import Post from "./Post.jsx";
import "./Feed.css";

function Feed({ posts, user, loading, error, onOpenPost, onToggleLike, onEditPost }) {
    return (
        <section className="feed">
            <h1 className="feed-heading">Feed</h1>

            {loading && <p className="feed-status">Loading feed...</p>}
            {error && <p className="feed-status feed-error">{error}</p>}
            {!loading && !error && posts.length === 0 && (
                <p className="feed-status">No posts yet.</p>
            )}

            {posts.map((post) => (
                <Post
                    key={post.id}
                    post={post}
                    user={user}
                    onOpen={() => onOpenPost(post.id)}
                    onToggleLike={onToggleLike}
                    onEdit={user ? () => onEditPost(post.id) : undefined}
                />
            ))}
        </section>
    );
}

export default Feed;
