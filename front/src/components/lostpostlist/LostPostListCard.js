import React, { useState, useEffect } from "react";
import "./LostPostListCard.css";

function LostPostListCard({
  itemImage,
  itemType,
  lostTime,
  lostLocation,
  onClick,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState("");

  // 로딩 완료 후 로딩 상태 업데이트
  useEffect(() => {
    // 로딩이 끝난다고 가정하고 1초 후 상태 업데이트 (실제 상황에서는 데이터를 받아오는 시점에서 처리)
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // 날짜 포맷팅
    if (lostTime) {
      const date = new Date(lostTime);
      const formatted = `${date.getFullYear()}년 ${
        date.getMonth() + 1
      }월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;
      setFormattedDate(formatted);
    }
  }, [lostTime]);

  return (
    <div className="lost-post-card" onClick={onClick}>
      <div className="post-thumbnail">
        {isLoading ? (
          <div className="placeholder">로딩중...</div>
        ) : itemImage ? (
          <img src={itemImage} alt="분실물 이미지" />
        ) : (
          <div className="placeholder">이미지 없음</div>
        )}
      </div>
      <div className="post-info">
        <h3>{itemType}</h3>
        <p>{formattedDate}</p>
        <p className="post-location">{lostLocation}</p>
      </div>
    </div>
  );
}

export default LostPostListCard;
