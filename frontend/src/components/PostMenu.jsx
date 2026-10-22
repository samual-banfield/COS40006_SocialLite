import { useEffect, useRef, useState } from "react";
import "./PostMenu.css";

// the "..." button in the top right of a post, with a dropdown of actions
function PostMenu({ onEdit, onDelete }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    // clicking anywhere outside the menu or pressing escape closes it
    useEffect(() => {
        if (!open) return;
        function handleClick(e) {
            if (!menuRef.current.contains(e.target)) setOpen(false);
        }
        function handleKey(e) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, [open]);

    return (
        <div className="post-menu" ref={menuRef}>
            <button
                type="button"
                className="btn-icon post-menu-toggle"
                onClick={() => setOpen((o) => !o)}
                aria-label="Post options"
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                </svg>
            </button>
            {open && (
                <div className="post-menu-list" role="menu">
                    <button
                        type="button"
                        role="menuitem"
                        className="post-menu-item"
                        onClick={() => {
                            setOpen(false);
                            onEdit();
                        }}
                    >
                        Edit post
                    </button>
                    <button
                        type="button"
                        role="menuitem"
                        className="post-menu-item post-menu-item-danger"
                        onClick={() => {
                            setOpen(false);
                            onDelete();
                        }}
                    >
                        Delete post
                    </button>
                </div>
            )}
        </div>
    );
}

export default PostMenu;
