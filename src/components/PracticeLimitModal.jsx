import React from 'react';
import { useNavigate } from 'react-router-dom';

const PracticeLimitModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleUpgrade = () => {
        onClose();
        navigate('/pricing');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden transform transition-all scale-100">
                {/* Decorative Blob */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-50"></div>

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                </div>

                <h3 className="text-2xl font-bold text-center text-slate-800 mb-2">Practice Limit Reached</h3>

                <p className="text-center text-slate-500 mb-8 text-sm leading-relaxed">
                    You've reached the daily limit for free practice questions. Upgrade to <b>Prime</b> for unlimited access.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={handleUpgrade}
                        className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
                    >
                        Upgrade to Premium
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full py-3 px-4 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PracticeLimitModal;
