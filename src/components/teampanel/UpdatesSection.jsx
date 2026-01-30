import { Bell } from 'lucide-react';
import { useState } from 'react';
import StylePopup from './StylePopup';

const UpdatesSection = ({ styles, html }) => {
    const [customStyle, setCustomStyle] = useState({
        backgroundColor: styles?.backgroundColor || '#000000',
        color: styles?.color || '#ffffff',
        font: styles?.font || 'inherit',
        backgroundImage: styles?.backgroundImage || 'none',
    });

    const handleStyleUpdate = (key, eventId, value) => {
        setCustomStyle(prev => ({ ...prev, updates: { ...prev.updates, [key]: value } }));
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
                <Bell className="w-5 h-5 opacity-70" />
                Updates & Announcements
            </h2>
            <div dangerouslySetInnerHTML={{ __html: html }}>
            </div>
        </div>
    );
};

export default UpdatesSection;

