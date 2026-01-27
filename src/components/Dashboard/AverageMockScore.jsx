import React from 'react';
import { Gauge } from 'lucide-react';

const AverageMockScore = ({ score = 0, target = 90 }) => {
    // Simple SVG Gauge logic
    // Score 0-90
    const radius = 80;
    const stroke = 12;
    const normalizedScore = Math.min(Math.max(score, 0), 90);
    const percentage = (normalizedScore / 90) * 100;

    // Arc calculation
    // Start -180 deg (left), End 0 deg (right)
    // Circumference for half circle
    const circumference = Math.PI * radius;
    const strokeDashoffset = circumference - ((percentage / 100) * circumference);

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-6 self-start w-full">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Gauge size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Average Mock Score</h2>
            </div>

            <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden mb-4">
                <svg className="w-48 h-48 absolute top-0 transform rotate-180" viewBox="0 0 200 200">
                    {/* Background Track */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#fdeadd" // Light orange/peach track from screenshot
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        className="opacity-50"
                        style={{ strokeDasharray: circumference, strokeDashoffset: 0 }}
                    />
                    {/* Progress */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#4f46e5" // Indigo-600
                        strokeWidth="12"
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                            transition: 'stroke-dashoffset 1s ease-out'
                        }}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>

                {/* Score Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-800 tracking-tight">{score}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">/ 90</span>
                </div>

                {/* Decorative Dot to simulate start point if needed or just visual flair */}
                {/* Position calculation is complex for dynamic dot, so simpler static decorative dot or removing */}
                <div className="absolute top-0 right-0 w-3 h-3 bg-purple-200 rounded-full blur-sm"></div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 w-full px-4">
                <div className="flex flex-col items-center bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Target</span>
                    <span className="text-xl font-bold text-indigo-700">79+</span>
                </div>
                <div className="flex flex-col items-center bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Previous</span>
                    <span className="text-xl font-bold text-slate-600">--</span>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                    {score === 0 ? "Start your first mock test to begin your PTE journey." : "Keep practicing to improve your average!"}
                </p>
            </div>
        </div>
    );
};

export default AverageMockScore;
