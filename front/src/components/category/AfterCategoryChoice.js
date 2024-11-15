import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../basic/Header';
import SearchBar from '../lostpostlist/SearchBar';
import Pagination from '../lostpostlist/Pagination';
import LostPostListCard from '../lostpostlist/LostPostListCard';
// import "./AfterCategoryChoice.css";

const AfterCategoryChoice = () => {
  const navigate = useNavigate();
  const { category } = useParams(); // URL에서 카테고리 정보를 받아옴
  const [allLostItems, setAllLostItems] = useState([]); // 전체 분실물 데이터를 저장
  const [filteredItems, setFilteredItems] = useState([]); // 필터링된 데이터를 저장
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const itemsPerPage = 5; //한페이지에 5개

  // 백엔드에서 분실물 데이터를 Fetch--------LostList에서 따옴
  // 데이터 Fetch (API로부터) 분실물 데이터 lost-item-list 가져오기
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // 데이터를 로드한 후 1초 후 로딩 상태를 false로 변경
    }, 1000); // 실제 API 응답 시간에 맞춰 설정

    axios
      .get('/lost-item-list') // 백엔드 API에서 데이터를 가져옵니다.
      .then((response) => {
        const data = response.data.map((item) => ({
          id: item.id,
          itemImage: item.image, // Base64 이미지
          itemType: item.name,
          lostTime: item.upload_date,
          lostLocation: item.place,
          category: item.category, // 카테고리 추가
        }));
        setAllLostItems(data); // 데이터를 상태에 저장
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        setIsLoading(false);
      });
  }, []);

  // 선택된 카테고리에 따른 데이터 필터링
  useEffect(() => {
    let filtered;
    if (category === 'card' || category === 'wallet' || category === 'umbrella') {
      // 선택된 카테고리가 'card', 'wallet', 'umbrella' 중 하나일 경우
      filtered = allLostItems.filter((item) => item.category === category);
    } else {
      // 다른 카테고리일 경우 빈 배열
      filtered = [];
    }
    setFilteredItems(filtered); // 필터링 결과를 상태에 저장
  }, [category, allLostItems]);

  // 검색 결과 필터링 함수
  const handleSearch = (searchText) => {
    let filtered;

    // 검색어가 없을 경우 전체 항목을 표시
    if (!searchText) {
      setFilteredItems(allLostItems);
      return;
    }

    // 전체 데이터(allLostItems)에서 다시 필터링
    switch (category) {
      case 'wallet':
        // '지갑' 항목 중에서 name과 place 모두 검색 가능하게 설정
        filtered = allLostItems.filter(
          (item) =>
            item.itemType === '지갑' && (item.itemType.includes(searchText) || item.lostLocation.includes(searchText))
        );
        break;
      case 'card':
        // '카드' 항목 중에서 name과 place 모두 검색 가능하게 설정
        filtered = allLostItems.filter(
          (item) =>
            item.itemType === '카드' && (item.itemType.includes(searchText) || item.lostLocation.includes(searchText))
        );
        break;
      case 'umbrella':
        // '우산' 항목 중에서 name과 place 모두 검색 가능하게 설정
        filtered = allLostItems.filter(
          (item) =>
            item.itemType === '우산' && (item.itemType.includes(searchText) || item.lostLocation.includes(searchText))
        );
        break;
      case 'infoculture':
        // '정보문화관' 항목 중에서 name과 place 모두 검색 가능하게 설정
        filtered = allLostItems.filter(
          (item) =>
            item.lostLocation === '정보문화관' &&
            (item.itemType.includes(searchText) || item.lostLocation.includes(searchText))
        );
        break;
      case 'newengineering':
        // '신공학관' 항목 중에서 name과 place 모두 검색 가능하게 설정
        filtered = allLostItems.filter(
          (item) =>
            item.lostLocation === '신공학관' &&
            (item.itemType.includes(searchText) || item.lostLocation.includes(searchText))
        );
        break;
      case 'wonheung':
        // '원흥관' 항목 중에서 name과 place 모두 검색 가능하게 설정
        filtered = allLostItems.filter(
          (item) =>
            item.lostLocation === '원흥관' &&
            (item.itemType.includes(searchText) || item.lostLocation.includes(searchText))
        );
        break;
      default:
        filtered = []; // 조건에 맞지 않는 경우 빈 배열 설정
    }

    setFilteredItems(filtered); // 필터링 결과를 상태에 저장
  };

  // 현재 페이지에 해당하는 게시물 추출
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = filteredItems.slice(indexOfFirstPost, indexOfLastPost);

  // 카드 클릭 시 상세 페이지로 이동
  const handleCardClick = (postId) => {
    // 상세 페이지로 이동하는 로직 (필요한 라우팅 로직 추가)
    navigate(`/lostpost/detail/${postId}`);
  };

  // 카테고리별 제목 설정
  let headerTitle = '';
  switch (category) {
    case 'wallet':
      headerTitle = '지갑 분실물';
      break;
    case 'card':
      headerTitle = '카드 분실물';
      break;
    case 'umbrella':
      headerTitle = '우산 분실물';
      break;
    case 'infoculture':
      headerTitle = '정보문화관 분실물';
      break;
    case 'newengineering':
      headerTitle = '신공학관 분실물';
      break;
    case 'wonheung':
      headerTitle = '원흥관 분실물';
      break;
    default:
      headerTitle = `${category} 분실물`;
  }

  // 선택된 카테고리에 따른 데이터 필터링
  useEffect(() => {
    let filtered;
    switch (category) {
      case 'wallet':
        filtered = allLostItems.filter((item) => item.itemType === '지갑');
        break;
      case 'card':
        filtered = allLostItems.filter((item) => item.itemType === '카드');
        break;
      case 'umbrella':
        filtered = allLostItems.filter((item) => item.itemType === '우산');
        break;
      case 'infoculture':
        filtered = allLostItems.filter((item) => item.lostLocation === '정보문화관');
        break;
      case 'newengineering':
        filtered = allLostItems.filter((item) => item.lostLocation === '신공학관');
        break;
      case 'wonheung':
        filtered = allLostItems.filter((item) => item.lostLocation === '원흥관');
        break;
      default:
        filtered = []; // 조건에 맞지 않는 카테고리일 경우 빈 배열 설정
    }
    setFilteredItems(filtered); // 필터링 결과를 상태에 저장
  }, [category, allLostItems]);

  return (
    <div className="lost-post-list">
      <Header name={headerTitle} />
      <SearchBar onSearch={handleSearch} />
      <div className="post-list">
        {isLoading ? (
          <div className="loading-message">로딩 중...</div>
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
          <p className="no-posts-message">게시물 없음</p>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredItems.length / itemsPerPage)}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default AfterCategoryChoice;
