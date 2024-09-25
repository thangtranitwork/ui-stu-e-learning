import React, { useState, useEffect } from "react";
import Input from "."; // Đảm bảo bạn đã import đúng Input component

export default function DebouncedInput({
  initialValue,
  onChange,
  debounceTime = 1000,
  ...props
}) {
  const [value, setValue] = useState(initialValue);

  // Đồng bộ giá trị với initialValue khi nó thay đổi
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Sử dụng debounce để gọi onChange sau khoảng thời gian debounceTime
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(value);
    }, debounceTime);

    // Xóa timeout khi giá trị hoặc debounceTime thay đổi
    return () => {
      clearTimeout(handler);
    };
  }, [value, debounceTime, onChange]);

  // Cập nhật giá trị khi người dùng nhập
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <Input
      {...props}
      value={value} // Giá trị được truyền vào Input
      onChange={handleChange} // Gọi hàm handleChange khi người dùng thay đổi input
    />
  );
}
