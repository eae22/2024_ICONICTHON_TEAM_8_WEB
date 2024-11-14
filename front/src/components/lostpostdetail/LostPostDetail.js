import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles'; // MUI에서 테마를 가져옴
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

import Map from '../map/Map';
import LostPostDetailPopUp from './LostPostDetailPopUp';
import DeletePopUp from './DeletePopUp';

import BackIcon from '../../images/LostPostDetailBackIcon.png';

import KakaoTalk_20241114_154616828 from '../../images/KakaoTalk_20241114_154616828.jpg';
import img11 from '../../images/11.png';

import './LostPostDetail.css';

const LostPostDetail = () => {
  const navigate = useNavigate();
  const theme = useTheme(); // 테마 사용
  const { isAdmin } = useContext(AuthContext);
  const { id } = useParams(); // URL에서 id 파라미터 가져오기
  const [lostItemData, setLostItemData] = useState({
    itemImage: '',
    itemType: '',
    lostTime: '',
    lostLocation: '',
    storageLocation: '',
  });

  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isRequestCompleted, setIsRequestCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    itemType: '',
    storageLocation: '',
  });

  const [isDarkImage, setIsDarkImage] = useState(false); // 이미지가 어두운지 밝은지 상태 관리
  const imageRef = useRef(null);

  useEffect(() => {
    axios
      .get(`/lost-item-detail/${id}`) // id에 맞는 데이터 요청
      .then((response) => {
        setLostItemData(response.data);
        setEditedData({
          itemType: response.data.itemType,
          storageLocation: response.data.storageLocation,
        });
      })
      .catch((error) => {
        console.error('분실물 상세 정보를 불러오는 중 오류 발생:', error);
      });
  }, [id]);

  const handleComplete = () => {
    setIsRequestCompleted(true);
    setShowPopup(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedData.itemType.trim() || !editedData.storageLocation.trim()) {
      alert('모든 필드를 작성해 주세요.');
      return;
    }

    try {
      const response = await axios.put(`/lost-item-update/${id}`, {
        itemType: editedData.itemType,
        storageLocation: editedData.storageLocation,
      });

      if (response.status === 200) {
        setLostItemData((prevData) => ({
          ...prevData,
          itemType: editedData.itemType,
          storageLocation: editedData.storageLocation,
        }));
        setIsEditing(false);
        alert('수정이 성공적으로 완료되었습니다.');
      } else {
        alert('수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('수정 중 오류 발생:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const renderMap = () => {
    if (lostItemData.storageLocation === '정보문화관') {
      return <Map selectedLocation="infoculture" />;
    } else if (lostItemData.storageLocation === '원흥관') {
      return <Map selectedLocation="wonheung" />;
    } else if (lostItemData.storageLocation === '신공학관') {
      return <Map selectedLocation="newengineering" />;
    } else {
      return <div className="LostPostDetail_map_message">보관 장소에 대한 지도가 없습니다.</div>;
    }
  };

  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const checkImageBrightness = () => {
    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    let r = 0,
      g = 0,
      b = 0;

    for (let i = 0; i < imageData.data.length; i += 4) {
      r += imageData.data[i]; // Red
      g += imageData.data[i + 1]; // Green
      b += imageData.data[i + 2]; // Blue
    }

    const pixelCount = imageData.data.length / 4;
    r /= pixelCount;
    g /= pixelCount;
    b /= pixelCount;

    const brightness = (r + g + b) / 3;
    setIsDarkImage(brightness < 128); // 밝기가 128보다 낮으면 어두운 이미지로 판단
  };

  return (
    <div className="LostPostDetail_all_layout">
      <div className="LostPostDetail_lost-item-image">
        {lostItemData.itemImage ? (
          <img
            ref={imageRef}
            src={lostItemData.itemImage}
            alt="분실물"
            style={{ width: '100%', height: '260px' }}
            onLoad={checkImageBrightness} // 이미지 로드 후 밝기 체크
          />
        ) : (
          '분실물 사진'
        )}
        {/* 이미지 위에 BackIcon을 올리기 */}
        <img
          src={BackIcon}
          alt="Back"
          onClick={handleBackClick}
          style={{
            position: 'absolute',
            width: '50px',
            top: '10px',
            left: '5px',
            cursor: 'pointer',
            filter: isDarkImage ? 'invert(100%)' : 'invert(0%)', // 이미지 밝기에 따라 색상 변경
          }}
        />
      </div>

      <div className="LostPostDetail_lost-post-detail">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedData.itemType}
              onChange={(e) => setEditedData({ ...editedData, itemType: e.target.value })}
              placeholder="분실물 유형을 입력하세요"
            />
            <div className="LostPostDetail_time_location">분실 시간 : {lostItemData.lostTime || '시간 정보 없음'}</div>
            <div className="LostPostDetail_time_location">
              분실 장소 : {lostItemData.lostLocation || '위치 정보 없음'}
            </div>
            <div className="LostPostDetail_time_location">
              보관 장소 :
              <input
                type="text"
                value={editedData.storageLocation}
                onChange={(e) => setEditedData({ ...editedData, storageLocation: e.target.value })}
                placeholder="보관 장소를 입력하세요"
              />
            </div>
          </>
        ) : (
          <>
            <div className="LostPostDetail_lostitem">{lostItemData.itemType || '분실물'}</div>
            <div className="LostPostDetail_time_location">분실 시간 : {lostItemData.lostTime || '시간 정보 없음'}</div>
            <div className="LostPostDetail_time_location">
              분실 장소 : {lostItemData.lostLocation || '위치 정보 없음'}
            </div>
            <div className="LostPostDetail_time_location">
              보관 장소 : {lostItemData.storageLocation || '위치 정보 없음'}
            </div>
          </>
        )}

        <div className="LostPostDetail_map-container">{renderMap()}</div>

        {isAdmin && (
          <div className="LostPostDetail_button-container">
            {isEditing ? (
              <button onClick={handleSave}>저장</button>
            ) : (
              <>
                <button onClick={handleEdit}>수정</button>
                <button onClick={() => setShowDeletePopup(true)}>삭제</button>
              </>
            )}
          </div>
        )}

        {!isAdmin && (
          <button
            className="LostPostDetail_request-button"
            onClick={() => setShowPopup(true)}
            disabled={isRequestCompleted}
          >
            {isRequestCompleted ? '수취 신청 완료' : '수취 신청'}
          </button>
        )}

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

        {showDeletePopup && (
          <DeletePopUp
            id={lostItemData.id}
            onClose={() => setShowDeletePopup(false)}
            onDeleteComplete={() => {
              setShowDeletePopup(false);
              alert('게시글이 삭제되었습니다.');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LostPostDetail;
