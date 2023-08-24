import React from "react";
import "./Sidebar.css";

function Sidebar({ friends, onSelectFriend }) {
  return (
    <aside className="sidebar">
      <nav>
        <h1>HOME</h1>
        <ul>
          <h3>Your Friends</h3>
          {friends.map((friend) => (
            <li key={friend.id}>
              <button onClick={() => onSelectFriend(friend.id)}>
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
