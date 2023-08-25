import React, { useState, useEffect } from "react";
import ConfirmationModal from "./ConfirmationModal";
import PopupSukses from "./PopupSukses";
import EditModal from "./EditModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faFlag,
  faBell,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";

import {
  faArrowsRotate,
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
  const [isScrolling, setIsScrolling] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [newFiles, setNewFiles] = useState("");

  const [newModalTitle, setNewModalTitle] = useState("");
  const [newModalBody, setNewModalBody] = useState("");
  const [newModalError, setNewModalError] = useState("");

  // const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [showPopup, setShowPopup] = useState(false);

  const [isNewPostVisible, setIsNewPostVisible] = useState(true);
  const [isNewAlbumVisible, setIsNewAlbumVisible] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedItem, setEditedItem] = useState(null);

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

  useEffect(() => {
    const scrollableContent = document.getElementById("scrollable-content");
    if (scrollableContent) {
      scrollableContent.addEventListener("scroll", handleScroll);
      return () => {
        scrollableContent.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

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

  const handleContentTypeChange = (type) => {
    setIsNewAlbumVisible(false);
    setIsNewPostVisible(type === "POST");
    setContentType(type);
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(false); // Close the main modal
    fetchComments(item.id);
    setEditedItem(item); // Set the edited item for the edit modal
    setIsEditModalOpen(true); // Open the edit modal
  };

  const handleEditModalClose = () => {
    setEditedItem(null);
    setIsEditModalOpen(false);
  };

  const handleEditSave = async (editedTitle, editedBody) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${selectedItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedItem.id,
            userId: selectedItem.userId,
            title: editedTitle,
            body: editedBody,
          }),
        }
      );

      if (response.ok) {
        const updatedItem = await response.json();
        // Update the content with the updated item
        setContent((prevContent) =>
          prevContent.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          )
        );
        handleEditModalClose();
      } else {
        console.error("Error updating item:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleNewModalTitleChange = (event) => {
    setNewModalTitle(event.target.value);
  };

  const handleNewModalBodyChange = (event) => {
    setNewModalBody(event.target.value);
  };

  const handleNewModalSubmit = (event) => {
    event.preventDefault();

    if (!newModalTitle || !newModalBody) {
      setNewModalError("Both title and body are required.");
      return;
    }

    const endpoint = "https://jsonplaceholder.typicode.com/posts";

    const newPost = {
      title: newModalTitle,
      body: newModalBody,
      userId: selectedFriendId,
    };

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    })
      .then((response) => response.json())
      .then((data) => {
        setContent((prevContent) => [data, ...prevContent]);

        setNewModalTitle("");
        setNewModalBody("");
        setShowPopup(true);

        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
      })
      .catch((error) => {
        console.error("Error adding new post:", error);
      });
  };

  const handleIconHover = (icon) => {
    setHoveredIcon(icon);
  };

  const handleIconBlur = () => {
    setHoveredIcon(null);
  };

  const openModal = (item) => {
    setSelectedItem(item);
    fetchComments(item.id); // Selalu panggil fetchComments saat membuka item
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    setNewTitle("");
    setNewFiles("");
    setNewModalBody("");
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 1500);
  };

  const handleShowNewAlbum = () => {
    setIsNewAlbumVisible(true);
    setIsNewPostVisible(false);
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
    setConfirmAction(() => () => {
      fetch(`https://jsonplaceholder.typicode.com/comments/${commentId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== commentId)
          );
          setConfirmAction(null);
          setShowConfirmation(false);
        })
        .catch((error) => console.error("Error deleting comment:", error));
    });
    setShowConfirmation(true);
  };

  const handleScroll = () => {
    const scrollableContent = document.getElementById("scrollable-content");
    if (scrollableContent) {
      const scrolled = scrollableContent.scrollTop > 0;
      setIsScrolling(scrolled);
    }
  };

  return (
    <div className="content">
      {selectedFriend ? (
        <div>
          <div className="unscroll">
            <div className="user-profile">
              <img
                src={`https://i.pravatar.cc/150?u=${selectedFriend.id}`}
                alt="User profile"
                className="avatar"
              />
              <h2>{selectedFriend.name}</h2>
            </div>
            <div className="buttons-container">
              <button
                className={contentType === "POST" ? "active" : ""}
                onClick={() => handleContentTypeChange("POST")}
              >
                POST
              </button>
              <button
                className={
                  contentType === "ALBUM" ? "active keAlbum" : "keAlbum"
                }
                onClick={() => {
                  handleContentTypeChange("ALBUM");
                  handleShowNewAlbum();
                }}
              >
                ALBUM
              </button>
            </div>
            <hr></hr>
            <div className={`new-post ${isNewPostVisible ? "" : "hidden"}`}>
              <div>
                <form onSubmit={handleNewModalSubmit}>
                  <input
                    type="text"
                    className="new-post-input"
                    id="inputTitle"
                    placeholder="Title your story"
                    value={newModalTitle}
                    onChange={handleNewModalTitleChange}
                    required
                  />
                  <input
                    className="new-post-input"
                    id="inputBody"
                    placeholder="Describe us how your day!"
                    value={newModalBody}
                    onChange={handleNewModalBodyChange}
                    required
                  />
                  <button className="submit-comment" type="submit">
                    POST
                  </button>
                </form>
              </div>
            </div>
            <div className={`new-album ${isNewAlbumVisible ? "" : "hidden"}`}>
              <div>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="new-post-input"
                    id="inputTitle"
                    placeholder="Title of your photo"
                    value={newTitle}
                    required
                    onChange={(event) => setNewTitle(event.target.value)}
                  />
                  <input
                    type="file"
                    className="form-control-file"
                    id="namafiles"
                    value={newFiles}
                    onChange={(event) => setSelectedFile(event.target.files[0])}
                  />

                  <button className="submit-comment" type="submit">
                    UPLOAD
                  </button>
                  {showPopup && <PopupSukses message="Upload successful!" />}
                </form>
              </div>
            </div>
          </div>
          <div
            className={`items ${isScrolling ? "scrolling" : ""}`}
            id="scrollable-content"
          >
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
                      <div>
                        <h5>{item.title}</h5>

                        <div className="album-image-container">
                          <img
                            src={item.thumbnailUrl}
                            alt={`Album ${item.id}`}
                            className="album-image"
                          />
                        </div>
                      </div>
                    )}
                    <div className="card-icons">
                      <button
                        type="button"
                        className={`delete-post ${
                          hoveredIcon === "heart" ? "hovered" : ""
                        }`}
                        onMouseEnter={() => handleIconHover("heart")}
                        onMouseLeave={handleIconBlur}
                        onFocus={() => handleIconHover("heart")}
                        onBlur={handleIconBlur}
                      >
                        <FontAwesomeIcon icon={faHeart} />
                      </button>

                      <button
                        type="button"
                        className={`notif-post ${
                          hoveredIcon === "notif" ? "hovered" : ""
                        }`}
                        onMouseEnter={() => handleIconHover("notif")}
                        onMouseLeave={handleIconBlur}
                        onFocus={() => handleIconHover("notif")}
                        onBlur={handleIconBlur}
                      >
                        <FontAwesomeIcon icon={faBell} />
                      </button>

                      <button
                        type="button"
                        className={`report-post ${
                          hoveredIcon === "report" ? "hovered" : ""
                        }`}
                        onMouseEnter={() => handleIconHover("report")}
                        onMouseLeave={handleIconBlur}
                        onFocus={() => handleIconHover("report")}
                        onBlur={handleIconBlur}
                      >
                        <FontAwesomeIcon icon={faFlag} />
                      </button>

                      <button
                        type="button"
                        className={`repost-post ${
                          hoveredIcon === "repost" ? "hovered" : ""
                        }`}
                        onMouseEnter={() => handleIconHover("repost")}
                        onMouseLeave={handleIconBlur}
                        onFocus={() => handleIconHover("repost")}
                        onBlur={handleIconBlur}
                        onClick={() => handleEditClick(selectedItem.id)}
                      >
                        <FontAwesomeIcon icon={faArrowsRotate} />
                      </button>
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
                        <br></br>
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
                        <br></br>
                      </div>
                    ) : null}
                    <div className="card-icons">
                      <button
                        type="button"
                        className={`heart-post ${
                          hoveredIcon === "heart" ? "hovered" : ""
                        }`}
                        onMouseEnter={() => handleIconHover("heart")}
                        onMouseLeave={handleIconBlur}
                        onFocus={() => handleIconHover("heart")}
                        onBlur={handleIconBlur}
                      >
                        <FontAwesomeIcon icon={faHeart} />
                      </button>

                      <button
                        type="button"
                        className={`notif-post ${
                          hoveredIcon === "notif" ? "hovered" : ""
                        }`}
                        onMouseEnter={() => handleIconHover("notif")}
                        onMouseLeave={handleIconBlur}
                        onFocus={() => handleIconHover("notif")}
                        onBlur={handleIconBlur}
                      >
                        <FontAwesomeIcon icon={faBell} />
                      </button>

                      <button
                        type="button"
                        className={`report-post ${
                          hoveredIcon === "report" ? "hovered" : ""
                        }`}
                        onMouseEnter={() => handleIconHover("report")}
                        onMouseLeave={handleIconBlur}
                        onFocus={() => handleIconHover("report")}
                        onBlur={handleIconBlur}
                      >
                        <FontAwesomeIcon icon={faFlag} />
                      </button>

                      <button
                        type="button"
                        className={`repost-post ${
                          hoveredIcon === "repost" ? "hovered" : ""
                        }`}
                        onMouseEnter={() => handleIconHover("repost")}
                        onMouseLeave={handleIconBlur}
                        onFocus={() => handleIconHover("repost")}
                        onBlur={handleIconBlur}
                      >
                        <FontAwesomeIcon icon={faArrowsRotate} />
                      </button>
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
                              <button
                                type="button"
                                className={`delete-post ${
                                  hoveredIcon === "heart" ? "hovered" : ""
                                }`}
                                onMouseEnter={() => handleIconHover("heart")}
                                onMouseLeave={handleIconBlur}
                                onFocus={() => handleIconHover("heart")}
                                onBlur={handleIconBlur}
                              >
                                <FontAwesomeIcon icon={faHeart} />
                              </button>

                              <button
                                type="button"
                                className={`notif-post ${
                                  hoveredIcon === "notif" ? "hovered" : ""
                                }`}
                                onMouseEnter={() => handleIconHover("notif")}
                                onMouseLeave={handleIconBlur}
                                onFocus={() => handleIconHover("notif")}
                                onBlur={handleIconBlur}
                              >
                                <FontAwesomeIcon icon={faBell} />
                              </button>

                              <button
                                type="button"
                                className={`report-post ${
                                  hoveredIcon === "report" ? "hovered" : ""
                                }`}
                                onMouseEnter={() => handleIconHover("report")}
                                onMouseLeave={handleIconBlur}
                                onFocus={() => handleIconHover("report")}
                                onBlur={handleIconBlur}
                              >
                                <FontAwesomeIcon icon={faFlag} />
                              </button>

                              <button
                                type="button"
                                className={`repost-post ${
                                  hoveredIcon === "repost" ? "hovered" : ""
                                }`}
                                onMouseEnter={() => handleIconHover("repost")}
                                onMouseLeave={handleIconBlur}
                                onFocus={() => handleIconHover("repost")}
                                onBlur={handleIconBlur}
                              >
                                <FontAwesomeIcon icon={faArrowsRotate} />
                              </button>
                              <button
                                type="button"
                                className={`delete-post ${
                                  hoveredIcon === "heart" ? "hovered" : ""
                                }`}
                                onMouseEnter={() => handleIconHover("heart")}
                                onMouseLeave={handleIconBlur}
                                onFocus={() => handleIconHover("heart")}
                                onBlur={handleIconBlur}
                                onClick={() => handleCommentDelete(comment.id)}
                              >
                                <FontAwesomeIcon icon={faTrashCan} />
                              </button>
                            </div>
                            <hr className="hr-comment-section"></hr>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* eDIT POST */}
                    {isEditModalOpen && (
                      <EditModal
                        selectedItem={selectedItem} // Pass the selectedItem for editing
                        onClose={handleEditModalClose}
                        onSave={handleEditSave}
                      />
                    )}
                    {selectedItem && (
                      <div className="new-comment-section">
                        <form onSubmit={handleCommentSubmit}>
                          <input
                            className="add-comment"
                            type="text"
                            value={newComment}
                            onChange={handleCommentChange}
                            placeholder="Post your reply!"
                          />
                          <button className="submit-comment" type="submit">
                            Reply
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {showPopup && <PopupSukses message="Success" />}

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
        <div className="dashboardd">
            <h3 >Select a friend to see their content.</h3>
            <hr style={{ marginTop: 75}}></hr>
        </div>
      )}
    </div>
  );
}

export default Content;
