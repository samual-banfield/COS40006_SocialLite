import Post from "./Post.jsx";
import "./Feed.css";

function Feed({ posts, loading, error, onOpenPost }) {
    return (
        <section className="feed">
            <h1 className="feed-heading">Feed</h1>

            {loading && <p className="feed-status">Loading feed...</p>}
            {error && <p className="feed-status feed-error">{error}</p>}
            {!loading && !error && posts.length === 0 && (
                <p className="feed-status">No posts yet.</p>
            )}

            {posts.map((post) => (
                <Post key={post.id} post={post} onOpen={() => onOpenPost(post.id)} />
            ))}
        </section>
    );
}

export default Feed;
