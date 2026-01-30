import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import StylePopup from './StylePopup';
import ProblemDescriptionModal from './ProblemDescriptionModal';

const ProblemStatementSection = ({ styles, PS, eventId, team, onSelectPS, isSubmitting }) => {
    const [customStyle, setCustomStyle] = useState({
        backgroundColor: styles?.backgroundColor || '#000000',
        color: styles?.color || '#ffffff',
        font: styles?.font || 'inherit',
        backgroundImage: styles?.backgroundImage || 'none',
    });

    // State for modal
    const [selectedPS, setSelectedPS] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleStyleUpdate = (key, value) => {
        setCustomStyle(prev => ({ ...prev, [key]: value }));
    };

    const handlePSClick = (ps) => {
        setSelectedPS(ps);
        setIsModalOpen(true);
    };

    const handlePSSelect = async (ps) => {
        if (onSelectPS) {
            await onSelectPS(ps);
            setIsModalOpen(false); // Close modal after selection
        }
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

            {/* Modal Component */}
            <ProblemDescriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                problemStatement={selectedPS}
                onSelectPS={team?.PS ? null : handlePSSelect}
                isSubmitting={isSubmitting}
            />

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 opacity-70" />
                Problem Statement
            </h2>
            <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 min-h-[150px] flex items-center justify-center text-center opacity-60 text-gray-400">
                {team?.PS ? (
                    <div
                        onClick={() => handlePSClick(team.PS)}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <h3 className="text-lg font-semibold text-white">
                            {team.PS.title}
                        </h3>
                        <p className="text-sm text-gray-300">
                            {team.PS.description}
                        </p>
                        <div className="mt-2 text-xs text-blue-400">
                            Click to view full description
                        </div>
                    </div>
                ) : (
                    PS?.length ? (
                        <div className="w-full space-y-4">
                            {PS.map((ps, index) => (
                                <div
                                    key={index}
                                    onClick={() => handlePSClick(ps)}
                                    className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 cursor-pointer transition-all hover:scale-[1.01] text-left group/item"
                                >
                                    <h2 className="text-lg font-semibold text-white mb-1 group-hover/item:text-blue-400 transition-colors">
                                        {ps.title}
                                    </h2>
                                    <p className="text-sm text-gray-400 line-clamp-2">
                                        {ps.description}
                                    </p>
                                    <div className="mt-2 text-xs text-blue-400 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                        Click to view details
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No Problem Statement</p>
                    )
                )}
            </div>
        </div>
    );
};

export default ProblemStatementSection;
