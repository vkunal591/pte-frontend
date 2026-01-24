import React from 'react';

export default function StartExamScreen({ onNext }) {
    return (
        <div className="w-full min-h-screen bg-white">
            <div className="bg-[#e0e0e0] px-6 py-3 border-b border-gray-400">
                <h1 className="text-xl font-bold text-gray-700">Practice PTE Mock Test</h1>
            </div>

            <div className="p-10 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">

                <p className="text-lg text-gray-800 mb-10 w-full text-left">
                    Click "Next" and we'll start the exam.
                </p>

                <div className="relative w-full max-w-md">
                    {/* Abstract Background Shape */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[#fdf5d8] rounded-full blur-3xl opacity-50 transform -translate-x-10 scale-125 z-0"></div>

                    {/* Illustration */}
                    <img
                        src="https://img.freepik.com/free-vector/business-woman-character_23-2148479901.jpg?w=740&t=st=1686730000~exp=1686730600~hmac=..."
                        alt="Start Exam"
                        className="relative z-10 w-64 h-auto mx-auto mix-blend-multiply"
                        onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/3408/3408148.png' }} // Fallback
                    />
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
