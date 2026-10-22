import { useState } from "react";
import Avatar from "./Avatar.jsx";
import PostMenu from "./PostMenu.jsx";
import { excerptOf, timeAgo } from "../format.js";
import "./Post.css";

// author line shared by the feed card and the expanded post
export function PostAuthor({ username, createdAt, size }) {
    if (!username) return null;
    return (
        <div className="post-author">
            <Avatar username={username} size={size} />
            <span className="post-author-name">{username}</span>
            {createdAt && (
                <time
                    className="post-author-time"
                    dateTime={createdAt}
                    title={new Date(createdAt).toLocaleString()}
                >
                    {timeAgo(createdAt)}
                </time>
            )}
        </div>
    );
}

// a post in the feed, clicking it opens the full post.
function Post({ post, user, onOpen, onToggleLike, onEdit }) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const { excerpt, isLong } = excerptOf(post.content);
    const likeCount = post.likes ?? 0;
    const liked = !!user && !!post.likedByMe;

    async function toggleLike() {
        setBusy(true);
        setError("");
        try {
            await onToggleLike(post);
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    // the menu and like button sit beside the open button rather than inside it, since buttons can't nest
    return (
        <div className="card card-interactive post-card">
            <button
                type="button"
                className="post"
                onClick={onOpen}
                aria-label={post.username ? `Open post by ${post.username}` : "Open post"}
            >
                <PostAuthor username={post.username} createdAt={post.createdAt} />
                {post.title && <span className="post-title">{post.title}</span>}
                {post.image && <img className="post-image" src={post.image} alt="" />}
                {excerpt && <span className="post-excerpt">{excerpt}</span>}
                {isLong && (
                    <span className="post-more">
                        Read the full post
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
                            <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </span>
                )}
            </button>
            <div className="post-footer">
                <button
                    type="button"
                    className={`post-likes${liked ? " is-liked" : ""}`}
                    onClick={toggleLike}
                    disabled={busy}
                    aria-pressed={liked}
                    aria-label={`Like post, ${likeCount} ${likeCount === 1 ? "like" : "likes"}`}
                    title={user ? undefined : "Log in to like posts"}
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill={liked ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" />
                    </svg>
                    {likeCount} {likeCount === 1 ? "like" : "likes"}
                </button>
                {error && (
                    <p role="alert" className="post-error">
                        {error}
                    </p>
                )}
            </div>
            {onEdit && <PostMenu onEdit={onEdit} />}
        </div>
    );
}

export default Post;
