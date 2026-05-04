import { useState, useEffect } from "react";
import Button from "../Button";
import Input from "../Input";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faFloppyDisk, faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function QuestionEditor({ initialQuestion, onSaveQuestion }) {
  const [question, setQuestion] = useState(initialQuestion);
  useEffect(() => { setQuestion(initialQuestion); }, [initialQuestion]);

  const addAnswer = () => {
    if (question.answers.length < 4) setQuestion({ ...question, answers: [...question.answers, { text: "", isCorrect: false }] });
  };

  const handleAnswerChange = (index, value) => {
    setQuestion({ ...question, answers: question.answers.map((a, i) => i === index ? { ...a, text: value } : a) });
  };

  const handleDeleteAnswer = (index) => {
    if (question.answers.length > 2) setQuestion({ ...question, answers: question.answers.filter((_, i) => i !== index) });
    else toast.error("Ít nhất 2 câu trả lời.");
  };

  const handleSaveQuestion = () => {
    if (!question.text.trim()) { toast.error("Câu hỏi trống."); return; }
    if (question.answers.some(a => !a.text.trim())) { toast.error("Câu trả lời trống."); return; }
    if (!question.answers.some(a => a.isCorrect)) { toast.error("Cần ít nhất 1 đáp án đúng."); return; }
    onSaveQuestion(question);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-white">Chỉnh sửa câu hỏi</h3>
      <Input type="text" placeholder="Câu hỏi" value={question.text} onChange={(e) => setQuestion({ ...question, text: e.target.value })} />
      <p className="text-xs text-slate-500">Câu đầu tiên là đáp án đúng</p>
      <div className="space-y-3">
        {question.answers.map((answer, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`flex-1 rounded-xl border ${index === 0 ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10"}`}>
              <Input type="text" placeholder={`Câu trả lời ${index + 1}`} value={answer.text} onChange={(e) => handleAnswerChange(index, e.target.value)} />
            </div>
            {index > 0 && <Button danger small onClick={() => handleDeleteAnswer(index)} leftIcon={<FontAwesomeIcon icon={faTrashCan} />}>Xóa</Button>}
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        {question.answers.length < 4 && <Button outline small onClick={addAnswer} rightIcon={<FontAwesomeIcon icon={faCirclePlus} />}>Thêm</Button>}
        <Button primary small onClick={handleSaveQuestion} rightIcon={<FontAwesomeIcon icon={faFloppyDisk} />}>Lưu</Button>
      </div>
    </div>
  );
}
