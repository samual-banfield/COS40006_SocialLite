import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar.jsx";
import "./Modal.css";
import "./ComposeModal.css";

// keep in sync with backend/src/middleware/validPostContent.js
const MAX_TITLE = 100;
const MAX_CHARS = 500;
// keep in sync with backend/src/middleware/uploadImage.js
const MAX_IMAGE_MB = 5;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

// new post form, same native <dialog> pattern as the login modal
function ComposeModal({ open, user, onClose, onSubmit }) {
    const dialogRef = useRef(null);
    const fileRef = useRef(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const dialog = dialogRef.current;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    const canPost = title.trim() !== "" && !submitting;

    // the server checks these too, this just saves uploading a file it would reject
    function handleFile(e) {
        const file = e.target.files[0];
        // cleared so picking the same file again still counts as a change
        e.target.value = "";
        if (!file) return;
        if (!IMAGE_TYPES.includes(file.type)) {
            setError("images must be a jpeg, png, gif or webp");
            return;
        }
        if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
            setError(`images are limited to ${MAX_IMAGE_MB}MB`);
            return;
        }
        setError("");
        setImage(file);
    }

    // on success the parent closes the modal, which clears the form via handleClose
    async function handleSubmit(e) {
        e.preventDefault();
        if (!canPost) return;
        setSubmitting(true);
        setError("");
        try {
            await onSubmit({ title: title.trim(), content: content.trim(), image });
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    function handleClose() {
        setTitle("");
        setContent("");
        setImage(null);
        setError("");
        onClose();
    }

    return (
        <dialog
            ref={dialogRef}
            className="modal compose-modal"
            aria-labelledby="compose-title"
            onClose={handleClose}
            onClick={(e) => e.target === dialogRef.current && onClose()}
        >
            <div className="modal-body compose-body">
                <div className="modal-head compose-head">
                    <div className="compose-who">
                        <Avatar username={user?.username} />
                        <div>
                            <h2 id="compose-title" className="modal-title compose-title">
                                New post
                            </h2>
                            <span className="compose-as">
                                Posting as {user?.username}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn-icon"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            aria-hidden="true"
                        >
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="field">
                        <label htmlFor="compose-post-title">Title</label>
                        <input
                            id="compose-post-title"
                            type="text"
                            value={title}
                            maxLength={MAX_TITLE}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="compose-post-content">Your post</label>
                        <textarea
                            id="compose-post-content"
                            rows={6}
                            value={content}
                            onChange={(e) =>
                                setContent(e.target.value.slice(0, MAX_CHARS))
                            }
                            placeholder="What’s on your mind?"
                        />
                    </div>
                    <div className="field">
                        {image ? (
                            <div className="compose-image">
                                <span className="compose-image-name">{image.name}</span>
                                <button
                                    type="button"
                                    className="btn-icon"
                                    onClick={() => setImage(null)}
                                    aria-label="Remove image"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M6 6l12 12M18 6L6 18" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="btn btn-secondary compose-image-add"
                                onClick={() => fileRef.current.click()}
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <rect x="3" y="4" width="18" height="16" rx="2" />
                                    <circle cx="9" cy="10" r="1.75" />
                                    <path d="M21 16l-5-5-9 9" />
                                </svg>
                                Add image
                            </button>
                        )}
                        <input
                            ref={fileRef}
                            type="file"
                            accept={IMAGE_TYPES.join(",")}
                            onChange={handleFile}
                            hidden
                        />
                    </div>
                    {error && (
                        <p role="alert" className="modal-error">
                            {error}
                        </p>
                    )}
                    <div className="compose-actions">
                        <span className="compose-count">
                            {content.length} / {MAX_CHARS}
                        </span>
                        <div className="compose-buttons">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary compose-submit"
                                disabled={!canPost}
                            >
                                {submitting ? "Posting..." : "Post"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </dialog>
    );
}

export default ComposeModal;
