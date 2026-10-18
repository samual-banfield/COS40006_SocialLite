// fills the database with test data, run with `npm run db:seed`
const bcrypt = require("bcryptjs");
const prisma = require("../src/db");

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
        image: "https://picsum.photos/seed/sociallite-1/1200/675",
        content:
            "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\n" +
            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        likedBy: ["lorem.ipsum", "consectetur"],
    },
    {
        username: "consectetur",
        title: "At vero eos et accusamus",
        content:
            "Et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
    },
    {
        username: "lorem.ipsum",
        title: "Nemo enim ipsam",
        content: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
    },
];

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

    for (const [i, { username, likedBy = [], ...post }] of posts.entries()) {
        await prisma.post.create({
            data: {
                ...post,
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
