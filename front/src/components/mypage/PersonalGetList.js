import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PersonalGetListCard from './PersonalGetListCard';
import CheckCode from './CheckCode';
import './PersonalGetList.css';

function PersonalGetList() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null); // 클릭한 항목의 ID 저장

  useEffect(() => {
    console.log('PersonalGetList useEffect 실행');
    setTimeout(() => {
      setIsLoading(false);
      console.log('isLoading 상태 변경: false');
    }, 1000);

    axios
      .get('/personal-get-list')
      .then((response) => {
        console.log('API 응답:', response.data);
        const data = response.data.map((item) => ({
          id: item.id,
          itemImage: item.itemImage,
          itemType: item.itemType,
          lostTime: item.lostTime,
          lostLocation: item.lostLocation,
        }));
        setPosts(data);
        setFilteredPosts(data);
        console.log('posts 설정 완료:', data);
      })
      .catch((error) => {
        console.error('데이터 가져오기 중 오류:', error);
      });
  }, []);

  // 수취확인 버튼 클릭 시 팝업을 열고 선택된 ID 저장
  const handleCheckClick = (id) => {
    console.log('handleCheckClick 호출됨 - 팝업 열림 설정, 선택된 ID:', id);
    setSelectedPostId(id); // 선택된 항목의 ID 저장
    setIsPopupOpen(true); // 팝업 열림
  };

  // CheckCode 팝업을 닫기 위한 함수
  const handleCloseCheckCode = () => {
    console.log('CheckCode 닫기 - 팝업 닫힘 설정');
    setIsPopupOpen(false);
    setSelectedPostId(null); // 선택된 ID 초기화
  };

  return (
    <div className="personal-get-list">
      <div className="post-list">
        {isLoading ? (
          <div className="loading-message">로딩중...</div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PersonalGetListCard
              key={post.id}
              itemId={post.id}
              itemImage={post.itemImage}
              itemType={post.itemType}
              lostTime={post.lostTime}
              lostLocation={post.lostLocation}
              onCheckClick={() => handleCheckClick(post.id)} // 클릭 시 선택된 ID 전달
            />
          ))
        ) : (
          <p className="no-posts-message">신청 내역이 없습니다.</p>
        )}
      </div>
      <CheckCode id={selectedPostId} onClose={handleCloseCheckCode} isOpen={isPopupOpen} />
    </div>
  );
}

export default PersonalGetList;
