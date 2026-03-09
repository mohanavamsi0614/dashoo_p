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

  // const user = JSON.parse(localStorage.getItem("user"));
  // const isRegistered = user?.registeredEvents?.some((ev) => ev._id === state._id);

  return (
    <div className="bg-[#0a0a0a] min-h-screen font-poppins text-gray-200">
      <Navbar />

      {/* Immersive Hero Banner */}
      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
        <div className="absolute top-24 left-4 sm:left-10 z-20">
          <BackButton />
        </div>

        {/* Banner with gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={state?.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"}
            alt={state?.eventTitle || "Event"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent"></div>
        </div>

        {/* Hero Content aligned to bottom */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 lg:p-16 z-10 translate-y-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-8">
            {state?.logoUrl && (
              <img
                src={state.logoUrl}
                alt="Logo"
                className="w-28 h-28 md:w-40 md:h-40 rounded-2xl border-2 border-white/10 shadow-2xl shadow-indigo-500/20 bg-white/5 backdrop-blur-sm object-cover"
              />
            )}
            <div className="mb-4 flex-1">
              <span className="inline-block px-4 py-1.5 mb-4 text-xs md:text-sm font-semibold tracking-wide bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                {state?.type === "hackathon" ? "HACKATHON" : "EVENT"}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-nerko text-white tracking-tight text-glow">
                {state?.eventTitle || "Loading..."}
              </h1>
              {state?.theme && (
                <p className="text-lg md:text-2xl text-gray-300 mt-3 font-light">
                  Theme: <span className="text-indigo-400 font-medium">{state.theme}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-16">

            {/* About Section */}
            <section>
              <h2 className="text-3xl md:text-4xl font-nerko text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-indigo-500 rounded-full"></span>
                About the Event
              </h2>
              <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap text-lg font-light">
                {state?.description || "No description provided."}
              </div>
            </section>

            {/* Tracks Section */}
            {state?.tracks && state.tracks.length > 0 && (
              <section>
                <h2 className="text-3xl md:text-4xl font-nerko text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
                  Tracks
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.tracks.map((track, index) => (
                    <div key={index} className="glass-card p-6 rounded-2xl group">
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">Track {index + 1}</h3>
                      <p className="text-gray-400">{track}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Prizes Section */}
            {state?.prize && (
              <section>
                <h2 className="text-3xl md:text-4xl font-nerko text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-1 bg-yellow-500 rounded-full"></span>
                  Prizes
                </h2>
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-8 rounded-3xl border border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                  <p className="text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 font-bold font-nerko tracking-wide">
                    {state.prize}
                  </p>
                </div>
              </section>
            )}

            {/* Gallery Section */}
            {(state?.photo1Url || state?.photo2Url) && (
              <section>
                <h2 className="text-3xl md:text-4xl font-nerko text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-1 bg-pink-500 rounded-full"></span>
                  Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {state?.photo1Url && (
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                      <img
                        src={state.photo1Url}
                        alt="Event Highlight 1"
                        className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  )}
                  {state?.photo2Url && (
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                      <img
                        src={state.photo2Url}
                        alt="Event Highlight 2"
                        className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
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

              {/* Action Card */}
              <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
                {/* Decorative background flare */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px]"></div>

                <div className="mb-8 relative z-10">
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Registration Fee</p>
                  <p className="text-5xl font-nerko text-white tracking-wide">
                    {state?.cost === "0" || !state?.cost ? "Free" : `₹${state?.cost}`}
                  </p>

                  <div className="mt-8 mb-2 bg-black/20 p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-400">Spots Filled</span>
                      <span className="text-sm font-bold text-white">
                        {state?.count || 0} / {state?.maxTeams || state?.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        style={{ width: `${Math.min(((state?.count || 0) / ((state?.maxTeams || state?.capacity) || 100)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  {alredyReg ? (
                    <div className="space-y-3">
                      <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-center font-medium shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        ✓ Already Registered
                      </div>
                      {!alredyReg.payment?.payment && (
                        <button
                          onClick={() => nav("/payment")}
                          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300 transform hover:-translate-y-1"
                        >
                          Complete Payment
                        </button>
                      )}
                    </div>
                  ) : open ? (
                    <div className="flex flex-col gap-3 mb-2">
                      <button
                        onClick={() => nav("/reg/" + state?.eventId, { state })}
                        className="w-full bg-white text-black hover:bg-gray-200 font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 transform hover:-translate-y-1"
                      >
                        {state?.type === "hackathon" ? "Create Team" : "Register Now"}
                      </button>
                      {state?.type === "hackathon" && (
                        <button
                          onClick={() => nav("/jointeam/" + state?.eventId, { state })}
                          className="w-full bg-indigo-600/20 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/40 hover:text-white font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all duration-300 transform hover:-translate-y-1"
                        >
                          Join Existing Team
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-white/10 text-white/50 border border-white/5 font-bold text-lg py-4 rounded-xl cursor-not-allowed mb-2 backdrop-blur-md"
                    >
                      Registrations Closed
                    </button>
                  )}
                </div>

                <div className="mt-8 space-y-5 text-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">📅</span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider">Date</p>
                      <p className="font-medium text-white text-base">{state?.startDate} {state?.endDate !== state?.startDate && ` - ${state?.endDate}`}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">⏰</span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider">Time</p>
                      <p className="font-medium text-white text-base">{state?.startTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">📍</span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider">Venue</p>
                      <p className="font-medium text-white text-base">{state?.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">👥</span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider">Team Size</p>
                      <p className="font-medium text-white text-base">{state?.minTeamMembers} - {state?.maxTeamMembers} Members</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">⏳</span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider">Deadline</p>
                      <p className="font-medium text-red-400 text-base">{state?.registrationDeadline}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organizer Card */}
              {state?.by && (
                <div className="glass-card p-6 rounded-3xl">
                  <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-4">Organized by</h3>
                  <div className="flex items-center gap-4 mb-4">
                    {state.by.imgUrl && (
                      <img
                        src={state.by.imgUrl}
                        alt={state.by.orgName}
                        className="w-14 h-14 rounded-xl object-cover border border-white/10 bg-white/5"
                      />
                    )}
                    <div>
                      <p className="font-bold text-white text-lg">{state.by.orgName}</p>
                      {state.by.website && (
                        <a href={state.by.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors flex items-center gap-1 mt-1">
                          Visit Website <span className="text-xs">↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 mt-4 pt-4 border-t border-white/5 text-sm">
                    {state.by.email && (
                      <a href={`mailto:${state.by.email}`} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <span className="text-gray-500">✉</span> {state.by.email}
                      </a>
                    )}
                    {state.by.contactPhone && (
                      <a href={`tel:${state.by.contactPhone}`} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <span className="text-gray-500">☏</span> {state.by.contactPhone}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Links Section */}
              {state?.links && state.links.length > 0 && (
                <div className="glass-card p-6 rounded-3xl">
                  <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-4">Important Links</h3>
                  <ul className="space-y-3">
                    {state.links.map((link, idx) => (
                      <li key={idx}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
                        >
                          <span className="text-lg group-hover:scale-110 transition-transform">🔗</span>
                          <span className="text-gray-200 group-hover:text-white font-medium">{link.title}</span>
                          <span className="ml-auto text-gray-500 group-hover:text-white transition-colors text-xs">↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
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