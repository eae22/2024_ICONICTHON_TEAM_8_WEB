import React from "react";
import "./LostPostListCard.css";

function LostPostListCard({
  key,
  itemImage,
  itemType,
  lostTime,
  lostLocation,
  onClick,
}) {
  // ------------------------------ LostPostListCard 컴포넌트 업데이트
  //확인용
  console.log("key:", key); // 확인용
  console.log("itemImage:", itemImage); // 확인용
  console.log("itemType:", itemType); // 확인용
  console.log("lostTime:", lostTime); // 확인용
  console.log("onClick:", onClick); // 확인용

  return (
    <div className="lost-post-card" onClick={onClick}>
      <div className="post-thumbnail">
        <img src={itemImage} alt="분실물 이미지" />
      </div>
      <div className="post-info">
        <h3>{itemType}</h3>
        <p>{lostTime}</p>
        <p className="post-location">{lostLocation}</p>
      </div>
    </div>
  );
}

export default LostPostListCard;
