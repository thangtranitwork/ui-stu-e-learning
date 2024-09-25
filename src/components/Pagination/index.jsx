import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Pagination.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import Table from "../Table";

const cx = classNames.bind(styles);

export default function Pagination({
  url,
  render,
  searchQuery = "",
  attachToken = false,
  renderWithOutMap = false,
}) {
  const MAX_PAGE_BUTTONS = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery); // Debounced value

  // Apply debouncing to searchQuery
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery); // Set debounced value after a delay
    }, 1000); // Delay time in milliseconds (e.g., 500ms)

    // Clear the timeout if the query changes before the delay is over
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Reset currentPage to 0 when searchQuery changes
  useEffect(() => {
    setCurrentPage(0); // Quay về trang đầu tiên khi searchQuery thay đổi
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json", // Header cơ bản
        };

        // Kiểm tra nếu attachToken là true thì thêm Authorization header
        if (attachToken) {
          const accessToken = localStorage.getItem("accessToken"); // Lấy token từ localStorage
          if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
          }
        }

        const response = await fetch(
          `${url}?${debouncedQuery}&page=${currentPage}`,
          {
            method: "GET", // hoặc "POST" tùy thuộc vào yêu cầu của bạn
            headers, // Sử dụng headers đã tạo
          }
        );

        const data = await response.json();
        console.warn(data);
        
        setCurrentPageData(data.body.content);
        setTotalPages(data.body.page.totalPages || 1);
      } catch (error) {
        console.error("Error fetching page data:", error);
      }
    };

    fetchData();
  }, [currentPage, url, debouncedQuery]); // Only fetch data when debouncedQuery or currentPage changes

  const getPageNumbers = () => {
    let startPage = Math.max(0, currentPage - Math.floor(MAX_PAGE_BUTTONS / 2));
    let endPage = Math.min(totalPages - 1, startPage + MAX_PAGE_BUTTONS - 1);

    if (endPage - startPage < MAX_PAGE_BUTTONS - 1) {
      startPage = Math.max(0, endPage - MAX_PAGE_BUTTONS + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageChange = (pageNumber) => {
    pageNumber >= 0 && setCurrentPage(pageNumber);
  };
  return (
    <>
      <div className={cx("data")}>
        {currentPageData.length ? (
          renderWithOutMap ? (
            render(currentPageData)
          ) : (
            currentPageData.map(render)
          )
        ) : (
          <p>Không có dữ liệu</p>
        )}
      </div>
      <div className={cx("pagination")}>
        <div className={cx("pagination-controls")}>
          <button
            onClick={() => setCurrentPage(0)}
            className={cx("page-button", "arrow-button")}
            disabled={currentPage === 0}
          >
            <FontAwesomeIcon icon={faAnglesLeft} />
          </button>
          <button
            onClick={handlePreviousPage}
            className={cx("page-button", "arrow-button")}
            disabled={currentPage === 0}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={cx("page-button", {
                active: pageNumber === currentPage,
              })}
            >
              {pageNumber + 1}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            className={cx("page-button", "arrow-button")}
            disabled={currentPage === totalPages - 1}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages - 1)}
            className={cx("page-button", "arrow-button")}
            disabled={currentPage === totalPages - 1}
          >
            <FontAwesomeIcon icon={faAnglesRight} />
          </button>
          <div>
            <input
              type="number"
              className={cx("page-input")}
              min={1}
              max={totalPages}
              value={currentPage + 1} /* Show the correct page in the input */
              onChange={(e) => handlePageChange(e.target.value - 1)}
            />
            <em> trong {totalPages} trang</em>
          </div>
        </div>
      </div>
    </>
  );
}
