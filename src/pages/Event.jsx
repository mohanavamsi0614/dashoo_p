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
        <div className="grid md:grid-cols-2 gap-8 border-b border-black pb-12 mb-12">
          <div>
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-widest border border-black bg-[#c3cfa1]">
              {state?.type === "hackathon" ? "HACKATHON" : "EVENT"}
            </span>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-6">
              {state?.eventTitle || "Loading..."}
            </h1>
            
            {state?.theme && (
              <p className="font-serif italic text-2xl text-gray-800 border-l-[4px] border-black pl-4">
                Theme: <span className="font-bold not-italic">{state.theme}</span>
              </p>
            )}
          </div>
          
          <div className="relative border-4 border-black h-64 md:h-auto overflow-hidden rounded-tr-[4rem] rounded-bl-[4rem]">
            <img
              src={state?.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"}
              alt={state?.eventTitle || "Event"}
              className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
            />
            {state?.logoUrl && (
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-white border-2 border-black p-1">
                <img
                  src={state.logoUrl}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-16">

            {/* About Section */}
            <section>
              <h2 className="text-4xl font-black uppercase tracking-tighter border-b-2 border-black pb-2 mb-6">
                About the Event
              </h2>
              <div className="font-serif text-lg leading-relaxed text-gray-900 whitespace-pre-wrap">
                {state?.description || "No description provided."}
              </div>
            </section>

            {/* Tracks Section */}
            {state?.tracks && state.tracks.length > 0 && (
              <section className="bg-[#c3cfa1] border border-black p-8 rounded-2xl shadow-[8px_8px_0_0_#000]">
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">
                  Tracks
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.tracks.map((track, index) => (
                    <div key={index} className="border-b border-black pb-2">
                      <h3 className="font-bold uppercase text-sm mb-1 tracking-widest">Track 0{index + 1}</h3>
                      <p className="font-serif italic">{track}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Prizes Section */}
            {state?.prize && (
              <section className="bg-white border-2 border-black p-8 shadow-[8px_8px_0_0_#000]">
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">
                  Prizes
                </h2>
                <p className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#7a6cf0]">
                  {state.prize}
                </p>
              </section>
            )}

            {/* Gallery Section */}
            {(state?.photo1Url || state?.photo2Url) && (
              <section>
                <h2 className="text-4xl font-black uppercase tracking-tighter border-b-2 border-black pb-2 mb-6">
                  Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                  {state?.photo1Url && (
                    <div className="border border-black bg-white p-2 shadow-[6px_6px_0_0_#000] rotate-1 hover:rotate-0 transition-transform">
                      <img
                        src={state.photo1Url}
                        alt="Event Highlight 1"
                        className="w-full h-64 object-cover filter grayscale hover:grayscale-0 transition-all"
                      />
                    </div>
                  )}
                  {state?.photo2Url && (
                    <div className="border border-black bg-white p-2 shadow-[6px_6px_0_0_#000] -rotate-1 hover:rotate-0 transition-transform">
                      <img
                        src={state.photo2Url}
                        alt="Event Highlight 2"
                        className="w-full h-64 object-cover filter grayscale hover:grayscale-0 transition-all"
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

               {/* Info List */}
               <div className="border-4 border-black p-6 bg-white shadow-[8px_8px_0_0_#000]">
                  <ul className="space-y-4 font-bold text-sm">
                     <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                        <span className="uppercase tracking-widest text-xs text-gray-500">Date</span>
                        <span className="font-serif italic text-base font-normal">{state?.startDate} {state?.endDate !== state?.startDate && `- ${state?.endDate}`}</span>
                     </li>
                     <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                        <span className="uppercase tracking-widest text-xs text-gray-500">Time</span>
                        <span className="font-serif italic text-base font-normal">{state?.startTime}</span>
                     </li>
                     <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                        <span className="uppercase tracking-widest text-xs text-gray-500">Venue</span>
                        <span className="font-serif italic text-base font-normal text-right max-w-[150px] truncate" title={state?.venue}>{state?.venue}</span>
                     </li>
                     <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                        <span className="uppercase tracking-widest text-xs text-gray-500">Team Size</span>
                        <span className="font-serif italic text-base font-normal">{state?.minTeamMembers}-{state?.maxTeamMembers}</span>
                     </li>
                     <li className="flex justify-between items-center text-red-600">
                        <span className="uppercase tracking-widest text-xs">Deadline</span>
                        <span className="font-serif italic text-base font-normal">{state?.registrationDeadline}</span>
                     </li>
                  </ul>
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
                    <div className="text-xs font-bold uppercase tracking-widest space-y-1">
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
    </div>
  );
}

export default Event;