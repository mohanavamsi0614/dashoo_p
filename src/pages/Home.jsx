import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

function Home() {
  const nav = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  return (
    <div className="bg-[#f4efe6] min-h-screen font-sans text-black selection:bg-[#7a6cf0]/30 selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <div className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto">
        
        <h1 className="text-6xl sm:text-7xl md:text-[9rem] font-black uppercase tracking-tighter leading-[0.85] mb-8">
          The Dashboard<br />
          that does it all
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="max-w-md">
            <p className="font-serif italic text-2xl md:text-3xl text-gray-800 leading-snug">
              Manage less, achieve more with <span className="font-bold">Dasho</span>. Organize events effortlessly.
            </p>
            <div className="mt-8">
              <button
                onClick={() => nav("/auth")}
                className="px-8 py-3 rounded-full font-bold text-white bg-[#7a6cf0] hover:bg-black transition-colors shadow-sm text-sm uppercase tracking-wider"
              >
                Get Started
              </button>
            </div>
          </div>
          
          <div className="border border-black p-6 rounded-2xl bg-[#f4efe6] max-w-xs relative md:translate-y-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-black"></div>
              <div>
                <p className="font-bold text-sm leading-tight uppercase">Trusted by Orgs</p>
                <p className="text-xs text-gray-600">Event Organizers</p>
              </div>
            </div>
            <p className="text-sm italic font-serif">
              "Dasho completely changed how we run our hackathons. It's so much easier now."
            </p>
          </div>
        </div>
      </div>

      {/* PROBLEM SECTION */}
      <section className="py-24 bg-[#c3cfa1] border-y border-black">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-serif italic text-3xl md:text-5xl leading-tight text-gray-900 mb-8">
              Running Hackathons can feel like a rollercoaster ride. Compounded when tools fail you.
            </p>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
              Dasho Won't.
            </h2>
          </div>
          {/* Decorative box */}
          <div className="h-[300px] bg-black rounded-lg border border-black max-w-md ml-auto w-full relative overflow-hidden">
             <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=3540&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity"></div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION 1 */}
      <section className="py-28 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
              Powerful<br/>Event<br/>Tools
            </h2>
          </div>
          
          <div className="bg-black text-white p-10 rounded-3xl">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-800">
              <h3 className="font-serif italic text-3xl">Dasho Features</h3>
              <div className="w-12 h-6 bg-white rounded-full flex items-center px-1">
                <div className="w-4 h-4 rounded-full bg-black ml-auto"></div>
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                { title: "Registration", desc: "Automated team creation & signups." },
                { title: "Attendance", desc: "Track participant check-ins live." },
                { title: "Judging", desc: "Score projects via structured panels." },
                { title: "Results", desc: "Calculate winners automatically." }
              ].map((feat, i) => (
                 <div key={i} className="flex gap-6 border-b border-gray-800 pb-6 last:border-0 last:pb-0">
                    <div className="text-gray-500 font-mono text-xs w-24 shrink-0 mt-1 uppercase">0{i+1} Feature</div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{feat.title}</h4>
                      <p className="text-gray-400 text-sm">{feat.desc}</p>
                    </div>
                 </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION 2 (Core Belief styled) */}
      <section className="py-24 bg-[#c3cfa1] border-y border-black">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-[1fr_2fr] gap-12">
          
          <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
            Core<br/>Platform
          </h2>
          
          <div>
            <p className="font-serif italic text-3xl mb-12 text-gray-900 border-b border-black pb-8">
              Deep organization features coupled with solid infrastructure for reliable event operations.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 items-start relative">
              <div className="border border-black p-8 rounded-2xl bg-[#c3cfa1]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-xs">A</div>
                  <h4 className="font-bold uppercase text-sm tracking-wide">Live Leaderboards</h4>
                </div>
                <h3 className="font-serif italic text-2xl mb-4">How do we track scores?</h3>
                <ul className="text-sm space-y-2 list-disc pl-5">
                  <li>Display rankings instantly.</li>
                  <li>Real-time judging updates.</li>
                  <li>Public and private view modes.</li>
                </ul>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#c3cfa1] border border-black rounded-full hidden md:flex items-center justify-center z-10">
                 <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-[10px]">⚖️</div>
              </div>

              <div className="border border-black p-8 rounded-2xl bg-[#c3cfa1]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-xs">B</div>
                  <h4 className="font-bold uppercase text-sm tracking-wide">Team Management</h4>
                </div>
                <h3 className="font-serif italic text-2xl mb-4">How do we organize?</h3>
                <ul className="text-sm space-y-2 list-disc pl-5">
                  <li>Organize submissions easily.</li>
                  <li>Drag and drop participants.</li>
                  <li>Mentor assignment portals.</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center mt-12">
               <button onClick={() => nav("/auth")} className="px-6 py-2 rounded-full border border-black text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
                 See All Features
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* ROLES SECTION */}
      <section className="py-28 px-6 max-w-7xl mx-auto">
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-16 md:mb-24">
          Built for<br/>Everyone
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Organizers", desc: "Manage participants, track attendance, and run events smoothly from one dashboard." },
            { title: "Judges", desc: "Evaluate projects easily with structured judging rubrics and automated score calculation." },
            { title: "Participants", desc: "Join events, manage teams, submit projects, and view results in real time." }
          ].map((role, i) => (
             <div key={i} className="text-center">
               <div className="border-t border-black pt-6 mb-8 mt-12">
                  <h3 className="font-serif italic text-2xl mb-4">{role.title}</h3>
                  <p className="text-sm text-gray-600 max-w-xs mx-auto">{role.desc}</p>
               </div>
             </div>
          ))}
        </div>
      </section>

      {/* FAQS / HOW IT WORKS */}
      <section className="py-24 max-w-4xl mx-auto px-6 border-t border-black">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12">
           <h2 className="text-5xl font-black uppercase tracking-tighter">
             How it<br/>Works
           </h2>
           
           <div className="space-y-0 border-t border-black">
             {[
               "1. Create Event",
               "2. Participants Register",
               "3. Judges Evaluate",
               "4. Results Generated"
             ].map((step, i) => (
                <div key={i} className="border-b border-black">
                  <button 
                    onClick={() => toggleFaq(i)}
                    className="w-full py-6 flex justify-between items-center text-left hover:bg-black/5 px-4 transition-colors"
                  >
                    <span className="font-serif italic text-xl">{step}</span>
                    <span className="text-2xl font-light">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-6 text-sm text-gray-600">
                      Dasho simplifies this step with powerful automation and an intuitive interface designed specifically for this task.
                    </div>
                  )}
                </div>
             ))}
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-[#7a6cf0] text-center px-6">
         <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white mb-6">
           Ready for<br/>an Uplift?
         </h2>
         <p className="font-serif italic text-white text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
           Organize hackathons effortlessly and become the event coordinator your community needs.
         </p>
         <button
           onClick={() => nav("/auth")}
           className="px-10 py-4 rounded-full font-bold text-white bg-black hover:bg-gray-800 transition-colors uppercase tracking-wider text-sm shadow-[0_4px_0_0_rgba(255,255,255,0.2)]"
         >
           Get Started Now
         </button>
      </section>

      <Footer />
    </div>
  );
}

export default Home;