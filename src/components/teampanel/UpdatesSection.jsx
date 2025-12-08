import React from 'react';
import { Bell } from 'lucide-react';

const UpdatesSection = ({ styles }) => {
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
                <Bell className="w-5 h-5 opacity-70" />
                Updates & Announcements
            </h2>
            <div className="space-y-4">
                {[1, 2].map((_, idx) => (
                    <div key={idx} className="p-4 bg-blue-900/20 rounded-xl border border-blue-900/30 flex gap-4">
                        <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0" />
                        <div>
                            <h4 className="font-semibold text-sm mb-1 text-gray-200">Update Title {idx + 1}</h4>
                            <p className="text-sm opacity-70 text-gray-400">This is a placeholder for team updates and announcements.</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpdatesSection;

