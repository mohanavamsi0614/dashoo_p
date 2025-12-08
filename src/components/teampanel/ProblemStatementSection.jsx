import React from 'react';
import { FileText } from 'lucide-react';

const ProblemStatementSection = ({ styles }) => {
    const { backgroundColor, color, font } = styles || {};

    return (
        <div
            className="rounded-2xl border border-gray-800 p-6 mb-8 transition-all"
            style={{
                backgroundColor: backgroundColor || '#000000',
                color: color || '#ffffff',
                fontFamily: font || 'inherit'
            }}
        >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
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

