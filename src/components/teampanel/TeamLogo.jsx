import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import StylePopup from './StylePopup';

const TeamLogo = ({ team, styles }) => {
    const [customStyle, setCustomStyle] = useState({
        backgroundColor: styles?.backgroundColor || '#000000',
        color: styles?.color || '#ffffff'
    });

    const handleStyleUpdate = (key, value) => {
        setCustomStyle(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div
            className="flex flex-col items-center justify-center p-8 rounded-2xl border border-gray-800 h-full transition-all relative group"
            style={{
                backgroundColor: customStyle.backgroundColor,
                color: customStyle.color
            }}
        >
            <StylePopup currentStyles={customStyle} onUpdate={handleStyleUpdate} />
            <div className="w-48 h-48 bg-gray-900 rounded-full flex items-center justify-center text-blue-500 mb-6 shadow-2xl border-4 border-gray-800 relative overflow-hidden group">
                {team?.logo ? (
                    <img src={team.logo} alt="Team Logo" className="w-full h-full object-cover rounded-full" />
                ) : (
                    <div className="flex flex-col items-center gap-3 z-10">
                        <Shield className="w-20 h-20 opacity-30 group-hover:opacity-50 transition-opacity text-gray-400" />
                        <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-full transition-all shadow-lg shadow-blue-900/20 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 cursor-pointer">
                            Upload Logo
                        </button>
                    </div>
                )}
                <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-200 tracking-wide">Team Logo</h3>
        </div>
    );
};

export default TeamLogo;
