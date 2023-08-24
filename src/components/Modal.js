import React from "react";
import { Modal, Button } from "react-bootstrap";

function CustomModal({ show, onHide, item }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {item && item.contentType === "POST" ? item.title : "Album"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {item && item.contentType === "POST" ? (
          <>
            <p>{item.body}</p>
            <h4>Comments:</h4>
            {item.comments &&
              item.comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <strong>{comment.name}</strong>: {comment.body}
                </div>
              ))}
          </>
        ) : (
          <img
            src={item && item.url}
            alt={`Album ${item && item.id}`}
            className="album-image"
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomModal;
