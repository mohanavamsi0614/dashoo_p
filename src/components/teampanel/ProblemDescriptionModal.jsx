import React from 'react';
import Markdown from 'react-markdown';

const ProblemDescriptionModal = ({ isOpen, onClose, problemStatement, onSelectPS, isSubmitting }) => {
    if (!isOpen || !problemStatement) return null;

    return (
        <div className="fixed inset-0 bg-[#f4efe6]/90 flex items-center justify-center z-50 p-4 font-sans text-black">
            <div
                className="bg-white p-6 sm:p-10 border-4 border-black shadow-[12px_12px_0_0_#000] w-full max-w-3xl max-h-[85vh] overflow-y-auto flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6 border-b-4 border-black pb-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#c3cfa1] border-2 border-black flex items-center justify-center font-black text-2xl">
                            !
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter leading-tight mt-1">
                            {problemStatement.title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-black font-black text-3xl hover:text-red-500 transition-colors cursor-pointer"
                    >
                        X
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="prose max-w-none text-black font-sans">
                        <Markdown>{problemStatement.description}</Markdown>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4 pt-6 border-t-4 border-black shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-white text-black font-black border-2 border-black uppercase tracking-widest shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-sm cursor-pointer"
                        disabled={isSubmitting}
                    >
                        {onSelectPS ? 'Cancel' : 'Close'}
                    </button>
                    {onSelectPS && (
                        <button
                            onClick={() => onSelectPS(problemStatement)}
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-[#7a6cf0] hover:bg-black text-white font-black border-2 border-black uppercase tracking-widest shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 cursor-pointer"
                        >
                            {isSubmitting ? "Selecting..." : "Select Problem Statement"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProblemDescriptionModal;
