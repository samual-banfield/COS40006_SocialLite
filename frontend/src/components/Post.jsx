import Avatar from "./Avatar.jsx";
import { excerptOf, timeAgo } from "../format.js";
import "./Post.css";

// author line shared by the feed card and the expanded post
export function PostAuthor({ username, createdAt, size }) {
    if (!username) return null;
    const time = timeAgo(createdAt);
    return (
        <div className="post-author">
            <Avatar username={username} size={size} />
            <span className="post-author-name">{username}</span>
            {time && <span className="post-author-time">· {time}</span>}
        </div>
    );
}

// a post in the feed, clicking it opens the full post
function Post({ post, onOpen }) {
    const { excerpt, isLong } = excerptOf(post.content);

    return (
        <button
            type="button"
            className="card card-interactive post"
            onClick={onOpen}
            aria-label={post.username ? `Open post by ${post.username}` : "Open post"}
        >
            <PostAuthor username={post.username} createdAt={post.createdAt} />
            {post.title && <span className="post-title">{post.title}</span>}
            {post.image && (
                <img className="post-image" src={post.image} alt="" />
            )}
            <span className="post-excerpt">{excerpt}</span>
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
    );
}

export default Post;
