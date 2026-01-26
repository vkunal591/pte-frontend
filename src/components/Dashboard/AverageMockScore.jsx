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
                        stroke="#f97316" // Orange
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                            transition: 'stroke-dashoffset 1s ease-out'
                        }}
                    />
                </svg>

                {/* Needle (simplified as a central text for now, or intricate SVG rotation) */}
                <div className="absolute bottom-0 mb-4 flex flex-col items-center">
                    {/* Small needle generic rep */}
                    <div className="w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-sm z-10"></div>
                </div>
            </div>

            {/* Ticks/Labels similar to screenshot */}
            <div className="w-full flex justify-between px-8 text-xs text-gray-400 font-mono -mt-6 mb-8">
                <span>10</span>
                <span>50</span>
                <span>90</span>
            </div>

            <div className="text-center">
                <div className="text-lg font-medium text-slate-700">
                    Your Score: <span className="font-bold text-slate-900">{score}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 max-w-[200px] mx-auto">
                    {score === 0 ? "Start your first mock test to begin your PTE journey." : "Keep practicing to improve your average!"}
                </p>
            </div>
        </div>
    );
};

export default AverageMockScore;
