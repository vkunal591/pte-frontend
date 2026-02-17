import React from 'react';
import { History, Clock } from 'lucide-react';

const PracticedHistory = ({ history = [], onShowAll, limit = 3 }) => {

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    // Group history by date
    // Sort logic handled by backend (newest first).
    const groupsArray = [];
    history.forEach(item => {
        const date = formatDate(item.date);
        let group = groupsArray.find(g => g.date === date);
        if (!group) {
            group = {
                date: date,
                totalQuestions: 0,
                items: [],
                // Alternating colors
                color: groupsArray.length % 2 === 0 ? 'green' : 'red'
            };
            groupsArray.push(group);
        }
        group.items.push(item);
        group.totalQuestions += 1; // Assuming each item is 1 question, or item.totalQuestions || 1
    });

    // If limit is provided, we limit the number of DAYS (groups) shown.
    const displayGroups = limit ? groupsArray.slice(0, limit) : groupsArray;

    const getTheme = (color) => {
        if (color === 'green') return { border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600', badge: 'text-emerald-500 bg-white' };
        return { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-600', badge: 'text-red-500 bg-white' };
    };

    const getTypeBadge = (type) => {
        switch (type) {
            case 'WFD': return { label: 'Write From Dictation', code: 'WFD' };
            case 'RA': return { label: 'Read Aloud', code: 'RA' };
            case 'RS': return { label: 'Repeat Sentence', code: 'RS' };
            case 'DI': return { label: 'Describe Image', code: 'DI' };
            case 'RO': return { label: 'Reorder Paragraphs', code: 'RO' };
            case 'RL': return { label: 'Retell Lecture', code: 'RL' };
            case 'ASQ': return { label: 'Answer Short Question', code: 'ASQ' };
            case 'SWT': return { label: 'Summarize Written Text', code: 'SWT' };
            case 'WE': return { label: 'Write Essay', code: 'WE' };
            case 'RFIB-D': return { label: 'Reading FIB (Dropdown)', code: 'RFIB' };
            case 'RFIB-DD': return { label: 'Reading FIB (Drag & Drop)', code: 'RFIB' };
            case 'R-MCQ-M': return { label: 'Reading MCQ (Multiple)', code: 'RMCM' };
            case 'R-MCQ-S': return { label: 'Reading MCQ (Single)', code: 'RMCS' };
            default: return { label: type, code: type ? type.substring(0, 4).toUpperCase() : 'UNK' };
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
                    <History size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Your Practiced History</h2>
            </div>

            <div className="space-y-6 flex-1 pr-2">
                {groupsArray.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                        <Clock size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No practice history yet.</p>
                    </div>
                ) : (
                    displayGroups.map((group, gIndex) => {
                        const theme = getTheme(group.color);
                        return (
                            <div key={gIndex} className={`rounded-xl p-5 ${theme.bg} border-l-[6px] ${theme.border} relative shadow-sm`}>
                                {/* Header */}
                                <div className="flex justify-between items-center mb-4 pb-3 border-b border-dashed border-gray-300/50">
                                    <h3 className="font-bold text-slate-800 text-base">{group.date}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${theme.badge}`}>
                                        Total Questions : {group.totalQuestions}
                                    </span>
                                </div>

                                {/* Items */}
                                <div className="space-y-3">
                                    {group.items.map((item, iIndex) => {
                                        const badge = getTypeBadge(item.type);
                                        return (
                                            <div key={iIndex} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-white text-slate-700 text-xs font-bold px-2 py-1.5 rounded-lg shadow-sm w-12 text-center shrink-0">
                                                        {badge.code}
                                                    </span>
                                                    <span className="text-sm font-semibold text-slate-700 truncate max-w-[140px] md:max-w-xs" title={badge.label}>
                                                        {badge.label}
                                                    </span>
                                                </div>
                                                <div className="text-slate-600 text-sm font-medium whitespace-nowrap">
                                                    Que : 1
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {onShowAll && (
                <div className="mt-4 flex justify-center pb-2">
                    <button
                        onClick={onShowAll}
                        className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-all"
                    >
                        <div className="p-1.5 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                            <History size={16} />
                        </div>
                        Show Complete History
                    </button>
                </div>
            )}
        </div>
    );
};

export default PracticedHistory;
