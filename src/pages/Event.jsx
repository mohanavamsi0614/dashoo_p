import { Link, useLocation, useNavigate, useParams } from "react-router";
import api from "../lib/api";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import socket from "../lib/socket";

function Event() {
  const { eventID } = useParams();
  const loc = useLocation();
  const [state, setState] = useState(loc.state || null);
  const [loading, setLoading] = useState(!loc.state);
  const [open, setopen] = useState(state?.status == "open")
  const nav = useNavigate();

  useEffect(() => {
    if (!state) {
      setLoading(true);
      api
        .get(`/participant/eventdata/${eventID}`)
        .then((res) => {
          console.log(res.data);
          setState(res.data);
          setopen(res.data.status == "open")
          socket.emit("join", res.data._id);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
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
  if (loading || !state) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#212121] text-white font-poppins">
        <p>Loading event details...</p>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem("user"));
  // const isRegistered = user?.registeredEvents?.some((ev) => ev._id === state._id);

  return (
    <div className="bg-[#212121] font-poppins min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh]">
        <img
          src={state.bannerUrl || "https://via.placeholder.com/1920x600?text=Event+Banner"}
          alt={state.eventTitle}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#212121] via-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 lg:p-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-6">
            {state.logoUrl && (
              <img
                src={state.logoUrl}
                alt="Logo"
                className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-[#212121] shadow-2xl bg-white object-contain"
              />
            )}
            <div className="mb-2">
              <span className="inline-block px-3 py-1 mb-3 text-xs md:text-sm font-medium bg-indigo-600 text-white rounded-full">
                {state.type === "hackathon" ? "Hackathon" : "Event"}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-nerko font-bold text-white leading-tight">
                {state.eventTitle}
              </h1>
              {state.theme && (
                <p className="text-lg md:text-xl text-gray-300 mt-2 font-medium">
                  Theme: <span className="text-indigo-400">{state.theme}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-10">

            {/* About Section */}
            <section>
              <h2 className="text-2xl md:text-3xl font-nerko text-white mb-4 border-b border-gray-700 pb-2">
                About the Event
              </h2>
              <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
                {state.description || "No description provided."}
              </div>
            </section>

            {/* Tracks Section */}
            {state.tracks && state.tracks.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-nerko text-white mb-6 border-b border-gray-700 pb-2">
                  Tracks
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.tracks.map((track, index) => (
                    <div key={index} className="bg-[#2a2a2a] p-5 rounded-xl border border-gray-700 hover:border-indigo-500 transition-colors">
                      <h3 className="text-lg font-semibold text-white mb-2">Track {index + 1}</h3>
                      <p className="text-gray-300">{track}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Prizes Section */}
            {state.prize && (
              <section>
                <h2 className="text-2xl md:text-3xl font-nerko text-white mb-6 border-b border-gray-700 pb-2">
                  Prizes
                </h2>
                <div className="bg-gradient-to-r from-[#2a2a2a] to-[#212121] p-6 rounded-2xl border border-gray-700">
                  <p className="text-xl md:text-2xl text-yellow-400 font-bold">
                    {state.prize}
                  </p>
                </div>
              </section>
            )}

            {/* Gallery Section */}
            {(state.photo1Url || state.photo2Url) && (
              <section>
                <h2 className="text-2xl md:text-3xl font-nerko text-white mb-6 border-b border-gray-700 pb-2">
                  Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {state.photo1Url && (
                    <img
                      src={state.photo1Url}
                      alt="Event Highlight 1"
                      className="w-full h-64 object-cover rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-300"
                    />
                  )}
                  {state.photo2Url && (
                    <img
                      src={state.photo2Url}
                      alt="Event Highlight 2"
                      className="w-full h-64 object-cover rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-300"
                    />
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-8">

            {/* Action Card */}
            <div className="bg-[#2a2a2a] p-6 rounded-2xl border border-gray-700 shadow-xl sticky top-24">
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-1">Registration Fee</p>
                <p className="text-3xl font-bold text-white">
                  {state.cost === "0" || !state.cost ? "Free" : `₹${state.cost}`}
                </p>
                <div className="mt-4 mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-400">Spots Filled</span>
                    <span className="text-sm font-semibold text-white">
                      {state.count || 0} / {state.maxTeams + 10}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(((state.count || 0) / (state.maxTeams + 10)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              {open ? (
                <button
                  onClick={() => nav("/reg/" + state.eventId, { state })}
                  className="w-full bg-white text-black font-bold text-lg py-3 rounded-xl hover:bg-gray-200 transition-colors shadow-lg mb-4"
                >
                  Register Now
                </button>
              ) : (
                <button
                  onClick={() => alert("Registrations are not open !")}
                  disabled={!open}
                  className="w-full bg-white text-black font-bold text-lg py-3 rounded-xl hover:bg-gray-200 transition-colors shadow-lg mb-4"
                >
                  Registrations are not open !
                </button>
              )}

              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📅</span>
                  <div>
                    <p className="font-semibold text-white">Date</p>
                    <p>{state.startDate} {state.endDate !== state.startDate && ` - ${state.endDate}`}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">⏰</span>
                  <div>
                    <p className="font-semibold text-white">Time</p>
                    <p>{state.startTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="font-semibold text-white">Venue</p>
                    <p>{state.venue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">⏳</span>
                  <div>
                    <p className="font-semibold text-white">Registration Deadline</p>
                    <p className="text-red-400">{state.registrationDeadline}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">👥</span>
                  <div>
                    <p className="font-semibold text-white">Team Size</p>
                    <p>{state.minTeamMembers} - {state.maxTeamMembers} Members</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Card */}
            {state.by && (
              <div className="bg-[#2a2a2a] p-6 rounded-2xl border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Organized by</h3>
                <div className="flex items-center gap-4 mb-4">
                  {state.by.imgUrl && (
                    <img
                      src={state.by.imgUrl}
                      alt={state.by.orgName}
                      className="w-12 h-12 rounded-full object-cover bg-white"
                    />
                  )}
                  <div>
                    <p className="font-bold text-white text-lg">{state.by.orgName}</p>
                    {state.by.website && (
                      <a href={state.by.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-sm hover:underline">
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  {state.by.email && <p>📧 {state.by.email}</p>}
                  {state.by.contactPhone && <p>📞 {state.by.contactPhone}</p>}
                </div>
              </div>
            )}

            {/* Links Section */}
            {state.links && state.links.length > 0 && (
              <div className="bg-[#2a2a2a] p-6 rounded-2xl border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Important Links</h3>
                <ul className="space-y-3">
                  {state.links.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        🔗 <span className="underline">{link.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Event;

