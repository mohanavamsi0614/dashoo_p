import api from "../lib/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { TypeAnimation } from "react-type-animation";
import { BackgroundBeams } from "../components/ui/background-beams";
import Footer from "../components/Footer";

function Home() {
  const nav = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/participant/eventslist")
      .then((response) => {
        setEvents(response.data.events);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen font-poppins selection:bg-indigo-500/30">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Abstract Glow Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
        <BackgroundBeams className="absolute inset-0 z-0 opacity-50" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-300">Next-gen Event Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            The dashboard that does it all <br />
            <span className="font-nerko text-6xl sm:text-7xl md:text-9xl text-gradient block mt-4 text-glow">
              Dasho
            </span>
          </h1>

          <div className="h-20 sm:h-24 flex items-center justify-center">
            <TypeAnimation
              sequence={[
                "Manage less, achieve more",
                1500,
                "Organize gracefully",
                1500,
                "Track seamlessly",
                1500,
              ]}
              wrapper="h2"
              speed={50}
              className="text-2xl sm:text-3xl md:text-4xl text-gray-400 font-light"
              repeat={Infinity}
            />
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => document.getElementById('upcoming-events').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-xl font-medium text-white bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all shadow-lg hover:shadow-indigo-500/20"
            >
              Explore Events
            </button>
            <button
              onClick={() => nav('/auth')}
              className="px-8 py-4 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg hover:shadow-indigo-500/40 transform hover:-translate-y-1"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="relative z-10 py-20 bg-gradient-to-b from-transparent via-[#111] to-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-8 md:p-12 text-center border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            <h3 className="text-2xl md:text-4xl font-semibold text-white leading-relaxed">
              <span className="font-nerko text-indigo-400 text-4xl md:text-5xl mr-2">Dasho</span>
              empowers organizers, judges, and participants with interactive
              dashboards that handle everything.
            </h3>
            <p className="mt-6 text-gray-400 text-lg">From event registration and attendance to scoring and results. It's your one-stop solution.</p>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div id="upcoming-events" className="relative z-10 pb-32 pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-nerko font-bold text-white tracking-tight">
                Upcoming Events
              </h2>
              <p className="text-gray-400 mt-2">Discover and participate in top-tier hackathons.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-2xl">
              <p className="text-gray-400 text-lg">No upcoming events found. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div
                  key={event._id}
                  onClick={() => nav(`/event/${event.eventId}`)}
                  className="glass-card rounded-2xl overflow-hidden group cursor-pointer flex flex-col h-full"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={event.bannerUrl}
                      alt={event.eventTitle}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent opacity-80"></div>

                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-black/50 border border-white/20 text-white shadow-lg">
                        {event.cost === "0" || !event.cost ? "Free" : `₹${event.cost}`}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-2xl font-nerko text-white font-medium truncate group-hover:text-indigo-400 transition-colors">
                        {event.eventTitle}
                      </h3>
                      {event.logoUrl && (
                        <img
                          src={event.logoUrl}
                          alt="Logo"
                          className="w-10 h-10 rounded-full border-2 border-white/10 bg-white/5 object-contain flex-shrink-0 shadow-md group-hover:border-indigo-400 transition-colors"
                        />
                      )}
                    </div>

                    <p className="text-sm text-gray-400 line-clamp-2 mb-6 flex-1">
                      {event.description}
                    </p>

                    <div className="space-y-2 mt-auto">
                      <div className="flex items-center text-xs text-gray-400 gap-2">
                        <span className="text-indigo-400">📍</span>
                        <span className="truncate">{event.venue}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-400 gap-2">
                        <span className="text-indigo-400">📅</span>
                        <span>{event.startDate}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nav(`/event/${event.eventId}`);
                      }}
                      className="mt-6 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-300 shadow-lg group-hover:shadow-indigo-500/25"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
