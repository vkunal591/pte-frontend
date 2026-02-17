import React, { useState, useEffect, useRef } from 'react';

export default function PersonalIntroduction({ onNext }) {
    const [phase, setPhase] = useState('PREPARE'); // PREPARE | RECORD | DONE
    const [timer, setTimer] = useState(25);
    const mediaRecorderRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        } else {
            // Timer finished
            if (phase === 'PREPARE') {
                startRecording();
            } else if (phase === 'RECORD') {
                stopRecording();
            }
        }
        return () => clearInterval(interval);
    }, [timer, phase]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setPhase('RECORD');
            setTimer(30); // 30s recording
        } catch (err) {
            console.error("Mic Error", err);
            // Fallback if mic fails
            setPhase('RECORD');
            setTimer(30);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        setPhase('DONE');
    };

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="bg-[#e0e0e0] px-6 py-3 border-b border-gray-400">
                <h1 className="text-xl font-bold text-gray-700">Practice PTE Mock Test</h1>
            </div>

            <div className="p-10 max-w-5xl mx-auto">

                {/* Prompt Text */}
                <div className="mb-12">
                    <p className="font-bold text-gray-800 mb-4 bg-yellow-50 p-2 border border-yellow-200">
                        Read the prompt below. In 25 seconds, you must reply in your own words, as naturally and clearly as possible.
                        You have 30 seconds to record your response. Your response will be sent together with your score report to the institutions selected by you.
                    </p>

                    <p className="text-gray-700 mb-6 font-semibold">
                        Please introduce yourself. For example, you could talk about one of the following:
                    </p>

                    <ul className="text-gray-600 space-y-1 list-disc pl-5">
                        <li>Your interests</li>
                        <li>Your plans for future study</li>
                        <li>Why you want to study abroad</li>
                        <li>Why you need to learn English</li>
                        <li>Why you chose this test</li>
                    </ul>
                </div>

                {/* Status / Timer */}
                <div className="flex items-center justify-center gap-6">
                    {phase === 'PREPARE' && (
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full border-4 border-gray-300 flex items-center justify-center text-xl font-bold text-gray-600">
                                {timer}
                            </div>
                            <span className="text-gray-500 font-bold uppercase">Recording in {timer} seconds</span>
                        </div>
                    )}

                    {phase === 'RECORD' && (
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full border-4 border-red-500 flex items-center justify-center bg-red-50 text-white animate-pulse">
                                <div className="w-6 h-6 bg-red-600 rounded-sm"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-red-500 font-bold uppercase tracking-wider">Recording</span>
                                <div className="w-64 h-2 bg-gray-200 rounded mt-2 overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-1000 linearity"
                                        style={{ width: `${((30 - timer) / 30) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            <span className="text-gray-600 font-mono">00:{timer < 10 ? `0${timer}` : timer}</span>
                        </div>
                    )}

                    {phase === 'DONE' && (
                        <div className="text-center text-green-600 font-bold text-lg">
                            Recording Complete. Click Next to continue.
                        </div>
                    )}
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
