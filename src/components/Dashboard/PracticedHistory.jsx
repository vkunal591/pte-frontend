import React from 'react';
import { History, Clock } from 'lucide-react';

const PracticedHistory = ({ history = [], onShowAll }) => {
    // Helper to get color/badge based on type
    const getTypeBadge = (type) => {
        switch (type) {
            case 'WFD': return { bg: 'bg-green-100', text: 'text-green-600', label: 'Write From Dictation', code: 'WFD' };
            case 'RA': return { bg: 'bg-orange-100', text: 'text-orange-600', label: 'Read Aloud', code: 'RA' };
            case 'RO': return { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Reorder Paragraphs', code: 'RO' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-600', label: type, code: type };
        }
    };

    // Helper date formatter
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
                    <History size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Your Practiced History</h2>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {history.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                        <Clock size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No practice history yet.</p>
                    </div>
                ) : (
                    history.map((item, index) => {
                        const badge = getTypeBadge(item.type);
                        return (
                            <div key={item.id || index} className={`${badge.bg} rounded-2xl p-4 relative`}>
                                {/* Vertical line connector logic could go here if strict timeline needed, simple cards for now as per design */}

                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-slate-800 font-bold text-sm">
                                        {formatDate(item.date)}
                                    </span>
                                    <span className={`text-[10px] bg-white/60 px-2 py-1 rounded-full ${badge.text} font-bold`}>
                                        Total Questions : {item.totalQuestions}
                                    </span>
                                </div>

                                {/* Dashed separator */}
                                <div className="border-t border-dashed border-slate-300/50 mb-3"></div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className={`bg-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm text-slate-700`}>
                                            {badge.code}
                                        </span>
                                        <span className="text-sm font-semibold text-slate-700">
                                            {badge.label}
                                        </span>
                                    </div>
                                    <div className="text-xs font-medium text-slate-500">
                                        Que : {item.totalQuestions}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    onClick={onShowAll}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                    <History size={16} />
                    Show Complete History
                </button>
            </div>
        </div>
    );
};

export default PracticedHistory;
