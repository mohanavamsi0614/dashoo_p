import React from 'react';
import { Shield } from 'lucide-react';

const TeamHeader = ({ team, styles }) => {
    const { backgroundColor, color, font } = styles || {};

    return (
        <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 transition-all"
            style={{
                backgroundColor: backgroundColor || '#ffffff',
                color: color || '#111827',
                fontFamily: font || 'inherit'
            }}
        >
            {/* Left: Team Logo */}
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50/50 rounded-xl border border-gray-100/50">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 shadow-inner">
                    {team?.logo ? (
                        <img src={team.logo} alt="Team Logo" className="w-full h-full object-cover rounded-full" />
                    ) : (
                        <Shield className="w-12 h-12" />
                    )}
                </div>
                <h3 className="text-lg font-semibold opacity-80">Team Logo</h3>
            </div>

            {/* Right: Team Info */}
            <div className="flex flex-col justify-center space-y-4">
                <div>
                    <h2 className="text-3xl font-bold mb-1">{team?.lead?.name || "Team Name"}</h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Team Lead
                    </span>
                </div>

                <div className="space-y-2 opacity-90">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Email:</span>
                        <span>{team?.lead?.email || "No email provided"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Members:</span>
                        <span>{team?.members?.length || 0} Members</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Team ID:</span>
                        <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-sm">{team?._id?.slice(-6) || "N/A"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamHeader;
