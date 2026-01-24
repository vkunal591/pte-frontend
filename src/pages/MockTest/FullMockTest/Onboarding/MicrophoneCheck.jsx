import React, { useState, useRef } from 'react';

export default function MicrophoneCheck({ onNext }) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                chunksRef.current = [];
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Mic Error:", err);
            alert("Microphone access denied or error.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const playRecording = () => {
        if (audioBlob) {
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        }
    };

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="bg-[#e0e0e0] px-6 py-3 border-b border-gray-400">
                <h1 className="text-xl font-bold text-gray-700">Practice PTE Mock Test</h1>
            </div>

            <div className="p-10 max-w-5xl mx-auto">
                <h2 className="text-lg font-bold text-gray-800 mb-6">Microphone Check</h2>

                <p className="text-gray-700 text-sm mb-6 max-w-xl">
                    This is an opportunity to check that your microphone is working correctly.
                    <br />
                    1. Make sure your headset is on and the microphone is in the downward position near your mouth.
                    <br />
                    2. When you are ready, click on the Record button and say <span className="text-red-500 font-bold">"Testing, testing, one, two, three"</span> into the microphone.
                    <br />
                    3. After you have spoken, click on the Stop button. Your recording is now complete.
                    <br />
                    4. Now click on the Playback button. You should clearly hear yourself speaking.
                    <br />
                    5. If you can not hear your voice clearly, please raise your hand.
                </p>

                <div className="flex items-center gap-6 mb-10">
                    {/* Record Button */}
                    {!isRecording ? (
                        <button onClick={startRecording} className="bg-[#008199] text-white px-8 py-2 rounded font-bold">
                            Record
                        </button>
                    ) : (
                        <button onClick={stopRecording} className="bg-red-600 text-white px-8 py-2 rounded font-bold animate-pulse">
                            Stop
                        </button>
                    )}

                    {/* Playback Indicator */}
                    {audioBlob && (
                        <button onClick={playRecording} className="border border-gray-400 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-100">
                            <span>▶</span> Playback
                        </button>
                    )}
                </div>

                <p className="text-gray-600 text-xs mt-10">
                    During the test, you will not have Record, Playback and Stop buttons. The voice recording will start automatically.
                </p>
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-[#eeeeee] border-t border-gray-300 py-3 px-10 flex justify-end">
                <button onClick={onNext} className="bg-[#008199] hover:bg-[#006b81] text-white px-10 py-2 rounded font-bold uppercase shadow-sm">
                    Next
                </button>
            </div>
        </div>
    );
}
