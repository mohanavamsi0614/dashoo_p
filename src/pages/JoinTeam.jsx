import { useState } from "react";
import api from "../lib/api";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import RegistrationSuccessPopup from "../components/RegistrationSuccessPopup";

export default function JoinTeam() {
    const { eventID } = useParams();
    const loc = useLocation();
    const [state] = useState(loc.state || "");
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        college: "",
        year: "",
        stream: "",
        branch: "",
        rollNumber: "",
        email: "",
        phone: "",
    });
    const [teamCode, setTeamCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successData, setSuccessData] = useState(null);

    const eventTitle = state?.eventTitle || eventID || "";

    const handleClosePopup = () => {
        navigate("/profile");
    };

    const validate = () => {
        if (!teamCode.trim()) return "Team Code is required";
        if (!form.name.trim()) return "Name is required";
        if (!form.college.trim()) return "College is required";
        if (!form.year.trim()) return "Year is required";
        if (!form.rollNumber.trim()) return "Roll number is required";
        if (!form.email.trim()) return "Email is required";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const v = validate();
        if (v) return setError(v);

        setLoading(true);

        try {
            const payload = {
                member: form,
                teamCode: teamCode.trim().toUpperCase(),
                userId: JSON.parse(localStorage.getItem("user"))?._id,
            };

            const res = await api.post(`/participant/join/hackthon/${state._id || eventID}`, payload);

            if (res?.data) {
                setSuccessData({ message: "Successfully joined the team!" });
                // Optionally update local storage user data if returned
            }
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || err.response?.data?.error || "Failed to join team. Please check the team code."
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full bg-white border-[3px] border-black text-black rounded-none p-4 outline-none focus:ring-0 focus:border-[#7a6cf0] transition-all duration-300 placeholder:font-serif placeholder:italic shadow-[4px_4px_0_0_#000] mb-4 text-lg font-bold";
    const labelClasses = "block text-sm sm:text-base text-black font-black uppercase tracking-widest mb-2";

    return (
        <div className="min-h-screen font-sans bg-[#f4efe6] flex justify-center items-center px-4 sm:px-6 py-10 pt-28">
            <div className="w-full max-w-2xl bg-white border-[4px] border-black p-6 sm:p-10 shadow-[12px_12px_0_0_#000]">
                <div className="text-center mb-10 border-b-[4px] border-black pb-8">
                    <span className="px-3 py-1 text-xs font-black uppercase tracking-widest bg-black text-white inline-block mb-4">
                        Join a Team
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-black leading-tight">
                        Join Team for{" "}
                        <span className="font-black text-5xl sm:text-6xl lg:text-7xl text-[#7a6cf0] block mt-2">
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
                    <div className="bg-[#c3cfa1] border-[4px] border-black p-6 sm:p-8 relative overflow-hidden mb-12 shadow-[8px_8px_0_0_#000]">
                        <h3 className="font-black uppercase tracking-tighter text-3xl mb-4 border-b-[3px] border-black pb-2">Connect to a team</h3>
                        <label className={labelClasses}>Team Code <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={teamCode}
                            onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                            placeholder="e.g. ABCD12"
                            className="w-full bg-white border-[3px] border-black text-black font-mono font-black tracking-[0.2em] text-3xl uppercase rounded-none p-4 mt-2 outline-none shadow-[4px_4px_0_0_#000] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all text-center"
                        />
                        <p className="text-xs font-bold uppercase tracking-widest text-black mt-4 flex items-center justify-center gap-2">
                           <span>ℹ</span> Ask your team lead for the unique Team Code.
                        </p>
                    </div>

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>Roll Number / Reg No. <span className="text-red-500">*</span></label>
                            <input
                                value={form.rollNumber}
                                onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                                placeholder="College roll or reg no"
                                className={inputClasses}
                            />
                        </div>

                        <div>
                            <label className={labelClasses}>Phone Number</label>
                            <input
                                value={form.phone || ""}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                placeholder="e.g. 9876543210"
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    {state?.other?.length > 0 && (
                        <div className="pt-6 border-t-2 border-black space-y-6">
                            <h3 className="text-black font-black uppercase tracking-tighter text-2xl">Additional Information</h3>
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
                                        <div className="mt-2 bg-[#f4efe6] p-4 border-2 border-black shadow-[4px_4px_0_0_#000]">
                                            <input
                                                type="file"
                                                className="block w-full text-sm font-bold uppercase tracking-widest file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:text-sm file:font-bold file:uppercase file:bg-white file:text-black hover:file:bg-[#c3cfa1] file:transition-colors file:cursor-pointer file:shadow-[2px_2px_0_0_#000]"
                                                onChange={(e) => setForm({ ...form, [i.title]: e.target.files[0] })}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="text-sm sm:text-base text-white bg-red-600 border-[4px] border-black p-4 text-center shadow-[6px_6px_0_0_#000] font-black uppercase tracking-widest mt-10">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t-[4px] border-black mt-10">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-4 border-[3px] border-black bg-white text-black hover:bg-black hover:text-white transition-colors font-black uppercase tracking-widest text-sm shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:shadow-none w-full sm:w-1/3 order-2 sm:order-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-4 bg-[#7a6cf0] border-[3px] border-black hover:bg-[#c3cfa1] text-black font-black uppercase tracking-widest shadow-[6px_6px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                        >
                            {loading ? "JOINING..." : "JOIN TEAM"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
