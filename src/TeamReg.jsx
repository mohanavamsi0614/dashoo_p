import { useState } from "react";
import axios from "axios";
import { useLocation, useParams, useNavigate } from "react-router-dom";

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
    if (!lead.rollNumber.trim()) return "Lead college roll/registration number is required";
    if (members.length + 1 > maxMembersTotal) return `Maximum ${maxMembersTotal} members allowed`;
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
    const next = members.map((m, i) => (i === idx ? { ...m, [field]: value } : m));
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
        "https://dasho-backend.onrender.com/participant/register/hackathon/" + state._id,
        payload
      );
      if (res?.data) {
        localStorage.setItem("lastRegistration", JSON.stringify({ payload, server: res.data }));
      }
      setSuccess(true);
      setTimeout(() => navigate("/profile"), 1400);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
        Team Registration
      </h2>
      {eventTitle && (
        <div className="text-center mb-6">
          <span className="text-gray-600">Event:</span>{" "}
          <span className="font-semibold">{eventTitle}</span>
        </div>
      )}

      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded-lg text-center">
          ✅ Team registered successfully — redirecting to your profile...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Team Name</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team name"
            />
          </div>

          {/* Team Lead Section */}
          <fieldset className="border border-gray-200 p-4 rounded-lg">
            <legend className="text-md font-semibold text-gray-700 px-2">
              Team Lead
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.keys(lead).map((field, idx) => (
                <input
                  key={idx}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400"
                  value={lead[field]}
                  onChange={(e) => setLead({ ...lead, [field]: e.target.value })}
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
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-700">
              Members (including lead): {members.length + 1}/{maxMembersTotal}
            </p>
            <button
              type="button"
              onClick={addMember}
              disabled={members.length + 1 >= maxMembersTotal}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-300"
            >
              + Add Member
            </button>
          </div>

          {members.map((m, idx) => (
            <fieldset
              key={idx}
              className="border border-gray-200 p-4 rounded-lg relative"
            >
              <button
                type="button"
                onClick={() => removeMember(idx)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
              <legend className="text-md font-semibold text-gray-700 px-2">
                Member {idx + 2}
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.keys(m).map((field, i) => (
                  <input
                    key={i}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400"
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

          {error && <div className="text-red-600 font-medium">{error}</div>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2 border border-gray-400 rounded-lg hover:bg-gray-100"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
            >
              {loading ? "Registering..." : "Register Team"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
