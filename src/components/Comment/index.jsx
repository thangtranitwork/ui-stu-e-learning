import UserInfo from "../UserInfo";
import TimeDisplay from "../TimeDisplay";

export default function Comment({ comment }) {
  return (
    <div className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
      <div className="flex-shrink-0">
        <UserInfo user={comment.creator} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-300 mb-1">{comment.content}</p>
        <TimeDisplay className="text-xs text-slate-600" time={comment.createdAt} />
      </div>
    </div>
  );
}
