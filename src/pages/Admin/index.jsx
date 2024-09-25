import { useCallback, useState } from "react";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import { BACKEND_BASE_URL } from "../../constant";
import classNames from "classnames/bind";
import styles from "./Admin.module.scss";
import Course from "../../components/Course";
import QuizInfo from "../../components/QuizInfo";
import UserAdminView from "../../components/UserAdminView";
import { toast } from "react-toastify";
import ForbiddenWordsManage from "../../components/ForbiddenWordsManage";
export default function Admin() {
  const [tab, setTab] = useState(3);
  const cx = classNames.bind(styles);
  const urls = [
    `${BACKEND_BASE_URL}/api/admin/users`,
    `${BACKEND_BASE_URL}/api/admin/courses`,
    `${BACKEND_BASE_URL}/api/admin/quizzes`,
    ,
  ];
  const renders = [
    (u) => <UserAdminView key={u.id} user={u} />,
    (c) => <Course key={c.id} course={c} />,
    (q) => <QuizInfo key={q.id} quiz={q} />,
  ];


  

  return (
    <div className={cx("wrapper")}>
      <Button primary={tab === 0} onClick={() => setTab(0)}>
        Người dùng
      </Button>
      <Button primary={tab === 1} onClick={() => setTab(1)}>
        Khóa học
      </Button>
      <Button primary={tab === 2} onClick={() => setTab(2)}>
        Trắc nghiệm
      </Button>
      <Button primary={tab === 3} onClick={() => setTab(3)}>
        Từ khóa bị cấm
      </Button>
      <div className={cx("content")}>
        {tab === 3 ? (
          <ForbiddenWordsManage/>
        ) : (
          <Pagination url={urls[tab]} attachToken render={renders[tab]} />
        )}
      </div>
    </div>
  );
}
