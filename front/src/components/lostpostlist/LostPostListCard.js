import React, { useState, useEffect } from 'react';

import LocationIcon from '../../images/LocationIcon.png';

import './LostPostListCard.css';

function LostPostListCard({ itemImage, itemType, lostTime, lostLocation, onClick }) {
  const [isLoading, setIsLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState('');

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
    <div className="LostPostListCard_all_layout">
      <div className="LostPostListCard_all_size" onClick={onClick}>
        <div>
          {isLoading ? (
            <div lassName="LostPostListCard_placeholder">로딩중...</div>
          ) : itemImage ? (
            <img className="LostPostListCard_itemImg" src={itemImage} alt="분실물 이미지" />
          ) : (
            <div className="LostPostListCard_placeholder">이미지 없음</div>
          )}
        </div>
        <div className="LostPostListCard_text_layout">
          <div className="LostPostListCard_lostTime_layout">
            <div className="PersonalGetListCard_itemType">{itemType || '카드'}</div>
            <div className="PersonalGetListCard_pickupDate_pickupTime">{formattedDate || '2024.11.11 오후 8시'}</div>
          </div>
          <div className="LostPostListCard_lostLocation_layout">
            <img src={LocationIcon} alt={'장소'} width={12} />
            <div className="LostPostListCard_storageLocation">{lostLocation || '정보문화관 P 402 인쇄실'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LostPostListCard;
