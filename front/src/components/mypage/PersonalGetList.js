import React, { useState, useEffect } from "react";
import axios from "axios";
import PersonalGetListCard from "./PersonalGetListCard";
import CheckCode from "./CheckCode";
import "./PersonalGetList.css";

function PersonalGetList() {
  const [posts, setPosts] = useState([]); // API 데이터 업데이트용
  const [filteredPosts, setFilteredPosts] = useState([]); // 검색 결과 필터링용
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리
  const [selectedPostId, setSelectedPostId] = useState(null); // 수취확인 버튼 클릭 시 저장되는 ID

  // 데이터 Fetch (API로부터) 개인 물품 데이터 personal-get-list 가져오기
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // 데이터를 로드한 후 1초 후 로딩 상태를 false로 변경
    }, 1000);

    axios
      .get("/personal-get-list")
      .then((response) => {
        console.log(response.data); // API에서 반환된 데이터를 확인
        const data = response.data.map((item) => ({
          id: item.id,
          itemImage: item.itemImage,
          itemType: item.itemType,
          lostTime: item.lostTime,
          lostLocation: item.lostLocation,
        }));
        setPosts(data);
        setFilteredPosts(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // 수취확인 버튼 클릭시 호출되는 함수
  const handleCheckClick = (postId) => {
    setSelectedPostId(postId);
  };

  // CheckCode 팝업을 닫기 위한 함수
  const handleCloseCheckCode = () => {
    setSelectedPostId(null);
  };

  return (
    <div className="personal-get-list">
      <div className="post-list">
        {isLoading ? (
          <div className="loading-message">로딩중...</div> // 로딩 중 메시지 표시
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PersonalGetListCard
              key={post.id}
              itemImage={post.itemImage}
              itemType={post.itemType}
              lostTime={post.lostTime}
              lostLocation={post.lostLocation}
              onCheckClick={() => handleCheckClick(post.id)}
            />
          ))
        ) : (
          <p className="no-posts-message">신청 내역이 없습니다.</p>
        )}
      </div>
      {selectedPostId && (
        <CheckCode id={selectedPostId} onClose={handleCloseCheckCode} />
      )}
    </div>
  );
}

export default PersonalGetList;
