import React, { useState, useEffect } from "react";
import ConfirmationModal from "./ConfirmationModal";
import PopupSukses from "./PopupSukses";
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

  const [newModalTitle, setNewModalTitle] = useState("");
  const [newModalBody, setNewModalBody] = useState("");
  const [newModalFile, setNewModalFile] = useState(null);
  const [newModalError, setNewModalError] = useState("");

  const [showPopup, setShowPopup] = useState(false);

  const [isNewPostVisible, setIsNewPostVisible] = useState(true);
  const [isNewAlbumVisible, setIsNewAlbumVisible] = useState(false);

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
    setIsNewAlbumVisible(false); // Menyembunyikan new-album saat tipe konten diubah
    setIsNewPostVisible(type === "POST");
    setContentType(type);
  };

  const handleNewModalTitleChange = (event) => {
    setNewModalTitle(event.target.value);
  };

  const handleNewModalBodyChange = (event) => {
    setNewModalBody(event.target.value);
  };

  const handleNewModalFileChange = (event) => {
    // Handle file change logic
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
      userId: selectedFriendId, // Set the user ID based on the selected friend
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
        // Update content with the newly added item
        setContent((prevContent) => [data, ...prevContent]);

        setNewModalTitle(""); // Clear the title
        setNewModalBody(""); // Clear the body
        setShowPopup(true); // Show the confirmation message

        // Set a timeout to hide the confirmation message after 3 seconds
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
      })
      .catch((error) => {
        // Handle error
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
    fetchComments(item.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
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
          // Mengatur kembali confirmAction dan showConfirmation ke null
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
                <form onSubmit={""}>
                  <input
                    type="text"
                    className="new-post-input"
                    id="inputTitle"
                    placeholder="Title of ur photo"
                    value={newModalTitle}
                    onChange={""}
                    required
                  />
                  <input type="file" class="form-control-file" id="namafiles" />

                  <button className="submit-comment" type="submit">
                    UPLOAD
                  </button>
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
        <p>Select a friend to see their content.</p>
      )}
    </div>
  );
}

export default Content;
