import React, { useState } from 'react';
import ProblemDescriptionModal from './ProblemDescriptionModal';

const ProblemStatementSection = ({ PS, team, onSelectPS, isSubmitting }) => {
    const [selectedPS, setSelectedPS] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePSClick = (ps) => {
        setSelectedPS(ps);
        setIsModalOpen(true);
    };

    const handlePSSelect = async (ps) => {
        if (onSelectPS) {
            await onSelectPS(ps);
            setIsModalOpen(false); 
        }
    };

    return (
        <div className="bg-white border-4 border-black p-6 sm:p-8 mb-8 shadow-[8px_8px_0_0_#000] text-black transition-all">
            <ProblemDescriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                problemStatement={selectedPS}
                onSelectPS={team?.PS ? null : handlePSSelect}
                isSubmitting={isSubmitting}
            />

            <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3 border-b-4 border-black pb-4">
                <span className="w-4 h-4 bg-yellow-400 border-2 border-black inline-block"></span>
                Problem Statement
            </h2>
            
            <div className="p-6 bg-[#f4efe6] border-4 border-black min-h-[150px] flex items-center justify-center text-center shadow-[4px_4px_0_0_#000]">
                {team?.PS ? (
                    <div
                        onClick={() => handlePSClick(team.PS)}
                        className="cursor-pointer hover:-translate-y-1 transition-transform w-full bg-white border-4 border-black p-6 shadow-[4px_4px_0_0_#000]"
                    >
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-black mb-2">
                            {team.PS.title}
                        </h3>
                        <p className="font-serif italic text-sm text-gray-800 line-clamp-2">
                            {team.PS.description}
                        </p>
                        <div className="mt-4 inline-block px-3 py-1 bg-black text-white font-bold uppercase tracking-widest text-xs border-2 border-black">
                            Click to view full description
                        </div>
                    </div>
                ) : (
                    PS?.length ? (
                        <div className="w-full space-y-6">
                            {PS.map((ps, index) => (
                                <div
                                    key={index}
                                    onClick={() => handlePSClick(ps)}
                                    className="p-6 bg-white border-4 border-black hover:-translate-y-1 hover:shadow-none shadow-[6px_6px_0_0_#000] cursor-pointer transition-all text-left group"
                                >
                                    <h2 className="text-2xl font-black uppercase tracking-tighter text-black mb-2 group-hover:text-[#7a6cf0] transition-colors">
                                        {ps.title}
                                    </h2>
                                    <p className="font-serif italic text-sm text-gray-800 line-clamp-2">
                                        {ps.description}
                                    </p>
                                    <div className="mt-4 inline-block px-3 py-1 bg-black text-white font-bold uppercase tracking-widest text-xs border-2 border-black group-hover:bg-[#7a6cf0] transition-colors">
                                        Click to view details
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="font-black uppercase tracking-widest text-2xl text-gray-400">No Problem Statement</p>
                    )
                )}
            </div>
        </div>
    );
};

export default ProblemStatementSection;
