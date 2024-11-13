import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import infoBuilding from '../../images/Category11.png';
import newengineeringBuilding from '../../images/Category22.png';
import wonheungBuilding from '../../images/Category33.png';
import etc from '../../images/Category44.png';

import AdminMap from '../map/AdminMap';
import './AdminPage.css';

function AdminPage() {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleLocationClick = (location) => {
    if (location === 'etc') {
      alert('Coming Soon!');
    } else {
      setSelectedLocation((prevLocation) => (prevLocation === location ? '' : location));
    }
  };

  const handleNavigate = () => {
    if (selectedLocation === 'info-building') {
      navigate('/cctv/infoculture');
    } else if (selectedLocation === 'newengineering-building') {
      navigate('/cctv/newengineering');
    } else if (selectedLocation === 'wonheung-building') {
      navigate('/cctv/wonheung');
    }
  };

  return (
    <div className="AdminPage_all_layout">
      <div className="AdminPage_itemLocation_all">
        <div className="AdminPage_bigname">CCTV 실시간 확인</div>
        <div className="AdminPage_icon_layout">
          <div onClick={() => handleLocationClick('info-building')}>
            <img className="AdminPage_categoryImg" src={infoBuilding} alt="정보문화관" />
          </div>
          <div onClick={() => handleLocationClick('newengineering-building')}>
            <img className="AdminPage_categoryImg" src={newengineeringBuilding} alt="신공학관" />
          </div>
          <div onClick={() => handleLocationClick('wonheung-building')}>
            <img className="AdminPage_categoryImg" src={wonheungBuilding} alt="원흥관" />
          </div>
          <div onClick={() => handleLocationClick('etc')}>
            <img className="AdminPage_categoryImg" src={etc} alt="기타" />
          </div>
        </div>
      </div>

      {/* 선택된 장소에 따라 지도와 정보 표시 */}
      <div className="AdminPage_map_all">
        <AdminMap selectedLocation={selectedLocation} height="250px" level={3} />

        {/* 선택된 위치가 있을 때만 이동하기 버튼 표시 */}
        {selectedLocation && (
          <button className="AdminPage_itemLocation_btn" onClick={handleNavigate}>
            이동하기
          </button>
        )}
      </div>

      <div className="AdminPage_pickup_code_all">
        <div className="AdminPage_pickup_code">수취 확인 코드 : abxd1234</div>
      </div>
    </div>
  );
}

export default AdminPage;
