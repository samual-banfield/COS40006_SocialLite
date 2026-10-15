import { PostAuthor } from "./Post.jsx";
import { paragraphsOf } from "../format.js";
import "./PostView.css";

// the full post, shown in place of the feed
function PostView({ post, onBack }) {
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
            </article>
        </div>
    );
}

export default PostView;
