import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function Home() {
  const nav = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("https://dasho-backend.onrender.com/participant/eventslist")
      .then(response => {
        setEvents(response.data.events);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Upcoming Events 🚀
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event._id}
            onClick={() => nav(`/event/${event.eventTitle}`, { state: event })}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer border border-gray-200"
          >
            <img
              src={event.bannerUrl}
              alt={event.eventTitle}
              className="w-full h-48 object-cover"
            />

            <div className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{event.eventTitle}</h2>
                <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-md font-medium">
                  {event.ticketPrice === "0" ? "Free" : `₹${event.ticketPrice}`}
                </span>
              </div>

              <p className="text-gray-500 mt-2 line-clamp-3">{event.description}</p>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <div>
                  <p className="font-medium">{event.venue}</p>
                  <p>{event.startDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={event.logoUrl}
                    alt="Logo"
                    className="w-8 h-8 rounded-full border border-gray-300"
                  />
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nav(`/event/${event.eventTitle}`, { state: event });
                }}
                className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition duration-200"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
