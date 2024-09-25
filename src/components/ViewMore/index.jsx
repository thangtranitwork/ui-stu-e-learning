import React, { memo, useCallback, useEffect, useState } from "react";
import Button from "../Button";
import { toast } from "react-toastify";

function ViewMore({ url, render }) {
  const [totalPages, setTotalPages] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [currentPageIndex, setCurrentPagesIndex] = useState(-1);

  const handleViewMore = useCallback(async () => {
    const response = await fetch(`${url}?page=${currentPageIndex + 1}`);
    const data = await response.json();

    if (data.code === 200) {
      // Sửa lỗi: Kết hợp dữ liệu cũ và mới đúng cách
      setCurrentData([...currentData, ...data.body.content]);
      setCurrentPagesIndex(currentPageIndex + 1);

      // Đảm bảo `totalPages` được cập nhật chỉ một lần, khi dữ liệu được tải lần đầu tiên
      if (currentPageIndex === -1) {
        setTotalPages(data.body.page.totalPages);
      }
    } else {
      toast.error(data.message);
    }
  }, [url, currentData, currentPageIndex, setCurrentData]);

  useEffect(() => {
    handleViewMore();
  }, []);

  return (
    <>
      {currentData.length ? currentData.map(render) : <p>Không có dữ liệu</p>}
      {currentPageIndex + 1 < totalPages && (
        <Button onClick={handleViewMore} primary>
          Xem thêm ...
        </Button>
      )}
    </>
  );
}

export default memo(ViewMore);
