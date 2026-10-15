// TEMP: placeholder posts so the feed has something to show while the backend
// post shape is being changed. Delete this file (and its import in App.jsx) once
// /api/feed returns real posts.

const minutesAgo = (m) => new Date(Date.now() - m * 60000).toISOString();

const TEMP_POSTS = [
    {
        id: "temp-1",
        username: "lorem.ipsum",
        createdAt: minutesAgo(12),
        title: "Lorem ipsum dolor sit amet",
        content:
            "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: "temp-2",
        username: "dolor_sit",
        createdAt: minutesAgo(95),
        title: "Ut enim ad minim veniam",
        image: "https://picsum.photos/seed/sociallite-1/1200/675",
        content:
            "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\n" +
            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.\n\n" +
            "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
    },
    {
        id: "temp-1",
        username: "lorem.ipsum",
        createdAt: minutesAgo(60 * 5),
        title: "Nemo enim ipsam",
        content:
            "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
    },
    {
        id: "temp-4",
        username: "consectetur",
        createdAt: minutesAgo(60 * 26),
        title: "At vero eos et accusamus",
        content:
            "Et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.\n\n" +
            "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
    },
    {
        id: "temp-5",
        username: "adipiscing.elit",
        createdAt: minutesAgo(60 * 24 * 3),
        title: "Temporibus autem quibusdam",
        image: "https://picsum.photos/seed/sociallite-2/1200/675",
        content:
            "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
    },
];

export default TEMP_POSTS;
