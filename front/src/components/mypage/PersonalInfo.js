import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PersonalInfo.css';

const PersonalInfo = () => {
  const [userInfo, setUserInfo] = useState({
    userImage: '',
    name: '',
    major: '',
    studentId: '',
  });

  useEffect(() => {
    // 사용자 정보를 불러오는 API 호출
    axios
      .get('/information')
      .then((response) => {
        setUserInfo({
          userImage: response.data.userImage || '이미지', // 이미지 URL
          name: response.data.name || '이름 없음', // 이름
          major: response.data.major || '전공 없음', // 전공
          studentId: response.data.studentId || '학번 없음', // 학번
        });
      })
      .catch((error) => {
        console.error('사용자 정보를 불러오는 중 오류 발생:', error);
      });
  }, []);

  const handleLogout = () => {
    // 로그아웃 기능 구현
    axios
      .post('/logout')
      .then(() => {
        alert('로그아웃 되었습니다.');
        // 로그아웃 후 리디렉션 또는 상태 초기화 가능
        window.location.href = '/login'; // 로그인 페이지로 이동
      })
      .catch((error) => {
        console.error('로그아웃 중 오류 발생:', error);
        alert('로그아웃에 실패했습니다.');
      });
  };

  return (
    <div className="PersonalInfo_all">
      <div className="PersonalInfo_content">
        <div className="PersonalInfo_image">
          {userInfo.userImage ? (
            <img className="PersonalInfo_image" src={userInfo.userImage} alt="프로필" />
          ) : (
            <div className="PersonalInfo_placeholder-image"></div>
          )}
        </div>
        <div className="PersonalInfo_right_layout">
          <div className="PersonalInfo_details">
            <div className="PersonalInfo_name">{userInfo.name || '이름'}</div>
            <div className="PersonalInfo_major">{userInfo.major || '전공'}</div>
            <div className="PersonalInfo_student-id">{userInfo.studentId || '학번'}</div>
          </div>
          <div className="PersonalInfo_logout-button_layout">
            <button className="PersonalInfo_logout-button" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
