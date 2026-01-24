import React from 'react';

export default function FullMockTestIntro({ onStart }) {
    return (
        <div className="w-full min-h-screen bg-white">
            {/* Header */}
            <div className="bg-[#e0e0e0] px-6 py-3 border-b border-gray-400">
                <h1 className="text-xl font-bold text-gray-700">Practice PTE Mock Test</h1>
            </div>

            {/* Content */}
            <div className="p-10 max-w-5xl mx-auto">
                <h2 className="text-lg font-bold text-gray-800 mb-6 font-sans">
                    The test is approximately 2.5 hours long.
                </h2>

                <div className="border border-gray-400 w-full max-w-lg mb-10 text-sm">
                    <div className="grid grid-cols-3 bg-[#eef6f8] font-bold border-b border-gray-400 text-center">
                        <div className="p-2 border-r border-gray-400">Part</div>
                        <div className="p-2 border-r border-gray-400">Content</div>
                        <div className="p-2">Time allowed</div>
                    </div>
                    <div className="grid grid-cols-3 border-b border-gray-400 text-center">
                        <div className="p-2 border-r border-gray-400">Intro</div>
                        <div className="p-2 border-r border-gray-400">Introduction</div>
                        <div className="p-2">-</div>
                    </div>
                    <div className="grid grid-cols-3 border-b border-gray-400 text-center">
                        <div className="p-2 border-r border-gray-400">Part 1</div>
                        <div className="p-2 border-r border-gray-400">Speaking and Writing</div>
                        <div className="p-2">77-93 minutes</div>
                    </div>
                    <div className="grid grid-cols-3 border-b border-gray-400 text-center">
                        <div className="p-2 border-r border-gray-400">Part 2</div>
                        <div className="p-2 border-r border-gray-400">Reading</div>
                        <div className="p-2">29-30 minutes</div>
                    </div>
                    <div className="grid grid-cols-3 text-center">
                        <div className="p-2 border-r border-gray-400">Part 3</div>
                        <div className="p-2 border-r border-gray-400">Listening</div>
                        <div className="p-2">30-43 minutes</div>
                    </div>
                </div>

                <div className="w-full h-[1px] bg-gray-300 mb-10"></div>
            </div>

            {/* Fixed Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-[#eeeeee] border-t border-gray-300 py-3 px-10 flex justify-end">
                <button
                    onClick={onStart}
                    className="bg-[#008199] hover:bg-[#006b81] text-white px-10 py-2 rounded font-bold uppercase shadow-sm"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
