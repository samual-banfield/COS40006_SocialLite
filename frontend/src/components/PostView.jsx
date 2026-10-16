import { useState } from "react";
import { PostAuthor } from "./Post.jsx";
import { paragraphsOf } from "../format.js";
import "./PostView.css";

// the full post, shown in place of the feed
function PostView({ post, user, onBack, onToggleLike, onDelete }) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const likeCount = post.likedBy?.length ?? 0;
    const liked = !!user && post.likedBy?.includes(user.username);
    const isOwner = !!user && user.username === post.username;

    // runs a like/delete request, showing any failure under the post
    async function run(action) {
        setBusy(true);
        setError("");
        try {
            await action(post);
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    function handleDelete() {
        if (window.confirm("Delete this post? This can't be undone.")) {
            run(onDelete);
        }
    }

    return (
        <div className="post-view">
            <button
                type="button"
                className="btn btn-secondary post-view-back"
                onClick={onBack}
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
                Back to feed
            </button>

            <article className="card post-view-article">
                <PostAuthor
                    username={post.username}
                    createdAt={post.createdAt}
                    size="lg"
                />
                {post.title && <h1 className="post-view-title">{post.title}</h1>}
                {post.image && (
                    <img className="post-view-image" src={post.image} alt="" />
                )}
                <div className="post-view-body">
                    {paragraphsOf(post.content).map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                </div>

                <div className="post-view-actions">
                    <button
                        type="button"
                        className={`btn btn-secondary post-like${liked ? " is-liked" : ""}`}
                        onClick={() => run(onToggleLike)}
                        disabled={busy}
                        aria-pressed={liked}
                        title={user ? undefined : "Log in to like posts"}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill={liked ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" />
                        </svg>
                        {liked ? "Liked" : "Like"}
                        <span className="post-like-count">{likeCount}</span>
                    </button>

                    {isOwner && (
                        <button
                            type="button"
                            className="btn btn-secondary post-delete"
                            onClick={handleDelete}
                            disabled={busy}
                        >
                            Delete
                        </button>
                    )}
                </div>
                {error && (
                    <p role="alert" className="post-view-error">
                        {error}
                    </p>
                )}
            </article>
        </div>
    );
}

export default PostView;
