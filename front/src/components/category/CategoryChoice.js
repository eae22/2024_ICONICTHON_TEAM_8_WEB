import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Map from '../map/Map';

import card from '../../images/Category1.png';
import wallet from '../../images/Category2.png';
import umbrella from '../../images/Category3.png';
import infoBuilding from '../../images/Category11.png';
import newengineeringBuilding from '../../images/Category22.png';
import wonheungBuilding from '../../images/Category33.png';
import etc from '../../images/Category44.png';

import './CategoryChoice.css';

const CategoryChoice = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState('');

  // 분실물 종류 카테고리 클릭 핸들러
  const handleCategoryClick = (category) => {
    if (category === 'etc') {
      alert('Coming Soon!');
    } else {
      navigate(`/category/${category}`);
    }
  };

  // 분실물 장소 선택 핸들러 (토글 기능 추가)
  const handleLocationClick = (location) => {
    if (location === 'etc') {
      alert('Coming Soon!');
    } else {
      setSelectedLocation((prevLocation) => (prevLocation === location ? '' : location));
    }
  };

  return (
    <div>
      <div className="CategoryChoice_all_layout">
        <div className="CategoryChoice_itemType_all">
          <div className="CategoryChoice_bigname">분실물 종류</div>
          <div className="CategoryChoice_icon_layout">
            <div onClick={() => handleCategoryClick('card')}>
              <img className="CategoryChoice_categoryImg" src={card} alt="카드" />
            </div>
            <div onClick={() => handleCategoryClick('wallet')}>
              <img className="CategoryChoice_categoryImg" src={wallet} alt="지갑" />
            </div>
            <div onClick={() => handleCategoryClick('umbrella')}>
              <img className="CategoryChoice_categoryImg" src={umbrella} alt="우산" />
            </div>
            <div onClick={() => handleCategoryClick('etc')}>
              <img className="CategoryChoice_categoryImg" src={etc} alt="기타" />
            </div>
          </div>
        </div>

        <div className="CategoryChoice_itemLocation_all">
          <div className="CategoryChoice_bigname">분실물 장소</div>
          <div className="CategoryChoice_icon_layout">
            <div onClick={() => handleLocationClick('infoculture')}>
              <img className="CategoryChoice_categoryImg" src={infoBuilding} alt="정보문화관" />
            </div>
            <div onClick={() => handleLocationClick('newengineering')}>
              <img className="CategoryChoice_categoryImg" src={newengineeringBuilding} alt="신공학관" />
            </div>
            <div onClick={() => handleLocationClick('wonheung')}>
              <img className="CategoryChoice_categoryImg" src={wonheungBuilding} alt="원흥관" />
            </div>
            <div onClick={() => handleLocationClick('etc')}>
              <img className="CategoryChoice_categoryImg" src={etc} alt="기타" />
            </div>
          </div>
        </div>

        {/* 선택된 장소에 따라 지도와 정보 표시 (토글된 경우에만 표시) */}
        {selectedLocation && (
          <div className="CategoryChoice_map_phone_all">
            <div className="CategoryChoice_map">
              <Map selectedLocation={selectedLocation} height="250px" />
            </div>
            <div className="CategoryChoice_location_phone">
              해당건물 담당자 번호 : {selectedLocation === 'infoculture' && '02-1234-5678'}
              {selectedLocation === 'newengineering' && '02-2345-6789'}
              {selectedLocation === 'wonheung' && '02-3456-7890'}
            </div>
            <button
              className="CategoryChoice_itemLocation_btn"
              onClick={() => {
                if (selectedLocation === 'infoculture') {
                  navigate('/category/infoculture');
                } else if (selectedLocation === 'newengineering') {
                  navigate('/category/newengineering');
                } else if (selectedLocation === 'wonheung') {
                  navigate('/category/wonheung');
                }
              }}
            >
              이동하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryChoice;
