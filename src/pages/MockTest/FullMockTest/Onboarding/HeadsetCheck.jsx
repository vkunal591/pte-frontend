import React, { useRef, useState } from 'react';

export default function HeadsetCheck({ onNext }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3")); // Sample audio

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="bg-[#e0e0e0] px-6 py-3 border-b border-gray-400">
                <h1 className="text-xl font-bold text-gray-700">Practice PTE Mock Test</h1>
            </div>

            <div className="p-10 max-w-5xl mx-auto">
                <h2 className="text-lg font-bold text-gray-800 mb-6">Headset</h2>

                <p className="text-gray-700 text-sm mb-6">
                    Check This is an opportunity to check that your headset is working correctly.
                    <br />
                    1. Put your headset on and adjust it so that it fits comfortably over your ears.
                    <br />
                    2. When you are ready, click on the [Play] button. You will hear a short recording.
                    <br />
                    3. If you do not hear anything in your headphones while the status reads [Playing], raise your hand to get the attention of the Test Administrator.
                </p>

                <div className="bg-[#008199] p-6 w-[400px] text-white flex flex-col items-center justify-center rounded-sm">

                    <button onClick={togglePlay} className="flex items-center gap-2 mb-4">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-2"></div>
                    </button>
                    <p className="text-xs mb-6">Click the play button to start</p>

                    <div className="w-full flex items-center gap-2">
                        <span>🔊</span>
                        <input type="range" className="w-full h-1 bg-white rounded-lg appearance-none cursor-pointer" />
                    </div>
                </div>

                <p className="mt-8 text-gray-600 text-xs">
                    - During the test you will not have [Play] and [Stop] buttons. The audio recording will start playing automatically.
                    <br />
                    - Please do not remove your headset. You should wear it throughout the test.
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
