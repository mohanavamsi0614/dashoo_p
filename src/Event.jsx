import { Link, useLocation, useNavigate, useParams } from "react-router";

function Event() {
  const { name } = useParams();
  const { state } = useLocation();
  const nav = useNavigate();

  if (!state) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">Event not found ⚠️</h1>
        <Link
          to="/"
          className="text-red-500 hover:underline hover:text-red-600 transition"
        >
          Go back to events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner at Top */}
      <div className="w-full h-64 md:h-96">
        <img
          src={state.bannerUrl}
          alt={state.eventTitle}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Event Info Section */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl -mt-16 relative z-10 p-8">
        {/* Logo + Title */}
        <div className="flex flex-col items-center text-center">
          {state.logoUrl && (
            <img
              src={state.logoUrl}
              alt="Logo"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg -mt-12 mb-4 bg-white object-cover"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-800">{state.eventTitle}</h1>
          {state.shortTitle && (
            <p className="text-gray-500 italic mt-1">{state.shortTitle}</p>
          )}
        </div>

        {/* Event Details */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">📅 Date</h3>
            <p className="text-gray-600">
              {state.startDate} – {state.endDate}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">⏰ Time</h3>
            <p className="text-gray-600">{state.startTime || "TBA"}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">📍 Venue</h3>
            <p className="text-gray-600">{state.venue}</p>
            <p className="text-gray-500">{state.address}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">🎟 Capacity</h3>
            <p className="text-gray-600">{state.capacity} participants</p>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">📖 Description</h3>
          <p className="text-gray-600 leading-relaxed">{state.description}</p>
        </div>

        {/* Gallery */}
        {(state.photo1Url || state.photo2Url) && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">📸 Event Gallery</h3>
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
          <button
            onClick={() => nav("/reg", { state })}
            className="bg-red-500 hover:bg-red-600 text-white text-lg font-semibold px-8 py-3 rounded-xl transition duration-300 shadow-md"
          >
            Register Now
          </button>
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center mt-6 mb-10">
        <Link
          to="/"
          className="text-gray-600 hover:text-red-500 transition text-sm"
        >
          ← Back to Events
        </Link>
      </div>
    </div>
  );
}

export default Event;
