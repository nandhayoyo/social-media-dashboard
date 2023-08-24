import React, { useState } from "react";
import PropTypes from "prop-types";

function EditModal({ selectedItem, onClose, onSave }) {
  const [editedTitle, setEditedTitle] = useState(selectedItem.title);
  const [editedBody, setEditedBody] = useState(selectedItem.body);

  const handleTitleChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const handleBodyChange = (event) => {
    setEditedBody(event.target.value);
  };

  const handleSave = () => {
    onSave(editedTitle, editedBody);
    onClose();
  };

  return (
    <div className="modal" tabIndex="-1" role="dialog">
      <div className="modal-overlay">
        <div className="modal-content modal-medium">
          <div className="modal-header">
            <h2>Edit Item</h2>
            <button
              type="button"
              className="close-end"
              onClick={onClose}
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="content-card">
              <input
                type="text"
                value={editedTitle}
                onChange={handleTitleChange}
                className="edit-input"
              />
              <textarea
                value={editedBody}
                onChange={handleBodyChange}
                className="edit-textarea"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

EditModal.propTypes = {
  selectedItem: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditModal;
