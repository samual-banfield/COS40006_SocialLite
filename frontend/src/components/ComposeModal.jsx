import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar.jsx";
import "./Modal.css";
import "./ComposeModal.css";

const MAX_CHARS = 500;

// new post form, same native <dialog> pattern as the login modal
function ComposeModal({ open, user, onClose, onSubmit }) {
    const dialogRef = useRef(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        const dialog = dialogRef.current;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    const canPost = title.trim() !== "" && content.trim() !== "";

    function handleSubmit(e) {
        e.preventDefault();
        if (!canPost) return;
        onSubmit({ title: title.trim(), content: content.trim() });
    }

    function handleClose() {
        setTitle("");
        setContent("");
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
                                Post
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </dialog>
    );
}

export default ComposeModal;
