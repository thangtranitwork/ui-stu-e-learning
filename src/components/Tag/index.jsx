import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function Tag({ tag, createMode = false, onRemove }) {
  const navigate = useNavigate();
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-medium rounded-full border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors cursor-pointer">
      {createMode ? (
        <>
          {tag.name}
          <FontAwesomeIcon icon={faXmark} className="text-[10px] hover:text-red-400 transition-colors" onClick={onRemove} />
        </>
      ) : (
        <span onClick={() => navigate(`/posts/tag/${tag.name}`)}>{tag.name}</span>
      )}
    </span>
  );
}
export default memo(Tag);
