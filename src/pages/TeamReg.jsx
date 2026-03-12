import { useEffect, useRef, useState } from "react";
import axios from "axios";
import api from "../lib/api";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import socket from "@/lib/socket";
import RegistrationSuccessPopup from "../components/RegistrationSuccessPopup";

export default function TeamReg({ state: propState }) {
  const { name: eventParam } = useParams();
  const loc = useLocation();
  const state = propState || loc.state;
  const navigate = useNavigate();

  const eventTitle = state?.eventTitle || eventParam || "";
  const minMembers = parseInt(state?.minTeamMembers) || 1;
  const maxMembers = parseInt(state?.maxTeamMembers) || 4;
  const eventId = state?._id || eventParam;
  const [open, setopen] = useState(state?.status == "open")
  const STORAGE_KEY = `team_reg_${eventId}`;

  const emptyMember = () => {
    const othersec = state?.other?.filter((item) => item.type === "EP") || [];
    const extras = othersec.reduce((acc, item) => {
      acc[item.title] = "";
      return acc;
    }, {});

    return {
      name: "",
      college: "",
      year: "",
      stream: "",
      branch: "",
      rollNumber: "",
      email: "",
      phone: "",
      ...extras,
    };
  };

  const STANDARD_FIELDS = ["name", "email", "phone", "rollNumber", "college", "year", "stream", "branch"];

  const getInitialState = (key, defaultVal) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed[key] !== undefined ? parsed[key] : defaultVal;
      }
    } catch (e) {
      console.error("Error loading from local storage", e);
    }
    return defaultVal;
  };

  const [teamName, setTeamName] = useState(() => getInitialState("teamName", ""));
  const [lead, setLead] = useState(() => getInitialState("lead", emptyMember()));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState(() => getInitialState("form", {}));
  const [team, setTeam] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleClosePopup = () => {
    navigate("/profile");
  };

  useEffect(() => {
    const othersec = state.other.filter((item) => item.type === "EP");
    setLead((prev) => {
      const updates = {};
      othersec.forEach((item) => {
        if (!(item.title in prev)) {
          updates[item.title] = "";
        }
      });
      return { ...prev, ...updates };
    });
    setLead((prev) => {
      const updates = {};
      othersec.forEach((item) => {
        if (!(item.title in prev)) {
          updates[item.title] = "";
        }
      });
      return { ...prev, ...updates };
    });
  }, []);

  useEffect(() => {
    const dataToSave = {
      teamName,
      lead,
      form
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    socket.emit("join", state._id);

  }, [teamName, lead, form, STORAGE_KEY]);
  socket.on("eventOpen", (data) => {
    setopen(true)
  })
  socket.on("eventClosed", (data) => {
    setopen(false)
  })
  function validate() {
    if (!teamName.trim()) return "Team name is required";

    // Validate Lead
    if (!lead.name.trim()) return "Team lead name is required";
    if (!lead.rollNumber.trim()) return "Lead college roll/registration number is required";
    if (!lead.email.trim()) return "Lead email is required";
    if (!lead.college.trim()) return "Lead college is required";
    if (!lead.year.trim()) return "Lead year is required";
    if (!lead.branch.trim()) return "Lead branch is required";
    if (!lead.phone.trim()) return "Lead phone number is required";

    return "";
  }



  const handleSubmit = async (e) => {
    const isPaymentRequired = state?.cost && state.cost > 0;
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        teamName,
        lead: lead,
        member: lead, // Backend DB expects 'member', Backend Email expects 'lead'
        userId: JSON.parse(localStorage.getItem("user"))?._id,
      };
      const res = await api.post(
        "/participant/register/hackathon/" +
        state._id,
        payload
      );
      if (res?.data) {
        console.log(res.data);
        console.log(res.data.team);
        setTeam(res.data.team);
        localStorage.setItem(
          "lastRegistration",
          JSON.stringify({ payload, server: res.data })
        );
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );
        localStorage.removeItem(STORAGE_KEY);
        socket.emit("regCheck", { eventId: state._id })
        console.log(`payment/${state._id}/${res.data.team}`)
        setSuccessData(res.data);
      }
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error || err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };
  if (!open) {
    return (
      <div className="min-h-screen bg-[#f4efe6] flex flex-col items-center justify-center font-sans">
        <div className="w-24 h-24 bg-red-500 border-[4px] border-black flex items-center justify-center text-5xl font-black mb-8 shadow-[8px_8px_0_0_#000]">
           X
        </div>
        <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-black text-center mb-6">
          Registrations are closed
        </h2>
        <button 
           onClick={() => navigate("/")}
           className="px-8 py-4 border-[3px] border-black text-white bg-black hover:bg-[#7a6cf0] font-bold uppercase tracking-widest transition-colors shadow-[6px_6px_0_0_#000]"
        >
           Return Home
        </button>
      </div>
    );
  }

  const inputClasses = "w-full bg-white border-[3px] border-black text-black rounded-none p-4 outline-none focus:ring-0 focus:border-[#7a6cf0] transition-all duration-300 placeholder:font-serif placeholder:italic shadow-[4px_4px_0_0_#000] mb-4 text-lg font-bold";
  const labelClasses = "block text-sm sm:text-base text-black font-black uppercase tracking-widest mb-2";
  const cardClasses = "bg-white border-[4px] border-black p-6 sm:p-10 shadow-[12px_12px_0_0_#000]";

  return (
    <div className="min-h-screen font-sans bg-[#f4efe6] flex justify-center items-center px-4 sm:px-6 py-10 sm:py-24 pt-32 relative text-black">
      <div className="max-w-4xl w-full mx-auto bg-white border-[4px] border-black p-6 sm:p-12 shadow-[16px_16px_0_0_#000] relative z-10">
        <div className="text-center mb-12 border-b-[4px] border-black pb-8">
          <span className="px-4 py-2 text-xs font-black bg-black text-white uppercase tracking-widest inline-block mb-6 shadow-[4px_4px_0_0_#c3cfa1]">
             Team Registration
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-black uppercase tracking-tighter leading-[0.85]">
            Register for{" "}
            <span className="text-[#7a6cf0] block mt-4">
              {eventTitle}
            </span>
          </h2>
          <div className="mt-8 flex justify-center">
             <span className="font-mono font-bold text-sm bg-[#c3cfa1] border-[3px] border-black px-4 py-2 uppercase tracking-widest shadow-[4px_4px_0_0_#000]">
               Team Size: {minMembers} - {maxMembers} Members
             </span>
          </div>
        </div>

        <RegistrationSuccessPopup
          isOpen={!!successData}
          onClose={handleClosePopup}
          data={successData}
        />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Team Name */}
          <div className="mb-8">
            <label className="block text-sm sm:text-base text-gray-300 font-medium mb-2 ml-1">Team Name <span className="text-red-500">*</span></label>
            <input
              className={`${inputClasses} text-base sm:text-lg p-4`}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team name"
            />
          </div>

          {/* Team Lead Section */}
          <div className={`${cardClasses} bg-[#c3cfa1] border-[4px] border-black p-8 shadow-[8px_8px_0_0_#000] mb-12`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b-[3px] border-black pb-4">
               <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
                 <span>👑</span> Team Lead
               </h3>
               <span className="text-xs font-bold uppercase tracking-widest bg-black text-white border-[2px] border-white px-3 py-1 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] mt-4 sm:mt-0">
                 Required
               </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
              {STANDARD_FIELDS.map((field) => (
                <div key={field}>
                  <label className={labelClasses}>
                    {field === "rollNumber" ? "Roll / Reg No." : field} <span className="text-red-500">*</span>
                  </label>
                  <input
                     className={inputClasses}
                     value={lead[field]}
                     onChange={(e) => setLead({ ...lead, [field]: e.target.value })}
                     placeholder={`Enter ${field}`}
                  />
                </div>
              ))}
              {state.other?.filter((item) => item.type === "EP").map((item) => (
                <div key={item.title}>
                  <label className={labelClasses}>
                    {item.title} <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={inputClasses}
                    value={lead[item.title] || ""}
                    onChange={(e) => setLead({ ...lead, [item.title]: e.target.value })}
                    placeholder={`Enter ${item.title}`}
                  />
                </div>
              ))}
            </div>
          </div>



          {/* Other Fields */}
          {state?.other.filter((item) => item.type == "AT").length > 0 && (
            <div className={`mt-12 pt-12 border-t-[4px] border-black`}>
              <h3 className="text-4xl font-black text-black mb-8 uppercase tracking-tighter">Additional Details</h3>
              <div className="space-y-6">
                {state.other.filter((item) => item.type == "AT").map((i, idx) => (
                  <div key={idx}>
                    <label className={labelClasses}>{i.title}</label>
                    {i.type === 'text' && (
                      <input
                        value={form[i.key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [i.key]: e.target.value })
                        }
                        placeholder={i.placeholder || ""}
                        className={inputClasses}
                      />
                    )}
                    {i.type === 'number' && (
                      <input
                        value={form[i.key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [i.key]: e.target.value })
                        }
                        placeholder={i.placeholder || ""}
                        className={inputClasses}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500 text-white font-bold uppercase tracking-widest border-[4px] border-black p-6 text-center shadow-[6px_6px_0_0_#000] mt-10">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-6 pt-12 border-t-[4px] border-black mt-12">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-5 border-[3px] border-black bg-white text-black font-black uppercase tracking-widest text-sm sm:text-base w-full sm:w-1/3 hover:bg-black hover:text-white transition-colors shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:shadow-none order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-5 bg-[#7a6cf0] border-[3px] border-black text-white font-black uppercase tracking-widest text-sm sm:text-base transition-all shadow-[8px_8px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 hover:bg-[#c3cfa1] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed w-full order-1 sm:order-2"
            >
              {loading ? "INITIALIZING..." : "CONFIRM TEAM REGISTRATION"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
