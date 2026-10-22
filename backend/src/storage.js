// stores post images in S3. the database only keeps the object key (e.g. posts/<uuid>.jpg),
// so staging and production differ only by IMAGE_BUCKET.
// on AWS the server's IAM role provides the credentials, locally docker compose points
// S3_ENDPOINT at an S3 mock. without IMAGE_BUCKET (e.g. in jest) uploads are turned off.
require("./env");
const crypto = require("crypto");
const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
    ListObjectsV2Command,
} = require("@aws-sdk/client-s3");

const bucket = process.env.IMAGE_BUCKET;
const endpoint = process.env.S3_ENDPOINT;

const client = bucket
    ? new S3Client({
          region: process.env.AWS_REGION ?? "ap-southeast-2",
          endpoint,
          // the mock serves buckets as paths rather than subdomains
          forcePathStyle: Boolean(endpoint),
      })
    : null;

exports.enabled = Boolean(client);

// keys the app writes, anything else is refused before reaching S3
exports.KEY_PATTERN = /^(posts|seed)\/[A-Za-z0-9._-]+$/;

// works out the type from the file's first bytes rather than trusting the browser
const signatures = [
    { mime: "image/jpeg", ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
    { mime: "image/png", ext: "png", test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
    { mime: "image/gif", ext: "gif", test: (b) => b.subarray(0, 4).toString("latin1") === "GIF8" },
    { mime: "image/webp", ext: "webp", test: (b) => b.subarray(0, 4).toString("latin1") === "RIFF" && b.subarray(8, 12).toString("latin1") === "WEBP" },
];

// returns { mime, ext }, or null if the buffer isn't a supported image
exports.imageType = (buffer) => signatures.find(({ test }) => test(buffer)) ?? null;

// the url the frontend loads the image from, see modules/image
exports.imageUrl = (key) => (key ? `/api/images/${key}` : null);

// uploads the image and returns its key. new posts get a random key, the seed passes a fixed one
exports.putImage = async (buffer, { mime, ext }, key = `posts/${crypto.randomUUID()}.${ext}`) => {
    await client.send(
        new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: mime }),
    );
    return key;
};

// returns { Body, ContentType, ContentLength }, or null if there is no such image
exports.getImage = async (key) => {
    try {
        return await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    } catch (err) {
        if (err.name === "NoSuchKey") return null;
        throw err;
    }
};

exports.deleteImage = async (key) => {
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
};

// deletes every image under a prefix, used by the seed to clear old staging uploads
exports.deletePrefix = async (prefix) => {
    let token;
    do {
        const page = await client.send(
            new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken: token }),
        );
        if (page.Contents?.length) {
            await client.send(
                new DeleteObjectsCommand({
                    Bucket: bucket,
                    Delete: { Objects: page.Contents.map(({ Key }) => ({ Key })) },
                }),
            );
        }
        token = page.NextContinuationToken;
    } while (token);
};
