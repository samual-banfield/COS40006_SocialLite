import { useState } from "react";
import Home from "./components/Home.jsx";
import LoginModal from "./components/LoginModal.jsx";
import "./App.css";

function App() {
    const [loginOpen, setLoginOpen] = useState(false);
    const [user, setUser] = useState(null);

    return (
        <>
            <header className="header">
                <h1 className="logo">SocialLite</h1>
                {user ? (
                    <div className="header-user">
                        <span>{user.username}</span>
                        <button type="button" onClick={() => setUser(null)}>
                            Log out
                        </button>
                    </div>
                ) : (
                    <button type="button" onClick={() => setLoginOpen(true)}>
                        Log in
                    </button>
                )}
            </header>

            <Home />

            <LoginModal
                open={loginOpen}
                onClose={() => setLoginOpen(false)}
                onLogin={(loggedInUser) => {
                    setUser(loggedInUser);
                    setLoginOpen(false);
                }}
            />
        </>
    );
}

export default App;
