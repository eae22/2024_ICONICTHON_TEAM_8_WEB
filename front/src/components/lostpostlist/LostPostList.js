import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ------------------------------
import axios from "axios"; //------------------추가함 api위해서
import LostPostListCard from "./LostPostListCard";
import "./LostPostList.css";
import Header from "../basic/Header";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";

function LostPostList() {
  //여기다가 api path를 가져와봐 아직 백엔드 연결안시켰어.
  //API path 이름은 /lost-item-list
  //가져올 항목:
  //axios.get('/lost-item-detail') -이거 get맞아?
  // - itemImage (가져올 항목1)
  // - itemType (가져올 항목1)
  // - lostTime (가져올 항목1)
  // - lostLocation(가져올 항목1)
  //posts주석은 그냥 예시용이었고 api path를 가져올거야

  const navigate = useNavigate();
  const [posts, setPosts] = useState([]); //api 데이터 업데이트용
  const [filteredPosts, setFilteredPosts] = useState([]); //검색 결과 필터링용 handleSearch
  const [currentPage, setCurrentPage] = useState(1); // Pagination용
  const itemsPerPage = 5; // 페이지 항목수 설정

  // 데이터 Fetch (API로부터) 분실물 데이터 lost-item-list가져오기----------------------
  useEffect(() => {
    axios
      .get("/lost-item-list")
      .then((response) => {
        setPosts(response.data);
        setFilteredPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // 검색 결과 필터링 함수---------------------------------------------------------------
  const handleSearch = (searchText) => {
    if (searchText) {
      const results = posts.filter((post) =>
        post.itemType.includes(searchText)
      );
      if (results.length > 0) {
        setFilteredPosts(results);
        // alert(`${searchText}에 대한 검색 결과가 있습니다.`);
      } else {
        setFilteredPosts([]);
        // alert("검색 결과가 없습니다.");
      }
    } else {
      setFilteredPosts(posts); // 검색어가 없으면 모든 게시물을 표시
    }
  };

  // 카드 클릭하면!  상세 페이지로 이동
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
        {currentPosts.map((post) => (
          <LostPostListCard
            key={post.id}
            itemImage={post.itemImage}
            itemType={post.itemType}
            lostTime={post.lostTime}
            lostLocation={post.lostLocation}
            onClick={() => handleCardClick(post.id)}
          />
        ))}
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
