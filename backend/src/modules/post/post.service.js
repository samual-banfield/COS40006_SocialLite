const prisma = require("../../db");

// likes only includes the logged in user's like, so we can tell if they liked it
const postSelect = (userId) => ({
    id: true,
    title: true,
    content: true,
    image: true,
    author: { select: { username: true } },
    _count: { select: { likes: true } },
    likes: userId ? { where: { userId }, select: { userId: true } } : false,
});

// turns the prisma result into the json the frontend expects
const toResponse = ({ author, _count, likes, ...post }) => ({
    ...post,
    username: author.username,
    likes: _count.likes,
    likedByMe: Boolean(likes?.length),
});

exports.listPosts = async (userId) => {
    const posts = await prisma.post.findMany({
        select: postSelect(userId),
        // newest posts first
        orderBy: { id: "desc" },
    });
    return posts.map(toResponse);
};

exports.getPost = async (id, userId) => {
    const post = await prisma.post.findUnique({ where: { id }, select: postSelect(userId) });
    return post ? toResponse(post) : null;
};

exports.createPost = async ({ authorId, title, content }) => {
    const post = await prisma.post.create({
        data: { authorId, title, content },
        select: postSelect(authorId),
    });
    return toResponse(post);
};

const postExists = async (id) => {
    return (await prisma.post.count({ where: { id } })) > 0;
};

// both return false if the post doesn't exist. liking twice or unliking twice does nothing
exports.likePost = async (id, userId) => {
    if (!(await postExists(id))) return false;
    await prisma.like.createMany({ data: [{ postId: id, userId }], skipDuplicates: true });
    return true;
};

exports.unlikePost = async (id, userId) => {
    if (!(await postExists(id))) return false;
    await prisma.like.deleteMany({ where: { postId: id, userId } });
    return true;
};
