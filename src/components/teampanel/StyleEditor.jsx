import React, { useState } from 'react';
import { Settings, X, Palette, Type } from 'lucide-react';

const StyleEditor = ({ customization, setCustomization }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('header');

    const sections = [
        { id: 'header', label: 'Header' },
        { id: 'attendance', label: 'Attendance' },
        { id: 'problem', label: 'Problem Statement' },
        { id: 'updates', label: 'Updates' },
    ];

    const fonts = [
        { id: 'inherit', label: 'Default' },
        { id: 'serif', label: 'Serif' },
        { id: 'monospace', label: 'Monospace' },
        { id: 'cursive', label: 'Handwritten' },
    ];

    const handleStyleChange = (property, value) => {
        setCustomization(prev => ({
            ...prev,
            [activeSection]: {
                ...prev[activeSection],
                [property]: value
            }
        }));
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50 cursor-pointer"
            >
                <Settings className="w-6 h-6" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-blue-600" />
                    Customize Theme
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4 space-y-6">
                {/* Section Selector */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Section</label>
                    <div className="grid grid-cols-2 gap-2">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${activeSection === section.id
                                        ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {section.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color Pickers */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Background Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={customization[activeSection]?.backgroundColor || '#ffffff'}
                                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                            />
                            <span className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                {customization[activeSection]?.backgroundColor || '#ffffff'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Text Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={customization[activeSection]?.color || '#111827'}
                                onChange={(e) => handleStyleChange('color', e.target.value)}
                                className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                            />
                            <span className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                {customization[activeSection]?.color || '#111827'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Font Selector */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block flex items-center gap-2">
                        <Type className="w-3 h-3" />
                        Font Family
                    </label>
                    <select
                        value={customization[activeSection]?.font || 'inherit'}
                        onChange={(e) => handleStyleChange('font', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                        {fonts.map(font => (
                            <option key={font.id} value={font.id}>{font.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default StyleEditor;
