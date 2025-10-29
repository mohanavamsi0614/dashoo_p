import { Link, useLocation, useNavigate, useParams } from "react-router";
import axios from "axios";
import { useState, useEffect } from "react";

function Event() {
  const { eventID } = useParams();
  const loc = useLocation();
  const [state, setState] = useState(loc.state || null);
  const [loading, setLoading] = useState(!loc.state);
  const nav = useNavigate();

  useEffect(() => {
    if (!state) {
      setLoading(true);
      axios
        .get(`https://dasho-backend.onrender.com/participant/eventdata/${eventID}`)
        .then((res) => {
          console.log(res.data);
          setState(res.data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [eventID, state]);

  if (loading || !state) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#212121] text-white font-poppins">
        <p>Loading event details...</p>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const isRegistered = user?.registeredEvents?.some((ev) => ev._id === state._id);

  return (
    <div className="bg-[#212121] font-poppins min-h-screen pb-0">
      {/* Banner */}
      <div className="w-full h-64 md:h-96 relative">
        <img
          src={state.bannerUrl}
          alt={state.eventTitle}
          className="w-full h-full object-cover rounded-b-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Event Card */}
      <div className="max-w-4xl mx-auto bg-[#2a2a2a] shadow-lg rounded-2xl -mt-16 relative z-10 p-8">
        {/* Logo + Title */}
        <div className="flex flex-col items-center text-center">
          {state.logoUrl && (
            <img
              src={state.logoUrl}
              alt="Logo"
              className="w-24 h-24 rounded-full border-4 border-[#2a2a2a] shadow-lg -mt-12 mb-4 bg-white object-cover"
            />
          )}
          <h1 className="text-5xl font-nerko font-medium text-white">{state.eventTitle}</h1>
          {state.shortTitle && (
            <p className="text-gray-300 italic mt-1">{state.shortTitle}</p>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div>
            <h3 className="text-lg font-nerko font-medium text-white mb-1">📅 Date</h3>
            <p className="text-gray-300">{state.startDate} – {state.endDate}</p>
          </div>
          <div>
            <h3 className="text-lg font-nerko font-medium text-white mb-1">⏰ Time</h3>
            <p className="text-gray-300">{state.startTime || "TBA"}</p>
          </div>
          <div>
            <h3 className="text-lg font-nerko font-medium text-white mb-1">📍 Venue</h3>
            <p className="text-gray-300">{state.venue || "Not specified"}</p>
            <p className="text-gray-300">{state.address || ""}</p>
          </div>
          <div>
            <h3 className="text-lg font-nerko font-medium text-white mb-1">🎟 Capacity</h3>
            <p className="text-gray-300">
              {state.capacity ? `${state.capacity} participants` : "N/A"}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8">
          <h3 className="text-lg font-nerko font-medium text-white mb-2">📖 Description</h3>
          <p className="text-gray-300 leading-relaxed">
            {state.description || "No description available."}
          </p>
        </div>

        {/* Gallery */}
        {(state.photo1Url || state.photo2Url) && (
          <div className="mt-10">
            <h3 className="text-lg font-nerko font-medium text-white mb-3">📸 Event Gallery</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {state.photo1Url && (
                <img
                  src={state.photo1Url}
                  alt="Event Photo 1"
                  className="w-full h-64 object-cover rounded-xl shadow-md hover:scale-[1.02] transition-transform"
                />
              )}
              {state.photo2Url && (
                <img
                  src={state.photo2Url}
                  alt="Event Photo 2"
                  className="w-full h-64 object-cover rounded-xl shadow-md hover:scale-[1.02] transition-transform"
                />
              )}
            </div>
          </div>
        )}

        {/* Register Button */}
        <div className="mt-10 text-center">
          {isRegistered ? (
            <p className="text-green-500 font-medium mb-4">
              ✅ You are already registered for this event.
            </p>
          ) : (
            <button
              onClick={() => {
                console.log(state.eventId);
                nav(`/reg/${state.eventId}`, { state })}}
              className="bg-transparent cursor-pointer hover:bg-white hover:text-black border border-[#aeaeae4d] text-white text-lg font-semibold px-8 py-3 rounded-xl transition duration-300"
            >
              Register Now
            </button>
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center mt-6 pb-6">
        <Link
          to="/"
          className="text-gray-400 cursor-pointer hover:text-white transition text-sm"
        >
          ← Home
        </Link>
      </div>
    </div>
  );
}

export default Event;
