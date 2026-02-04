import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Headphones,
  Volume2,
  RotateCcw,
  Play,
  Pause,
  X,
  History, // This icon is for showing history
  Share2,
  Trash2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Languages,
  Eye,
  RefreshCw,
  BarChart2,
  Info,
  Users,
  User
} from "lucide-react";
import { submitHIWAttempt } from "../../services/api";
import axios from "axios";
export const getHIWCommunityAttempts = (questionId) =>
  axios.get(
    `/api/hiw/${questionId}/community`
  );

const AttemptHistoryHIW = ({ questionId, currentAttemptId, onSelectAttempt }) => {
  const [activeTab, setActiveTab] = useState("my"); // my | community
  const [myAttempts, setMyAttempts] = useState([]);
  const [communityAttemptsRaw, setCommunityAttemptsRaw] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= MY ATTEMPTS ================= */
  useEffect(() => {
    if (!questionId || activeTab !== "my") return;

    const fetchMyAttempts = async () => {
      setLoading(true);
      try {
        const res = questionId?.lastAttempts;

        if (res?.success) {
          // Sort by latest first
          const sortedAttempts = (res.data || []).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setMyAttempts(sortedAttempts);
        }
      } catch (err) {
        console.error("Failed to fetch my HIW attempts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAttempts();
  }, [questionId, currentAttemptId, activeTab]);

  /* ================= COMMUNITY ATTEMPTS ================= */
  useEffect(() => {
    if (!questionId || activeTab !== "community" || communityAttemptsRaw.length)
      return;

    const fetchCommunityAttempts = async () => {
      setLoading(true);
      try {
        const res = await getHIWCommunityAttempts(questionId._id); // API call for community HIW attempts

        if (res?.data.success) {
          setCommunityAttemptsRaw(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch community HIW attempts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityAttempts();
  }, [questionId, activeTab, communityAttemptsRaw.length]);

  /* ================= FLATTEN & SORT COMMUNITY ATTEMPTS ================= */
  const flattenedCommunityAttempts = useMemo(() => {
    const flattened = communityAttemptsRaw.flatMap((user) =>
      user.attempts.map((attempt) => ({
        ...attempt,
        communityUserId: user.userId,
      }))
    );
    // Sort by latest first
    return flattened.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [communityAttemptsRaw]);

  const list = activeTab === "my" ? myAttempts : flattenedCommunityAttempts;

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">Loading history...</div>
    );
  }

  return (
    <div className="mt-12 font-sans">
     
      {/* ================= HEADER + TABS ================= */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="text-purple-600" size={20} />
          <h3 className="font-bold text-slate-800">
            {activeTab === "my" ? "Your Attempts" : "Community Attempts"}
          </h3>
        </div>

        <div className="flex bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("my")}
            className={`px-4 py-1.5 text-sm font-bold rounded-lg transition ${
              activeTab === "my"
                ? "bg-white shadow text-purple-600"
                : "text-slate-500"
            }`}
          >
            My
          </button>
          <button
            onClick={() => setActiveTab("community")}
            className={`px-4 py-1.5 text-sm font-bold rounded-lg transition ${
              activeTab === "community"
                ? "bg-white shadow text-purple-600"
                : "text-slate-500"
            }`}
          >
            Community
          </button>
        </div>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {list.length === 0 && (
        <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border">
            <Info size={20} className="text-slate-300" />
          </div>
          <p className="text-sm font-medium">
            {activeTab === "my"
              ? "No attempts yet"
              : "No community attempts yet"}
          </p>
          <p className="text-xs mt-1 opacity-70">
            Complete the exercise to see your history
          </p>
        </div>
      )}

      {/* ================= LIST ================= */}
      <div className="space-y-4">
        {list.map((attempt) => (
          <div
            key={attempt._id}
            onClick={() => onSelectAttempt?.(attempt)}
            className={`bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center gap-6 transition cursor-pointer ${
              activeTab === "my" ? "hover:shadow-md group" : ""
            }`}
          >
            {/* 👤 COMMUNITY USER (only for community tab) */}
            {activeTab === "community" && attempt.communityUserId && (
              <div className="min-w-[160px]">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  User
                </span>
                <div className="text-sm font-semibold text-slate-700 truncate">
                  {attempt.communityUserId.slice(-6)} {/* Display last 6 chars */}
                </div>
              </div>
            )}

            {/* 📅 DATE */}
            <div className="min-w-[150px]">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Date
              </span>
              <div className="text-sm font-semibold text-slate-700">
                {new Date(attempt.createdAt).toLocaleString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {/* 📊 SCORE */}
            <div className="flex-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Score
              </span>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-xl font-bold ${
                    attempt.score === attempt.maxScore
                      ? "text-green-600"
                      : attempt.score > attempt.maxScore / 2
                      ? "text-blue-600" // Mid-range score
                      : "text-red-500"
                  }`}
                >
                  {attempt.score}
                </span>
                <span className="text-sm text-slate-400 font-medium">
                  / {attempt.missedCount + attempt.score}
                </span>
              </div>
            </div>

            {/* ✅ STATUS */}
            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  attempt.score === attempt.maxScore
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600" // For completed but not perfect
                }`}
              >
                {attempt.score === attempt.maxScore ? "Perfect" : "Completed"}
              </span>
            </div>

            {/* ACTION */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-600 font-bold text-sm">
              View Result →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};




export default function HighlightIncorrectWords({ question, setActiveSpeechQuestion, nextButton, previousButton }) {

  const [status, setStatus] = useState("countdown");
  const [prepTimer, setPrepTimer] = useState(3);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFinished, setAudioFinished] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState(null);
  const [showAttemptHistory, setShowAttemptHistory] = useState(false); // State for showing history

  const audioRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const words = useMemo(() => {
    if (!question?.content) return [];
    return question.content.replace(/\s+/g, " ").trim().split(" ");
  }, [question?.content]);

  /* ================= COUNTDOWN ================= */
  useEffect(() => {
    let timer;
    if (status === "countdown" && prepTimer > 0) {
      timer = setInterval(() => setPrepTimer((t) => t - 1), 1000);
    }
    if (status === "countdown" && prepTimer === 0) {
      setStatus("playing");
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => { });
        setIsPlaying(true);
      }
    }
    return () => clearInterval(timer);
  }, [status, prepTimer]);

  /* ================= AUDIO CONTROLS ================= */
  const toggleAudio = () => {
    if (!audioRef.current || audioFinished) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => { });
    }
  };

  const handleSkipAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = audioRef.current.duration;
    setIsPlaying(false);
    setAudioFinished(true);
    setCurrentTime(duration);
  };

  const resetSession = () => {
    setPrepTimer(3);
    setStatus("countdown");
    setSelectedIndices([]);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setAudioFinished(false);
    setShowModal(false);
    setResult(null);
    setShowAttemptHistory(false); // Hide history when resetting

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setAudioFinished(true);
    setCurrentTime(duration);
  };

  /* ================= WORD CLICK ================= */
  const handleWordClick = (index) => {
    if (status !== "playing") return;
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    setAudioFinished(true);
    setStatus("submitted");

    try {
      // Use user._id and question._id
      const res = await submitHIWAttempt({
        userId: user._id,
        questionId: question._id,
        selectedIndices
      });
      setResult(res.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error submitting HIW:", error);
      setShowModal(true); // Still show modal even if API fails for demo
    }
  };

  /* ================= RESET ON QUESTION CHANGE ================= */
  useEffect(() => {
    resetSession();
  }, [question]);

  const handleSelectAttempt = (attempt) => {
    // This function will be called when an attempt from history is clicked
    // You can use the 'attempt' data to display its details or "replay" it
    console.log("Selected attempt:", attempt);
    // For HIW, we might just display the selected indices for that attempt
    // and potentially its score.
    // This example just logs it, you might want to open a new modal or update existing UI.
    // For now, let's close the history and potentially show a result based on selected attempt
    setShowAttemptHistory(false);
    setResult({
      score: attempt.score,
      maxScore: attempt.maxScore,
      correctCount: attempt.correctCount,
      wrongCount: attempt.wrongCount,
      missedCount: attempt.missedCount,
      // Add other relevant fields if you want to display them in the ResultModal
    });
    // Maybe set selectedIndices to attempt.selectedIndices if you want to highlight them
    // on the main UI after selecting from history.
    setSelectedIndices(attempt.selectedIndices);
    setShowModal(true); // Show the result modal for the selected history attempt
  };


  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
       <div>
        <h1>Highlight Incorrect Words</h1>
        <p>You will hear a recording. Below is a transcription of the recording. Some words in the transcription differ from what the speaker said. Please click on the words that are different.</p>
      </div>
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-4">
        <button onClick={() => setActiveSpeechQuestion(false)}>
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Highlight Incorrect Words</h1>
      </div>

      {/* ================= MAIN CONTENT / HISTORY ================= */}
      {status === "countdown" ? (
        <div className="h-[500px] flex flex-col items-center justify-center">
          <p className="text-xl">Starting in</p>
          <p className="text-6xl font-black text-blue-600">{prepTimer}</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border shadow-sm flex flex-col min-h-[600px]">
          {/* ================= AUDIO BAR ================= */}
          <div className="p-6 bg-slate-50 border-b flex items-center gap-6">
            <button
              onClick={toggleAudio}
              disabled={audioFinished}
              className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:bg-slate-300"
            >
              {isPlaying ? <Pause /> : <Play className="ml-1" />}
            </button>

            <div className="flex-1">
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-[width] duration-200"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{Math.floor(currentTime)}s</span>
                <span>{Math.floor(duration)}s</span>
              </div>
            </div>

            {!audioFinished && (
              <button onClick={handleSkipAudio} className="text-blue-600 font-bold text-sm">
                Skip
              </button>
            )}

            <Volume2 className="text-slate-400" />
          </div>

          {/* ================= CONTENT ================= */}
          <div
            className="p-10 text-lg lg:text-xl leading-[3rem] text-slate-700 font-medium break-words break-all overflow-hidden"
          >
            {words.map((word, index) => {
              const isSelected = selectedIndices.includes(index);
              return (
                <span
                  key={index}
                  onClick={() => handleWordClick(index)}
                  className={`mr-1 px-1 py-1 rounded cursor-pointer ${isSelected ? "bg-blue-600 text-white" : ""
                    }`}
                >
                  {word}
                </span>
              );
            })}
          </div>

          {/* SUBMIT BUTTON - MOVED INSIDE CARD */}
          <div className="px-8 pb-8">
            <button
              onClick={handleSubmit}
              disabled={status === "submitted"} // Disable after submission
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg disabled:bg-slate-300 shadow-lg shadow-blue-200 disabled:shadow-none transition-all hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={24} /> Submit Answer
            </button>
          </div>
        </div>
      )}

        <AttemptHistoryHIW
          questionId={question}
          currentAttemptId={result?._id} // Pass current attempt ID if needed for highlighting
          onSelectAttempt={handleSelectAttempt}
        />
     
      {/* FOOTER CONTROLS - REPLACED WITH SST STYLE */}
      <div className="flex items-center justify-between pb-6 mt-6">
        {/* LEFT SIDE: Translate, Answer, Redo, History */}
        <div className="flex items-center gap-4">
          {/* Translate (Static) */}
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-default">
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm">
              <Languages size={18} />
            </div>
            <span className="text-xs font-medium">Translate</span>
          </button>

          {/* Answer (Static) */}
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-default text-opacity-50">
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm">
              <Eye size={18} />
            </div>
            <span className="text-xs font-medium">Answer</span>
          </button>

          {/* Redo */}
          <button onClick={resetSession} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm">
              <RefreshCw size={18} />
            </div>
            <span className="text-xs font-medium">Redo</span>
          </button>

          {/* History Button */}
          <button onClick={() => setShowAttemptHistory(prev => !prev)} className="flex flex-col items-center gap-1 text-slate-400 hover:text-purple-600 transition-colors">
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm">
              <History size={18} />
            </div>
            <span className="text-xs font-medium">History</span>
          </button>
        </div>

        {/* RIGHT SIDE: Prev, Next */}
        <div className="flex items-center gap-4">
          <button onClick={previousButton} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm">
              <ChevronLeft size={20} />
            </div>
            <span className="text-xs font-medium">Previous</span>
          </button>

          <button onClick={nextButton} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm">
              <ChevronRight size={20} />
            </div>
            <span className="text-xs font-medium">Next</span>
          </button>
        </div>
      </div>

      {/* ================= AUDIO ELEMENT ================= */}
      <audio
        ref={audioRef}
        src={question.audioUrl}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onEnded={handleAudioEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="hidden"
      />

      {/* ================= RESULT MODAL ================= */}
      {showModal && result && (
        <ResultModal
          result={result}
          onClose={() => setShowModal(false)}
          onRedo={resetSession}
        />
      )}
    </div>
  );
}

/* ================= RESULT MODAL COMPONENT ================= */
const ResultModal = ({ result, onClose, onRedo }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  // Use result.score and result.maxScore from the HIW attempt
  const scoreValue = result.score || 0;
  const maxScore = result.maxScore || 1; // Default to 1 to avoid division by zero
  const percentage = maxScore > 0 ? (scoreValue / maxScore) : 0;
  const offset = circumference - circumference * percentage;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden relative border flex flex-col items-center p-10">

        <div className="absolute top-6 right-6">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
        </div>

        <h2 className="text-3xl font-black text-slate-800 mb-8">Performance Result</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">

          {/* SCORE GAUGE */}
          <div className="bg-slate-50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center border">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
                <circle
                  cx="60" cy="60" r={radius} fill="none" stroke="#2563eb" strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-800">{scoreValue}</span>
                <span className="text-xs text-slate-400 font-bold uppercase">Score</span>
                <span className="text-sm text-slate-500">out of {maxScore}</span>
              </div>
            </div>
          </div>

          {/* DETAILS */}
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <span className="text-green-800 font-bold">Correct Words</span>
              <div className="text-2xl font-black text-green-600">{result.correctCount || 0}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <span className="text-red-800 font-bold">Incorrectly Selected</span>
              <div className="text-2xl font-black text-red-600">{result.wrongCount || 0}</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <span className="text-orange-800 font-bold">Missed Words</span>
              <div className="text-2xl font-black text-orange-600">{result.missedCount || 0}</div>
            </div>


            <div className="flex gap-4 mt-6">
              <button onClick={onRedo} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2">
                <RotateCcw size={18} /> Redo
              </button>
              <button onClick={onClose} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl">
                Close
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};