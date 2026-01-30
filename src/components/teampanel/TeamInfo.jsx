import React, { useState, useEffect } from "react";
import StylePopup from "./StylePopup";

const TeamInfo = ({ team, styles, eventId }) => {
    const [customStyle, setCustomStyle] = useState({
        backgroundColor: styles?.backgroundColor || "#000000",
        color: styles?.color || "#ffffff",
        font: styles?.font || "Inter",
    });

    const handleStyleUpdate = (key, value) => {
        setCustomStyle((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div
            className="rounded-2xl border border-gray-800 p-6 h-full transition-all relative group"
            style={{
                backgroundColor: customStyle.backgroundColor,
                color: customStyle.color,
                fontFamily: customStyle.font,
                backgroundImage: customStyle.backgroundImage ? `url(${customStyle.backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: "difference",

            }}
        >
            <StylePopup currentStyles={customStyle} onUpdate={handleStyleUpdate} />

            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-blue-600 rounded-full"></span>
                Team Info
            </h1>

            <div className="mb-8">
                <h2 className="text-xs font-semibold opacity-70 uppercase tracking-wider mb-4 ml-1">
                    Team Name
                </h2>
                <h2 className="text-xs font-semibold opacity-70 uppercase tracking-wider mb-4 ml-1">
                    {team?.teamName}
                </h2>
                <h2 className="text-xs font-semibold opacity-70 uppercase tracking-wider mb-4 ml-1">
                    Team Lead
                </h2>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/30 border border-gray-800">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-lg">
                        {team?.lead?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <p className="font-semibold text-lg">{team?.lead?.name}</p>
                        <p className="text-sm opacity-80">{team?.lead?.email}</p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xs font-semibold opacity-70 uppercase tracking-wider mb-4 ml-1">
                    Team Members
                </h2>

                <div className="space-y-3">
                    {team?.members?.map((member, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-gray-700 hover:bg-gray-900/40"
                        >
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 text-gray-300">
                                {member.name?.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-xs opacity-80">{member.email}</p>
                            </div>
                        </div>
                    ))}

                    {(!team?.members || team.members.length === 0) && (
                        <p className="text-gray-500 text-sm italic pl-2">
                            No members added yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamInfo;
