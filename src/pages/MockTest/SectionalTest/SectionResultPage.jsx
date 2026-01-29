import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import DashboardLayout from "../../../components/DashboardLayout/DashboardLayout";
import ScoreBreakdownTable from "../FullMockTest/ScoreBreakdownTable";

import { useLocation } from "react-router-dom"; // Add hook

const SectionResultPage = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); // Get state
    const [result, setResult] = useState(location.state?.result || null); // Init from state
    const [loading, setLoading] = useState(!location.state?.result); // Loading only if no state
    const [error, setError] = useState(null);

    useEffect(() => {
        if (result) return; // Skip fetch if data exists

        const fetchResult = async () => {
            try {
                let endpoint = "";
                if (type === "speaking") endpoint = `/question/speaking/result/${id}`;
                else if (type === "writing") endpoint = `/question/writing/result/${id}`;
                else if (type === "reading") endpoint = `/question/reading/result/${id}`;
                else if (type === "listening") endpoint = `/question/listening/result/${id}`;
                // Add FIBD fetch support if implemented later (currently purely state-based for session)

                if (!endpoint) throw new Error("Invalid test type or direct fetch not supported");

                const res = await api.get(endpoint);
                if (res.data?.success) {
                    setResult(res.data.data);
                } else if (res.data) {
                    setResult(res.data);
                } else {
                    setError("Failed to load data");
                }
            } catch (err) {
                console.error("Error fetching section result:", err);
                setError("Result not found or API error.");
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [type, id, result]);

    if (loading) return <div className="p-20 text-center">Loading Result...</div>;
    if (error) return <div className="p-20 text-center text-red-500">{error}</div>;

    // Render logic
    const renderContent = () => {
        if (type === "writing") {
            // Use specific Writing Result if it handles fetching internally? 
            // The existing WritingResult.jsx (checked via view_file) receives `resultData` prop.
            // If I pass `result`, it should work.
            return <WritingResult resultData={result} />;
        }

        if (type === "writing") {
            return <WritingResult resultData={result} />;
        }

        // Generic view for Question Tests (FIBD, SST etc)
        if (!["speaking", "reading", "listening", "writing"].includes(type)) {
            return (
                <div className="space-y-6">
                    <h1 className="text-2xl font-bold mb-4 capitalize">{type} Test Result</h1>

                    <div className="bg-white p-6 rounded-xl shadow-sm border flex justify-between items-center">
                        <div>
                            <p className="text-sm text-slate-500">Total Score</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-[#008199]">{result.overallScore ?? result.score ?? 0}</span>
                                <span className="text-slate-400">/ {result.maxScore ?? "?"}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500">Date</p>
                            <p className="font-semibold">{new Date(result.date || result.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Question Breakdown */}
                    {result.questionResults && (
                        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            <h3 className="bg-slate-50 px-6 py-4 font-bold border-b">Detailed Breakdown</h3>
                            <div className="divide-y">
                                {result.questionResults.map((q, idx) => (
                                    <div key={idx} className="p-4 hover:bg-slate-50 transition">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-semibold text-slate-800">Question {idx + 1}</span>
                                            <span className={`font-bold ${q.score === q.maxScore ? 'text-green-600' : 'text-[#008199]'}`}>
                                                {q.score} / {q.maxScore}
                                            </span>
                                        </div>
                                        {/* Show user answers vs correct (if detailed) */}
                                        <div className="text-xs text-slate-500 space-y-1">
                                            {q.detail && q.detail.map((d, i) => (
                                                <div key={i} className="flex gap-2">
                                                    <span className="w-6 font-mono text-slate-400">[{d.index}]</span>
                                                    <span className={d.isCorrect ? "text-green-600 font-medium" : "text-red-500"}>
                                                        {d.answer || "(Empty)"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // For others, we can reuse ScoreBreakdownTable BUT we need to format the data
        // differently because ScoreBreakdownTable expects { speaking: ..., writing: ... }
        // whereas `result` here is likely just the specific section object.

        // Wrapper object to mimic full mock result structure for ScoreBreakdownTable
        const mockFullResult = {
            speaking: type === 'speaking' ? result : null,
            reading: type === 'reading' ? result : null,
            listening: type === 'listening' ? result : null,
            writing: type === 'writing' ? result : null,
        };

        return (
            <div>
                <h1 className="text-2xl font-bold mb-4 capitalize">{type} Test Result</h1>
                <div className="bg-white p-6 rounded-xl shadow-sm border mb-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-slate-500">Overall Score</p>
                            <p className="text-4xl font-bold text-[#008199]">{result.score || result.overallScore || 0}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500">Date</p>
                            <p className="font-semibold">{new Date(result.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <ScoreBreakdownTable result={mockFullResult} />
            </div>
        );
    };

    return (
        <DashboardLayout>
            <div className="p-6 max-w-5xl mx-auto">
                <button
                    onClick={() => navigate("/mock-test?module=Results")}
                    className="mb-4 text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                    &larr; Back to Results
                </button>
                {renderContent()}
            </div>
        </DashboardLayout>
    );
};

export default SectionResultPage;
