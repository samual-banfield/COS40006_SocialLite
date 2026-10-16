import { useEffect, useState } from "react";
import {
    createPost,
    getFeed,
    getPost,
    likePost,
    login,
    setToken,
    unlikePost,
} from "./api.js";
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

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openPostId, setOpenPostId] = useState(null);

    // refetched on login/logout since likedByMe depends on who is asking
    useEffect(() => {
        getFeed()
            .then(setPosts)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [user]);

    // the feed copy shows straight away, then gets swapped for the latest version
    useEffect(() => {
        if (openPostId === null) return;
        getPost(openPostId)
            .then((fresh) =>
                setPosts((prev) => prev.map((p) => (p.id === fresh.id ? fresh : p))),
            )
            .catch((err) => {
                setPosts((prev) => prev.filter((p) => p.id !== openPostId));
                setOpenPostId(null);
                setError(err.message);
            });
    }, [openPostId]);

    const openPost = posts.find((p) => p.id === openPostId);

    function replacePost(updated) {
        setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }

    // errors are left to bubble up so the modal can show them
    async function handleLogin({ username, password }) {
        const { token, user } = await login({ username, password });
        setToken(token);
        setUser(user);
        setLoginOpen(false);
    }

    function handleLogout() {
        setToken(null);
        setUser(null);
        setComposeOpen(false);
    }

    // errors are left to bubble up so the modal can show them
    async function handleNewPost({ title, content }) {
        const post = await createPost({ title, content });
        setPosts((prev) => [post, ...prev]);
        setComposeOpen(false);
        setOpenPostId(null);
    }

    async function handleToggleLike(post) {
        if (!user) {
            setLoginOpen(true);
            return;
        }
        const liked = post.likedByMe;
        const updated = liked
            ? await unlikePost(post.id)
            : await likePost(post.id);
        replacePost(updated);
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
                    <PostView
                        post={openPost}
                        user={user}
                        onBack={() => setOpenPostId(null)}
                        onToggleLike={handleToggleLike}
                    />
                ) : (
                    <Feed
                        posts={posts}
                        loading={loading}
                        error={error}
                        onOpenPost={(id) => {
                            setError(null);
                            setOpenPostId(id);
                        }}
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
