import classNames from "classnames/bind";
import styles from "./Friends.module.scss";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../../components/Pagination";
import { BACKEND_BASE_URL } from "../../constant";
import { useState } from "react";
import UserSearch from "../../components/UserSearch";
export default function Friends() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState(0); //0: bạn bè, 1: tìm bạn, 2: lời mời đã gửi, 3: lời mời đã nhận
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };
  const cx = classNames.bind(styles);
  return (
    <div className={cx("friends-container")}>
      <div className={cx("header")}>
        <div className={cx("left-buttons")}>
          <Button rounded outline onClick={() => setTab(0)}>
            Bạn bè
          </Button>
          <Button rounded outline onClick={() => setTab(1)}>
            Kết bạn
          </Button>
          <Button rounded outline onClick={() => setTab(2)}>
            Lời mời đã nhận
          </Button>
          <Button rounded outline onClick={() => setTab(3)}>
            Lời mời đã gửi
          </Button>
        </div>
        <div className={cx("right-buttons")}>
          <form onSubmit={handleSearchSubmit} className={cx("search-form")}>
            <Input
              type="search"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={handleSearchChange}
              actionIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
              onActionIconClick={handleSearchSubmit}
            />
          </form>
        </div>
      </div>
      {tab === 0 && (
        <div className={cx("your-friends")}>
          <h2>Bạn của bạn</h2>
          <div className={cx("friends-list")}>
            <Pagination
              searchQuery={`name=${searchQuery}`}
              render={(user) => (
                <UserSearch key={user.id} user={user}></UserSearch>
              )}
              url={`${BACKEND_BASE_URL}/api/friendship/search`}
              attachToken
            />
          </div>
        </div>
      )}
      {tab === 1 && (
        <div className={cx("your-friends")}>
          <h2>Tìm kiếm</h2>
          <div className={cx("friends-list")}>
            <Pagination
              searchQuery={`name=${searchQuery}`}
              render={(user) => (
                <UserSearch key={user.id} user={user}></UserSearch>
              )}
              url={`${BACKEND_BASE_URL}/api/users/search`}
              attachToken
            />
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className={cx("your-friends")}>
          <h2>Lời mời đã nhận</h2>
          <div className={cx("friends-list")}>
            <Pagination
              //searchQuery={`name=${searchQuery}`}
              render={(user) => (
                <UserSearch key={user.id} user={user}></UserSearch>
              )}
              url={`${BACKEND_BASE_URL}/api/friendship/invitationReceived`}
              attachToken
            />
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className={cx("your-friends")}>
          <h2>Lời mời đã nhận</h2>
          <div className={cx("friends-list")}>
            <Pagination
              //searchQuery={`name=${searchQuery}`}
              render={(user) => (
                <UserSearch key={user.id} user={user}></UserSearch>
              )}
              url={`${BACKEND_BASE_URL}/api/friendship/invitationSend`}
              attachToken
            />
          </div>
        </div>
      )}
    </div>
  );
}
