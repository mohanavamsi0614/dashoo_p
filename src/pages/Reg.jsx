import { useEffect, useState } from "react";
import api from "../lib/api";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import TeamReg from "./TeamReg";
import { BackgroundBeams } from "../components/ui/background-beams";
import RegistrationSuccessPopup from "../components/RegistrationSuccessPopup";

export default function Reg() {
  const { eventID } = useParams();
  const loc = useLocation();
  const [state, setState] = useState(loc.state || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      api.get(`/participant/eventdata/${eventID}`)
        .then(res => {
          setState(res.data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [eventID, state]);

  const [form, setForm] = useState({
    name: "",
    college: "",
    year: "",
    stream: "",
    branch: "",
    rollNumber: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const handleClosePopup = () => {
    navigate("/profile");
  };

  const eventTitle = state?.eventTitle || eventID || "";
  const eventType = state?.type || state?.event?.type || state?.eventType || "qr";

  // If this is a team event, show TeamReg component
  if (eventType !== "qr") {
    return <TeamReg state={state} />;
  }

  function validate() {
    if (!form.name.trim()) return "Name is required";
    if (!form.college.trim()) return "College is required";
    if (!form.year.trim()) return "Year is required";
    if (!form.rollNumber.trim()) return "Roll number is required";
    if (!form.email.trim()) return "Email is required";
    return "";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) return setError(v);
    setLoading(true);

    try {
      const payload = {
        ...form,
        eventName: eventTitle,
        userId: JSON.parse(localStorage.getItem("user"))?._id,
      };

      const res = await api.post(
        `/participant/register/qr/${state._id}`,
        payload
      );

      if (res?.data) {
        localStorage.setItem(
          "lastRegistration",
          JSON.stringify({ payload, server: res.data })
        );
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setSuccessData(res.data);
      }
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-[#111] border border-white/10 text-gray-200 rounded-xl p-3 sm:p-4 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 placeholder:text-gray-600 text-sm sm:text-base shadow-inner";
  const labelClasses = "block text-sm sm:text-base text-gray-300 font-medium mb-1.5 ml-1";

  return (
    <div className="min-h-screen font-poppins bg-[#0a0a0a] flex justify-center items-center px-4 sm:px-6 py-10 sm:py-16 relative overflow-hidden">
      <BackgroundBeams className="fixed inset-0 z-0 opacity-40" />

      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-10 relative z-10 shadow-2xl">
        <div className="text-center mb-10">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 mb-4 inline-block tracking-wider uppercase">Individual Registration</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            Register for{" "}
            <span className="font-nerko text-4xl sm:text-5xl font-medium text-gradient text-glow block mt-2">
              {eventTitle || "the event"}
            </span>
          </h1>
        </div>

        <RegistrationSuccessPopup
          isOpen={!!successData}
          onClose={handleClosePopup}
          data={successData}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={labelClasses}>Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>College <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.college}
              onChange={(e) => setForm({ ...form, college: e.target.value })}
              placeholder="Your college name"
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Year <span className="text-red-500">*</span></label>
              <input
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="e.g. 1, 2, 3, 4"
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Stream</label>
              <input
                value={form.stream}
                onChange={(e) => setForm({ ...form, stream: e.target.value })}
                placeholder="e.g. B.Tech, MBA"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Branch</label>
              <input
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                placeholder="e.g. Computer Science"
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Email <span className="text-red-500">*</span></label>
              <input
                value={form.email}
                type="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. john@college.edu"
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Roll Number / Reg No. <span className="text-red-500">*</span></label>
            <input
              value={form.rollNumber}
              onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
              placeholder="College roll or registration number"
              className={inputClasses}
            />
          </div>

          {state?.other?.length > 0 && (
            <div className="pt-4 border-t border-white/10 space-y-6">
              <h3 className="text-white font-medium">Additional Information</h3>
              {state.other.map((i, idx) => (
                <div key={idx}>
                  <label className={labelClasses}>{i.title}</label>
                  {i.type === 'text' && (
                    <input
                      value={form[i.title] || ""}
                      onChange={(e) => setForm({ ...form, [i.title]: e.target.value })}
                      placeholder={i.placeholder || ""}
                      className={inputClasses}
                    />
                  )}
                  {i.type === "upload" && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="file"
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/5 file:text-indigo-300 hover:file:bg-white/10 file:transition-colors file:cursor-pointer"
                        onChange={(e) => setForm({ ...form, [i.title]: e.target.files[0] })}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-sm sm:text-base text-red-400 bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-center shadow-inner">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 sm:py-4 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all font-medium text-sm sm:text-base w-full sm:w-1/3 order-2 sm:order-1"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold transition-all shadow-lg hover:shadow-indigo-500/40 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 w-full order-1 sm:order-2"
            >
              {loading ? "Registering..." : "Complete Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
