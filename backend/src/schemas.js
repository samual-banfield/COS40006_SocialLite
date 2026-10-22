const { z } = require("zod");

const TITLE_MAX = 100;
const CONTENT_MAX = 500;

const postTitleError = "posts must have a title containing a non-whitespace string";
const postContentError = "post content must be a string";
const postLengthError = `titles are limited to ${TITLE_MAX} characters and content to ${CONTENT_MAX}`;

exports.Id = z.coerce
    .number({ error: "id must be a positive integer" })
    .int("id must be a positive integer")
    .positive("id must be a positive integer");

exports.CreatePostBody = z.object({
    title: z
        .string({ error: postTitleError })
        .trim()
        .min(1, postTitleError)
        .max(TITLE_MAX, postLengthError),
    // content is optional, a post only needs a title
    content: z
        .string({ error: postContentError })
        .trim()
        .max(CONTENT_MAX, postLengthError)
        .default(""),
});

const USERNAME_MAX = 32; // matches the sql
const authError = "username and password must contain non-whitespace characters";

// the username is trimmed but the password is kept exactly as typed
exports.AuthBody = z.object({
    username: z
        .string({ error: authError })
        .trim()
        .min(1, authError)
        .max(USERNAME_MAX, `usernames are limited to ${USERNAME_MAX} characters`),
    password: z
        .string({ error: authError })
        .refine((p) => p.trim().length > 0, authError),
});

exports.User = z.strictObject({
    id: z.number().int().positive(),
    username: z.string(),
});

exports.AuthResponse = z.strictObject({
    token: z.string(),
    user: exports.User,
});

exports.Post = z.strictObject({
    id: z.number().int().positive(),
    title: z.string(),
    content: z.string(),
    image: z.string().nullable(),
    // dates are sent as iso strings in the json
    createdAt: z.iso.datetime(),
    username: z.string(),
    likes: z.number().int().nonnegative(),
    likedByMe: z.boolean(),
});

exports.Feed = z.strictObject({
    posts: z.array(exports.Post),
});

exports.Error = z.strictObject({
    error: z.string(),
});
