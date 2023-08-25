import React from "react";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faBuildingColumns } from "@fortawesome/free-solid-svg-icons";

function Sidebar({ friends, onSelectFriend }) {
  return (
    <aside className="sidebar">
      <nav>
        <div className="socmed">
          <h1 className="sidebar-title">HOME</h1>
          <FontAwesomeIcon
            className="default-icon"
            icon={faBuildingColumns}
          />{" "}
          <hr />
          <a class="nc-bank nc-icon"></a>
        </div>
        <ul>
          <h3></h3>
          {friends.map((friend) => (
            <li key={friend.id}>
              <button onClick={() => onSelectFriend(friend.id)}>
                <div
                  className="avatar-sidebar"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <img
                    src={`https://i.pravatar.cc/32?u=${friend.id}`}
                    alt={`${friend.name}'s Avatar`}
                    className="avatar-sidebar"
                  />
                </div>
                {friend.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
