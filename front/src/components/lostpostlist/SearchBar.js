// src/components/lostpostlist/SearchBar.js
import React, { useRef } from 'react';
import './SearchBar.css';
import searchIcon from '../../images/SearchButton.png';

function SearchBar({ onSearch }) {
  const inputRef = useRef(null);

  const handleSearch = () => {
    const searchText = inputRef.current.value;
    console.log('Search text:', searchText);
    onSearch(searchText); // 부모 컴포넌트로 검색어 전달
    inputRef.current.value = ''; // 검색 후 입력창 초기화
  };

  return (
    <div className="search-bar">
      <input type="text" ref={inputRef} className="search-input" />
      <button onClick={handleSearch} className="search-btn">
        <img src={searchIcon} alt="Search Icon" className="search-icon" />
      </button>
    </div>
  );
}

export default SearchBar;
