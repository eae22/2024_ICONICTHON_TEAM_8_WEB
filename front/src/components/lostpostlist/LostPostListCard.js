import React from "react";
import "./LostPostListCard.css";

function LostPostListCard({ key, title, date, location, onClick }) {
  // ------------------------------
  console.log("key:", key); // 확인용
  console.log("title:", title); // 확인용
  console.log("date:", date); // 확인용
  console.log("location:", location); // 확인용
  return (
    <div className="lost-post-card" onClick={onClick}>
      {" "}
      {/* ------------------------------ */}
      <div className="post-thumbnail"></div>
      <div className="post-info">
        <h3>{title}</h3>
        <p>{date}</p>
        <p className="post-location">{location}</p>
      </div>
    </div>
  );
}

export default LostPostListCard;
