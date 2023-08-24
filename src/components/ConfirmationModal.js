import React from "react";
import "./ConfirmationModal.css";

function ConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    <div className="confirmation-modal">
      <div className="confirmation-content">
        <p>{message}</p>
        <div className="button-container">
          <button className="confirm-button" onClick={onConfirm}>
            YES
          </button>
          <button className="cancel-button" onClick={onCancel}>
            NO
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
