import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import StylePopup from './StylePopup';

const ProblemStatementSection = ({ styles, eventId }) => {
    const [customStyle, setCustomStyle] = useState({
        backgroundColor: styles?.backgroundColor || '#000000',
        color: styles?.color || '#ffffff',
        font: styles?.font || 'inherit',
        backgroundImage: styles?.backgroundImage || 'none',
    });

    const handleStyleUpdate = (key, value) => {
        // localStorage.setItem(`${eventId}-styles`, JSON.stringify({ ...styles, problemStatement: { ...styles.problemStatement, [key]: value } }));

        setCustomStyle(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div
            className="rounded-2xl border border-gray-800 p-6 mb-8 transition-all relative group"
            style={{
                backgroundColor: customStyle.backgroundColor,
                color: customStyle.color,
                fontFamily: customStyle.font,
                backgroundImage: customStyle.backgroundImage ? `url(${customStyle.backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',

            }}
        >
            <StylePopup currentStyles={customStyle} onUpdate={handleStyleUpdate} />

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 opacity-70" />
                Problem Statement
            </h2>
            <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 min-h-[150px] flex items-center justify-center text-center opacity-60 text-gray-400">
                <p>Problem statement details will appear here.</p>
            </div>
        </div>
    );
};

export default ProblemStatementSection;

