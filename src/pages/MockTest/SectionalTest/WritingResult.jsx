import React, { useEffect, useState } from "react";
import axios from "axios";

export default function WritingResultScreen({ resultId }) {
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Writing");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`/api/writing/result/${resultId}`);
        setResultData(response.data.data);
      } catch (err) {
        console.error("Error fetching results", err);
      } finally {
        setLoading(false);
      }
    };
    if (resultId) fetchResult();
  }, [resultId]);

  if (loading) return <div className="p-10 text-center">Scoring your test...</div>;
  if (!resultData) return <div className="p-10 text-center">No result found.</div>;

  return (
    <div className="bg-[#f4f7f8] min-h-screen pb-10">
      {/* 1. OVERALL SCORE SECTION */}
      <div className="bg-white border-b p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-xl font-bold text-gray-800 mb-6">
            【VIP Section Test】 Writing Mock Test - Score Report
          </h1>

          <div className="flex gap-10 items-center bg-[#fcfcfc] border rounded-lg p-6 shadow-sm">
             {/* Circular Score Mockup */}
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-[10px] border-[#008199]">
                <div className="text-center">
                    <span className="text-3xl font-bold">{resultData.overallScore}</span>
                    <p className="text-xs text-gray-500 uppercase">Overall</p>
                </div>
            </div>

            <div className="flex-1">
               <div className="grid grid-cols-4 gap-4 text-center">
                  <ScoreMiniCard label="Listening" score={resultData.overallScore} color="bg-blue-500" />
                  <ScoreMiniCard label="Reading" score={resultData.overallScore} color="bg-green-500" />
                  <ScoreMiniCard label="Speaking" score={resultData.overallScore} color="bg-gray-600" />
                  <ScoreMiniCard label="Writing" score={resultData.overallScore} color="bg-purple-700" />
               </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-[#e1f5fe] border border-[#b3e5fc] rounded text-[#01579b] text-sm font-medium flex items-center gap-2">
            <span>ℹ️</span>
            Your mock test is being scored by APEUni AI ... please check the details below.
          </div>
        </div>
      </div>

      {/* 2. DETAILED ANSWERS SECTION */}
      <div className="max-w-5xl mx-auto mt-8 px-4">
        <div className="bg-white border rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="flex border-b text-sm font-semibold text-gray-500">
            {["Speaking", "Writing", "Reading", "Listening"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 ${activeTab === tab ? "text-[#008199] border-b-2 border-[#008199]" : ""}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* List of Questions based on backend scores array */}
          <div className="p-6">
            {resultData.scores.map((item, index) => (
              <div key={item._id} className="mb-10 last:mb-0 border-b pb-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-gray-700">
                    {index + 1}. {item.questionType} #{item.questionId.slice(-4)}
                  </h3>
                  <button className="text-[#008199] text-sm font-medium">Go to Question &gt;</button>
                </div>

                {/* Answer Display */}
                <div className="bg-gray-50 p-4 rounded border mb-4">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-2">Your Answer:</p>
                    <p className="text-gray-700 italic">"{item.answerText || "No response"}"</p>
                </div>

                {/* Score Breakdown (Matches your backend object) */}
                <div className="flex gap-6 mt-4">
                    <ScoreTag label="Content" score={item.contentScore} max={3} />
                    <ScoreTag label="Grammar" score={item.grammarScore} max={2} />
                    <ScoreTag label="Form" score={1} max={1} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Helper Components */
function ScoreMiniCard({ label, score, color }) {
    return (
        <div>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${score}%` }}></div>
            </div>
            <p className="text-sm font-bold mt-1">{score}</p>
        </div>
    )
}

function ScoreTag({ label, score, max }) {
  return (
    <div className="text-sm">
      <span className="text-gray-500">{label}: </span>
      <span className="font-bold text-[#008199]">{score} / {max}</span>
    </div>
  );
}