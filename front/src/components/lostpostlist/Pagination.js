// src/components/Pagination.js
import React from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const renderPageButtons = () => {
    let pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={`page-button ${currentPage === i ? "active" : ""}`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      }
    } else if (currentPage <= 3) {
      // 첫 3 페이지 중 하나일 때 - 1 2 3 ... totalPages
      for (let i = 1; i <= 3; i++) {
        pages.push(
          <button
            key={i}
            className={`page-button ${currentPage === i ? "active" : ""}`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      }
      pages.push(<span key="dots1">...</span>);
      pages.push(
        <button
          key={totalPages}
          className={`page-button ${
            currentPage === totalPages ? "active" : ""
          }`}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </button>
      );
    } else if (currentPage >= totalPages - 2) {
      // 마지막 3 페이지 중 하나일 때 - 1 ... totalPages-2 totalPages-1 totalPages
      pages.push(
        <button
          key={1}
          className={`page-button ${currentPage === 1 ? "active" : ""}`}
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>
      );
      pages.push(<span key="dots2">...</span>);
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={`page-button ${currentPage === i ? "active" : ""}`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      // 중간 페이지일 때 - 1 ... currentPage-1 currentPage currentPage+1 ... totalPages
      pages.push(
        <button
          key={1}
          className={`page-button ${currentPage === 1 ? "active" : ""}`}
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>
      );
      pages.push(<span key="dots3">...</span>);
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(
          <button
            key={i}
            className={`page-button ${currentPage === i ? "active" : ""}`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      }
      pages.push(<span key="dots4">...</span>);
      pages.push(
        <button
          key={totalPages}
          className={`page-button ${
            currentPage === totalPages ? "active" : ""
          }`}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination-container">
      <button
        className="arrowbutton"
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {renderPageButtons()}
      <button
        className="arrowbutton"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
