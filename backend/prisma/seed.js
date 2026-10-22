// fills the database with test data, run with `npm run db:seed`
// staging runs this on every deploy. production never does.
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const prisma = require("../src/db");
const storage = require("../src/storage");

// files in seed-images/ are uploaded to the bucket as seed/<file>
const SEED_IMAGES = path.join(__dirname, "seed-images");

// every seeded user has the password "password"
const usernames = ["test", "dev", "user", "lorem.ipsum", "dolor_sit", "consectetur"];

const posts = [
    {
        username: "lorem.ipsum",
        title: "Lorem ipsum dolor sit amet",
        content:
            "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        likedBy: ["dolor_sit"],
    },
    {
        username: "dolor_sit",
        title: "Ut enim ad minim veniam",
        imageFile: "lake.jpg",
        content:
            "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\n" +
            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        likedBy: ["lorem.ipsum", "consectetur"],
    },
    {
        username: "consectetur",
        title: "At vero eos et accusamus",
        imageFile: "coffee.jpg",
        content:
            "Et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
    },
    {
        username: "lorem.ipsum",
        title: "Nemo enim ipsam",
        content: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
    },
    {
        username: "dev",
        title: "Sed ut perspiciatis unde",
        imageFile: "city.jpg",
        content:
            "Omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
        likedBy: ["test", "user"],
    },
    {
        username: "user",
        title: "Quis autem vel eum",
        imageFile: "mountains.jpg",
        content: "Iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
    },
];

// uploads the seed images and returns a map of file name to key. without a bucket
// (e.g. in jest) nothing is uploaded and the seeded posts have no images
async function seedImages() {
    if (!storage.enabled) {
        console.log("IMAGE_BUCKET isn't set, seeding posts without images");
        return {};
    }
    // the posts these belonged to are about to be deleted
    await storage.deletePrefix("posts/");

    const keys = {};
    for (const file of fs.readdirSync(SEED_IMAGES)) {
        const buffer = fs.readFileSync(path.join(SEED_IMAGES, file));
        const type = storage.imageType(buffer);
        if (!type) throw new Error(`seed-images/${file} isn't a supported image`);
        // a fixed key, so seeding again just overwrites the same objects
        keys[file] = await storage.putImage(buffer, type, `seed/${file}`);
    }
    return keys;
}

async function main() {
    // deleting users also deletes their posts and likes
    await prisma.user.deleteMany();

    const passwordHash = await bcrypt.hash("password", 10);
    const userIds = {};
    for (const [i, username] of usernames.entries()) {
        // fixed ids so the data is the same every time
        const user = await prisma.user.create({ data: { id: i + 1, username, passwordHash } });
        userIds[username] = user.id;
    }

    const imageKeys = await seedImages();

    for (const [i, { username, likedBy = [], imageFile, ...post }] of posts.entries()) {
        await prisma.post.create({
            data: {
                ...post,
                image: imageKeys[imageFile] ?? null,
                id: i + 1,
                authorId: userIds[username],
                likes: { create: likedBy.map((liker) => ({ userId: userIds[liker] })) },
            },
        });
    }

    console.log(`seeded ${usernames.length} users and ${posts.length} posts`);
}

main()
    .catch((err) => {
        console.error(err);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
