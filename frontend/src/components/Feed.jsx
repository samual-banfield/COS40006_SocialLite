import { useEffect, useState } from "react";
import { getFeed } from "../api.js";
import Post from "./Post.jsx";
import "./Feed.css";

function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getFeed()
            .then(setPosts)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="feed-status">Loading feed...</p>;
    if (error) return <p className="feed-status feed-error">{error}</p>;
    if (posts.length === 0) return <p className="feed-status">No posts yet.</p>;

    return (
        <section className="feed">
            {posts.map((post) => (
                <Post key={post.id} content={post.content} image={post.image} />
            ))}
        </section>
    );
}

export default Feed;
