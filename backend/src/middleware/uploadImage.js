const multer = require("multer");
const storage = require("../storage");

// keep in sync with frontend/src/components/ComposeModal.jsx
const MAX_IMAGE_MB = 5;

// reads an optional image from a multipart/form-data body into req.file.
// json bodies pass straight through, so posts without an image work as before
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_IMAGE_MB * 1024 * 1024, files: 1 },
}).single("image");

const uploadImage = function (req, res, next) {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            const error =
                err.code === "LIMIT_FILE_SIZE"
                    ? `images are limited to ${MAX_IMAGE_MB}MB`
                    : "posts can include one image, sent as the image field";
            return res.status(400).json({ error });
        }
        if (err) return next(err);
        if (!req.file) return next();

        if (!storage.enabled) {
            return res.status(503).json({ error: "image uploads are not available" });
        }
        // checked from the file's contents, the browser's content type can't be trusted
        req.file.imageType = storage.imageType(req.file.buffer);
        if (!req.file.imageType) {
            return res
                .status(400)
                .json({ error: "images must be a jpeg, png, gif or webp" });
        }
        next();
    });
};

module.exports = uploadImage;
