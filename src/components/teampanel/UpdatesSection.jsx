import React from 'react';

const UpdatesSection = ({ html }) => {
    return (
        <div className="bg-[#c3cfa1] border-4 border-black p-6 sm:p-8 mb-8 shadow-[8px_8px_0_0_#000] text-black transition-all">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3 border-b-4 border-black pb-4">
                <span className="w-4 h-4 bg-white border-2 border-black inline-block"></span>
                Updates & Announcements
            </h2>
            <div 
                className="bg-white border-4 border-black p-6 shadow-[4px_4px_0_0_#000] prose max-w-none text-black font-sans"
                dangerouslySetInnerHTML={{ __html: html }}
            >
            </div>
        </div>
    );
};

export default UpdatesSection;
