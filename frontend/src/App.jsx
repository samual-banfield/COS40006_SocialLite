import { useEffect, useState } from "react";
import { getFeed } from "./api.js";
import TEMP_POSTS from "./tempPosts.js";
import Header from "./components/Header.jsx";
import Feed from "./components/Feed.jsx";
import PostView from "./components/PostView.jsx";
import LoginModal from "./components/LoginModal.jsx";
import ComposeModal from "./components/ComposeModal.jsx";
import "./App.css";

function App() {
    const [user, setUser] = useState(null);
    const [loginOpen, setLoginOpen] = useState(false);
    const [composeOpen, setComposeOpen] = useState(false);

    const [posts, setPosts] = useState(TEMP_POSTS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openPostId, setOpenPostId] = useState(null);

    useEffect(() => {
        getFeed()
            .then((fetched) => setPosts((prev) => [...prev, ...fetched]))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const openPost = posts.find((p) => p.id === openPostId);

    function handleLogin(loggedInUser) {
        setUser(loggedInUser);
        setLoginOpen(false);
    }

    function handleLogout() {
        setUser(null);
        setComposeOpen(false);
    }

    function handleNewPost({ title, content }) {
        // TODO: POST /api/post once the backend route exists, for now it only lives in the browser
        const post = {
            id: `local-${Date.now()}`,
            username: user.username,
            createdAt: new Date().toISOString(),
            title,
            content,
        };
        setPosts((prev) => [post, ...prev]);
        setComposeOpen(false);
        setOpenPostId(null);
    }

    return (
        <>
            <Header
                user={user}
                onHome={() => setOpenPostId(null)}
                onLogin={() => setLoginOpen(true)}
                onLogout={handleLogout}
                onCompose={() => setComposeOpen(true)}
            />

            <main className="main">
                {openPost ? (
                    <PostView post={openPost} onBack={() => setOpenPostId(null)} />
                ) : (
                    <Feed
                        posts={posts}
                        loading={loading}
                        error={error}
                        onOpenPost={setOpenPostId}
                    />
                )}
            </main>

            <LoginModal
                open={loginOpen}
                onClose={() => setLoginOpen(false)}
                onLogin={handleLogin}
            />

            <ComposeModal
                open={composeOpen && !!user}
                user={user}
                onClose={() => setComposeOpen(false)}
                onSubmit={handleNewPost}
            />
        </>
    );
}

export default App;
