import { useState } from "react";
import axios from "axios";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { BackgroundBeams } from "./components/ui/background-beams";

export default function TeamReg() {
  const { name: eventParam } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const eventTitle = state?.eventTitle || eventParam || "";

  const emptyMember = () => ({
    name: "",
    college: "",
    year: "",
    stream: "",
    branch: "",
    rollNumber: "",
    email: "",
    phone: "",
  });

  const [teamName, setTeamName] = useState("");
  const [lead, setLead] = useState(emptyMember());
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const maxMembersTotal = 4;

  function validate() {
    if (!teamName.trim()) return "Team name is required";
    if (!lead.name.trim()) return "Team lead name is required";
    if (!lead.rollNumber.trim())
      return "Lead college roll/registration number is required";
    if (members.length + 1 > maxMembersTotal)
      return `Maximum ${maxMembersTotal} members allowed`;
    return "";
  }

  const addMember = () => {
    if (members.length + 1 >= maxMembersTotal) return;
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
      const res = await axios.post(
        "https://dasho-backend.onrender.com/participant/register/hackathon/" +
          state._id,
        payload
      );
      if (res?.data) {
        localStorage.setItem(
          "lastRegistration",
          JSON.stringify({ payload, server: res.data })
        );
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.updatedUser)
        );
      }
      setSuccess(true);
      setTimeout(() => navigate("/profile"), 1400);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-poppins bg-[#212121] flex justify-center items-center px-4 sm:px-6 py-10 sm:py-16 relative">
      <BackgroundBeams className="fixed inset-0 z-0" />
      <div className="max-w-3xl w-full mx-auto bg-[#161616] border border-[#aeaeae4d] shadow-lg rounded-2xl p-4 sm:p-6 relative z-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white text-center">
          Team Registration
        </h2>
        {eventTitle && (
          <div className="text-center mb-4 sm:mb-6">
            <span className="text-sm sm:text-base text-gray-400">Event:</span>{" "}
            <span className="font-medium font-nerko text-2xl sm:text-3xl text-white">
              {eventTitle}
            </span>
          </div>
        )}

        {success ? (
          <div className="border border-green-700 text-green-700 p-3 sm:p-4 rounded-lg text-center text-sm sm:text-base">
            ✅ Team registered successfully — redirecting to your profile...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm sm:text-base font-medium mb-1 text-white">
                Team Name
              </label>
              <input
                className="w-full border text-sm sm:text-base bg-transparent text-gray-300 border-[#aeaeae4d] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#8989894d] transition-all duration-300 placeholder:opacity-40"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter your team name"
              />
            </div>

            {/* Team Lead Section */}
            <fieldset className="border border-[#aeaeae4d] p-3 sm:p-4 rounded-lg">
              <legend className="text-sm sm:text-base font-semibold text-white px-2">
                Team Lead
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {Object.keys(lead).map((field, idx) => (
                  <input
                    key={idx}
                    className="border text-sm sm:text-base bg-transparent text-gray-300 border-[#aeaeae4d] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#8989894d] transition-all duration-300 placeholder:opacity-40"
                    value={lead[field]}
                    onChange={(e) =>
                      setLead({ ...lead, [field]: e.target.value })
                    }
                    placeholder={
                      field === "rollNumber"
                        ? "Roll / Reg No."
                        : field.charAt(0).toUpperCase() + field.slice(1)
                    }
                  />
                ))}
              </div>
            </fieldset>

            {/* Members */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <p className="font-medium text-sm sm:text-base text-white">
                Members (including lead): {members.length + 1}/{maxMembersTotal}
              </p>
              <button
                type="button"
                onClick={addMember}
                disabled={members.length + 1 >= maxMembersTotal}
                className="cursor-pointer w-full sm:w-auto border text-sm sm:text-base border-[#aeaeae4d] text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                + Add Member
              </button>
            </div>

            {members.map((m, idx) => (
              <fieldset
                key={idx}
                className="border border-[#aeaeae4d] p-3 sm:p-4 rounded-lg relative"
              >
                <button
                  type="button"
                  onClick={() => removeMember(idx)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg sm:text-xl"
                >
                  ✕
                </button>
                <legend className="text-sm sm:text-base font-semibold text-white px-2">
                  Member {idx + 2}
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {Object.keys(m).map((field, i) => (
                    <input
                      key={i}
                      className="border text-sm sm:text-base bg-transparent text-gray-300 border-[#aeaeae4d] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#8989894d] transition-all duration-300 placeholder:opacity-40"
                      value={m[field]}
                      onChange={(e) => updateMember(idx, field, e.target.value)}
                      placeholder={
                        field === "rollNumber"
                          ? "Roll / Reg No."
                          : field.charAt(0).toUpperCase() + field.slice(1)
                      }
                    />
                  ))}
                </div>
              </fieldset>
            ))}

            {error && (
              <div className="text-red-700 font-medium text-sm sm:text-base">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2 text-sm sm:text-base cursor-pointer border border-[#aeaeae4d] text-white rounded-lg hover:bg-white hover:text-black transition w-full sm:w-auto"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-sm sm:text-base cursor-pointer border border-[#aeaeae4d] text-white rounded-lg hover:bg-white hover:text-black transition disabled:bg-gray-600 disabled:cursor-not-allowed w-full sm:w-auto"
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
