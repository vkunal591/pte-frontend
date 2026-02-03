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
  History,
  Share2,
  Trash2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Languages,
  Eye,
  RefreshCw
} from "lucide-react";
import { submitHIWAttempt } from "../../services/api";

export default function HighlightIncorrectWords({ question, setActiveSpeechQuestion, nextButton, previousButton }) {
  console.log(question)
  const [status, setStatus] = useState("countdown");
  const [prepTimer, setPrepTimer] = useState(3);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFinished, setAudioFinished] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState(null); // Added result state

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
      // Fallback for demo if API fails?
      // For now, let's assume it works or just show basic result
      setShowModal(true);
    }
  };

  /* ================= RESET ON QUESTION CHANGE ================= */
  useEffect(() => {
    resetSession();
  }, [question]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-4">
        <button onClick={() => setActiveSpeechQuestion(false)}>
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Highlight Incorrect Words</h1>
      </div>

      {/* ================= COUNTDOWN ================= */}
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
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg disabled:bg-slate-300 shadow-lg shadow-blue-200 disabled:shadow-none transition-all hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={24} /> Submit Answer
            </button>
          </div>
        </div>
      )}

      {/* FOOTER CONTROLS - REPLACED WITH SST STYLE */}
      <div className="flex items-center justify-between pb-6 mt-6">
        {/* LEFT SIDE: Translate, Answer, Redo */}
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
  const progress = result.score || 0;
  // Should adjust max score logic if needed. Assuming 100% or normalized to 0-1 for pie?
  // Actually, let's just make it look good.
  const scoreValue = result.totalScore !== undefined ? result.totalScore : result.score;
  const maxScore = result.maxScore || 10;
  const percentage = (scoreValue / maxScore);
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
              </div>
            </div>
          </div>

          {/* DETAILS */}
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <span className="text-green-800 font-bold">Listening Score</span>
              <div className="text-2xl font-black text-green-600">{result.listeningScore?.toFixed(1) || 0}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <span className="text-purple-800 font-bold">Reading Score</span>
              <div className="text-2xl font-black text-purple-600">{result.readingScore?.toFixed(1) || 0}</div>
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
