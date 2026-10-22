import Post from "./Post.jsx";
import "./Feed.css";

function Feed({
    posts,
    user,
    loading,
    error,
    onOpenPost,
    onToggleLike,
    onEditPost,
    onDeletePost,
}) {
    // the edit/delete menu only shows on the user's own posts
    const isMine = (post) => user?.username === post.username;

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
                    onEdit={isMine(post) ? () => onEditPost(post.id) : undefined}
                    onDelete={isMine(post) ? () => onDeletePost(post.id) : undefined}
                />
            ))}
        </section>
    );
}

export default Feed;
