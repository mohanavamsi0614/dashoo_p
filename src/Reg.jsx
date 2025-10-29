import { useState } from "react";
import axios from "axios";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import TeamReg from "./TeamReg";
import { BackgroundBeams } from "./components/ui/background-beams";

export default function Reg() {
  const { name: eventParam } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

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

  const eventTitle = state?.eventTitle || eventParam || "";
  const eventType =
    state?.type || state?.event?.type || state?.eventType || "qr";

  // ✅ If this is a team event, show TeamReg component
  if (eventType !== "qr") {
    return <TeamReg />;
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

      const res = await axios.post(
        `https://dasho-backend.onrender.com/participant/register/qr/${state._id}`,
        payload
      );

      if (res?.data) {
        localStorage.setItem(
          "lastRegistration",
          JSON.stringify({ payload, server: res.data })
        );
        console.log("Registration response:", res.data);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      setSuccess(true);
      setTimeout(() => navigate("/profile"), 1500);
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
    <div className="min-h-screen font-poppins bg-[#212121] flex justify-center items-center pt-10 pb-16 relative">
      <BackgroundBeams className="fixed inset-0 z-0" />
      <div className="w-full max-w-2xl bg-[#161616] border border-[#aeaeae4d] rounded-2xl shadow-lg p-8 relative z-10">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">
          Register for{" "}
          <span className="font-nerko text-3xl font-medium">
            {eventTitle || "the event"}
          </span>
        </h1>

        {success ? (
          <div className="p-4 text-green-700 bg-transparent border border-green-700 rounded-lg text-center">
            ✅ Registration successful — redirecting to your profile...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                className="w-full border bg-transparent text-gray-300 border-[#aeaeae4d] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#8989894d] transition-all duration-300 placeholder:opacity-40 placeholder:transition-opacity placeholder:duration-300 focus:placeholder:opacity-30"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-1">
                College
              </label>
              <input
                type="text"
                value={form.college}
                onChange={(e) => setForm({ ...form, college: e.target.value })}
                placeholder="Your college name"
                className="w-full border bg-transparent text-gray-300 border-[#aeaeae4d] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#8989894d] transition-all duration-300 placeholder:opacity-40 placeholder:transition-opacity placeholder:duration-300 focus:placeholder:opacity-30"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-1">
                  Year
                </label>
                <input
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  placeholder="e.g. 1, 2, 3, 4"
                  className="w-full border bg-transparent text-gray-300 border-[#aeaeae4d] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#8989894d] transition-all duration-300 placeholder:opacity-40 placeholder:transition-opacity placeholder:duration-300 focus:placeholder:opacity-30"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-1">
                  Stream
                </label>
                <input
                  value={form.stream}
                  onChange={(e) => setForm({ ...form, stream: e.target.value })}
                  placeholder="e.g. B.Tech, MBA"
                  className="w-full border bg-transparent text-gray-300 border-[#aeaeae4d] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#8989894d] transition-all duration-300 placeholder:opacity-40 placeholder:transition-opacity placeholder:duration-300 focus:placeholder:opacity-30"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-1">
                  Branch
                </label>
                <input
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className="w-full border bg-transparent text-gray-300 border-[#aeaeae4d] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#8989894d] transition-all duration-300 placeholder:opacity-40 placeholder:transition-opacity placeholder:duration-300 focus:placeholder:opacity-30"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-1">
                  Email
                </label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. john@college.edu"
                  className="w-full border bg-transparent text-gray-300 border-[#aeaeae4d] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#8989894d] transition-all duration-300 placeholder:opacity-40 placeholder:transition-opacity placeholder:duration-300 focus:placeholder:opacity-30"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-1">
                Roll Number | College Registration Number
              </label>
              <input
                value={form.rollNumber}
                onChange={(e) =>
                  setForm({ ...form, rollNumber: e.target.value })
                }
                placeholder="College roll or registration number"
                className="w-full border bg-transparent text-gray-300 border-[#aeaeae4d] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#8989894d] transition-all duration-300 placeholder:opacity-40 placeholder:transition-opacity placeholder:duration-300 focus:placeholder:opacity-30"
              />
            </div>

            {error && (
              <div className="text-red-700 bg-transparent border border-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-transparent cursor-pointer border border-[#aeaeae4d] hover:bg-white hover:text-black hover:border-white text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-60"
              >
                {loading ? "Registering..." : "Register"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-transparent cursor-pointer border border-[#aeaeae4d] hover:bg-white hover:text-black hover:border-white text-white font-semibold px-6 py-2 rounded-lg transition"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
