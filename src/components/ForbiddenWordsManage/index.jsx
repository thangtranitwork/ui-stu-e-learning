import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "../../constant";
import Button from "../Button";
import Input from "../Input";
import Popup from "../Popup";
import Pagination from "../Pagination";
import Table from "../Table";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getToken } from "../../App";

export default function ForbiddenWordsManage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newWord, setNewWord] = useState("");

  const handleDeleteForbiddenWord = async (id) => {
    fetch(`${BACKEND_BASE_URL}/api/admin/forbiddenWords/delete?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          toast.success("Xóa từ khóa thành công");
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleAddWord = async (e) => {
    e.preventDefault();
    if (newWord === "") return;

    fetch(`${BACKEND_BASE_URL}/api/admin/forbiddenWords/new`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: newWord,
    })
      .then((response) => response.json())
      .then((data) => {
        setNewWord("");
        if (data.code === 200) {
          toast.success("Thêm từ khóa thành công");
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div>
      <Button
        style={{ float: "inline-end" }}
        noBackground
        scaleHoverAnimation
        onClick={() => setIsPopupOpen(true)}
      >
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <Popup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title={"Từ khóa mới"}
      >
        <form onSubmit={handleAddWord}>
          <Input
            placeholder={"Từ khóa"}
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
          />
          <Button primary type="submit">
            Thêm
          </Button>
        </form>
      </Popup>
      <Pagination
        attachToken
        url={`${BACKEND_BASE_URL}/api/admin/forbiddenWords/search`}
        render={(data) => (
          <Table
            items={data}
            labels={["ID", "Từ khóa"]}
            buttons={[<Button>Xóa</Button>]}
            onButtonsClick={[handleDeleteForbiddenWord]}
          />
        )}
        renderWithOutMap
      />
    </div>
  );
}
