import { useState } from "react";
import QuestionEditor from "../../components/QuestionEditor";
import { BACKEND_BASE_URL } from "../../constant";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import UploadFile from "../../components/UploadFile";
import Popup from "../../components/Popup";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faPenToSquare, faQuestionCircle, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getToken } from "../../App";
import { useNavigate } from "react-router-dom";

export default function QuizCreate() {
  const [quiz, setQuiz] = useState({ name: "", description: "", duration: 10, questions: [] });
  const [file, setFile] = useState();
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [helpPopupOpen, setHelpPopupOpen] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
    setQuiz(prev => ({ ...prev, questions: [] }));
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(new Uint8Array(e.target.result), { type: "array" });
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
      setQuiz(prev => ({ ...prev, questions: jsonData.map(row => ({ text: row[0], answers: [{ text: row[1], isCorrect: true }, { text: row[2], isCorrect: false }] })) }));
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  const addOrUpdateQuestion = (question) => {
    if (editingQuestion !== null) {
      setQuiz({ ...quiz, questions: quiz.questions.map((q, i) => i === editingQuestion ? question : q) });
      setEditingQuestion(null);
    } else { setQuiz({ ...quiz, questions: [...quiz.questions, question] }); }
  };

  const handleSaveQuiz = async () => {
    const response = await fetch(`${BACKEND_BASE_URL}/api/quizzes/new`, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(quiz),
    });
    const data = await response.json();
    if (data.code === 200) toast.success("Tạo trắc nghiệm thành công!");
    else toast.error(data.message);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 py-6 md:py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-6 bg-transparent border-none cursor-pointer">
          <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
        </button>

        <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6 animate-[slideUp_0.35s_ease]">
          <h2 className="text-2xl font-bold text-white">Tạo Quiz</h2>

          {/* Quiz info */}
          <div className="space-y-4">
            <Input type="text" placeholder="Tên Quiz" value={quiz.name} onChange={(e) => setQuiz({ ...quiz, name: e.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input placeholder="Mô tả Quiz" value={quiz.description} onChange={(e) => setQuiz({ ...quiz, description: e.target.value })} />
              <Input type="number" placeholder="Thời lượng (phút)" value={quiz.duration} onChange={(e) => setQuiz({ ...quiz, duration: parseInt(e.target.value, 10) })} />
            </div>
          </div>

          {/* Questions header */}
          <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-white/10">
            <h3 className="text-lg font-bold text-white">Câu hỏi ({quiz.questions.length})</h3>
            <UploadFile setFile={handleFileUpload} accept=".xls, .xlsx" />
            <button onClick={() => setHelpPopupOpen(true)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer bg-transparent border-none">
              <FontAwesomeIcon icon={faQuestionCircle} />
            </button>
          </div>

          <Popup isOpen={helpPopupOpen} title="Hướng dẫn" onClose={() => setHelpPopupOpen(false)}>
            <p className="text-sm text-slate-400 mb-3"><em>Không bao gồm dòng tiêu đề</em></p>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <thead><tr className="bg-white/5"><th className="px-3 py-2 text-left text-slate-400">Câu hỏi</th><th className="px-3 py-2 text-left text-emerald-400">Đúng</th><th className="px-3 py-2 text-left text-red-400">Sai</th><th className="px-3 py-2 text-left text-slate-500">Sai (opt)</th><th className="px-3 py-2 text-left text-slate-500">Sai (opt)</th></tr></thead>
                <tbody className="text-slate-300"><tr><td className="px-3 py-2">1+1=?</td><td className="px-3 py-2">2</td><td className="px-3 py-2">3</td><td className="px-3 py-2"></td><td className="px-3 py-2"></td></tr></tbody>
              </table>
            </div>
          </Popup>

          {/* Questions list — scrollable */}
          {quiz.questions.length > 0 && (
            <div className="space-y-3 max-h-[380px] overflow-y-auto overscroll-contain pr-1">
              {quiz.questions.map((question, index) => (
                <div key={index} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 space-y-2 hover:border-white/10 transition-colors">
                  <p className="text-sm text-white"><span className="text-indigo-400 font-bold mr-2">#{index + 1}</span>{question.text}</p>
                  <div className="flex flex-wrap gap-2">
                    {question.answers.map((answer, idx) => (
                      <span key={idx} className={`px-2.5 py-1 rounded-lg text-xs ${answer.isCorrect ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                        {answer.text}
                      </span>
                    ))}
                  </div>
                  <Button outline small onClick={() => setEditingQuestion(index)} rightIcon={<FontAwesomeIcon icon={faPenToSquare} />}>Sửa</Button>
                </div>
              ))}
            </div>
          )}

          {/* Editor */}
          <QuestionEditor
            initialQuestion={editingQuestion !== null ? quiz.questions[editingQuestion] : { text: "", answers: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }] }}
            onSaveQuestion={addOrUpdateQuestion}
          />

          <Button primary large onClick={handleSaveQuiz} rightIcon={<FontAwesomeIcon icon={faFloppyDisk} />} className="w-full">
            Lưu Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
