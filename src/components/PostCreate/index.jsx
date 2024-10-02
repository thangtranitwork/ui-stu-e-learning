import { memo, useState } from "react";
import Input from "../Input";
import RichTextEditor from "../RichTextEditor";
import classNames from "classnames/bind";
import styles from "./PostCreate.module.scss";
import Button from "../Button";
import Tag from "../Tag";
import { BACKEND_BASE_URL } from "../../constant";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { getToken } from "../../App";

function PostCreate({ onClose }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]); //{name: } []
  const [tag, setTag] = useState("");
  const cx = classNames.bind(styles);

  const handlePost = async () => {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/posts/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          title,
          content,
          tags: tags.map((tag) => tag.name), // chuyển mảng tags thành mảng các name
        }),
      });
      const data = await response.json();
      if (data.code === 200) {
        toast.success("Đăng bài thành công!");
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching hottest posts:", error);
    }
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleAddTag = () => {
    if (tag === "") {
      toast.error("Thẻ không được để trống!");
      return;
    }
    setTags([...tags, { name: tag }]);
    setTag("");
  };

  const handleRemoveTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index); // Lọc bỏ thẻ theo chỉ số
    setTags(newTags);
  };

  return (
    <div className={cx("wrapper")}>
      <Input
        otherClass={cx("input")}
        placeholder={"Tiêu đề"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <RichTextEditor
        label={"Nội dung"}
        value={content}
        inpopup
        onChange={handleContentChange}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddTag();
        }}
      >
        <Input
          otherClass={cx("input")}
          placeholder={"Thẻ"}
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          actionIcon={
            <Button
              noBackground
              scaleHoverAnimation
              type="submit"
              rightIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            >
              Thêm
            </Button>
          }
        />
      </form>
      <div className={cx("tags-container")}>
        {tags.map((tag, index) => (
          <Tag
            key={index}
            className={cx("tag-item")}
            createMode
            tag={tag}
            onRemove={() => handleRemoveTag(index)}
          ></Tag>
        ))}
      </div>

      <Button primary onClick={handlePost} className={cx("submit-btn")}>
        Đăng bài
      </Button>
    </div>
  );
}

export default memo(PostCreate);
