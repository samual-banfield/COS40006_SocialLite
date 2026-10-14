import "./Post.css";

// a single post: text content and an optional image url
function Post({ content, image }) {
    return (
        <div className="post">
            <p className="post-content">{content}</p>
            {image && <img className="post-image" src={image} alt="" />}
        </div>
    );
}

export default Post;
