import React, { useState, useEffect } from 'react';

import LocationIcon from '../../images/LocationIcon.png';

import './PersonalGetListCard.css';

function PersonalGetListCard({ itemImage, itemType, lostTime, lostLocation, itemId, onCheckClick }) {
  const [isLoading, setIsLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState('');
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    console.log('PersonalGetListCard useEffect 실행');
    setTimeout(() => {
      setIsLoading(false);
      console.log('isLoading 상태 변경: false');
    }, 1000);

    if (lostTime) {
      const date = new Date(lostTime);
      const formatted = `${date.getFullYear()}년 ${
        date.getMonth() + 1
      }월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;
      setFormattedDate(formatted);
      console.log('formattedDate 설정:', formatted);
    }

    if (itemImage) {
      setImageSrc(itemImage);
      console.log('imageSrc 설정:', itemImage);
    } else {
      setImageSrc(null);
      console.log('imageSrc가 없어서 null로 설정');
    }
  }, [lostTime, itemImage]);

  return (
    <div className="PersonalGetListCard_all_layout">
      <div className="PersonalGetListCard_all_size">
        <div>
          {isLoading ? (
            <div className="PersonalGetListCard_placeholder">로딩중...</div>
          ) : imageSrc ? (
            <img className="PersonalGetListCard_itemImg" src={imageSrc} alt="물품 이미지" width={90} height={90} />
          ) : (
            <div className="PersonalGetListCard_placeholder">이미지 없음</div>
          )}
        </div>
        <div className="PersonalGetListCard_text_layout">
          <div className="PersonalGetListCard_lostTime_layout">
            <div className="PersonalGetListCard_itemType">{itemType || '카드'}</div>
            <div className="PersonalGetListCard_pickupDate_pickupTime">{formattedDate || '2024.11.11 오후 8시'}</div>
          </div>
          <div className="PersonalGetListCard_lostLocation_layout">
            <img src={LocationIcon} alt={'장소'} width={12} />
            <div className="PersonalGetListCard_storageLocation">{lostLocation || '정보문화관 P 402 인쇄실'}</div>
          </div>
        </div>
        <div className="PersonalGetListCard_btn_layout">
          <button
            className="PersonalGetListCard_pickupcheck_btn"
            onClick={() => {
              console.log('수취확인 버튼 클릭 - itemId:', itemId);
              onCheckClick(itemId);
            }}
          >
            수취확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalGetListCard;
