import axios from "axios";
import api from "../lib/api";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { BackgroundBeams } from "../components/ui/background-beams";

function Payment() {
  const navigate = useNavigate();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const wid = useRef(null);
  const { eventId, teamId } = useParams();
  const [data, setData] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [paid, setPaid] = useState(false);
  const [payment, setPayment] = useState({
    upi: "",
    imgUrl: "",
  });

  useEffect(() => {
    api.get(`/participant/payment/hackthon/${eventId}/${teamId}`)
      .then((res) => {
        if (res.data)
          setData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching payment data:", err.response);
        if (err.response?.data?.error === "Team already paid")
          setPaid(true);
      });

    api.get(`/participant/eventdata/${eventId}`)
      .then((res) => {
        if (res.data) setEventData(res.data);
      })
      .catch((err) => console.error("Error fetching event data", err));

    if (typeof window === "undefined") return;

    if (!window.cloudinary) {
      console.error(
        "Cloudinary widget not found. Make sure the Cloudinary script is included in index.html"
      );
      return;
    }

    if (wid.current) return;

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dfseckyjx",
        uploadPreset: "qbvu3y5j",
        multiple: false,
        folder: "payments",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Uploaded", result.info);
          setPayment((prev) => ({
            ...prev,
            imgUrl: result.info.secure_url,
          }));
        } else if (error) {
          console.error("Cloudinary error:", error);
          alert("Error uploading image!");
        }
      }
    );

    wid.current = widget;
  }, [eventId, teamId]);

  const handleSubmit = async () => {
    if (!payment.upi || !payment.imgUrl) {
      alert("Please upload payment proof");
      return;
    }
    try {
      const res = await api.post(
        `/participant/payment/hackthon/${eventId}/${teamId}`,
        payment
      );
      console.log(res.data);
      setShowSuccessPopup(true);
    } catch (err) {
      console.error(err);
      alert("Payment submission failed", err);
    }
  };

  const minMembers = eventData ? (parseInt(eventData.minTeamMembers) || 1) : 1;
  const currentMembers = data ? ((data.team?.members?.length || 0) + 1) : 1;
  const isTeamComplete = currentMembers >= minMembers;

  return (
    <div className="min-h-screen font-poppins bg-[#0a0a0a] flex justify-center items-center px-4 sm:px-6 py-10 sm:py-16 relative overflow-hidden text-gray-200">
      <BackgroundBeams className="fixed inset-0 z-0 opacity-40" />

      {/* Decorative glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20">
        <BackButton />
      </div>

      <div className="w-full max-w-3xl glass-card rounded-3xl shadow-2xl p-6 sm:p-10 relative z-10">
        <div className="text-center mb-10">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 mb-4 inline-block tracking-wider uppercase">Secure Checkout</span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Complete your{" "}
            <span className="font-nerko text-4xl sm:text-5xl font-medium text-gradient text-glow block mt-2">
              Payment
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-4 max-w-md mx-auto">
            Review your event details and securely complete your payment to finalize registration.
          </p>
        </div>

        {paid && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 mb-8 text-center text-emerald-400 font-medium">
            ✅ This team has already completed the payment!
          </div>
        )}

        {data && eventData && !isTeamComplete && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 mb-8 text-center text-yellow-500 font-medium shadow-lg">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-xl font-bold mb-2">Team Incomplete</h3>
            <p className="text-sm">
              Your team currently has <span className="font-bold text-white">{currentMembers}</span> member(s), but a minimum of <span className="font-bold text-white">{minMembers}</span> members is required to proceed with payment.
              <br /><br />
              Please share your <b className="text-indigo-400">Team Code</b> with your members so they can join before paying.
            </p>
          </div>
        )}

        {data && (!eventData || isTeamComplete) && (
          <div className="space-y-8">
            {/* Event + Team Info */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] pointer-events-none"></div>
              <h3 className="text-lg font-semibold text-white mb-2 border-b border-white/10 pb-2">Order Summary</h3>
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-gray-400">Event Name</span>
                <span className="font-medium text-white">{data.name}</span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-gray-400">Team Name</span>
                <span className="font-medium text-white">{data.team.teamName}</span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base border-t border-white/10 pt-4 mt-2">
                <span className="text-gray-300 font-medium">Total Amount</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white block">₹{data.cost * ((data.team.members?.length || 0) + 1)}</span>
                  <span className="text-xs text-indigo-400">
                    (₹{data.cost} × {(data.team.members?.length || 0) + 1} members)
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-nerko text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-indigo-500 rounded-full"></span>
                Payment Instructions
              </h2>
              <div className="space-y-6">
                {data.payments.reverse().map((pay, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-center md:items-start group hover:border-indigo-500/50 transition-colors"
                  >
                    <div className="flex-1 space-y-3 w-full">
                      {pay.bankName && (
                        <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wider">Bank</span>
                          <span className="text-sm text-gray-200 font-medium">{pay.bankName}</span>
                        </div>
                      )}
                      {pay.accountNumber && (
                        <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wider">Account No</span>
                          <span className="text-sm text-gray-200 font-medium tracking-wider">{pay.accountNumber}</span>
                        </div>
                      )}
                      {pay.ifscCode && (
                        <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wider">IFSC</span>
                          <span className="text-sm text-gray-200 font-medium tracking-wider">{pay.ifscCode}</span>
                        </div>
                      )}
                      {pay.accountName && (
                        <div className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wider">Name</span>
                          <span className="text-sm text-gray-200 font-medium">{pay.accountName}</span>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row sm:justify-between pt-2">
                        <span className="text-xs text-indigo-400 uppercase tracking-wider font-semibold">UPI ID</span>
                        <span className="text-base text-white font-bold">{pay.upi}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-4 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                        Scan the QR code or send payment directly to the UPI ID above. Ensure you note the exact transaction reference number.
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-shadow">
                      {pay.upi ?
                        <img src={pay.imgUrl} className="w-40 h-40 object-contain" alt="QR Code" />
                        :
                        <img
                          src={pay.imgUrl}
                          alt="UPI QR"
                          className="w-40 h-40 object-contain rounded-lg"
                        />
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Submission */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              <h2 className="text-xl font-nerko text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
                Verify Payment
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Transaction / UPI Reference ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner text-lg font-mono tracking-wider placeholder:text-gray-600 placeholder:font-sans placeholder:tracking-normal placeholder:text-base uppercase"
                    placeholder="e.g. 31234567890"
                    value={payment.upi}
                    onChange={(e) =>
                      setPayment((prev) => ({
                        ...prev,
                        upi: e.target.value.toUpperCase(),
                      }))
                    }
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Screenshot <span className="text-red-500">*</span>
                  </label>

                  <div className="flex flex-col items-start gap-4">
                    {!payment.imgUrl ? (
                      <button
                        type="button"
                        onClick={() => wid.current && wid.current.open()}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 border-dashed border-indigo-500/50 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-300 font-medium transition-colors cursor-pointer group"
                      >
                        <span className="text-2xl group-hover:-translate-y-1 transition-transform">⇧</span>
                        Upload Screenshot
                      </button>
                    ) : (
                      <div className="w-full relative group">
                        <img
                          src={payment.imgUrl}
                          alt="Payment proof"
                          className="w-full sm:w-64 h-auto max-h-64 object-cover rounded-xl border-2 border-emerald-500/50 shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={() => wid.current && wid.current.open()}
                          className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-white/20 hover:bg-black transition-colors"
                        >
                          Change Image
                        </button>
                        <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                          <span>✓</span> Uploaded
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-10 flex flex-col sm:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-lg font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)] transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!payment.upi || !payment.imgUrl}
                >
                  Submit Payment Verification
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {
        showSuccessPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="glass-card border border-emerald-500/30 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl relative overflow-hidden">
              {/* Confetti background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/10 blur-[50px] pointer-events-none"></div>

              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>

                <div>
                  <h3 className="text-3xl font-nerko text-white mb-2">
                    Payment Submitted!
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Thank you. The organization team will verify your payment and transaction ID shortly. You will receive a confirmation email once verified.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/")}
                  className="mt-6 w-full py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
                >
                  Return to Homepage
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}

export default Payment;
