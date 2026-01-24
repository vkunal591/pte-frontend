import React from 'react';

export default function TestInstructions({ onNext }) {
    return (
        <div className="w-full min-h-screen bg-white">
            <div className="bg-[#e0e0e0] px-6 py-3 border-b border-gray-400">
                <h1 className="text-xl font-bold text-gray-700">Practice PTE Mock Test</h1>
            </div>

            <div className="p-10 max-w-5xl mx-auto">
                <h2 className="text-lg font-bold text-gray-800 mb-6">Test Instructions</h2>

                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    This test will measure the English Reading, Writing, Listening and Speaking skills that you need in an academic setting.
                    <br />
                    - The test is divided into 3 parts. Each part may contain a number of sections. The sections are individually timed.
                    The timer will be shown in the top right corner of your screen. The number of items in the section will also be displayed.
                </p>

                <div className="my-8">
                    <img src="https://cdn-icons-png.flaticon.com/512/4693/4693264.png" alt="Logo" className="w-24 opacity-20" />
                    {/* Placeholder for the Monkey Logo using a generic Headset icon for now, or existing asset if known */}
                </div>

                <ul className="list-none space-y-2 text-sm text-gray-700">
                    <li>- At the beginning of each part you will receive instructions. These will provide details on what to expect in that part of the test.</li>
                    <li>- By clicking on the Next button at the bottom of each screen you confirm your answer and move to the next question. If you click on Next you will not be able to return to the previous question. You will not be able to revisit any questions at the end of the test.</li>
                    <li>- You will be offered a break of up 10 minutes after Part 2. The break is optional.</li>
                    <li>- This test makes use of different varieties of English, for example, British, American, Australian. You can answer in the standard English variety of your choice.</li>
                </ul>
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-[#eeeeee] border-t border-gray-300 py-3 px-10 flex justify-end">
                <button onClick={onNext} className="bg-[#008199] hover:bg-[#006b81] text-white px-10 py-2 rounded font-bold uppercase shadow-sm">
                    Next
                </button>
            </div>
        </div>
    );
}
