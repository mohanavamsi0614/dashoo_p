import axios from "axios";
import api from "../lib/api";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
function Payment() {
  const navigate = useNavigate();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const wid = useRef(null);
  const { eventId, teamId } = useParams();
  const [data, setData] = useState(null);
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
        if (err.response.data.error === "Team already paid")
          setPaid(true);
      });

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-4 py-10 text-[#ECE8E7] relative">
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <BackButton />
      </div>
      <div className="w-full max-w-3xl bg-[#020617]/90 border border-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          Hackathon Payment
        </h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Review the event details and complete your payment using the UPI
          details and QR provided.
        </p>
        {paid && (
          <div className="space-y-6">
            <div className="bg-[#020617] border border-gray-800 rounded-2xl p-4 sm:p-5 space-y-2">
              Already Paid
            </div>
          </div>
        )}
        {data && (
          <div className="space-y-6">
            {/* Event + Team Info */}
            <div className="bg-[#020617] border border-gray-800 rounded-2xl p-4 sm:p-5 space-y-2">
              <p className="text-sm text-gray-400">
                <span className="font-medium text-gray-200">Event:</span>{" "}
                {data.name}
              </p>
              <p className="text-sm text-gray-400">
                <span className="font-medium text-gray-200">Team:</span>{" "}
                {data.team.teamName}
              </p>
              <p className="text-sm text-gray-400">
                <span className="font-medium text-gray-200">Amount:</span>{" "}
                ₹{data.cost * ((data.team.members?.length || 0) + 1)}
                <span className="text-xs ml-1 text-gray-500">
                  (₹{data.cost} × {(data.team.members?.length || 0) + 1})
                </span>
              </p>
            </div>

            {/* Payment Methods */}
            <div className="bg-[#020617] border border-gray-800 rounded-2xl p-4 sm:p-5">
              <h2 className="text-lg font-semibold mb-3">Available Payments</h2>
              <div className="space-y-5">
                {data.payments.reverse().map((pay, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 md:items-center"
                  >
                    <div className="flex-1 space-y-2">
                      {pay.bankName && (
                        <p className="text-sm text-gray-300">
                          <span className="font-medium text-gray-100">
                            Bank Name:
                          </span>{" "}
                          {pay.bankName}
                        </p>
                      )}
                      {pay.accountNumber && (
                        <p className="text-sm text-gray-300">
                          <span className="font-medium text-gray-100">
                            Account Number:
                          </span>{" "}
                          {pay.accountNumber}
                        </p>
                      )}
                      {pay.ifscCode && (
                        <p className="text-sm text-gray-300">
                          <span className="font-medium text-gray-100">
                            IFSC Code:
                          </span>{" "}
                          {pay.ifscCode}
                        </p>
                      )}
                      {pay.accountName && (
                        <p className="text-sm text-gray-300">
                          <span className="font-medium text-gray-100">
                            Account Name:
                          </span>{" "}
                          {pay.accountName}
                        </p>
                      )}
                      <p className="text-sm text-gray-300">
                        <span className="font-medium text-gray-100">
                          UPI ID:
                        </span>{" "}
                        {pay.upi}
                      </p>
                      <p className="text-xs text-gray-500">
                        Scan the QR or pay to this UPI and then enter your
                        transaction reference.
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      {pay.upi ?
                        <div>
                          <img src={pay.imgUrl} />
                        </div>
                        :
                        <img
                          src={pay.imgUrl}
                          alt="UPI QR"
                          className="w-32 h-32 object-contain rounded-lg border border-gray-700 bg-black"
                        />
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Payment Submission */}
            <div className="bg-[#020617] border border-gray-800 rounded-2xl p-4 sm:p-5 space-y-4">
              <h2 className="text-lg font-semibold">Submit your payment</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Transaction / UPI Reference ID
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-700 bg-[#020617] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E16254]"
                    placeholder="Enter transaction ID / UPI reference"
                    value={payment.upi}
                    onChange={(e) =>
                      setPayment((prev) => ({
                        ...prev,
                        upi: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-gray-300">
                    Upload payment screenshot
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <button
                      type="button"
                      onClick={() => wid.current && wid.current.open()}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#E16254] text-white text-sm font-medium hover:bg-[#c65045] transition shadow"
                    >
                      Upload Screenshot
                    </button>
                    {payment.imgUrl && (
                      <span className="text-xs text-emerald-400">
                        Screenshot uploaded ✓
                      </span>
                    )}
                  </div>
                  {payment.imgUrl && (
                    <img
                      src={payment.imgUrl}
                      alt="Payment proof"
                      className="mt-2 w-40 h-40 object-contain rounded-lg border border-gray-700 bg-black"
                    />
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg transform hover:-translate-y-0.5 transition"
                >
                  Submit Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {
        showSuccessPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#0f172a] border border-gray-700 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl transform transition-all scale-100 opacity-100">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                  <svg
                    className="w-8 h-8 text-green-500"
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

                <h3 className="text-2xl font-bold text-white">
                  Thanks for verification!
                </h3>

                <p className="text-gray-300 leading-relaxed">
                  The team is verifying the payment. After verifying we will send you the mail.
                </p>

                <button
                  onClick={() => navigate("/")}
                  className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:from-indigo-600 hover:to-purple-600 shadow-lg transform active:scale-95 transition-all duration-200"
                >
                  Back to Home
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
