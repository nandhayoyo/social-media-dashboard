import React, { useState, useEffect } from "react";
import ConfirmationModal from "./ConfirmationModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faHeart,
  faFlag,
  faBell,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";

import {
  faArrowsRotate,
  faUser,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";

import "./Content.css";

function Content({ selectedFriendId, friends }) {
  const [content, setContent] = useState([]);
  const [contentType, setContentType] = useState("POST");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const selectedFriend = friends.find(
    (friend) => friend.id === selectedFriendId
  );

  useEffect(() => {
    if (selectedFriendId) {
      const endpoint =
        contentType === "POST"
          ? `https://jsonplaceholder.typicode.com/posts?userId=${selectedFriendId}`
          : `https://jsonplaceholder.typicode.com/photos?albumId=${selectedFriendId}`;

      fetch(endpoint)
        .then((response) => response.json())
        .then((data) => setContent(data))
        .catch((error) => console.error("Error fetching content:", error));
    }
  }, [selectedFriendId, contentType]);

  const fetchComments = (itemId) => {
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${itemId}`)
      .then((response) => response.json())
      .then((data) => {
        const commentsWithAvatar = data.map((comment) => ({
          ...comment,
          avatarUrl: `https://randomuser.me/api/portraits/thumb/${
            Math.random() > 0.5 ? "men" : "women"
          }/${Math.floor(Math.random() * 100)}.jpg`,
        }));
        setComments(commentsWithAvatar);
      })
      .catch((error) => console.error("Error fetching comments:", error));
  };
  const openModal = (item) => {
    setSelectedItem(item);
    fetchComments(item.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();

    fetch(`https://jsonplaceholder.typicode.com/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: selectedItem.id,
        body: newComment,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setComments((prevComments) => [...prevComments, data]);
        setNewComment("");
      })
      .catch((error) => console.error("Error adding comment:", error));
  };

  const handlePostDelete = (postId) => {
    setConfirmAction(() => () => {
      fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          setContent((prevContent) =>
            prevContent.filter((item) => item.id !== postId)
          );
          closeModal();
        })
        .catch((error) => console.error("Error deleting post:", error));
    });
    setShowConfirmation(true);
  };

  const handleCommentDelete = (commentId) => {
    fetch(`https://jsonplaceholder.typicode.com/comments/${commentId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      })
      .catch((error) => console.error("Error deleting comment:", error));
  };

  return (
    <div className="content">
      {selectedFriend ? (
        <div>
          <div className="user-profile">
            <img
              src={`https://i.pravatar.cc/150?u=${selectedFriend.id}`}
              alt="User profile"
              className="avatar"
            />
            <h2>{selectedFriend.name}</h2>
          </div>
          <div className="buttons">
            <button onClick={() => setContentType("POST")}>POST</button>
            <button onClick={() => setContentType("ALBUM")}>ALBUM</button>
          </div>
          <div className="items">
            {content.length > 0 ? (
              content.map((item) => (
                <div key={item.id} className="item">
                  <div className="content-card" onClick={() => openModal(item)}>
                    {contentType === "POST" ? (
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.body}</p>
                      </div>
                    ) : (
                      <div className="album-image-container">
                        <img
                          src={item.thumbnailUrl}
                          alt={`Album ${item.id}`}
                          className="album-image"
                        />
                      </div>
                    )}
                    <div className="card-icons">
                      <FontAwesomeIcon icon={faComment} />
                      <FontAwesomeIcon icon={faHeart} />
                      <FontAwesomeIcon icon={faBell} />
                      <FontAwesomeIcon icon={faFlag} />
                      <FontAwesomeIcon icon={faArrowsRotate} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No content available for {selectedFriend.name}.</p>
            )}
          </div>
          {isModalOpen && (
            <div className="modal" tabIndex="-1" role="dialog">
              <div className="modal-overlay">
                <div className="modal-content modal-medium">
                  <div className="modal-header">
                    <div className="user-profile">
                      <img
                        src={`https://i.pravatar.cc/150?u=${selectedFriend.id}`}
                        alt="User profile"
                        className="avatar"
                      />
                      <h2>{selectedFriend.name}</h2>
                      <button
                        type="button"
                        className="close-end"
                        onClick={closeModal}
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                  </div>
                  <div className="modal-body">
                    {selectedItem && contentType === "POST" ? (
                      <div className="content-card">
                        <h3>{selectedItem.title}</h3>
                        <p>{selectedItem.body}</p>
                      </div>
                    ) : selectedItem && contentType === "ALBUM" ? (
                      <div>
                        <div className="album-image-container">
                          <img
                            src={selectedItem.url}
                            alt={`Album ${selectedItem.id}`}
                            className="album-image"
                          />
                        </div>
                        <h5>{selectedItem.title}</h5>
                      </div>
                    ) : null}
                    <div className="card-icons">
                      <FontAwesomeIcon icon={faComment} />
                      <FontAwesomeIcon icon={faHeart} />
                      <FontAwesomeIcon icon={faBell} />
                      <FontAwesomeIcon icon={faFlag} />
                      <FontAwesomeIcon icon={faArrowsRotate} />
                      <button
                        type="button"
                        className="delete-post"
                        onClick={() => handlePostDelete(selectedItem.id)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </div>
                    {selectedItem && (
                      <div className="comments">
                        <h4>Replied:</h4>
                        {comments.map((comment) => (
                          <div className="comment-section">
                            <div key={comment.id} className="comment-card">
                              <div className="comment-avatar">
                                {comment.avatarUrl ? (
                                  <img src={comment.avatarUrl} alt="Avatar" />
                                ) : (
                                  <FontAwesomeIcon
                                    className="default-avatar"
                                    icon={faCircleUser}
                                  />
                                )}
                              </div>
                              <div className="comment-details">
                                <div className="comment-header">
                                  <strong>{comment.email}</strong>
                                </div>
                                <div className="comment-body">
                                  {comment.body}
                                </div>
                              </div>
                            </div>
                            <div className="card-icons-comment">
                              <FontAwesomeIcon icon={faComment} />
                              <FontAwesomeIcon icon={faHeart} />
                              <FontAwesomeIcon icon={faBell} />
                              <FontAwesomeIcon icon={faFlag} />
                              <FontAwesomeIcon icon={faArrowsRotate} />
                              <button
                                type="button"
                                className="delete-post"
                                onClick={() =>
                                  handlePostDelete(selectedItem.id)
                                }
                              >
                                <FontAwesomeIcon icon={faTrashCan} />
                              </button>
                            </div>
                            <hr className="hr-comment-section"></hr>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedItem && (
                      <div className="add-comment">
                        <h4>Add a Comment:</h4>
                        <form onSubmit={handleCommentSubmit}>
                          <input
                            type="text"
                            value={newComment}
                            onChange={handleCommentChange}
                            placeholder="Your comment..."
                          />
                          <button type="submit">Add</button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {showConfirmation && (
            <ConfirmationModal
              message="Are you sure?"
              onConfirm={() => {
                if (confirmAction) {
                  confirmAction();
                }
                setShowConfirmation(false);
              }}
              onCancel={() => setShowConfirmation(false)}
            />
          )}
        </div>
      ) : (
        <p>Select a friend to see their content.</p>
      )}
    </div>
  );
}

export default Content;
