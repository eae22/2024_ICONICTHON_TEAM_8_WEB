import React from 'react';
import { useNavigate } from 'react-router-dom';

import infoBuilding from '../../images/Category11.png';
import newengineeringBuilding3 from '../../images/Category223.png';
import newengineeringBuilding9 from '../../images/Category229.png';
import wonheungBuilding from '../../images/Category33.png';
import etc from '../../images/Category44.png';

import './AdminPage.css';

function AdminPage() {
  const navigate = useNavigate();

  const handleLocationClick = (location) => {
    if (location === 'etc') {
      alert('Coming Soon!');
    } else if (location === 'info-building') {
      navigate('/cctvlive/infoculture');
    } else if (location === 'newengineering-building-3') {
      navigate('/cctvlive/newengineering-3');
    } else if (location === 'newengineering-building-9') {
      navigate('/cctvlive/newengineering-9');
    } else if (location === 'wonheung-building') {
      navigate('/cctvlive/wonheung');
    }
  };

  return (
    <div className="AdminPage_all_layout">
      <div className="AdminPage_itemLocation_all">
        <div className="AdminPage_bigname">CCTV 실시간 확인</div>
        <div className="AdminPage_icon_etc_layout">
          <div className="AdminPage_icon_layout">
            <div onClick={() => handleLocationClick('info-building')}>
              <img className="AdminPage_categoryImg" src={infoBuilding} alt="정보문화관" />
            </div>
            <div onClick={() => handleLocationClick('newengineering-building-3')}>
              <img className="AdminPage_categoryImg" src={newengineeringBuilding3} alt="신공학관 3층" />
            </div>
            <div onClick={() => handleLocationClick('newengineering-building-9')}>
              <img className="AdminPage_categoryImg" src={newengineeringBuilding9} alt="신공학관 9층" />
            </div>
            <div onClick={() => handleLocationClick('wonheung-building')}>
              <img className="AdminPage_categoryImg" src={wonheungBuilding} alt="원흥관" />
            </div>
          </div>
          <div onClick={() => handleLocationClick('etc')}>
            <img className="AdminPage_categoryImg" src={etc} alt="기타" />
          </div>
        </div>
      </div>

      <div className="AdminPage_pickup_code_all">
        <div className="AdminPage_pickup_code">수취 확인 코드 : abxd1234</div>
      </div>
    </div>
  );
}

export default AdminPage;
