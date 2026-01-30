import React from 'react';
import { X, FileText, CheckCircle, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';

const ProblemDescriptionModal = ({ isOpen, onClose, problemStatement, onSelectPS, isSubmitting }) => {
    if (!isOpen || !problemStatement) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div
                className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6 border-b border-gray-800 pb-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white leading-tight">
                            {problemStatement.title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="prose prose-invert prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300 max-w-none">
                        <Markdown>{problemStatement.description}</Markdown>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-800 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white font-medium rounded-xl transition-colors"
                        disabled={isSubmitting}
                    >
                        {onSelectPS ? 'Cancel' : 'Close'}
                    </button>
                    {onSelectPS && (
                        <button
                            onClick={() => onSelectPS(problemStatement)}
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Selecting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Select Problem Statement
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProblemDescriptionModal;
