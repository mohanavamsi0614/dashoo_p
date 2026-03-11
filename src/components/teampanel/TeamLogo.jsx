import React, { useEffect, useRef, useState } from 'react';
import api from '@/lib/api';

const TeamLogo = ({ team, eventId }) => {
    const [img, setImg] = useState("")
    const wid = useRef()
    
    useEffect(() => {
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: "dfseckyjx",
                uploadPreset: "qbvu3y5j",
                multiple: false,
                folder: "payments",
            },
            (error, result) => {
                if (!error && result && result.event === "success") {
                    console.log("Uploaded", result.info);
                    api.post(`/participant/teamlogo/${eventId}/${localStorage.getItem(`${eventId}-pass`)}`, { logo: result.info.secure_url })
                    setImg(result.info.secure_url)
                } else if (error) {
                    console.error("Cloudinary error:", error);
                    alert("Error uploading image!");
                }
            }
        );
        wid.current = widget;
    }, [])
    
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-[#c3cfa1] border-4 border-black h-full shadow-[8px_8px_0_0_#000] relative group text-black">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 border-b-4 border-black pb-2 w-full text-center">
                Team Logo
            </h3>
            
            <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white flex items-center justify-center mb-8 border-4 border-black shadow-[8px_8px_0_0_#000] relative overflow-hidden group">
                {img || team?.logo ? (
                    <img src={img || team.logo} alt="Team Logo" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500" />
                ) : (
                    <div className="flex flex-col items-center gap-3 z-10 w-full h-full justify-center">
                        <span className="text-6xl sm:text-8xl opacity-30 group-hover:opacity-100 transition-opacity text-black font-black">?</span>
                    </div>
                )}
            </div>
            
            <button 
                onClick={() => wid.current.open()} 
                className='px-6 py-3 bg-black text-white hover:bg-[#7a6cf0] font-black uppercase tracking-widest text-sm border-2 border-black transition-all shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer'
            >
                {img || team?.logo ? "Re-Upload Logo" : "Upload Logo"}
            </button>
        </div>
    );
};

export default TeamLogo;
