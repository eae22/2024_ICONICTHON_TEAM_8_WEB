import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ------------------------------
import LostPostListCard from "./LostPostListCard";
import "./LostPostList.css";
import Header from "../basic/Header";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";

function LostPostList() {
  const navigate = useNavigate(); // ------------------------------
  //여기다가 api path를 가져와봐 아직 백엔드 연결안시켰어.
  //API path 이름은 /lost-item-list
  //가져올 항목:
  //axios.get('/lost-item-detail') -이거 get맞아?
  // - itemImage (가져올 항목1)
  // - itemType (가져올 항목1)
  // - lostTime (가져올 항목1)
  // - lostLocation(가져올 항목1)
  //posts주석은 그냥 예시용이었고 api path를 가져올거야

  const posts = [
    {
      id: 1,
      title: "파란색 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 2,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 3,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 4,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 5,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 6,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 7,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 8,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 9,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 10,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 11,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 12,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 13,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 14,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 15,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 16,
      title: "파란색 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 17,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 18,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 19,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 20,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 21,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 22,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 23,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 24,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 25,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 26,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 27,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 28,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 29,
      title: "루이비통 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
    {
      id: 30,
      title: "이주연 카드 지갑",
      date: "2024.11.11 오후 8시",
      location: "정보문화관 P 402 인쇄실",
    },
  ];
  // Pagination용 ----------------------------
  const [currentPage, setCurrentPage] = useState(1); //-------------------
  const itemsPerPage = 5; // 페이지당 항목 수 설정

  // search용 --------------------------------
  //1.검색결과 필터링 handleSearch
  const [filteredPosts, setFilteredPosts] = useState(posts); // ------------------------------

  const handleSearch = (searchText) => {
    if (searchText) {
      const results = posts.filter((post) => post.title.includes(searchText));
      if (results.length > 0) {
        setFilteredPosts(results);
        alert(`${searchText}에 대한 검색 결과가 있습니다.`);
      } else {
        setFilteredPosts([]);
        alert("검색 결과가 없습니다.");
      }
    } else {
      setFilteredPosts(posts); // 검색어가 없으면 모든 게시물을 표시
    }
  };

  const handleCardClick = (postId) => {
    navigate(`/lostpost/detail/${postId}`); // ------------------------------
  };

  // 현재 페이지에 해당하는 게시물 추출 ------------------------------
  const indexOfLastPost = currentPage * itemsPerPage;
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
            title={post.title}
            date={post.date}
            location={post.location}
            onClick={() => handleCardClick(post.id)} // ------------------------------
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage} // 현재 페이지 번호 ------------------------------
        totalPages={Math.ceil(filteredPosts.length / itemsPerPage)} // 총 페이지 수 ------------------------------
        setCurrentPage={setCurrentPage} // 페이지 변경 함수 ------------------------------
      />
    </div>
  );
}

export default LostPostList;
