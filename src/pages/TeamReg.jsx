import { useEffect, useRef, useState } from "react";
import axios from "axios";
import api from "../lib/api";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { BackgroundBeams } from "../components/ui/background-beams";
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
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Registrations are not open!</div>
  }

  const inputClasses = "w-full bg-[#111] border border-white/10 text-gray-200 rounded-xl p-3 sm:p-3 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 placeholder:text-gray-600 text-sm shadow-inner";
  const labelClasses = "block text-xs sm:text-sm text-gray-300 font-medium mb-1.5 ml-1 capitalize";
  const cardClasses = "bg-white/5 border border-white/10 p-6 rounded-2xl relative shadow-lg";

  return (
    <div className="min-h-screen font-poppins bg-[#0a0a0a] flex justify-center items-center px-4 sm:px-6 py-10 sm:py-16 relative overflow-hidden text-gray-200">
      <BackgroundBeams className="fixed inset-0 z-0 opacity-40" />

      {/* Decorative glows */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl w-full mx-auto glass-card rounded-3xl p-6 sm:p-10 relative z-10 shadow-2xl">
        <div className="text-center mb-10">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 mb-4 inline-block tracking-wider uppercase">Team Registration</span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
            Register for{" "}
            <span className="font-nerko text-4xl sm:text-5xl font-medium text-gradient text-glow block mt-2">
              {eventTitle}
            </span>
          </h2>
          <p className="text-sm text-indigo-300 mt-4 bg-indigo-500/10 inline-block px-4 py-2 rounded-full border border-indigo-500/20">
            Team Size: {minMembers} - {maxMembers} members
          </p>
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
          <div className={`${cardClasses} ring-1 ring-indigo-500/30 overflow-hidden`}>
            {/* Background flare for lead card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] pointer-events-none"></div>

            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3 relative z-10">
              <span className="text-2xl">👑</span> Team Lead <span className="text-xs text-indigo-400 font-normal ml-2 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">Required</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
              {STANDARD_FIELDS.map((field) => (
                <div key={field}>
                  <label className={labelClasses}>
                    {field === "rollNumber" ? "Roll / Reg No." : field} <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={inputClasses}
                    value={lead[field]}
                    onChange={(e) =>
                      setLead({ ...lead, [field]: e.target.value })
                    }
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
                    onChange={(e) =>
                      setLead({ ...lead, [item.title]: e.target.value })
                    }
                    placeholder={`Enter ${item.title}`}
                  />
                </div>
              ))}
            </div>
          </div>



          {/* Other Fields */}
          {state?.other.filter((item) => item.type == "AT").length > 0 && (
            <div className={`${cardClasses} mt-8 pt-8 border-t border-white/10`}>
              <h3 className="text-xl font-nerko text-white mb-6">Additional Details</h3>
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
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center shadow-inner mt-8">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-4 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all font-medium text-sm sm:text-base w-full sm:w-1/3 order-2 sm:order-1"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold transition-all shadow-lg hover:shadow-indigo-500/40 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 w-full order-1 sm:order-2"
            >
              {loading ? "Registering Team..." : "Complete Team Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
