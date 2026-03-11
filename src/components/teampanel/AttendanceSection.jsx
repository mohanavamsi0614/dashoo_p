import React from 'react';

const AttendanceSection = ({ team, attd, currAttd, onMarkAttendance, eventId }) => {
    const allMembers = [
        { ...team?.lead, role: 'lead', isLead: true },
        ...(team?.members?.map(m => ({ ...m, role: 'member', isLead: false })) || [])
    ];

    return (
        <div className="bg-white border-4 border-black overflow-hidden mb-8 shadow-[8px_8px_0_0_#000] text-black">
            <div className="p-6 sm:p-8 border-b-4 border-black bg-[#f4efe6]">
                <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <span className="w-4 h-4 bg-black inline-block"></span>
                    Attendance Record
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="bg-[#c3cfa1] border-b-4 border-black">
                            <th className="p-4 font-black uppercase tracking-widest text-sm border-r-4 border-black w-[40%]">Member</th>
                            <th className="p-4 font-black uppercase tracking-widest text-sm border-r-4 border-black">Role</th>
                            {attd?.map((sessionId, idx) => (
                                <th key={idx} className="p-4 font-black uppercase tracking-widest text-sm text-center border-r-2 border-black last:border-r-0">
                                    S-{sessionId}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {allMembers.map((member, idx) => (
                            <tr key={idx} className="border-b-4 border-black hover:bg-[#f4efe6] transition-colors last:border-b-0">
                                <td className="p-4 border-r-4 border-black">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center font-black text-xl border-2 border-black ${member.isLead ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                            {member.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-bold uppercase tracking-widest text-sm sm:text-base break-all">{member.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 border-r-4 border-black">
                                    <span className={`text-xs px-2 py-1 font-black uppercase tracking-widest border-2 border-black inline-block ${member.isLead ? 'bg-[#7a6cf0] text-white' : 'bg-white text-black'}`}>
                                        {member.isLead ? 'Lead' : 'Member'}
                                    </span>
                                </td>
                                {attd?.map((sessionId, sIdx) => {
                                    const statusObj = member?.attd?.[sessionId];
                                    const isPresent = statusObj?.status === 'Present';
                                    const isVerifying = statusObj?.img && !statusObj?.status;
                                    const isOpen = currAttd === sessionId;

                                    return (
                                        <td key={sIdx} className="p-4 border-r-2 border-black last:border-r-0 text-center text-xs font-bold uppercase tracking-widest">
                                            {statusObj?.status ? (
                                                <div className={`inline-block px-2 py-1 border-2 border-black shadow-[2px_2px_0_0_#000] ${isPresent ? 'bg-[#c3cfa1] text-black' : 'bg-red-500 text-white'}`}>
                                                    {isPresent ? '✓ ' : '✗ '}
                                                    <span className="capitalize">{statusObj.status}</span>
                                                </div>
                                            ) : isVerifying ? (
                                                <div className="inline-block px-2 py-1 bg-yellow-400 border-2 border-black shadow-[2px_2px_0_0_#000] animate-pulse">
                                                    Verifying
                                                </div>
                                            ) : isOpen ? (
                                                <button
                                                    onClick={() => onMarkAttendance(member, sessionId)}
                                                    className="px-3 py-1 bg-black text-white hover:bg-[#7a6cf0] border-2 border-black shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer font-black text-xs"
                                                >
                                                    Mark
                                                </button>
                                            ) : (
                                                <span className="font-serif italic text-gray-500 normal-case">Closed</span>
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