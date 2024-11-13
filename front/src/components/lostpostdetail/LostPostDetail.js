import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Map from '../map/Map';
import LostPostDetailPopUp from './LostPostDetailPopUp';

import './LostPostDetail.css';

const LostPostDetail = () => {
  const [lostItemData, setLostItemData] = useState({
    itemImage: '',
    itemType: '',
    lostTime: '',
    lostLocation: '',
    storageLocation: '',
  });

  const [showPopup, setShowPopup] = useState(false);
  const [isRequestCompleted, setIsRequestCompleted] = useState(false);

  useEffect(() => {
    axios
      .get('/api/lost-item-detail')
      .then((response) => {
        setLostItemData(response.data);
      })
      .catch((error) => {
        console.error('분실물 상세 정보를 불러오는 중 오류 발생:', error);
      });
  }, []);

  const handleComplete = () => {
    setIsRequestCompleted(true); // 수취 신청 완료 상태 설정
    setShowPopup(false); // 팝업 닫기
  };

  const renderMap = () => {
    if (lostItemData.storageLocation === '정보문화관') {
      return <Map selectedLocation="infoculture" />;
    } else if (lostItemData.storageLocation === '원흥관') {
      return <Map selectedLocation="wonheung" />;
    } else if (lostItemData.storageLocation === '신공학관') {
      return <Map selectedLocation="newengineering" />;
    } else {
      // return <div className="LostPostDetail_map_message">보관 장소에 대한 지도가 없습니다.</div>;
      return <Map selectedLocation="infoculture" />;
    }
  };

  return (
    <div className="LostPostDetail_all_layout">
      <div className="LostPostDetail_lost-item-image">
        {lostItemData.itemImage ? (
          <img src={lostItemData.itemImage} alt="분실물" style={{ width: 'auto', height: '260px' }} />
        ) : (
          '분실물 사진'
        )}
      </div>
      <div className="LostPostDetail_lost-post-detail">
        <div className="LostPostDetail_lostitem">{lostItemData.itemType || '분실물'}</div>
        <div className="LostPostDetail_time_location">분실 시간 : {lostItemData.lostTime || '시간 정보 없음'}</div>
        <div className="LostPostDetail_time_location">분실 장소 : {lostItemData.lostLocation || '위치 정보 없음'}</div>
        <div className="LostPostDetail_time_location">
          보관 장소 : {lostItemData.storageLocation || '위치 정보 없음'}
        </div>

        {/* 지도 렌더링 */}
        <div className="LostPostDetail_map-container">{renderMap()}</div>

        <button
          className="LostPostDetail_request-button"
          onClick={() => setShowPopup(true)}
          disabled={isRequestCompleted}
        >
          {isRequestCompleted ? '수취 신청 완료' : '수취 신청'}
        </button>

        {showPopup && (
          <LostPostDetailPopUp
            itemType={lostItemData.itemType}
            storageLocation={lostItemData.storageLocation}
            lostTime={lostItemData.lostTime}
            lostLocation={lostItemData.lostLocation}
            onClose={() => setShowPopup(false)}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
};

export default LostPostDetail;
