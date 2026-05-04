import { Link } from "react-router-dom";
import UserInfo from "../UserInfo";
import TimeDisplay from "../TimeDisplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import Tag from "../Tag";

export default function PostSearch({ post, hot }) {
  return (
    <Link to={`/posts/${post.id}`} className="no-underline">
      <div className={`rounded-2xl border p-5 transition-all duration-300 group cursor-pointer
        ${hot 
          ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 hover:border-blue-500/40 shadow-lg shadow-blue-500/5" 
          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08]"}`}>
        <h4 className="text-base font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors line-clamp-1">
          {post.title}
        </h4>
        <div className="mb-2"><UserInfo user={post.creator} /></div>
        <TimeDisplay time={post.createdAt} className="text-xs text-slate-500" />
        <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faHeart} className="text-red-400 text-xs" />
            {post.likeCount}
          </span>
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faEye} className="text-slate-500 text-xs" />
            {post.viewCount}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {post.tags.map(t => <Tag key={t.id} tag={t} />)}
        </div>
      </div>
    </Link>
  );
}
