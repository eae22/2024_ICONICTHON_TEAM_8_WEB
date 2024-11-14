import React, { useState, useEffect } from "react";
import axios from "axios";

function PersonalGetListCard({
  itemImage,
  itemType,
  lostTime,
  lostLocation,
  itemId,
  onCheckClick,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState("");
  const [imageSrc, setImageSrc] = useState(null);

  // 로딩 완료 후 로딩 상태 업데이트
  useEffect(() => {
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

    // 이미지 처리
    if (itemImage) {
      setImageSrc(itemImage);
    } else {
      setImageSrc(null); // 이미지가 없다면 null 처리
    }
  }, [lostTime, itemImage, itemId]);

  return (
    <div className="personal-get-card">
      <div className="post-thumbnail">
        {isLoading ? (
          <div className="placeholder">로딩중...</div>
        ) : imageSrc ? (
          <img src={imageSrc} alt="물품 이미지" />
        ) : (
          <div className="placeholder">이미지 없음</div>
        )}
      </div>
      <div className="post-info">
        <h3>{itemType}</h3>
        <p>{formattedDate}</p>
        <p className="post-location">{lostLocation}</p>
        <button className="check-button" onClick={onCheckClick}>
          수취확인
        </button>
      </div>
    </div>
  );
}

export default PersonalGetListCard;
