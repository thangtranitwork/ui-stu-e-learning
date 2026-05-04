import { LOADING_GIF_URL } from "../../constant";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin"></div>
        <span className="text-sm text-slate-500">Đang tải...</span>
      </div>
    </div>
  );
}
