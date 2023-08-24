import React, { useState, useEffect } from "react";
import "./Post.css";

function Post({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, [post.id]);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="post">
      <div className="user-info">
        <div className="user-profile">
          <img
            src={`https://i.pravatar.cc/150?u=${post.userId}`}
            alt="User profile"
          />
        </div>
        <h3 className="username">{post.title}</h3>
      </div>
      <p>{post.body}</p>
      {comments.length > 0 && (
        <button onClick={toggleComments}>
          {showComments ? "Hide Comments" : "View Comments"}
        </button>
      )}
      {showComments && (
        <div className="comments">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <strong>{comment.name}</strong>: {comment.body}
              </div>
            ))
          ) : (
            <div className="comment">No one has commented.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Post;
