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
  const [members, setMembers] = useState(() => getInitialState("members", []));
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
    setMembers((prev) => {
      return prev.map((member) => {
        const updates = {};
        othersec.forEach((item) => {
          if (!(item.title in member)) {
            updates[item.title] = "";
          }
        });
        return { ...member, ...updates };
      });
    });
  }, []);
  useEffect(() => {
    const dataToSave = {
      teamName,
      lead,
      members,
      form
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    socket.emit("join", state._id);

  }, [teamName, lead, members, form, STORAGE_KEY]);
  socket.on("eventOpen", (data) => {
    setopen(true)
  })
  socket.on("eventClosed", (data) => {
    setopen(false)
  })
  useEffect(() => {
    if (minMembers > 1 && members.length === 0) {
      const initialMembers = [];
      for (let i = 0; i < minMembers - 1; i++) {
        initialMembers.push(emptyMember());
      }
      if (initialMembers.length > 0) {
        setMembers(initialMembers);
      }
    }
  }, [minMembers]);

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

    // Validate Team Size
    const totalMembers = members.length + 1;
    if (totalMembers < minMembers) return `Minimum ${minMembers} members required (including lead)`;
    if (totalMembers > maxMembers) return `Maximum ${maxMembers} members allowed (including lead)`;

    // Validate Members
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name.trim()) return `Member ${i + 2} name is required`;
      if (!m.rollNumber.trim()) return `Member ${i + 2} roll number is required`;
      if (!m.email.trim()) return `Member ${i + 2} email is required`;
      if (!m.college.trim()) return `Member ${i + 2} college is required`;
    }

    return "";
  }

  const addMember = () => {
    if (members.length + 1 >= maxMembers) return;
    setMembers([...members, emptyMember()]);
  };

  const removeMember = (idx) => {
    setMembers(members.filter((_, i) => i !== idx));
  };

  const updateMember = (idx, field, value) => {
    const next = members.map((m, i) =>
      i === idx ? { ...m, [field]: value } : m
    );
    setMembers(next);
  };

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
        lead,
        members,
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

        setSuccessData(res.data);
        navigate(`/payment/${state._id}/${res.data.team._id}`)
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
    return <div>Registrations are not open !</div>
  }

  return (
    <div className="min-h-screen font-poppins flex justify-center items-center px-4 sm:px-6 py-10 sm:py-16 relative bg-[#212121]">
      <BackgroundBeams className="fixed inset-0 z-0" />
      <div className="max-w-4xl w-full mx-auto bg-[#161616] border border-[#aeaeae4d] rounded-2xl shadow-2xl p-6 sm:p-10 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-white">
          Team Registration
        </h2>
        {eventTitle && (
          <div className="text-center mb-8">
            <span className="text-gray-400">Event:</span>{" "}
            <span className="font-nerko text-3xl text-indigo-400">
              {eventTitle}
            </span>
            <p className="text-sm text-gray-500 mt-2">
              Team Size: {minMembers} - {maxMembers} members
            </p>
          </div>
        )}

        <RegistrationSuccessPopup
          isOpen={!!successData}
          onClose={handleClosePopup}
          data={successData}
        />

        {false ? (
          <div className="border border-green-500 bg-green-900/20 text-green-400 p-4 rounded-xl text-center text-lg font-medium">
            ✅ Team registered successfully! Redirecting...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Team Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Team Name <span className="text-red-500">*</span></label>
              <input
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter your team name"
              />
            </div>

            {/* Team Lead Section */}
            <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                👑 Team Lead <span className="text-xs text-gray-400 font-normal">(Required)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STANDARD_FIELDS.map((field) => (
                  <div key={field}>
                    <label className="block text-xs text-gray-400 mb-1 capitalize">
                      {field === "rollNumber" ? "Roll / Reg No." : field} <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
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
                    <label className="block text-xs text-gray-400 mb-1 capitalize">
                      {item.title} <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
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

            {/* Members */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Team Members <span className="text-sm font-normal text-gray-400">({members.length + 1}/{maxMembers})</span>
                </h3>
                {members.length + 1 < maxMembers && (
                  <button
                    type="button"
                    onClick={addMember}
                    className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    + Add Member
                  </button>
                )}
              </div>

              {members.length === 0 && minMembers > 1 && (
                <p className="text-yellow-500 text-sm italic">Please add at least {minMembers - 1} more member(s).</p>
              )}

              {members.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700 relative group"
                >
                  <button
                    type="button"
                    onClick={() => removeMember(idx)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                    title="Remove Member"
                  >
                    ✕
                  </button>
                  <h4 className="text-md font-medium text-white mb-4">Member {idx + 2}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {STANDARD_FIELDS.map((field) => (
                      <div key={field}>
                        <label className="block text-xs text-gray-400 mb-1 capitalize">
                          {field === "rollNumber" ? "Roll / Reg No." : field} <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                          value={m[field]}
                          onChange={(e) => updateMember(idx, field, e.target.value)}
                          placeholder={`Enter ${field}`}
                        />
                      </div>
                    ))}
                    {state.other?.filter((item) => item.type === "EP").map((item) => (
                      <div key={item.title}>
                        <label className="block text-xs text-gray-400 mb-1 capitalize">
                          {item.title} <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                          value={m[item.title] || ""}
                          onChange={(e) =>
                            updateMember(idx, item.title, e.target.value)
                          }
                          placeholder={`Enter ${item.title}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Other Fields */}
            {state?.other.filter((item) => item.type == "AT").length > 0 && (
              <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Additional Details</h3>
                <div className="space-y-4">
                  {state.other.filter((item) => item.type == "AT").map((i, idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{i.title}</label>
                      {i.type === 'text' && (
                        <input
                          value={form[i.key] || ""}
                          onChange={(e) =>
                            setForm({ ...form, [i.key]: e.target.value })
                          }
                          placeholder={i.placeholder || ""}
                          className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      )}
                      {i.type === 'number' && (
                        <input
                          value={form[i.key] || ""}
                          onChange={(e) =>
                            setForm({ ...form, [i.key]: e.target.value })
                          }
                          placeholder={i.placeholder || ""}
                          className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors font-medium"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Register Team"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
