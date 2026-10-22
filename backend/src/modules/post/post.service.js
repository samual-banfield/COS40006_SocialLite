const prisma = require("../../db");
const storage = require("../../storage");

// likes only includes the logged in user's like, so we can tell if they liked it
const postSelect = (userId) => ({
    id: true,
    title: true,
    content: true,
    image: true,
    createdAt: true,
    author: { select: { username: true } },
    _count: { select: { likes: true } },
    likes: userId ? { where: { userId }, select: { userId: true } } : false,
});

// turns the prisma result into the json the frontend expects
const toResponse = ({ author, _count, likes, image, ...post }) => ({
    ...post,
    image: storage.imageUrl(image),
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

// image is the uploaded file from uploadImage, if there was one
exports.createPost = async ({ authorId, title, content, image }) => {
    const key = image ? await storage.putImage(image.buffer, image.imageType) : null;
    try {
        const post = await prisma.post.create({
            data: { authorId, title, content, image: key },
            select: postSelect(authorId),
        });
        return toResponse(post);
    } catch (err) {
        // don't leave an image in the bucket that no post points to
        if (key) await storage.deleteImage(key).catch(() => {});
        throw err;
    }
};

// returns null if the post doesn't exist, false if it isn't the user's, otherwise the updated post
exports.updatePost = async (id, userId, { title, content }) => {
    const existing = await prisma.post.findUnique({ where: { id }, select: { authorId: true } });
    if (!existing) return null;
    const post = await prisma.post.update({
        where: { id },
        data: { title, content },
        select: postSelect(userId),
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
