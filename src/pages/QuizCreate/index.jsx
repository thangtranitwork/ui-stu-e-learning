import { useState } from "react";
import QuestionEditor from "../../components/QuestionEditor";
import styles from "./QuizCreate.module.scss";
import classNames from "classnames/bind";
import { BACKEND_BASE_URL } from "../../constant";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import UploadFile from "../../components/UploadFile";
import Popup from "../../components/Popup";
import * as XLSX from "xlsx"; // Thêm thư viện XLSX
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faPenToSquare,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function QuizCreate() {
  const cx = classNames.bind(styles);
  const [quiz, setQuiz] = useState({
    name: "",
    description: "",
    duration: 10,
    questions: [],
  });

  const [file, setFile] = useState();
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [helpPopupOpen, setHelpPopupOpen] = useState(false);

  // Hàm xử lý khi người dùng tải lên tệp Excel
  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
    setQuiz((prevQuiz) => ({ ...prevQuiz, questions: [] })); // Xóa các câu hỏi cũ

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Giả định rằng dữ liệu ở sheet đầu tiên
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const newQuestions = jsonData.map((row) => ({
        text: row[0], // Câu hỏi ở cột đầu tiên
        answers: [
          { text: row[1], isCorrect: true }, // Giả định cột thứ 2 là câu trả lời đúng
          { text: row[2], isCorrect: false }, // Cột thứ 3 là câu sai
        ],
      }));

      // Cập nhật quiz với các câu hỏi mới từ file
      setQuiz((prevQuiz) => ({
        ...prevQuiz,
        questions: newQuestions,
      }));
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  // Thêm hoặc cập nhật câu hỏi
  const addOrUpdateQuestion = (question) => {
    if (editingQuestion !== null) {
      setQuiz({
        ...quiz,
        questions: quiz.questions.map((q, idx) =>
          idx === editingQuestion ? question : q
        ),
      });
      setEditingQuestion(null);
    } else {
      setQuiz({
        ...quiz,
        questions: [...quiz.questions, question],
      });
    }
  };

  // Chỉnh sửa câu hỏi
  const handleEditQuestion = (index) => {
    setEditingQuestion(index);
  };

  // Xử lý khi nhấn nút lưu để gửi lên API
  const handleSaveQuiz = async () => {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/quizzes/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(quiz),
      });
      const data = await response.json();
      if (data.code === 200) {
        toast.success("Tạo trắc nghiệm thành công!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tạo quiz.");
    }
  };

  return (
    <div className={cx("wrapper")}>
      <h2>Tạo Quiz</h2>
      <Input
        type="text"
        placeholder="Tên Quiz"
        value={quiz.name}
        onChange={(e) => setQuiz({ ...quiz, name: e.target.value })}
      />
      <Input
        placeholder="Mô tả Quiz"
        value={quiz.description}
        onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Thời lượng (phút)"
        value={quiz.duration}
        onChange={(e) =>
          setQuiz({ ...quiz, duration: parseInt(e.target.value, 10) })
        }
      />

      <h3>
        Danh sách câu hỏi{" "}
        <UploadFile setFile={handleFileUpload} accept={".xls, .xlsx"} />
        <Button
          noBackground
          noHoverAnimation
          onClick={() => {
            setHelpPopupOpen(true);
          }}
        >
          <FontAwesomeIcon icon={faQuestionCircle} />
        </Button>
        <Popup
          isOpen={helpPopupOpen}
          title="Hướng dẫn"
          onClose={() => setHelpPopupOpen(false)}
        >
          <em>Không bao gồm dòng tiêu đề</em>
          <table border={1}>
            <tr>
              <th>Câu hỏi</th>
              <th>Câu trả lời đúng</th>
              <th>Câu trả lời sai</th>
              <th>Câu trả lời sai (tùy chọn)</th>
              <th>Câu trả lời sai (tùy chọn)</th>
            </tr>
            <tr>
              <td>1 + 1 = ?</td>
              <td>2</td>
              <td>3</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>85326 - 3776 / 2 + 2323 = ?</td>
              <td>82791</td>
              <td>82792</td>
              <td>82729</td>
              <td>82922</td>
            </tr>
          </table>
        </Popup>
      </h3>
      <div className={cx("questions-list")}>
        {quiz.questions.map((question, index) => (
          <div key={index} className={cx("question-card")}>
            <div className={cx("question-text")}>
              <strong>Câu hỏi: </strong>
              {question.text}
            </div>
            <div className={cx("answers-list")}>
              {question.answers.map((answer, idx) => (
                <p
                  key={idx}
                  className={cx(
                    answer.isCorrect ? "correct-answer" : "incorrect-answer"
                  )}
                >
                  {answer.text}
                </p>
              ))}
            </div>
            <Button
              onClick={() => handleEditQuestion(index)}
              rightIcon={<FontAwesomeIcon icon={faPenToSquare} />}
            >
              Chỉnh sửa
            </Button>
          </div>
        ))}
      </div>
      <QuestionEditor
        initialQuestion={
          editingQuestion !== null
            ? quiz.questions[editingQuestion]
            : {
                text: "",
                answers: [
                  { text: "", isCorrect: true },
                  { text: "", isCorrect: false },
                ],
              }
        }
        onSaveQuestion={addOrUpdateQuestion}
      />

      <Button primary onClick={handleSaveQuiz} className={cx("save-btn")}>
        Lưu Quiz <FontAwesomeIcon icon={faFloppyDisk} />
      </Button>
    </div>
  );
}
