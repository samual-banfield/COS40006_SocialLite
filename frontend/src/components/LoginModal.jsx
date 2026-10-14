import { useEffect, useRef, useState } from "react";
import "./LoginModal.css";

// login form shown over the top of the current page using a native <dialog>
function LoginModal({ open, onClose, onLogin }) {
    const dialogRef = useRef(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const dialog = dialogRef.current;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    function handleSubmit(e) {
        e.preventDefault();
        // TODO: call /api/auth/login once the backend auth route exists
        onLogin({ username });
    }

    // the modal stays mounted between opens, so clear the form whenever it closes
    // (submit, cancel, escape or backdrop click all end up here)
    function handleClose() {
        setUsername("");
        setPassword("");
        onClose();
    }

    return (
        <dialog
            ref={dialogRef}
            className="login-modal"
            onClose={handleClose}
            // clicking the backdrop (the dialog itself, outside the form) closes it
            onClick={(e) => e.target === dialogRef.current && onClose()}
        >
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Log in</h2>
                <label>
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </label>
                <div className="login-actions">
                    <button
                        type="button"
                        className="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button type="submit">Log in</button>
                </div>
            </form>
        </dialog>
    );
}

export default LoginModal;
