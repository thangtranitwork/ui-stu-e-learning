import { useState, useEffect } from "react";
import styles from "./QuestionEditor.module.scss";
import classNames from "classnames/bind";
import Button from "../Button";
import Input from "../Input";
import { toast } from "react-toastify"; // Thêm toast để thông báo lỗi
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faFloppyDisk, faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function QuestionEditor({ initialQuestion, onSaveQuestion }) {
  const cx = classNames.bind(styles);
  const [question, setQuestion] = useState(initialQuestion);

  // Cập nhật lại câu hỏi nếu prop initialQuestion thay đổi
  useEffect(() => {
    setQuestion(initialQuestion);
  }, [initialQuestion]);

  // Thêm câu trả lời mới (tối đa 4)
  const addAnswer = () => {
    if (question.answers.length < 4) {
      setQuestion({
        ...question,
        answers: [...question.answers, { text: "", isCorrect: false }],
      });
    }
  };

  // Cập nhật câu trả lời
  const handleAnswerChange = (index, value) => {
    const updatedAnswers = question.answers.map((answer, idx) =>
      idx === index ? { ...answer, text: value } : answer
    );
    setQuestion({ ...question, answers: updatedAnswers });
  };

  // Cập nhật câu hỏi
  const handleQuestionChange = (e) => {
    setQuestion({ ...question, text: e.target.value });
  };

  // Xử lý xóa câu trả lời
  const handleDeleteAnswer = (index) => {
    if (question.answers.length > 2) {
      const updatedAnswers = question.answers.filter((_, idx) => idx !== index);
      setQuestion({ ...question, answers: updatedAnswers });
    } else {
      toast.error("Câu hỏi phải có ít nhất 2 câu trả lời.");
    }
  };

  // Xử lý lưu câu hỏi sau khi chỉnh sửa
  const handleSaveQuestion = () => {
    if (!question.text.trim()) {
      toast.error("Câu hỏi không được để trống.");
      return;
    }

    const emptyAnswers = question.answers.filter(
      (answer) => !answer.text.trim()
    );

    if (emptyAnswers.length > 0) {
      toast.error("Câu trả lời không được để trống.");
      return;
    }

    if (!question.answers.some((answer) => answer.isCorrect)) {
      toast.error("Vui lòng có ít nhất một câu trả lời đúng.");
      return;
    }

    onSaveQuestion(question); // Trả lại câu hỏi đã chỉnh sửa cho component cha
  };

  return (
    <div className={cx("question-editor")}>
      <h3>Chỉnh sửa câu hỏi</h3>
      <Input
        type="text"
        placeholder="Câu hỏi"
        value={question.text}
        onChange={handleQuestionChange}
      />
      <h4>Câu trả lời (Câu đầu tiên là câu đúng)</h4>
      {question.answers.map((answer, index) => (
        <div key={index} className={cx("answer-row")}>
          <Input
            type="text"
            placeholder={`Câu trả lời ${index + 1}`}
            value={answer.text}
            otherClass={cx(index === 0 ? "correct-answer" : "incorrect-answer")}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
          />
          {index > 0 && (
            <Button
              className={cx("delete-button")}
              onClick={() => handleDeleteAnswer(index)}
              leftIcon={<FontAwesomeIcon icon={faTrashCan}/>}
            >
              Xóa
            </Button>
          )}
        </div>
      ))}

      {question.answers.length < 4 && (
        <Button className={cx("button")} outline onClick={addAnswer} rightIcon={<FontAwesomeIcon icon={faCirclePlus}/>}>
          Thêm câu trả lời
        </Button>
      )}

      <Button className={cx("button")} outline onClick={handleSaveQuestion} rightIcon={<FontAwesomeIcon icon={faFloppyDisk}/>}>
        Lưu câu hỏi
      </Button>
    </div>
  );
}
