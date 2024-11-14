import React, { useState } from "react";
import axios from "axios";
import "./CheckCode.css";

const CheckCode = ({ id, onClose }) => {
  const [code, setCode] = useState("");

  const handleInputChange = (e) => {
    setCode(e.target.value);
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.post(`/check-code/${id}`, { code });
      if (response.status === 200) {
        alert("수취 확인이 성공적으로 완료되었습니다.");
        onClose(); // 팝업 닫기
      } else {
        alert("수취 확인에 실패했습니다.");
      }
    } catch (error) {
      console.error("수취 확인 중 오류 발생:", error);
      alert("수취 확인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="CheckCode_popup-overlay" onClick={onClose}>
      <div
        className="CheckCode_popup-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>수취확인</h2>
        <input
          type="text"
          value={code}
          onChange={handleInputChange}
          placeholder="관리인 코드"
        />
        <button onClick={handleConfirm} className="CheckCode_confirm-button">
          수취 확인
        </button>
      </div>
    </div>
  );
};

export default CheckCode;
