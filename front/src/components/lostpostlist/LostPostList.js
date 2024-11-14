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
  const [posts, setPosts] = useState([]); // All posts from API
  const [filteredPosts, setFilteredPosts] = useState([]); // Filtered posts based on search
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const itemsPerPage = 5; // Number of items per page

  // Fetch data from API
  useEffect(() => {
    axios
      .get("/lost-item-list")
      .then((response) => {
        const data = response.data || []; // Ensure response.data is an array
        setPosts(data);
        setFilteredPosts(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Search filter handler
  const handleSearch = (searchText) => {
    if (searchText) {
      const results = posts.filter((post) =>
        post.itemType.includes(searchText)
      );
      setFilteredPosts(results);
    } else {
      setFilteredPosts(posts); // Show all posts if search is empty
    }
  };

  // Navigate to detail page
  const handleCardClick = (postId) => {
    navigate(`/lostpost/detail/${postId}`);
  };

  // Calculate posts for the current page
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="lost-post-list">
      <Header name="전체 분실물" />
      <SearchBar onSearch={handleSearch} />
      <div className="post-list">
        {Array.isArray(currentPosts) && currentPosts.length > 0 ? (
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
