import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';

const StylePopup = ({ currentStyles, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Local state to manage edits before finding them
    // or we can just directly call onUpdate for immediate feedback.
    // Let's use direct updates for "live" feel as per previous TeamInfo implementation.

    const handleChange = (key, value) => {
        onUpdate(key, value);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="absolute top-4 right-4 p-2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg backdrop-blur-sm z-10"
                title="Edit Style"
            >
                <Settings className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-xl w-full max-w-sm animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Customize Style</h2>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Background Color */}
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-400">Background Color</label>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="color"
                                    value={currentStyles.backgroundColor || '#000000'}
                                    onChange={(e) => handleChange("backgroundColor", e.target.value)}
                                    className="w-12 h-10 rounded cursor-pointer bg-transparent border-none p-0"
                                />
                                <span className="text-sm text-gray-500 font-mono uppercase">{currentStyles.backgroundColor}</span>
                            </div>
                        </div>

                        {/* Text Color */}
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-400">Text Color</label>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="color"
                                    value={currentStyles.color || '#ffffff'}
                                    onChange={(e) => handleChange("color", e.target.value)}
                                    className="w-12 h-10 rounded cursor-pointer bg-transparent border-none p-0"
                                />
                                <span className="text-sm text-gray-500 font-mono uppercase">{currentStyles.color}</span>
                            </div>
                        </div>

                        {/* Font Family Selector */}
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-400">Font Family</label>
                            <select
                                value={currentStyles.font || 'Inter'}
                                onChange={(e) => handleChange("font", e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="Inter">Inter</option>
                                <option value="Poppins">Poppins</option>
                                <option value="Roboto">Roboto</option>
                                <option value="Montserrat">Montserrat</option>
                                <option value="Nunito">Nunito</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StylePopup;
