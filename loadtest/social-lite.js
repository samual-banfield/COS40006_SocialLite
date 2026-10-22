// k6 load test for Social Lite, run against staging by deploy-staging.yml from the load tester server.
// Each virtual user signs up and logs in once, then keeps reading the feed, opening a post
// (and its image), liking or unliking it, and sometimes making a post of its own.

import http from "k6/http";
import encoding from "k6/encoding";
import { check, fail, sleep } from "k6";

const APP_URL = (__ENV.APP_URL || fail("set APP_URL to the app's address")).replace(/\/$/, "");

export const options = {
    scenarios: {
        users: {
            executor: "constant-vus",
            vus: Number(__ENV.VUS || 50),
            duration: __ENV.DURATION || "2m",
        },
    },
    // Staging fails if any of these are missed. k6 then exits with code 99.
    thresholds: {
        // fewer than 1% of requests fail
        http_req_failed: ["rate<0.01"],
        // 95% of requests answer within 1.5 seconds
        http_req_duration: ["p(95)<1500"],
        // 99% of requests answer within 3.5 seconds
        http_req_duration: ["p(99)<3500"],
    },
};

// A small 1x1 PNG to test the app and S3 rather than upload bandwidth
const IMAGE = encoding.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC"
);

// Runs once before the test. Its result is passed to every virtual user.
export function setup() {
    const res = http.get(`${APP_URL}/api/health`);
    if (res.status !== 200)
        fail(`${APP_URL}/api/health returned ${res.status}, is the app running?`);
    // Usernames are limited to 32 characters, and must be new on every run
    return { runId: Date.now().toString(36) };
}

// Kept between iterations, one per virtual user
let token = null;

function authHeaders() {
    return { Authorization: `Bearer ${token}` };
}

function signUpAndLogIn(runId) {
    const credentials = JSON.stringify({
        username: `k6-${runId}-${__VU}`,
        password: "load-test-password",
    });
    const params = { headers: { "Content-Type": "application/json" } };

    const signup = http.post(`${APP_URL}/api/auth/signup`, credentials, {
        ...params,
        tags: { name: "POST /api/auth/signup" },
    });
    check(signup, { "signup returns 201": (r) => r.status === 201 });

    const login = http.post(`${APP_URL}/api/auth/login`, credentials, {
        ...params,
        tags: { name: "POST /api/auth/login" },
    });
    if (
        !check(login, {
            "login returns a token": (r) => r.status === 200 && Boolean(r.json("token")),
        })
    ) {
        fail(`virtual user ${__VU} could not log in`);
    }
    token = login.json("token");
}

function createPost() {
    const post = {
        title: `Load test post from user ${__VU}`,
        content: `Posted during iteration ${__ITER} of the load test.`,
    };
    const withImage = Math.random() < 0.5;

    // Half the posts have an image, which the app stores in S3. Those are sent as multipart form
    // data, the rest as JSON. The app doesn't read URL encoded forms, k6's default for an object.
    const res = withImage
        ? http.post(
              `${APP_URL}/api/post`,
              { ...post, image: http.file(IMAGE, "load-test.png", "image/png") },
              { headers: authHeaders(), tags: { name: "POST /api/post (image)" } }
          )
        : http.post(`${APP_URL}/api/post`, JSON.stringify(post), {
              headers: { ...authHeaders(), "Content-Type": "application/json" },
              tags: { name: "POST /api/post" },
          });

    if (!check(res, { "creating a post returns 201": (r) => r.status === 201 })) {
        console.warn(
            `creating a post${withImage ? " with an image" : ""} returned ${res.status}: ${res.body}`
        );
    }
}

export default function (data) {
    if (!token) signUpAndLogIn(data.runId);

    const feed = http.get(`${APP_URL}/api/feed`, {
        headers: authHeaders(),
        tags: { name: "GET /api/feed" },
    });
    check(feed, { "feed returns 200": (r) => r.status === 200 });
    const posts = feed.status === 200 ? feed.json("posts") : [];

    if (posts.length > 0) {
        const post = posts[Math.floor(Math.random() * posts.length)];

        const view = http.get(`${APP_URL}/api/post/${post.id}`, {
            headers: authHeaders(),
            tags: { name: "GET /api/post/:id" },
        });
        check(view, { "viewing a post returns 200": (r) => r.status === 200 });

        // Served by the app from S3
        if (post.image) {
            const image = http.get(`${APP_URL}${post.image}`, {
                tags: { name: "GET /api/images/:key" },
            });
            check(image, { "image returns 200": (r) => r.status === 200 });
        }

        const like = post.likedByMe
            ? http.del(`${APP_URL}/api/post/${post.id}/like`, null, {
                  headers: authHeaders(),
                  tags: { name: "DELETE /api/post/:id/like" },
              })
            : http.post(`${APP_URL}/api/post/${post.id}/like`, null, {
                  headers: authHeaders(),
                  tags: { name: "POST /api/post/:id/like" },
              });
        check(like, { "liking or unliking returns 200": (r) => r.status === 200 });
    }

    if (Math.random() < 0.25) createPost();

    // Time a person spends reading before doing something else
    sleep(1 + Math.random() * 2);
}
