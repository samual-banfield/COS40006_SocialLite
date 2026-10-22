import { useEffect, useRef, useState } from "react";
import "./Modal.css";
import "./LoginModal.css";

// wording for each mode, the form itself is the same for both
const MODES = {
    login: {
        title: "Log in",
        sub: "Welcome back to Social Lite.",
        submit: "Log in",
        missing: "Enter your username and password to log in.",
        switchPrompt: "Don't have an account?",
        switchLabel: "Sign up",
    },
    signup: {
        title: "Sign up",
        sub: "Create your Social Lite account.",
        submit: "Sign up",
        missing: "Enter a username and password to sign up.",
        switchPrompt: "Already have an account?",
        switchLabel: "Log in",
    },
};

// login/signup form shown over the top of the current page using a native <dialog>
function LoginModal({ open, onClose, onLogin, onSignup }) {
    const dialogRef = useRef(null);
    const [mode, setMode] = useState("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const text = MODES[mode];

    useEffect(() => {
        const dialog = dialogRef.current;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!username.trim() || !password) {
            setError(text.missing);
            return;
        }
        const submit = mode === "signup" ? onSignup : onLogin;
        try {
            await submit({ username: username.trim(), password });
        } catch (err) {
            setError(err.message);
        }
    }

    // keep whatever was typed so switching after a mistake doesn't lose it
    function switchMode() {
        setMode(mode === "login" ? "signup" : "login");
        setError("");
    }

    // the modal stays mounted between opens, so clear the form whenever it closes
    // (submit, cancel, escape or backdrop click all end up here)
    function handleClose() {
        setMode("login");
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
                            {text.title}
                        </h2>
                        <p className="modal-sub">{text.sub}</p>
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
                            autoComplete={
                                mode === "signup" ? "new-password" : "current-password"
                            }
                        />
                    </div>
                    {error && (
                        <p role="alert" className="modal-error">
                            {error}
                        </p>
                    )}
                    <button type="submit" className="btn btn-primary login-submit">
                        {text.submit}
                    </button>
                </form>

                <p className="login-switch">
                    {text.switchPrompt}{" "}
                    <button
                        type="button"
                        className="login-switch-btn"
                        onClick={switchMode}
                    >
                        {text.switchLabel}
                    </button>
                </p>
            </div>
        </dialog>
    );
}

export default LoginModal;
