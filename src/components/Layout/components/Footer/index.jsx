import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-[#060609] mt-16">
      <div className="container mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">STU</div>
            <span className="font-bold text-white text-lg">E-Learning</span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">Dự án của Trần Đoàn Xuân Thắng. ReactJS, Spring Boot, MySQL.</p>
          <div className="flex items-center gap-3 mt-4">
            <a href="https://www.facebook.com/thangtran0111" className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="mailto:thangtran.it.work@gmail.com" className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
            <a href="https://github.com/thangtranitwork" className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </div>
        </div>
        {[
          { title: "Chăm sóc KH", links: ["Hướng dẫn thanh toán", "Điều kiện giao dịch", "Chính sách bảo hành", "Chính sách bảo mật"] },
          { title: "Tính năng", links: ["Học tập", "Luyện tập", "Thảo luận", "Kết bạn", "Trò chuyện"] },
          { title: "Thông tin", links: ["Về chúng tôi", "Điều khoản sử dụng"] },
          { title: "Trợ giúp", links: ["Trợ giúp", "Liên hệ"] },
        ].map((col, i) => (
          <div key={i}>
            <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
            <div className="flex flex-col gap-2">
              {col.links.map((link, j) => (
                <a key={j} href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{link}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-slate-600">
        © 2024 STU E-Learning. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
