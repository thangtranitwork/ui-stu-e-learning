import { memo, useState } from "react";
import Input from "../Input";
import RichTextEditor from "../RichTextEditor";
import Button from "../Button";
import Tag from "../Tag";
import { BACKEND_BASE_URL } from "../../constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { getToken } from "../../App";

function PostCreate({ onClose }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");

  const handlePost = async () => {
    if (!title.trim()) { toast.error("Tiêu đề trống!"); return; }
    if (!content.trim()) { toast.error("Nội dung trống!"); return; }
    const response = await fetch(`${BACKEND_BASE_URL}/api/posts/new`, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ title, content, tags: tags.map(t => t.name) }),
    });
    const data = await response.json();
    if (data.code === 200) { toast.success("Đăng bài thành công!"); onClose(); }
    else toast.error(data.message);
  };

  const handleAddTag = () => { if (!tag.trim()) { toast.error("Thẻ trống!"); return; } setTags([...tags, { name: tag }]); setTag(""); };
  const handleRemoveTag = (i) => setTags(tags.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <Input placeholder="Tiêu đề bài viết" value={title} onChange={(e) => setTitle(e.target.value)} />
      <RichTextEditor label="Nội dung" value={content} inpopup onChange={setContent} />

      {/* Tag input */}
      <form onSubmit={(e) => { e.preventDefault(); handleAddTag(); }} className="flex gap-2 items-end">
        <div className="flex-1">
          <Input placeholder="Thêm thẻ" value={tag} onChange={(e) => setTag(e.target.value)} small />
        </div>
        <Button outline small type="submit" leftIcon={<FontAwesomeIcon icon={faPlus} />}>Thêm</Button>
      </form>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((t, i) => <Tag key={i} createMode tag={t} onRemove={() => handleRemoveTag(i)} />)}
        </div>
      )}

      <Button primary large onClick={handlePost} className="w-full" rightIcon={<FontAwesomeIcon icon={faPaperPlane} />}>
        Đăng bài
      </Button>
    </div>
  );
}

export default memo(PostCreate);
