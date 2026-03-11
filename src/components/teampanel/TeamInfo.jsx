import React from "react";

const TeamInfo = ({ team, eventId }) => {
    return (
        <div className="bg-white border-4 border-black p-6 sm:p-8 h-full shadow-[8px_8px_0_0_#000] text-black">
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3 border-b-4 border-black pb-4">
                <span className="w-4 h-4 bg-[#7a6cf0] border-2 border-black inline-block"></span>
                Team Info
            </h1>

            <div className="mb-10">
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2 bg-black text-white inline-block px-2 py-1">
                    Team Name
                </h2>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 ml-2 break-all">
                    {team.teamName}
                </h2>
                
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2 bg-black text-white inline-block px-2 py-1">
                    Team Lead
                </h2>
                <div className="flex items-center gap-4 p-4 mt-2 bg-[#f4efe6] border-4 border-black shadow-[4px_4px_0_0_#000]">
                    <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-[#c3cfa1] border-4 border-black text-black font-black text-3xl uppercase">
                        {team?.lead?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="font-black uppercase tracking-widest text-lg truncate">{team?.lead?.name}</p>
                        <p className="font-serif italic text-sm truncate">{team?.lead?.email}</p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-4 bg-black text-white inline-block px-2 py-1">
                    Team Members
                </h2>

                <div className="space-y-4 mt-2">
                    {team?.members?.map((member, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 p-4 bg-white border-4 border-black hover:-translate-y-1 transition-transform shadow-[4px_4px_0_0_#000]"
                        >
                            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-gray-200 border-2 border-black text-black font-black text-xl uppercase">
                                {member.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold uppercase tracking-widest truncate">{member.name}</p>
                                <p className="font-serif italic text-xs truncate">{member.email}</p>
                            </div>
                        </div>
                    ))}

                    {(!team?.members || team.members.length === 0) && (
                        <p className="font-serif italic p-4 border-2 border-dashed border-black text-center">
                            No members added yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamInfo;
