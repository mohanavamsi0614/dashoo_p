import React from 'react';
import { Check, Loader2, Camera, X } from 'lucide-react';

const AttendanceSection = ({ team, attd, currAttd, onMarkAttendance, styles }) => {
    const { backgroundColor, color, font } = styles || {};

    // Combine lead and members into a single list for the table
    const allMembers = [
        { ...team?.lead, role: 'lead', isLead: true },
        ...(team?.members?.map(m => ({ ...m, role: 'member', isLead: false })) || [])
    ];

    return (
        <div
            className="rounded-2xl border border-gray-800 overflow-hidden mb-8 transition-all"
            style={{
                backgroundColor: backgroundColor || '#000000',
                color: color || '#ffffff',
                fontFamily: font || 'inherit'
            }}
        >
            <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    Attendance Record
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-900/50 border-b border-gray-800">
                            <th className="p-4 font-semibold text-sm opacity-80 min-w-[200px] text-gray-300">Member</th>
                            <th className="p-4 font-semibold text-sm opacity-80 text-gray-300">Role</th>
                            {attd?.map((sessionId, idx) => (
                                <th key={idx} className="p-4 font-semibold text-sm opacity-80 min-w-[150px] text-gray-300">
                                    Session {sessionId}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {allMembers.map((member, idx) => (
                            <tr key={idx} className="border-b border-gray-800 hover:bg-gray-900/30 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${member.isLead ? 'bg-blue-900/50 text-blue-400' : 'bg-indigo-900/50 text-indigo-400'}`}>
                                            {member.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-gray-200">{member.name}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${member.isLead ? 'bg-blue-900/30 text-blue-300 border border-blue-800' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}>
                                        {member.isLead ? 'Team Lead' : 'Member'}
                                    </span>
                                </td>
                                {attd?.map((sessionId, sIdx) => {
                                    const statusObj = member?.attd?.[sessionId];
                                    const isPresent = statusObj?.status === 'Present';
                                    const isVerifying = statusObj?.img && !statusObj?.status;
                                    const isOpen = currAttd === sessionId;

                                    return (
                                        <td key={sIdx} className="p-4">
                                            {statusObj?.status ? (
                                                <div className={`flex items-center gap-1.5 text-sm font-medium ${isPresent ? 'text-green-400' : 'text-red-400'}`}>
                                                    {isPresent ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                                    <span className="capitalize">{statusObj.status}</span>
                                                </div>
                                            ) : isVerifying ? (
                                                <div className="flex items-center gap-1.5 text-amber-400 text-sm font-medium">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Verifying</span>
                                                </div>
                                            ) : isOpen ? (
                                                <button
                                                    onClick={() => onMarkAttendance(member, sessionId)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 border border-gray-700 hover:border-blue-500 hover:text-blue-400 text-gray-400 rounded-lg text-sm transition-all shadow-sm cursor-pointer"
                                                >
                                                    <Camera className="w-3.5 h-3.5" />
                                                    <span>Mark</span>
                                                </button>
                                            ) : (
                                                <span className="text-gray-600 text-sm italic">Closed</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceSection;

