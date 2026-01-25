import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getUserFullMockTestResults,
    getUserReadingResults,
    getUserSpeakingResults,
    getUserWritingResults,
    getUserListeningResults
} from "../../services/api";

const MockTestResults = ({ activeMainTab, activeSubTab }) => {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchResults();
    }, [activeMainTab, activeSubTab]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            // Default to "Full Tests" if activeSubTab is null (initial load of Results tab)
            const currentTab = activeSubTab || "Full Tests";

            if (currentTab === "Full Tests") {
                const data = await getUserFullMockTestResults();
                setResults(data.data || []);
            } else if (currentTab === "Section Tests") {
                // Determine specific section filter if any (currently MockTest.jsx doesn't pass a 3rd level filter)
                // For now, fetch ALL sections if we are in "Section Tests" mode.
                // If we implemented 3rd level filter, it would be passed somehow (maybe a new prop or encoded in activeSubTab?)
                // Since MockTest.jsx handles 2nd level as "Section Tests", let's load ALL sections.

                const [r, s, w, l] = await Promise.all([
                    getUserReadingResults(),
                    getUserSpeakingResults(),
                    getUserWritingResults(),
                    getUserListeningResults()
                ]);
                const combined = [
                    ...(r.data || []).map(i => ({ ...i, type: 'Reading' })),
                    ...(s.data || []).map(i => ({ ...i, type: 'Speaking' })),
                    ...(w.data || []).map(i => ({ ...i, type: 'Writing' })),
                    ...(l.data || []).map(i => ({ ...i, type: 'Listening' }))
                ];

                // Sort by date desc
                combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setResults(combined);
            }
        } catch (error) {
            console.error("Failed to fetch results", error);
        } finally {
            setLoading(false);
        }
    };


    const handleViewResult = (item) => {
        const currentTab = activeSubTab || "Full Tests";
        if (currentTab === "Full Tests") {
            // Updated route for full mock result
            navigate(`/mocktest/full/result/${item._id}`);
        } else {
            // Sectional Result
            navigate(`/mocktest/section/${item.type.toLowerCase()}/result/${item._id}`);
        }
    };


    if (loading) return <div className="p-8 text-center text-slate-500">Loading results...</div>;

    if (results.length === 0) return (
        <div className="p-12 text-center border rounded-xl bg-slate-50">
            <p className="text-slate-500 mb-4">No results found.</p>
            <button onClick={() => window.location.reload()} className="text-blue-600 font-semibold hover:underline">Refresh</button>
        </div>
    );

    return (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700">Test Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Type</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Date Taken</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Score</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {results.map((item) => (
                            <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {(item.fullMockTestId?.title || item.readingId?.title || item.speakingTestId?.title || item.writingId?.title || item.listeningId?.title) || "Untitled Test"}
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.type === 'Reading' ? 'bg-blue-100 text-blue-700' :
                                        item.type === 'Speaking' ? 'bg-purple-100 text-purple-700' :
                                            item.type === 'Writing' ? 'bg-yellow-100 text-yellow-700' :
                                                item.type === 'Listening' ? 'bg-pink-100 text-pink-700' :
                                                    'bg-emerald-100 text-emerald-700' // Full Test
                                        }`}>
                                        {item.type || "Full Mock"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-800">
                                    {item.overallScore}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleViewResult(item)}
                                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                                    >
                                        View Result
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MockTestResults;
