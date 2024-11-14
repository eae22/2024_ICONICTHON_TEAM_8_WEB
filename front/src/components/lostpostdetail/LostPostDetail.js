import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles'; // MUI에서 테마를 가져옴
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

import Map from '../map/Map';
import LostPostDetailPopUp from './LostPostDetailPopUp';
import DeletePopUp from './DeletePopUp';

import BackIcon from '../../images/LostPostDetailBackIcon.png';

import './LostPostDetail.css';

const LostPostDetail = () => {
  const { id } = useParams(); // Get 'id' from URL
  const [lostItemData, setLostItemData] = useState({});
  const navigate = useNavigate();
  const theme = useTheme(); // 테마 사용
  const { isAdmin } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리
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

  // 데이터 로딩
  useEffect(() => {
    axios
      .get(`/lost-item-detail/${id}`) // Fetch item details using 'id'
      .then((response) => {
        setLostItemData(response.data);
        setEditedData({
          itemType: response.data.itemType || '',
          storageLocation: response.data.storageLocation || '',
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching lost item details:', error);
        setIsLoading(false);
      });
  }, [id]);

  // 로딩 상태 처리
  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  // 날짜 포맷팅 (2024-11-14T06:10 -> 2024년 11월 14일 06시 10분)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;
  };

  // 이미지 밝기 체크
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

  // 지도 렌더링 함수
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

  // 저장 함수
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

  return (
    <div className="LostPostDetail_all_layout">
      <div className="LostPostDetail_lost-item-image">
        {isLoading ? (
          <div className="loading-message">로딩중...</div> // 로딩 중 메시지
        ) : (
          lostItemData.itemImage && (
            <img
              ref={imageRef}
              src={lostItemData.itemImage}
              alt="분실물"
              style={{ width: '100%', height: '260px' }}
              onLoad={checkImageBrightness} // 이미지 로드 후 밝기 체크
            />
          )
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
              className="LostPostDetail_update_input"
              type="text"
              value={editedData.itemType}
              onChange={(e) => setEditedData({ ...editedData, itemType: e.target.value })}
              placeholder="분실물 유형을 입력하세요"
            />
            <div className="LostPostDetail_time_location">
              분실 시간 : {formatDate(lostItemData.lostTime) || '시간 정보 없음'}
            </div>
            <div className="LostPostDetail_time_location">
              분실 장소 : {lostItemData.lostLocation || '위치 정보 없음'}
            </div>
            <div className="LostPostDetail_time_location">
              보관 장소 :
              <input
                className="LostPostDetail_update_input2"
                type="text"
                value={editedData.storageLocation}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    storageLocation: e.target.value,
                  })
                }
                placeholder="보관 장소를 입력하세요"
              />
            </div>
          </>
        ) : (
          <>
            <div className="LostPostDetail_lostitem">{lostItemData.itemType || '분실물'}</div>
            <div className="LostPostDetail_time_location">
              분실 시간 : {formatDate(lostItemData.lostTime) || '시간 정보 없음'}
            </div>
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
              <button className="LostPostDetail_save_btn" onClick={handleSave}>
                저장
              </button>
            ) : (
              <div className="LostPostDetail_update_delete_btn_layout">
                <button className="LostPostDetail_update_btn" onClick={() => setIsEditing(true)}>
                  수정
                </button>
                <button className="LostPostDetail_delete_btn" onClick={() => setShowDeletePopup(true)}>
                  삭제
                </button>
              </div>
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
            itemId={lostItemData.id} // Pass the correct 'id'
            itemType={lostItemData.itemType}
            storageLocation={lostItemData.storageLocation}
            lostTime={lostItemData.lostTime}
            lostLocation={lostItemData.lostLocation}
            onClose={() => setShowPopup(false)}
            onComplete={() => setIsRequestCompleted(true)}
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
