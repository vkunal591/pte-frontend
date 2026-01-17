import { useState } from "react";
import { BarChart2, Shuffle, Play, Eye, Info, CheckCircle, Target } from "lucide-react";

const WrittenAttemptHistory = ({ question, onSelectAttempt, module }) => {
  const [activeTab, setActiveTab] = useState("my_answer");
  const attempts = question?.lastAttempts || [];

  const getAISuggestion = (score) => {
    if (score >= 11) {
      return {
        text: "Excellent work! Keep it up.",
        color: "text-green-700 bg-green-50 border-green-100",
        icon: <CheckCircle className="w-5 h-5 text-green-600" />
      };
    } else if (score >= 7) {
      return {
        text: "Good attempt. Focus more on key details.",
        color: "text-amber-700 bg-amber-50 border-amber-100",
        icon: <Target className="w-5 h-5 text-amber-600" />
      };
    } else {
      return {
        text: "Needs improvement. Work on clarity and structure.",
        color: "text-red-700 bg-red-50 border-red-100",
        icon: <Info className="w-5 h-5 text-red-600" />
      };
    }
  };

  if (!attempts.length) {
    return (
      <div className="mt-10 font-sans">
        <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
          <button className="pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 border-purple-600 text-purple-600">
            <div className="w-5 h-5 rounded bg-purple-100 flex items-center justify-center">
              <BarChart2 size={12} />
            </div>
            My Answer
            <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">0</span>
          </button>
        </div>

        <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border">
            <Info size={20} className="text-slate-300" />
          </div>
          <p className="text-sm font-medium">No attempts yet</p>
          <p className="text-xs mt-1 opacity-70">
            Complete the exercise to see your history
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 font-sans">
      {/* ---------------- TABS ---------------- */}
      <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab("my_answer")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "my_answer"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <div className="w-5 h-5 rounded bg-purple-100 flex items-center justify-center">
            <BarChart2 size={12} />
          </div>
          My Answer
          <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{attempts.length}</span>
        </button>

        <button
          onClick={() => setActiveTab("community")}
          className="pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 border-transparent text-slate-400 cursor-not-allowed"
        >
          <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center">
            <Shuffle size={12} />
          </div>
          Community
        </button>
      </div>

      {/* ---------------- ATTEMPT LIST ---------------- */}
      <div className="space-y-4">
        {attempts.map((attempt, idx) => {
          const aiSuggestion = getAISuggestion(attempt.score);
          return (
            <div
              key={idx}
              onClick={() => onSelectAttempt?.(attempt)}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center gap-6 hover:shadow-md transition-shadow cursor-pointer group"
            >
              {/* Date */}
              <div className="min-w-[180px]">
                <span className="text-sm font-bold text-slate-600">
                  {new Date(attempt.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Score and Details */}
              <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 w-full">
                <div className="bg-slate-50 px-4 py-3 rounded-xl border w-full sm:w-auto">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Score</span>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-2xl font-black ${
                        attempt.score >= (module === "essay" ? 13 : 1)
                          ? "text-green-600"
                          : attempt.score >= (module === "essay" ? 9 : 0.5)
                          ? "text-yellow-600"
                          : "text-red-500"
                      }`}
                    >
                      {attempt.score}
                    </span>
                    <span className="text-xs text-slate-400">
                      {module === "essay" ? "/16" : "/1"}
                    </span>
                  </div>

                  {/* Detailed breakdown */}
                  {module === "essay" && (
                    <div className="flex gap-4 mt-2 text-xs text-slate-500">
                      <div>
                        <span className="font-bold text-slate-700">{attempt.content}</span>
                        <div className="text-[9px] uppercase">Content</div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700">{attempt.grammar}</span>
                        <div className="text-[9px] uppercase">Grammar</div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700">{attempt.vocabulary}</span>
                        <div className="text-[9px] uppercase">Vocab</div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700">{attempt.structure}</span>
                        <div className="text-[9px] uppercase">Structure</div>
                      </div>
                    </div>
                  )}

                  {module === "summarize" && (
                    <div className="flex gap-4 mt-2 text-xs text-slate-500">
                      <div>
                        <span className="font-bold text-slate-700">{attempt.content}</span>
                        <div className="text-[9px] uppercase">Content</div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700">{attempt.grammar}</span>
                        <div className="text-[9px] uppercase">Grammar</div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700">{attempt.vocabulary}</span>
                        <div className="text-[9px] uppercase">Vocab</div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700">{attempt.form}</span>
                        <div className="text-[9px] uppercase">Form</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* View Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAttempt?.(attempt);
                }}
                className="p-2 text-slate-300 hover:text-purple-600"
              >
                <Eye size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WrittenAttemptHistory;
