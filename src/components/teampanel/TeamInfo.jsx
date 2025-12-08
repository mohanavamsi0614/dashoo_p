import React from 'react';

const TeamInfo = ({ team, styles }) => {
    const { backgroundColor, color, font } = styles || {};

    return (
        <div
            className="rounded-2xl border border-gray-800 p-6 h-full transition-all"
            style={{
                backgroundColor: backgroundColor || '#000000',
                color: color || '#ffffff',
                fontFamily: font || 'inherit'
            }}
        >
            <h1 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-8 bg-blue-600 rounded-full"></span>
                Team Info
            </h1>

            <div className="mb-8">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 ml-1">Team Lead</h2>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/30 border border-gray-800 hover:border-gray-700 transition-all group">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
                        {team?.lead?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-white text-lg">{team?.lead?.name}</p>
                        <p className="text-sm text-gray-400">{team?.lead?.email}</p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 ml-1">Team Members</h2>
                <div className="space-y-3">
                    {team?.members?.map((member, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-900/50 border border-transparent hover:border-gray-800 transition-all group">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 text-gray-300 font-medium group-hover:bg-indigo-900/50 group-hover:text-indigo-300 transition-colors">
                                {member.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-medium text-gray-200 group-hover:text-white transition-colors">{member.name}</p>
                                <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{member.email}</p>
                            </div>
                        </div>
                    ))}
                    {(!team?.members || team.members.length === 0) && (
                        <p className="text-gray-500 text-sm italic pl-2">No members added yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamInfo;
