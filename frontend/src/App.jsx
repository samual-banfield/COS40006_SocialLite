import { useEffect, useState } from "react";
import {
    createPost,
    deletePost,
    getFeed,
    getPost,
    likePost,
    login,
    setToken,
    signup,
    unlikePost,
    updatePost,
} from "./api.js";
import Header from "./components/Header.jsx";
import Feed from "./components/Feed.jsx";
import PostView from "./components/PostView.jsx";
import LoginModal from "./components/LoginModal.jsx";
import ComposeModal from "./components/ComposeModal.jsx";
import EditPostModal from "./components/EditPostModal.jsx";
import "./App.css";

function App() {
    const [user, setUser] = useState(null);
    const [loginOpen, setLoginOpen] = useState(false);
    const [composeOpen, setComposeOpen] = useState(false);

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openPostId, setOpenPostId] = useState(null);
    const [editingPostId, setEditingPostId] = useState(null);

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
    const editingPost = posts.find((p) => p.id === editingPostId);

    // only the author can edit or delete a post, the backend checks this too
    const isMine = (post) => Boolean(user && post && post.username === user.username);

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

    // create the account, then log in with the same details so the modal closes logged in
    async function handleSignup({ username, password }) {
        await signup({ username, password });
        await handleLogin({ username, password });
    }

    function handleLogout() {
        setToken(null);
        setUser(null);
        setComposeOpen(false);
        setEditingPostId(null);
    }

    // errors are left to bubble up so the modal can show them
    async function handleNewPost({ title, content, image }) {
        const post = await createPost({ title, content, image });
        setPosts((prev) => [post, ...prev]);
        setComposeOpen(false);
        setOpenPostId(null);
    }

    // errors are left to bubble up so the modal can show them
    async function handleEditPost({ title, content }) {
        const updated = await updatePost(editingPostId, { title, content });
        replacePost(updated);
        setEditingPostId(null);
    }

    // errors are left to bubble up so the post can show them
    async function handleDeletePost(id) {
        await deletePost(id);
        setPosts((prev) => prev.filter((p) => p.id !== id));
        if (openPostId === id) setOpenPostId(null);
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
                        onEdit={
                            isMine(openPost) ? () => setEditingPostId(openPost.id) : undefined
                        }
                        onDelete={
                            isMine(openPost)
                                ? () => handleDeletePost(openPost.id)
                                : undefined
                        }
                    />
                ) : (
                    <Feed
                        posts={posts}
                        user={user}
                        loading={loading}
                        error={error}
                        onOpenPost={(id) => {
                            setError(null);
                            setOpenPostId(id);
                        }}
                        onToggleLike={handleToggleLike}
                        onEditPost={setEditingPostId}
                        onDeletePost={handleDeletePost}
                    />
                )}
            </main>

            <LoginModal
                open={loginOpen}
                onClose={() => setLoginOpen(false)}
                onLogin={handleLogin}
                onSignup={handleSignup}
            />

            <ComposeModal
                open={composeOpen && !!user}
                user={user}
                onClose={() => setComposeOpen(false)}
                onSubmit={handleNewPost}
            />

            {isMine(editingPost) && (
                <EditPostModal
                    key={editingPost.id}
                    post={editingPost}
                    onClose={() => setEditingPostId(null)}
                    onSubmit={handleEditPost}
                />
            )}
        </>
    );
}

export default App;
