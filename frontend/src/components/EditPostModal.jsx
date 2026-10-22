import { useEffect, useRef, useState } from "react";
import "./Modal.css";
import "./ComposeModal.css";

// keep in sync with backend/src/middleware/validPostContent.js
const MAX_TITLE = 100;
const MAX_CHARS = 500;

// edit form for an existing post, only mounted while editing so the
// fields start from the post each time it opens
function EditPostModal({ post, onClose, onSubmit }) {
    const dialogRef = useRef(null);
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        dialogRef.current.showModal();
    }, []);

    const unchanged = title.trim() === post.title && content.trim() === post.content;
    const canSave =
        title.trim() !== "" && content.trim() !== "" && !unchanged && !submitting;

    // on success the parent unmounts the modal
    async function handleSubmit(e) {
        e.preventDefault();
        if (!canSave) return;
        setSubmitting(true);
        setError("");
        try {
            await onSubmit({ title: title.trim(), content: content.trim() });
        } catch (err) {
            setError(err.message);
            setSubmitting(false);
        }
    }

    return (
        <dialog
            ref={dialogRef}
            className="modal compose-modal"
            aria-labelledby="edit-title"
            onClose={onClose}
            onClick={(e) => e.target === dialogRef.current && onClose()}
        >
            <div className="modal-body compose-body">
                <div className="modal-head compose-head">
                    <h2 id="edit-title" className="modal-title compose-title">
                        Edit post
                    </h2>
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
                        <label htmlFor="edit-post-title">Title</label>
                        <input
                            id="edit-post-title"
                            type="text"
                            value={title}
                            maxLength={MAX_TITLE}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="edit-post-content">Your post</label>
                        <textarea
                            id="edit-post-content"
                            rows={6}
                            value={content}
                            onChange={(e) =>
                                setContent(e.target.value.slice(0, MAX_CHARS))
                            }
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
                                disabled={!canSave}
                            >
                                {submitting ? "Saving..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </dialog>
    );
}

export default EditPostModal;
