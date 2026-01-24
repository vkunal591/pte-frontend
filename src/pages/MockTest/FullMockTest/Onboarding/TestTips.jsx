import React from 'react';

export default function TestTips({ onNext }) {
    return (
        <div className="w-full min-h-screen bg-white">
            <div className="bg-[#e0e0e0] px-6 py-3 border-b border-gray-400">
                <h1 className="text-xl font-bold text-gray-700">Practice PTE Mock Test</h1>
            </div>

            <div className="p-10 max-w-5xl mx-auto">
                <h2 className="text-lg font-bold text-gray-800 mb-6">Tips</h2>

                <div className="mb-10 text-gray-700 text-sm">
                    <p className="mb-2">The key lies in clear and natural expression, accurate pronunciation, and correct grammar.</p>
                    <p className="mb-2">Avoid long pauses or using words like "um" or "uh".</p>
                    <p>Fluency is crucial – don't hesitate, just speak up directly.</p>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-[#eeeeee] border-t border-gray-300 py-3 px-10 flex justify-end">
                <button onClick={onNext} className="bg-[#008199] hover:bg-[#006b81] text-white px-10 py-2 rounded font-bold uppercase shadow-sm">
                    Next
                </button>
            </div>
        </div>
    );
}
