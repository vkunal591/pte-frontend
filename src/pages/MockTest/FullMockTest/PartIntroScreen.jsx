import React from 'react';

export default function PartIntroScreen({
    partName,
    title,
    contentList = [],
    timeAllowed,
    onNext
}) {
    return (
        <div className="w-full min-h-screen bg-white">
            {/* Header */}
            <div className="bg-[#e0e0e0] px-6 py-3 border-b border-gray-400">
                <h1 className="text-xl font-bold text-gray-700">Practice PTE Mock Test</h1>
            </div>

            {/* Main Content */}
            <div className="p-10 max-w-5xl mx-auto">
                <h2 className="text-lg font-bold text-gray-800 mb-2">
                    You are about to begin {partName} of the exam : {title}
                </h2>

                <p className="text-sm font-bold text-gray-700 mb-8">
                    Remember : to put your headphones on before beginning this section
                </p>

                <div className="flex gap-4">
                    {/* Table */}
                    <div className="border border-gray-500 w-[300px] text-sm">
                        <div className="grid grid-cols-2 bg-[#eef6f8] font-bold border-b border-gray-400 text-center italic">
                            <div className="p-1 border-r border-gray-400">Content</div>
                            <div className="p-1">Time allowed</div>
                        </div>

                        {/* Content Rows */}
                        <div className="flex h-full">
                            <div className="w-1/2 border-r border-gray-400">
                                {contentList.map((item, idx) => (
                                    <div key={idx} className="p-1 border-b border-gray-300 last:border-b-0 italic text-gray-600 pl-2 text-left">
                                        {item}
                                    </div>
                                ))}
                            </div>
                            <div className="w-1/2 flex items-center justify-center text-gray-500 italic">
                                {timeAllowed}
                            </div>
                        </div>
                    </div>

                    {/* Illustration (Headset Icon Placeholder) */}
                    <div className="flex-1 flex items-center justify-center">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4693/4693264.png"
                            alt="Headset"
                            className="w-32 opacity-20"
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-[#eeeeee] border-t border-gray-300 py-3 px-10 flex justify-end">
                <button
                    onClick={onNext}
                    className="bg-[#008199] hover:bg-[#006b81] text-white px-10 py-2 rounded font-bold uppercase shadow-sm"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
