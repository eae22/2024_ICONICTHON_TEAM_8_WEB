// LostPostList.js
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
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/lost-item-list")
      .then((response) => {
        const data = response.data.map((item) => ({
          id: item.id, // Use 'id' from the response
          itemImage: item.image,
          itemType: item.name,
          lostTime: item.upload_date,
          lostLocation: item.place,
        }));
        setPosts(data);
        setFilteredPosts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  const handleSearch = (searchText) => {
    if (searchText) {
      const results = posts.filter((post) =>
        post.itemType.includes(searchText)
      );
      setFilteredPosts(results);
    } else {
      setFilteredPosts(posts);
    }
  };

  const handleCardClick = (postId) => {
    navigate(`/lostpost/detail/${postId}`); // Use correct 'id' in the URL
  };

  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="lost-post-list">
      <Header name="전체 분실물" />
      <SearchBar onSearch={handleSearch} />
      <div className="post-list">
        {isLoading ? (
          <div className="loading-message">로딩중...</div>
        ) : currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <LostPostListCard
              key={post.id}
              itemImage={post.itemImage}
              itemType={post.itemType}
              lostTime={post.lostTime}
              lostLocation={post.lostLocation}
              onClick={() => handleCardClick(post.id)} // Pass the correct 'id'
            />
          ))
        ) : (
          <p className="no-posts-message">게시물 없음</p>
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
