import { Link, useLocation, useNavigate, useParams } from "react-router";
import api from "../lib/api";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer";
import socket from "../lib/socket";

function Event() {
  const { eventID } = useParams();
  const loc = useLocation();
  const [state, setState] = useState(loc.state || null);
  const [open, setopen] = useState(state?.status == "open")
  const nav = useNavigate();
  const [alredyReg, setAlreg] = useState()
  const [selectedImage, setSelectedImage] = useState(null); // State for Gallery Popup

  useEffect(() => {
    if (!state) {
      api
        .get(`/participant/eventdata/${eventID}`, {
          headers: {
            authorization: localStorage.getItem("token")
          }
        })
        .then((res) => {
          setState(res.data);
          setAlreg(res.data.alredyReg)
          setopen(res.data.status == "open")
          socket.emit("join", res.data._id);
        })
        .catch((err) => console.error(err));
    }
    if (state) {
      socket.emit("join", state._id);
    }
    window.scrollTo(0, 0);
  }, [eventID, state]);

  socket.on("eventOpen", (data) => {
    setopen(true)
    setState({ ...state, status: "open" })
  })
  socket.on("eventClosed", (data) => {
    setopen(false)
    setState({ ...state, status: "closed" })
  })

  return (
    <div className="bg-[#f4efe6] min-h-screen font-sans text-black pt-28">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-6">
          <BackButton />
        </div>

        {/* BRUTALIST HERO SPLIT */}
        <div className="grid md:grid-cols-2 gap-8 border-b-[3px] border-black pb-12 mb-12">
          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-6">
               <span className="inline-block px-4 py-2 text-xs font-black uppercase tracking-widest border-[3px] border-black bg-[#c3cfa1] shadow-[4px_4px_0_0_#000]">
                 {state?.type === "hackathon" ? "HACKATHON" : "EVENT"}
               </span>
               <span className="inline-block px-4 py-2 text-xs font-black uppercase tracking-widest border-[3px] border-black bg-black text-white shadow-[4px_4px_0_0_#000]">
                 {state?.status === "open" ? "OPEN" : "CLOSED"}
               </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-[7xl] font-black uppercase tracking-tighter leading-[0.85] mb-8 lg:pr-4">
              {state?.eventTitle || "Loading..."}
            </h1>
            
            {state?.theme && (
              <div className="bg-[#f4efe6] border-[3px] border-black p-4 inline-block shadow-[4px_4px_0_0_#000]">
                 <p className="font-serif italic text-xl md:text-2xl text-black m-0">
                   Theme: <span className="font-black not-italic">{state.theme}</span>
                 </p>
              </div>
            )}
          </div>
          
          <div className="relative border-[4px] border-black shadow-[12px_12px_0_0_#000] bg-white h-[400px] md:h-[500px]">
            <img
              src={state?.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"}
              alt={state?.eventTitle || "Event"}
              className="w-full h-full object-cover"
            />
            {state?.logoUrl && (
              <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white border-[4px] border-black p-2 shadow-[8px_8px_0_0_#000] flex items-center justify-center">
                <img
                  src={state.logoUrl}
                  alt="Logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-16">

            {/* About Section */}
            <section className="bg-white border-[3px] border-black p-8 shadow-[8px_8px_0_0_#000]">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter border-b-[3px] border-black pb-4 mb-6">
                About the Event
              </h2>
              <div className="font-serif text-lg md:text-xl leading-relaxed text-black whitespace-pre-wrap">
                {state?.description || "No description provided."}
              </div>
            </section>

            {/* Tracks Section */}
            {state?.tracks && state.tracks.length > 0 && (
              <section className="bg-[#c3cfa1] border-[3px] border-black p-8 shadow-[8px_8px_0_0_#000]">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 border-b-[3px] border-black pb-4">
                  Tracks
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {state.tracks.map((track, index) => (
                    <div key={index} className="bg-white border-[3px] border-black p-6 shadow-[4px_4px_0_0_#000]">
                      <h3 className="font-mono font-bold uppercase text-xs mb-2 tracking-widest text-[#7a6cf0]">Track 0{index + 1}</h3>
                      <p className="font-serif italic text-xl font-bold">{track}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Prizes Section */}
            {state?.prize && (
              <section className="bg-black text-white border-[3px] border-black p-8 shadow-[8px_8px_0_0_#c3cfa1]">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 border-b-[3px] border-white pb-4">
                  Prizes
                </h2>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 shrink-0 bg-[#c3cfa1] border-[3px] border-white flex items-center justify-center font-black text-3xl text-black">
                     🏆
                  </div>
                  <p className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#c3cfa1]">
                    {state.prize}
                  </p>
                </div>
              </section>
            )}

            {/* Gallery Section */}
            {(state?.photo1Url || state?.photo2Url) && (
              <section className="bg-white border-[3px] border-black p-8 shadow-[8px_8px_0_0_#000]">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter border-b-[3px] border-black pb-4 mb-8">
                  Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {state?.photo1Url && (
                    <div 
                      className="border-[4px] border-black bg-[#f4efe6] p-2 shadow-[8px_8px_0_0_#000] hover:-translate-y-2 hover:shadow-[12px_12px_0_0_#000] hover:-rotate-2 transition-all cursor-pointer"
                      onClick={() => setSelectedImage(state.photo1Url)}
                    >
                      <img
                        src={state.photo1Url}
                        alt="Event Highlight 1"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}
                  {state?.photo2Url && (
                    <div 
                      className="border-[4px] border-black bg-[#f4efe6] p-2 shadow-[8px_8px_0_0_#000] hover:-translate-y-2 hover:shadow-[12px_12px_0_0_#000] hover:rotate-2 transition-all cursor-pointer"
                      onClick={() => setSelectedImage(state.photo2Url)}
                    >
                      <img
                        src={state.photo2Url}
                        alt="Event Highlight 2"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-8 relative">
            <div className="sticky top-28 space-y-8">

               {/* Stats Card */}
               <div className="bg-black text-white p-8 rounded-2xl">
                  <h3 className="uppercase font-bold tracking-widest text-xs text-gray-400 mb-8 border-b border-gray-700 pb-2">Event Registration</h3>
                  
                  <div className="mb-6">
                    <p className="text-xs uppercase font-bold tracking-widest text-[#c3cfa1]">Fee</p>
                    <p className="text-6xl font-black uppercase tracking-tighter">
                      {state?.cost === "0" || !state?.cost ? "FREE" : `₹${state?.cost}`}
                    </p>
                  </div>

                  <div className="mb-8 p-4 bg-white/10 rounded-xl">
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-xs font-bold uppercase tracking-widest">Spots</span>
                       <span className="font-serif italic text-lg">{state?.count || 0} / {state?.maxTeams || state?.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2">
                       <div 
                         className="bg-[#c3cfa1] h-full"
                         style={{ width: `${Math.min(((state?.count || 0) / ((state?.maxTeams || state?.capacity) || 100)) * 100, 100)}%` }}
                       ></div>
                    </div>
                  </div>

                  <div>
                     {alredyReg ? (
                        <div className="space-y-4">
                           <div className="bg-[#c3cfa1] text-black font-bold uppercase tracking-widest text-sm text-center py-4 rounded-full">
                             ✓ Registered
                           </div>
                           {!alredyReg.payment?.payment && (
                             <button
                               onClick={() => nav("/payment")}
                               className="w-full bg-[#7a6cf0] text-white font-bold uppercase tracking-widest text-sm py-4 rounded-full border border-black hover:bg-white hover:text-black transition-colors"
                             >
                               Pay Now
                             </button>
                           )}
                        </div>
                     ) : open ? (
                        <div className="flex flex-col gap-4">
                           <button
                             onClick={() => nav("/reg/" + state?.eventId, { state })}
                             className="w-full bg-[#7a6cf0] text-white font-bold uppercase tracking-widest text-sm py-4 rounded-full hover:bg-white hover:text-black transition-colors"
                           >
                             {state?.type === "hackathon" ? "Create Team" : "Register Now"}
                           </button>
                           {state?.type === "hackathon" && (
                             <button
                               onClick={() => nav("/jointeam/" + state?.eventId, { state })}
                               className="w-full bg-transparent border border-white text-white font-bold uppercase tracking-widest text-sm py-4 rounded-full hover:bg-white hover:text-black transition-colors"
                             >
                               Join Team
                             </button>
                           )}
                        </div>
                     ) : (
                        <button disabled className="w-full bg-gray-800 text-gray-500 font-bold uppercase tracking-widest text-sm py-4 rounded-full cursor-not-allowed">
                          Closed
                        </button>
                     )}
                  </div>
               </div>

               {/* Info List - Highly visible brutalist blocks */}
               <div className="w-full flex flex-col gap-6">
                  {/* VENUE BLOCK */}
                  <div className="border-[4px] border-black bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#000]">
                     <h3 className="font-mono font-bold text-sm tracking-widest text-[#7a6cf0] uppercase mb-4 border-b-[2px] border-dashed border-black pb-2">Location</h3>
                     <p className="font-black text-3xl md:text-4xl uppercase tracking-tighter leading-none break-words">
                       {state?.venue || "TBA"}
                     </p>
                  </div>

                  {/* DATE & TIME BLOCK */}
                  <div className="grid grid-cols-2 gap-6">
                     <div className="border-[4px] border-black bg-[#c3cfa1] p-6 shadow-[8px_8px_0_0_#000]">
                        <h3 className="font-mono font-bold text-xs tracking-widest text-black uppercase mb-3">Date</h3>
                        <p className="font-black text-2xl uppercase tracking-tighter leading-tight">
                           {state?.startDate} <br/>
                           {state?.endDate && state.endDate !== state.startDate && <span className="opacity-70 text-xl">{state?.endDate}</span>}
                        </p>
                     </div>
                     <div className="border-[4px] border-black bg-[#f4efe6] p-6 shadow-[8px_8px_0_0_#000]">
                        <h3 className="font-mono font-bold text-xs tracking-widest text-black uppercase mb-3">Time</h3>
                        <p className="font-black text-2xl uppercase tracking-tighter leading-tight">
                           {state?.startTime || "TBA"}
                        </p>
                     </div>
                  </div>

                  {/* META BLOCK */}
                  <div className="border-[4px] border-black bg-white p-6 shadow-[8px_8px_0_0_#000] flex flex-col gap-6">
                     <div className="flex justify-between items-end border-b-[2px] border-black pb-4">
                        <span className="font-mono font-bold text-xs tracking-widest uppercase">Team Size</span>
                        <span className="font-black text-2xl uppercase">{state?.minTeamMembers}-{state?.maxTeamMembers}</span>
                     </div>
                     <div className="flex justify-between items-end">
                        <span className="font-mono font-bold text-xs tracking-widest uppercase text-red-600">Event Deadline</span>
                        <span className="font-black text-xl uppercase text-red-600">{state?.registrationDeadline || "TBA"}</span>
                     </div>
                  </div>
               </div>

               {/* Organizer Card */}
               {state?.by && (
                 <div className="bg-[#c3cfa1] border border-black p-6 shadow-[6px_6px_0_0_#000]">
                    <h3 className="uppercase tracking-widest text-xs font-bold mb-4">Organized By</h3>
                    <div className="flex items-center gap-4 mb-4">
                      {state.by.imgUrl && (
                        <div className="w-12 h-12 border border-black bg-white flex-shrink-0">
                          <img src={state.by.imgUrl} alt={state.by.orgName} className="w-full h-full object-cover filter grayscale" />
                        </div>
                      )}
                      <div>
                        <p className="font-black uppercase tracking-tighter text-xl">{state.by.orgName}</p>
                        {state.by.website && <a href={state.by.website} target="_blank" rel="noopener noreferrer" className="font-serif italic text-sm hover:underline">Website</a>}
                      </div>
                    </div>
                    <div className="text-xs font-bold tracking-widest space-y-1">
                      {state.by.email && <p>✉ {state.by.email}</p>}
                      {state.by.contactPhone && <p>☏ {state.by.contactPhone}</p>}
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* GALLERY POPUP MODAL */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative w-full max-w-5xl max-h-[90vh] border-[4px] border-black bg-[#f4efe6] p-2 sm:p-4 shadow-[16px_16px_0_0_#000]"
            onClick={(e) => e.stopPropagation()} // Prevent close on clicking the image box
          >
            <button 
              className="absolute -top-6 -right-6 w-12 h-12 bg-white border-[3px] border-black text-black text-2xl font-black rounded-full shadow-[4px_4px_0_0_#000] hover:bg-black hover:text-white transition-colors flex items-center justify-center z-[10] leading-none"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img 
              src={selectedImage} 
              alt="Gallery Fullscreen" 
              className="w-full h-full max-h-[80vh] object-contain border-[3px] border-black bg-black"
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default Event;