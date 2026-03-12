import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

function Home() {
  const nav = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeFeature, setActiveFeature] = useState(0);

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
                onClick={() => nav("/events")}
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
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-24 items-start">
          <div className="lg:sticky lg:top-32 border-b lg:border-none border-black pb-8 lg:pb-0">
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
              Powerful<br/>Event<br/>Tools
            </h2>
            <p className="font-serif italic text-2xl text-gray-800 max-w-sm lg:border-l-4 lg:border-[#7a6cf0] lg:pl-6 leading-snug">
              Everything you need to orchestrate a flawless event without the usual headache.
            </p>
          </div>
          
          <div className="flex flex-col gap-5">
            {[
              { title: "Registration", desc: "Automated team creation & signups with custom fields and waitlists.", bg: "bg-[#7a6cf0]", text: "text-white" },
              { title: "Attendance", desc: "Track participant check-ins live with real-time tracking dashboards.", bg: "bg-[#c3cfa1]", text: "text-black" },
              { title: "Judging", desc: "Score projects via structured panels, custom rubrics, and tabulation.", bg: "bg-[#f4efe6]", text: "text-black" },
              { title: "Results", desc: "Calculate winners automatically and publish them instantly to public.", bg: "bg-black", text: "text-white" }
            ].map((feat, i) => (
              <div 
                key={i} 
                onClick={() => setActiveFeature(activeFeature === i ? null : i)} 
                className={`border-[3px] border-black rounded-[2rem] overflow-hidden transition-all duration-300 cursor-pointer ${
                  activeFeature === i 
                    ? `${feat.bg} ${feat.text} shadow-[8px_8px_0_0_rgba(0,0,0,1)] -translate-y-1` 
                    : 'bg-transparent text-black hover:bg-black/5'
                }`}
              >
                <div className="p-6 md:p-8 lg:p-10 flex items-center justify-between">
                  <div className="flex items-center gap-4 lg:gap-8">
                    <span className="font-mono text-lg lg:text-xl font-bold opacity-60">{(i+1).toString().padStart(2, '0')}</span>
                    <h4 className="font-black uppercase text-3xl md:text-4xl lg:text-5xl tracking-tighter leading-none translate-y-1">{feat.title}</h4>
                  </div>
                  <div className={`w-12 h-12 flex-shrink-0 rounded-full border-[3px] flex items-center justify-center transition-transform duration-500 ${activeFeature === i ? 'rotate-[135deg] border-current' : 'border-black rotate-0'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                </div>
                
                {/* Expandable Content */}
                <div 
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    activeFeature === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 md:px-8 lg:px-10 pb-8 lg:pb-10 pt-2 lg:w-5/6">
                       <p className="font-serif italic text-xl lg:text-2xl leading-snug opacity-90">
                         {feat.desc}
                       </p>
                    </div>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES SECTION */}
      <section className="py-32 px-6 max-w-7xl mx-auto border-t-[3px] border-black">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
            Built for<br/>Everyone
          </h2>
          <p className="font-serif italic text-xl md:text-2xl text-gray-800 max-w-md md:text-right md:border-r-4 md:border-[#7a6cf0] md:pr-6 leading-snug">
            A unified experience that empowers every stakeholder in the event ecosystem.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {[
            { title: "Organizers", bg: "hover:bg-[#c3cfa1] cursor-pointer", desc: "Manage participants, track attendance, and run events smoothly from one master dashboard." },
            { title: "Judges", bg: "hover:bg-[#f4efe6] cursor-pointer", desc: "Evaluate projects effortlessly with structured judging rubrics and automated score calculation." },
            { title: "Participants", bg: "hover:bg-[#7a6cf0] hover:text-white cursor-pointer", textClass: "group-hover:text-white", desc: "Join events, form teams, submit projects, and climb the live leaderboards in real time." }
          ].map((role, i) => (
             <div key={i} className={`group border-[3px] border-black rounded-[2rem] p-8 lg:p-10 transition-all duration-300 ${role.bg} hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 bg-white flex flex-col h-full cursor-default`}>
                <h3 className={`font-black uppercase text-3xl md:text-4xl mb-4 tracking-tighter leading-none ${role.textClass || 'text-black'}`}>{role.title}</h3>
                <p className={`font-serif italic text-lg lg:text-xl opacity-90 mt-auto leading-snug ${role.textClass || 'text-black'}`}>{role.desc}</p>
             </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-32 bg-black text-white border-y-[3px] border-black overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
            <h2 className="text-6xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter leading-[0.85] text-[#c3cfa1]">
              How it<br/>Works
            </h2>
            <div className="w-16 h-16 rounded-full bg-[#7a6cf0] animate-[spin_10s_linear_infinite] flex items-center justify-center border-4 border-black">
              <div className="w-8 h-8 rounded-full border-4 border-black bg-white"></div>
            </div>
          </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { step: "01", title: "Create Event", desc: "Set up your landing page, dates, and custom forms in minutes." },
               { step: "02", title: "Registration", desc: "Participants join, form squads, and submit necessary docs." },
               { step: "03", title: "Evaluation", desc: "Judges score live through structured parameter panels." },
               { step: "04", title: "Results", desc: "Winners are generated instantly with automated tabulation." }
             ].map((item, i) => (
                <div key={i} className="bg-[#111] cursor-pointer p-8 lg:p-10 rounded-[2rem] border-2 border-gray-800 hover:border-[#c3cfa1] hover:bg-[#c3cfa1] hover:text-black transition-all duration-300 relative group cursor-default">
                  <div className="text-[#7a6cf0] group-hover:text-black font-mono text-xl font-bold mb-10 transition-colors">{item.step} <span className="opacity-50">——</span></div>
                  <h3 className="font-black uppercase text-3xl mb-4 leading-none tracking-tight">{item.title}</h3>
                  <p className="font-serif italic text-gray-400 group-hover:text-gray-900 text-lg leading-snug transition-colors">
                    {item.desc}
                  </p>
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
           onClick={() => nav("/events")}
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