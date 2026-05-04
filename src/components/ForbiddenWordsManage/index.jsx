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
    const response = await fetch(`${BACKEND_BASE_URL}/api/admin/forbiddenWords/delete?id=${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await response.json();
    if (data.code === 200) toast.success("Xóa thành công");
    else toast.error(data.message);
  };

  const handleAddWord = async (e) => {
    e.preventDefault();
    if (newWord === "") return;
    const response = await fetch(`${BACKEND_BASE_URL}/api/admin/forbiddenWords/new`, {
      method: "POST", headers: { Authorization: `Bearer ${getToken()}` }, body: newWord,
    });
    const data = await response.json();
    setNewWord("");
    if (data.code === 200) toast.success("Thêm thành công");
    else toast.error(data.message);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button outline small onClick={() => setIsPopupOpen(true)} leftIcon={<FontAwesomeIcon icon={faPlus} />}>Thêm</Button>
      </div>
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} title="Từ khóa mới">
        <form onSubmit={handleAddWord} className="space-y-4">
          <Input placeholder="Từ khóa" value={newWord} onChange={(e) => setNewWord(e.target.value)} />
          <Button primary type="submit">Thêm</Button>
        </form>
      </Popup>
      <Pagination attachToken url={`${BACKEND_BASE_URL}/api/admin/forbiddenWords/search`}
        render={(data) => (
          <Table items={data} labels={["ID", "Từ khóa"]} buttons={[<Button danger small>Xóa</Button>]} onButtonsClick={[handleDeleteForbiddenWord]} />
        )} renderWithOutMap />
    </div>
  );
}
