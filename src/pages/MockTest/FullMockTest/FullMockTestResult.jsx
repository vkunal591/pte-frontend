import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, BarChart2, BookOpen, PenTool, Headphones, Mic } from 'lucide-react';
import ScoreBreakdownTable from './ScoreBreakdownTable';

const FullMockTestResult = ({ result }) => {
    const navigate = useNavigate();

    if (!result) return null;

    const { overallScore, speaking, writing, reading, listening } = result;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-[#008199] px-8 py-6 text-white flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <CheckCircle size={32} className="text-emerald-400" />
                                Test Completed
                            </h1>
                            <p className="text-blue-100 mt-1 opacity-90">Great job! Here is your performance summary.</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs uppercase tracking-widest opacity-70">Overall Score</p>
                            <p className="text-5xl font-black">{overallScore}</p>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <SectionScoreCard
                                title="Speaking"
                                score={speaking?.score}
                                icon={<Mic size={24} />}
                                color="text-blue-600"
                                bg="bg-blue-50"
                                border="border-blue-100"
                            />
                            <SectionScoreCard
                                title="Writing"
                                score={writing?.score}
                                icon={<PenTool size={24} />}
                                color="text-purple-600"
                                bg="bg-purple-50"
                                border="border-purple-100"
                            />
                            <SectionScoreCard
                                title="Reading"
                                score={reading?.score}
                                icon={<BookOpen size={24} />}
                                color="text-orange-600"
                                bg="bg-orange-50"
                                border="border-orange-100"
                            />
                            <SectionScoreCard
                                title="Listening"
                                score={listening?.score}
                                icon={<Headphones size={24} />}
                                color="text-emerald-600"
                                bg="bg-emerald-50"
                                border="border-emerald-100"
                            />
                        </div>
                    </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="p-8 pt-0">
                    <ScoreBreakdownTable result={result} />
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                >
                    <BarChart2 size={20} />
                    Return to Dashboard
                </button>
                {/* Add detailed report button later if needed */}
            </div>

        </div>
    );
};

const SectionScoreCard = ({ title, score, icon, color, bg, border }) => (
    <div className={`${bg} ${border} border rounded-2xl p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1`}>
        <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-4 ${color}`}>
            {icon}
        </div>
        <h3 className="text-gray-600 font-bold uppercase tracking-wider text-xs mb-1">{title}</h3>
        <p className={`text-3xl font-black ${color}`}>{Math.round(score || 0)}</p>
    </div>
);

export default FullMockTestResult;
