import React from 'react';
import axios from 'axios';
import './DeletePopUp.css';

const DeletePopUp = ({ id, onClose, onDeleteComplete }) => {
  const handleDelete = async () => {
    try {
      const response = await axios.delete('/delete-lost-item/${id}');
      if (response.status === 200) {
        alert('게시글이 성공적으로 삭제되었습니다.');
        onDeleteComplete(); // 삭제 완료 콜백
        onClose(); // 팝업 닫기
      } else {
        alert('게시글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 삭제 중 오류 발생:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="DeletePopUp_popup-overlay" onClick={onClose}>
      <div className="DeletePopUp_popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="DeletePopUp_message">게시글을 삭제하시겠습니까?</div>
        <div className="DeletePopUp_button-group">
          <button onClick={handleDelete} className="DeletePopUp_delete-button">
            삭제
          </button>
          <button onClick={onClose} className="DeletePopUp_cancel-button">
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopUp;
