// seed data so the feed isn't empty on a fresh start

module.exports = [
    {
        username: "lorem.ipsum",
        title: "Lorem ipsum dolor sit amet",
        content:
            "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        createdAt: "2026-10-12T09:15:00.000Z",
        likedBy: ["dolor_sit"],
    },
    {
        username: "dolor_sit",
        title: "Ut enim ad minim veniam",
        image: "https://picsum.photos/seed/sociallite-1/1200/675",
        content:
            "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\n" +
            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        createdAt: "2026-10-14T22:40:00.000Z",
        likedBy: ["lorem.ipsum", "consectetur"],
    },
    {
        username: "consectetur",
        title: "At vero eos et accusamus",
        content:
            "Et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
        createdAt: "2026-10-15T13:05:00.000Z",
    },
    {
        username: "lorem.ipsum",
        title: "Nemo enim ipsam",
        content: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
        createdAt: "2026-10-16T01:30:00.000Z",
    },
];
