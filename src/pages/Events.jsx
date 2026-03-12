import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    // Attempting to fetch events - adjust endpoint if different
    api.get('/participant/eventslist', {
      headers: {
        authorization: localStorage.getItem("token")
      }
    })
      .then(res => {
        if (res.data?.events) {
          setEvents(res.data.events);
        } else if (Array.isArray(res.data)) {
          setEvents(res.data);
        } else {
          setEvents([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch events:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#f4efe6] font-sans text-black flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="border-b-8 border-black pb-8 mb-12">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
            All <br/> <span className="text-[#7a6cf0]">Events</span>
          </h1>
          <p className="font-serif italic text-xl md:text-2xl mt-6 text-gray-800 max-w-2xl">
            Discover and participate in upcoming hackathons, coding challenges, and tech events.
          </p>
        </div>

        {loading ? (
          <div className="w-full py-20 bg-white border-4 border-black border-dashed flex items-center justify-center text-black shadow-[8px_8px_0_0_#000]">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest animate-pulse">Loading Events...</h2>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((evt, idx) => (
              <div 
                key={idx} 
                className="bg-white border-[3px] border-black rounded-3xl p-6 sm:p-8 hover:-translate-y-2 transition-all shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] flex flex-col group cursor-pointer relative overflow-hidden"
                onClick={() => nav(`/event/${evt.eventId}`)}
              >
                {/* Decorative dots */}
                <div className="absolute top-4 right-4 flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                   <div className="w-2 h-2 rounded-full bg-black"></div>
                   <div className="w-2 h-2 rounded-full bg-black"></div>
                   <div className="w-2 h-2 rounded-full bg-black"></div>
                </div>

                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#c3cfa1] border-[3px] border-black flex items-center justify-center font-black text-xl shadow-[4px_4px_0_0_#000] group-hover:bg-[#7a6cf0] group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                  
                  {/* Event Type / Status Tag */}
                  <div className="border-[2px] border-black rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest bg-[#f4efe6]">
                     {evt.type === 'hackathon' ? 'Hackathon' : 'Event'}
                  </div>
                </div>
                
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none group-hover:text-[#7a6cf0] transition-colors">{evt.eventTitle || "Unnamed Event"}</h3>
                <p className="font-serif italic text-sm text-gray-800 flex-grow mb-8 line-clamp-3 leading-relaxed">
                  {evt.description || "No description available for this event."}
                </p>
                
                {/* Meta Information Container */}
                <div className="mt-auto flex gap-2 mb-4">
                  {/* Date Pill */}
                  <div className="flex-1 bg-black text-white border-[2px] border-black rounded-xl p-2 flex flex-col items-center justify-center group-hover:bg-[#c3cfa1] group-hover:text-black transition-colors">
                     <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold mb-1">Date</span>
                     <span className="font-mono text-xs font-bold whitespace-nowrap">
                       {evt.startDate ? new Date(evt.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "TBA"}
                     </span>
                  </div>

                  {/* Venue Pill */}
                  <div className="flex-1 bg-white border-[2px] border-black rounded-xl p-2 flex flex-col items-center justify-center group-hover:bg-[#f4efe6] transition-colors overflow-hidden">
                     <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Venue</span>
                     <span className="font-mono text-xs font-bold text-black truncate w-full text-center" title={evt.venue || "TBA"}>
                       {evt.venue || "TBA"}
                     </span>
                  </div>
                </div>
                
                {/* Footer Action */}
                <div className="border-t-[3px] border-black pt-4 flex justify-between items-center text-sm font-black uppercase tracking-widest">
                  <span>View Details</span>
                  <div className="w-8 h-8 rounded-full border-[2px] border-black flex items-center justify-center group-hover:bg-black group-hover:text-white group-hover:translate-x-1 transition-all">
                    →
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="w-full py-32 bg-white border-4 border-black border-dashed flex flex-col items-center justify-center text-center shadow-[8px_8px_0_0_#000]">
             <div className="w-20 h-20 md:w-24 md:h-24 bg-yellow-400 border-4 border-black flex items-center justify-center text-5xl md:text-6xl font-black mb-8 shadow-[4px_4px_0_0_#000]">
               !
             </div>
             <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">No events found</h2>
             <p className="font-serif italic text-lg md:text-xl text-gray-800">Check back later for new hackathons and challenges.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Events;
