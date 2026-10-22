const { pipeline } = require("stream");
const storage = require("../../storage");

const notFound = (res) => res.status(404).json({ error: "image not found" });

// streams an image from the bucket, so the bucket itself never has to be public
exports.getImage = async (req, res) => {
    const key = req.params.key.join("/");
    if (!storage.enabled || !storage.KEY_PATTERN.test(key)) return notFound(res);

    const image = await storage.getImage(key);
    if (!image) return notFound(res);

    res.set({
        "Content-Type": image.ContentType,
        "Content-Length": image.ContentLength,
        "X-Content-Type-Options": "nosniff",
        // keys are random and images are never changed, so browsers can cache them for good
        "Cache-Control": "public, max-age=31536000, immutable",
    });
    pipeline(image.Body, res, () => {});
};
