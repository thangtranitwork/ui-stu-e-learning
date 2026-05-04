import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import Table from "../Table";
import { getToken } from "../../App";

export default function Pagination({ url, render, searchQuery = "", attachToken = false, renderWithOutMap = false }) {
  const MAX_PAGE_BUTTONS = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedQuery(searchQuery); }, 1000);
    return () => { clearTimeout(handler); };
  }, [searchQuery]);

  useEffect(() => { setCurrentPage(0); }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { "Content-Type": "application/json" };
        if (attachToken) {
          const accessToken = getToken();
          if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
        }
        const response = await fetch(`${url}?${debouncedQuery}&page=${currentPage}`, { method: "GET", headers });
        const data = await response.json();
        setCurrentPageData(data.body.content);
        setTotalPages(data.body.totalPages || data.body.page.totalPages || 1);
      } catch (error) {
        console.error("Error fetching page data:", error);
      }
    };
    fetchData();
  }, [currentPage, url, debouncedQuery]);

  const getPageNumbers = () => {
    let startPage = Math.max(0, currentPage - Math.floor(MAX_PAGE_BUTTONS / 2));
    let endPage = Math.min(totalPages - 1, startPage + MAX_PAGE_BUTTONS - 1);
    if (endPage - startPage < MAX_PAGE_BUTTONS - 1) {
      startPage = Math.max(0, endPage - MAX_PAGE_BUTTONS + 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  };

  const handlePreviousPage = () => { if (currentPage > 0) setCurrentPage(currentPage - 1); };
  const handleNextPage = () => { if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1); };
  const handlePageChange = (pageNumber) => { pageNumber >= 0 && setCurrentPage(pageNumber); };

  const btnBase = "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer";
  const btnNormal = `${btnBase} bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed`;
  const btnActive = `${btnBase} bg-indigo-600 text-white border-0 shadow-lg shadow-indigo-500/30`;

  return (
    <>
      <div className="space-y-3">
        {currentPageData.length ? (
          renderWithOutMap ? render(currentPageData) : currentPageData.map(render)
        ) : (
          <p className="text-center text-slate-500 py-8">Không có dữ liệu</p>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
          <button onClick={() => setCurrentPage(0)} className={btnNormal} disabled={currentPage === 0}>
            <FontAwesomeIcon icon={faAnglesLeft} />
          </button>
          <button onClick={handlePreviousPage} className={btnNormal} disabled={currentPage === 0}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={pageNumber === currentPage ? btnActive : btnNormal}
            >
              {pageNumber + 1}
            </button>
          ))}
          <button onClick={handleNextPage} className={btnNormal} disabled={currentPage === totalPages - 1}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
          <button onClick={() => setCurrentPage(totalPages - 1)} className={btnNormal} disabled={currentPage === totalPages - 1}>
            <FontAwesomeIcon icon={faAnglesRight} />
          </button>
          <div className="flex items-center gap-2 ml-2 text-xs text-slate-500">
            <input
              type="number"
              className="w-14 h-9 text-center bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              min={1}
              max={totalPages || 0}
              value={currentPage + 1}
              onChange={(e) => handlePageChange(e.target.value - 1)}
            />
            <span>/ {totalPages || 0}</span>
          </div>
        </div>
      )}
    </>
  );
}
