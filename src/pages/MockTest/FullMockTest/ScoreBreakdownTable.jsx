import React from 'react';

const ScoreBreakdownTable = ({ result }) => {
    if (!result) return null;

    // 1. Flatten all answers from all sections
    const allSections = [
        { name: 'Speaking', data: result.speaking },
        { name: 'Writing', data: result.writing },
        { name: 'Reading', data: result.reading },
        { name: 'Listening', data: result.listening }
    ];

    // 2. Aggregate Data by Question Type
    // Map: Type -> { section, totalScore, totalMaxScore }
    const typeAggregates = {};

    allSections.forEach(section => {
        if (section.data && section.data.answers) {
            section.data.answers.forEach(ans => {
                // Normalize type names for display (e.g. READ_ALOUD -> Read Aloud or RA)
                const typeCode = getShortCode(ans.type);

                if (!typeAggregates[typeCode]) {
                    typeAggregates[typeCode] = {
                        section: section.name,
                        item: typeCode,
                        details: getCleanName(ans.type),
                        myScore: 0,
                        maxScore: 0
                    };
                }
                typeAggregates[typeCode].myScore += (ans.score || 0);
                typeAggregates[typeCode].maxScore += (ans.maxScore || 0);
            });
        }
    });

    // 3. Convert to Array and Calculate Metrics
    const rows = Object.values(typeAggregates).map(item => {
        const contribute = item.maxScore > 0 ? (item.myScore / item.maxScore) * 100 : 0;

        let status = 'Average';
        if (contribute >= 90.0) status = 'Excellent';
        else if (contribute >= 70.0) status = 'Good';

        return {
            ...item,
            contribute: contribute,
            target: 90.0,
            status: status
        };
    });

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-8">
            <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Detailed Score Breakdown</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-sm text-gray-500 border-b border-gray-100">
                            <th className="px-8 py-4 font-bold">Section</th>
                            <th className="px-8 py-4 font-bold">Item</th>
                            <th className="px-8 py-4 font-bold">Contribute</th>
                            <th className="px-8 py-4 font-bold">My Correctness</th>
                            <th className="px-8 py-4 font-bold">Target</th>
                            <th className="px-8 py-4 font-bold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                                <td className="px-8 py-4">{row.section}</td>
                                <td className="px-8 py-4 font-medium">{row.item}</td>
                                <td className="px-8 py-4">{row.contribute.toFixed(1)}%</td>
                                <td className="px-8 py-4">{row.contribute.toFixed(1)}%</td>
                                <td className="px-8 py-4 text-gray-400">{row.target.toFixed(1)}%</td>
                                <td className="px-8 py-4">
                                    <span className={`px-3 py-1 rounded text-xs font-bold text-white ${row.status === 'Excellent' ? 'bg-emerald-500' :
                                            row.status === 'Good' ? 'bg-yellow-500' :
                                                'bg-rose-500'
                                        }`}>
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}

                        {/* Comparison Row */}
                        <tr className="bg-gray-50 font-bold border-t border-gray-200">
                            <td className="px-8 py-4" colSpan="2">Total Average</td>
                            <td className="px-8 py-4">
                                {rows.length > 0 ? (rows.reduce((a, b) => a + b.contribute, 0) / rows.length).toFixed(1) : 0}%
                            </td>
                            <td className="px-8 py-4"></td>
                            <td className="px-8 py-4"></td>
                            <td className="px-8 py-4"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- HELPERS ---

const getShortCode = (type) => {
    const map = {
        'READ_ALOUD': 'RA',
        'REPEAT_SENTENCE': 'RS',
        'DESCRIBE_IMAGE': 'DI',
        'RE_TELL_LECTURE': 'RL',
        'ANSWER_SHORT_QUESTION': 'ASQ',
        'SUMMARIZE_WRITTEN_TEXT': 'SWT',
        'WRITE_ESSAY': 'WE', 'ESSAY': 'WE',
        'READING_FIB_DROPDOWN': 'R-FIB', 'FIB_R': 'R-FIB',
        'READING_FIB_DRAGBOX': 'R-FIB-RW', 'FIB_RW': 'R-FIB-RW',
        'MULTIPLE_CHOICE_MULTIPLE': 'MCQ-M', 'MCM': 'MCQ-M',
        'RE_ORDER_PARAGRAPHS': 'RO',
        'MULTIPLE_CHOICE_SINGLE': 'MCQ-S', 'MCS': 'MCQ-S',
        'SUMMARIZE_SPOKEN_TEXT': 'SST', 'SST': 'SST',
        'LISTENING_FIB': 'L-FIB', 'FIB_L': 'L-FIB',
        'HIGHLIGHT_CORRECT_SUMMARY': 'HCS',
        'SELECT_MISSING_WORD': 'SMW',
        'HIGHLIGHT_INCORRECT_WORDS': 'HIW',
        'WRITE_FROM_DICTATION': 'WFD', 'WFD': 'WFD'
    };
    return map[type] || type;
};

const getCleanName = (type) => {
    return type.replace(/_/g, " ");
};

export default ScoreBreakdownTable;
