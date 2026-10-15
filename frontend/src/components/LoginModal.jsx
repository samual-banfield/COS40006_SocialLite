import { useEffect, useRef, useState } from "react";
import "./Modal.css";
import "./LoginModal.css";

// login form shown over the top of the current page using a native <dialog>
function LoginModal({ open, onClose, onLogin }) {
    const dialogRef = useRef(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const dialog = dialogRef.current;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    function handleSubmit(e) {
        e.preventDefault();
        if (!username.trim() || !password) {
            setError("Enter your username and password to log in.");
            return;
        }
        // TODO: call /api/auth/login once the backend auth route exists
        onLogin({ username: username.trim() });
    }

    // the modal stays mounted between opens, so clear the form whenever it closes
    // (submit, cancel, escape or backdrop click all end up here)
    function handleClose() {
        setUsername("");
        setPassword("");
        setError("");
        onClose();
    }

    return (
        <dialog
            ref={dialogRef}
            className="modal login-modal"
            aria-labelledby="login-title"
            onClose={handleClose}
            // clicking the backdrop (the dialog itself, outside the content) closes it
            onClick={(e) => e.target === dialogRef.current && onClose()}
        >
            <div className="modal-body">
                <div className="modal-head">
                    <div>
                        <h2 id="login-title" className="modal-title">
                            Log in
                        </h2>
                        <p className="modal-sub">Welcome back to Social Lite.</p>
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

                <form className="modal-form" onSubmit={handleSubmit} noValidate>
                    <div className="field">
                        <label htmlFor="login-username">Username</label>
                        <input
                            id="login-username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>
                    {error && (
                        <p role="alert" className="modal-error">
                            {error}
                        </p>
                    )}
                    <button type="submit" className="btn btn-primary login-submit">
                        Log in
                    </button>
                </form>
            </div>
        </dialog>
    );
}

export default LoginModal;
