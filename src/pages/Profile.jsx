import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import api from "@/lib/api";

function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [loading, setLoading] = useState(!user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await api.get("/participant/my/profile", {
          headers: {
            authorization: token,
          },
        });
        if (res.data) {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-poppins relative overflow-hidden">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-poppins text-center p-6">
        <p className="text-gray-400 text-lg mb-6">No user data available or session expired.</p>
        <button
          onClick={() => navigate("/auth")}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-poppins text-gray-200 px-4 sm:px-6 py-6 sm:py-10 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto mb-6 relative z-10">
        <BackButton />
      </div>

      {/* Profile Header Card */}
      <div className="max-w-4xl mx-auto glass-card rounded-3xl p-6 sm:p-10 relative z-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-md opacity-50"></div>
            <img
              src={user.imgUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.name}
              alt={user.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-[#0a0a0a] relative z-10 shadow-xl bg-white/5"
            />
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-nerko text-white mb-2 tracking-wide text-glow">
              {user.name}
            </h1>
            <div className="space-y-1 mb-4">
              <p className="text-sm sm:text-base text-gray-400 truncate flex items-center justify-center sm:justify-start gap-2">
                <span className="text-indigo-400">✉</span> {user.email}
              </p>
              {user.phone && (
                <p className="text-sm sm:text-base text-gray-400 flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-indigo-400">☏</span> {user.phone}
                </p>
              )}
            </div>

            <p className="mt-2 text-sm sm:text-base text-gray-300 break-words leading-relaxed max-w-2xl">
              {user.bio || "No bio provided."}
            </p>
            {user.group && (
              <p className="mt-3 inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-indigo-300">
                Group: {user.group}
              </p>
            )}
          </div>

          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/");
              }}
              className="px-6 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-colors font-medium text-sm"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Registered Events */}
      <div className="max-w-4xl mx-auto mt-16 relative z-10">
        <h2 className="text-3xl sm:text-5xl font-nerko text-white mb-8 flex items-center gap-4">
          <span className="w-10 h-1 bg-indigo-500 rounded-full"></span>
          Registered Events
        </h2>

        {user.registeredEvents && user.registeredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {user.registeredEvents.map((event, idx) => {
              const paymentStatus = event.payment;
              return (
                <div
                  key={idx}
                  className="glass-card rounded-2xl overflow-hidden group flex flex-col border border-white/5 hover:border-indigo-500/30 transition-colors shadow-lg"
                >
                  {/* Banner */}
                  {event.bannerUrl && (
                    <div className="relative h-40 overflow-hidden bg-gray-900">
                      <img
                        src={event.bannerUrl}
                        alt={event.eventName}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/50 to-transparent"></div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col relative z-10 -mt-6">
                    {/* Header Details */}
                    <div className="min-w-0 mb-4 bg-[#0a0a0a]/80 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 shadow-lg">
                      <h3 className="text-xl sm:text-2xl font-nerko text-white truncate group-hover:text-indigo-400 transition-colors tracking-wide">
                        {event.eventName}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`px-2 py-0.5 rounded border text-[10px] uppercase tracking-wider font-bold ${paymentStatus ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                          {paymentStatus ? "Paid" : "Pending Payment"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6 text-sm bg-white/5 p-4 rounded-xl border border-white/5">
                      {event.venue && (
                        <p className="text-gray-300 flex items-start gap-3">
                          <span className="text-indigo-400 mt-0.5">📍</span>
                          <span className="flex-1">{event.venue}</span>
                        </p>
                      )}

                      {event.teamId && (
                        <p className="text-gray-300 flex items-center gap-3">
                          <span className="text-purple-400">👥</span>
                          <span>Team Reference: <span className="font-mono text-xs bg-black/50 px-2 py-1 rounded ml-1 border border-white/5">{event.teamId.slice(-6).toUpperCase()}</span></span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-auto">
                      <Link
                        to={`/event/${event.eventId}`}
                        className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                      >
                        View Details <span>→</span>
                      </Link>

                      {!paymentStatus && (
                        <Link
                          to={`/payment/${event.eventId}/${event.teamId}`}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-sm font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)] transform hover:-translate-y-0.5 transition-all"
                        >
                          Pay Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card p-10 rounded-2xl text-center border border-white/5 border-dashed">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 text-2xl">
              🎯
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No Events Yet</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
              You haven't registered or joined any teams for events yet. Explore upcoming opportunities!
            </p>
            <Link to="/" className="inline-block px-8 py-3 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-medium transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Explore Events
            </Link>
          </div>
        )}
      </div>

      <div className="text-center mt-16 sm:mt-24 pb-8 relative z-10 border-t border-white/5 pt-8">
        <Link
          to="/"
          className="text-gray-500 hover:text-white transition-colors text-sm flex items-center justify-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Profile;
