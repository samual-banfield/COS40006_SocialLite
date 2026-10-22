import Avatar from "./Avatar.jsx";
import logo from "../assets/social-lite-icon.svg";
import "./Header.css";

function Header({ user, onHome, onLogin, onLogout, onCompose }) {
    return (
        <header className="header">
            <div className="header-inner">
                <button
                    type="button"
                    className="logo"
                    onClick={onHome}
                    aria-label="Social Lite, go to the feed"
                >
                    <img src={logo} alt="" className="logo-icon" />
                    <span className="logo-text">
                        <span className="logo-social">Social</span>
                        <span className="logo-lite">Lite</span>
                    </span>
                </button>

                {user ? (
                    <div className="header-user">
                        <button
                            type="button"
                            className="btn btn-primary header-compose"
                            onClick={onCompose}
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.4"
                                strokeLinecap="round"
                                aria-hidden="true"
                            >
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            New post
                        </button>
                        <Avatar username={user.username} />
                        <span className="header-username">{user.username}</span>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onLogout}
                        >
                            Log out
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onLogin}
                    >
                        Log in / Sign up
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;
