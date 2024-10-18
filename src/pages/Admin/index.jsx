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
  const [tab, setTab] = useState(0);
  const cx = classNames.bind(styles);

  return (
    <div className={cx("wrapper")}>
      <Button primary={tab === 0} onClick={() => setTab(0)}>
        Người dùng
      </Button>
      <Button primary={tab === 1} onClick={() => setTab(1)}>
        Từ khóa bị cấm
      </Button>
      <div className={cx("content")}>
        {tab === 1 ? (
          <ForbiddenWordsManage />
        ) : (
          <Pagination
            url={`${BACKEND_BASE_URL}/api/admin/users`}
            attachToken
            render={(u) => <UserAdminView key={u.id} user={u} />}
          />
        )}
      </div>
    </div>
  );
}
