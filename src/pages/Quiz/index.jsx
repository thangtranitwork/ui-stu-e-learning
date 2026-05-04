import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Question from "../../components/Question";
import Timer from "../../components/Timer";
import { BACKEND_BASE_URL } from "../../constant";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Popup from "../../components/Popup";
import { getToken } from "../../App";

const Quiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quizName, setQuizName] = useState("");
  const [score, setScore] = useState();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [quizResults, setQuizResults] = useState(null);
  const [duration, setDuration] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => { document.title = `Quiz ${quizName}`; }, [quizName]);

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await fetch(`${BACKEND_BASE_URL}/api/quizzes/${quizId}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      });
      const data = await response.json();
      if (data.code === 200) {
        const { questions, remainingTime, duration, name } = data.body;
        setQuestions(questions); setRemainingTime(remainingTime); setDuration(duration); setQuizName(name);
      } else toast.error(data.message);
    };
    fetchQuiz();
  }, [quizId]);

  const handleAnswerSelect = (answerId) => {
    if (isQuizSubmitted) return;
    setQuestions(prev => {
      const updated = prev.map((q, i) => i === currentQuestionIndex ? { ...q, selectedAnswer: answerId } : q);
      if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
      else setTimeout(() => submitQuiz(updated), 0);
      return updated;
    });
  };

  const submitQuiz = async (updatedQuestions) => {
    const response = await fetch(`${BACKEND_BASE_URL}/api/quizzes/${quizId}`, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ answers: (updatedQuestions || questions).map(q => ({ questionId: q.id, answerId: q.selectedAnswer })) }),
    });
    const data = await response.json();
    if (data.code === 200) { setScore(data.body.score); setIsQuizSubmitted(true); setIsPopupOpen(true); setQuizResults(data.body.questionResultResponses); }
    else toast.error(data.message);
  };

  const startQuiz = () => {
    let c = 3;
    const interval = setInterval(() => { setCountdown(p => p - 1); c--; if (c === 0) { clearInterval(interval); setIsQuizStarted(true); } }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 py-6 md:py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-6 bg-transparent border-none cursor-pointer">
          <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
        </button>

        <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl animate-[slideUp_0.35s_ease]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{quizName}</h2>
              <p className="text-sm text-slate-500">{duration} phút · {questions.length} câu</p>
            </div>
            {score >= 0 && (
              <span className={`text-lg font-bold px-4 py-2 rounded-xl ${score > questions.length / 2 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                {score}/{questions.length}
              </span>
            )}
          </div>

          {!isQuizStarted ? (
            <div className="flex flex-col items-center justify-center py-16 gap-6">
              {countdown === 3 && (
                <Button primary large onClick={startQuiz} rightIcon={<FontAwesomeIcon icon={faPlay} />}>Bắt đầu Quiz</Button>
              )}
              {countdown < 3 && countdown > 0 && (
                <div className="text-7xl font-extrabold text-indigo-500 animate-pulse">{countdown}</div>
              )}
            </div>
          ) : (
            <>
              {!isQuizSubmitted ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <Timer remainingTime={remainingTime} duration={duration} onTimeout={submitQuiz} />
                    <div className="flex items-center gap-2">
                      {/* Progress dots */}
                      <div className="hidden sm:flex gap-1">
                        {questions.map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentQuestionIndex ? "bg-indigo-500 scale-125" : i < currentQuestionIndex ? "bg-indigo-500/40" : "bg-white/10"}`}></div>
                        ))}
                      </div>
                      <span className="text-sm text-slate-400 font-semibold bg-white/5 px-4 py-2 rounded-full ml-2">
                        {currentQuestionIndex + 1}/{questions.length}
                      </span>
                    </div>
                  </div>
                  {questions.length > 0 && <Question question={questions[currentQuestionIndex]} onAnswerSelect={handleAnswerSelect} quizResults={quizResults} isQuizSubmitted={isQuizSubmitted} />}
                </div>
              ) : (
                <div className="space-y-4">
                  <Popup isOpen={isPopupOpen} title={quizName} onClose={() => setIsPopupOpen(false)}>
                    <div className="text-center py-4">
                      <p className="text-4xl font-extrabold text-white mb-2">{score}/{questions.length}</p>
                      <p className="text-slate-400 mb-6">{score > questions.length / 2 ? "Tuyệt vời! 🎉" : "Cố gắng hơn nhé! 💪"}</p>
                      <div className="flex gap-3 justify-center">
                        <Button secondary to="/quizzes">Trắc nghiệm khác</Button>
                        <Button primary onClick={() => window.location.reload(false)}>Chơi lại</Button>
                      </div>
                    </div>
                  </Popup>
                  {/* Scrollable results */}
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto overscroll-contain pr-1">
                    {questions.map((q) => <Question key={q.id} onAnswerSelect={handleAnswerSelect} question={q} quizResults={quizResults} isQuizSubmitted={isQuizSubmitted} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
