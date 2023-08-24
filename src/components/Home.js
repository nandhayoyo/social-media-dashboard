import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Content from "./Content";
import "./Home.css";

function Home() {
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => setFriends(data))
      .catch((error) => console.error("Error fetching friends:", error));
  }, []);

  const onSelectFriend = (friendId) => {
    setSelectedFriendId(friendId);
  };

  return (
    <div className="home">
      <Sidebar friends={friends} onSelectFriend={onSelectFriend} />
      <Content friends={friends} selectedFriendId={selectedFriendId} />
    </div>
  );
}

export default Home;
