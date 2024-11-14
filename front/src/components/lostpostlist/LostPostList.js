import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LostPostListCard from "./LostPostListCard";
import "./LostPostList.css";
import Header from "../basic/Header";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";

function LostPostList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]); // API 데이터 업데이트용
  const [filteredPosts, setFilteredPosts] = useState([]); // 검색 결과 필터링용 handleSearch
  const [currentPage, setCurrentPage] = useState(1); // Pagination용
  const itemsPerPage = 5; // 페이지 항목수 설정
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리

  // 데이터 Fetch (API로부터) 분실물 데이터 lost-item-list 가져오기
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // 데이터를 로드한 후 1초 후 로딩 상태를 false로 변경
    }, 1000); // 실제 API 응답 시간에 맞춰 설정

    axios
      .get("/lost-item-list")
      .then((response) => {
        const data = response.data.map((item) => ({
          id: item.id,
          itemImage: item.image, // Base64 이미지
          itemType: item.name,
          lostTime: item.upload_date,
          lostLocation: item.place,
        }));
        setPosts(data);
        setFilteredPosts(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // 검색 결과 필터링 함수
  const handleSearch = (searchText) => {
    if (searchText) {
      const results = posts.filter((post) =>
        post.itemType.includes(searchText)
      );
      if (results.length > 0) {
        setFilteredPosts(results);
      } else {
        setFilteredPosts([]); // 검색 결과가 없을 경우
      }
    } else {
      setFilteredPosts(posts); // 검색어가 없으면 모든 게시물을 표시
    }
  };

  // 카드 클릭하면 상세 페이지로 이동
  const handleCardClick = (postId) => {
    navigate(`/lostpost/detail/${postId}`);
  };

  // 현재 페이지에 해당하는 게시물 추출
  const indexOfLastPost = currentPage * itemsPerPage; // 페이지네이션을 위한 인덱스 계산
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="lost-post-list">
      <Header name="전체 분실물" />
      <SearchBar onSearch={handleSearch} />
      <div className="post-list">
        {isLoading ? (
          <div className="loading-message">로딩중...</div> // 로딩 중 메시지 표시
        ) : currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <LostPostListCard
              key={post.id}
              itemImage={post.itemImage}
              itemType={post.itemType}
              lostTime={post.lostTime}
              lostLocation={post.lostLocation}
              onClick={() => handleCardClick(post.id)}
            />
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredPosts.length / itemsPerPage)}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default LostPostList;
