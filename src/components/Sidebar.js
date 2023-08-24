import React from "react";
import "./Sidebar.css";

function Sidebar({ friends, onSelectFriend }) {
  return (
    <aside className="sidebar">
      <nav>
        <div className="socmed">
          <h1 className="sidebar-title">HOME</h1>
          <hr />
        </div>
        <ul>
          <h3></h3>
          {friends.map((friend) => (
            <li key={friend.id}>
              <button onClick={() => onSelectFriend(friend.id)}>
                <div className="avatar-sidebar">
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
