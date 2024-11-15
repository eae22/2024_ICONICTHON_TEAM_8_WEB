import React, { useState } from 'react';
import axios from 'axios';
import './CheckCode.css';

const CheckCode = ({ id, onClose, isOpen }) => {
  const [code, setCode] = useState('');

  const handleInputChange = (e) => {
    setCode(e.target.value);
    console.log('코드 입력값 변경:', e.target.value);
  };

  const handleConfirm = async () => {
    console.log('수취 확인 버튼 클릭 - 코드 확인 중');
    try {
      const response = await axios.post(`/check-code/${id}`, { code });
      if (response.status === 200) {
        console.log('수취 확인 성공');
        alert('수취 확인이 성공적으로 완료되었습니다.');
        onClose();
      } else {
        console.log('수취 확인 실패');
        alert('수취 확인에 실패했습니다.');
      }
    } catch (error) {
      console.error('수취 확인 중 오류 발생:', error);
      alert('수취 확인 중 오류가 발생했습니다.');
    }
  };

  if (!isOpen) return null; // 팝업이 닫혀 있을 때는 아무것도 렌더링하지 않음

  return (
    <div className="CheckCode_popup-overlay" onClick={onClose}>
      <div className="CheckCode_popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="CheckCode_popup_name">수취확인</div>
        <input
          type="text"
          value={code}
          onChange={handleInputChange}
          placeholder="관리인 코드"
          className="CheckCode_input"
        />
        <button onClick={handleConfirm} className="CheckCode_confirm-button">
          수취 확인
        </button>
      </div>
    </div>
  );
};

export default CheckCode;
