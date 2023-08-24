import React from "react";
import "./PopupSukses.css"; // Import your CSS file for styling

function PopupSukses({ message }) {
  return (
    <div className="popupSukses-message-overlay">
      <div className="popupSukses-content">
        <p>{message}</p>
      </div>
    </div>
  );
}

export default PopupSukses;
