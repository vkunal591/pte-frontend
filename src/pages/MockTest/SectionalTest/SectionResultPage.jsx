import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import DashboardLayout from "../../../components/DashboardLayout/DashboardLayout";
import ScoreBreakdownTable from "../FullMockTest/ScoreBreakdownTable";

const SectionResultPage = () => {
    const { type, id } = useParams(); // type: speaking, reading, listening, writing
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                // Determine API endpoint based on type
                let endpoint = "";
                if (type === "speaking") endpoint = `/question/speaking/result/${id}`;
                else if (type === "writing") endpoint = `/question/writing/result/${id}`;
                else if (type === "reading") endpoint = `/question/reading/result/${id}`; // Need to confirm this route exists
                else if (type === "listening") endpoint = `/question/listening/result/${id}`;

                if (!endpoint) throw new Error("Invalid test type");

                const res = await api.get(endpoint);
                if (res.data?.success) {
                    setResult(res.data.data);
                } else if (res.data) {
                    // Some endpoints return data directly or in different format? 
                    // Assuming standard { success: true, data: ... }
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
    }, [type, id]);

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
