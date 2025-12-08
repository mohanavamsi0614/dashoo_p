import axios from "axios";
import api from "../lib/api";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"; // make sure you're using react-router-dom v6

function Payment() {
  const wid = useRef(null);
  const { eventId, teamId } = useParams();
  const [data, setData] = useState(null);

  const [payment, setPayment] = useState({
    upi: "",
    imgUrl: "",
  });

  useEffect(() => {
    // 1) Fetch payment data for this event + team
    api
      .get(
        `/participant/payment/hackthon/${eventId}/${teamId}`
      )
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching payment data:", err);
      });

    // 2) Initialise Cloudinary upload widget
    if (typeof window === "undefined") return;

    // Make sure script is loaded
    if (!window.cloudinary) {
      console.error(
        "Cloudinary widget not found. Make sure the Cloudinary script is included in index.html"
      );
      return;
    }

    // Avoid recreating widget if it already exists (React StrictMode calls useEffect twice in dev)
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
      alert("Payment submitted successfully");
    } catch (err) {
      console.error(err);
      alert("Payment submission failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-4 py-10 text-[#ECE8E7]">
      <div className="w-full max-w-3xl bg-[#020617]/90 border border-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          Hackathon Payment
        </h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Review the event details and complete your payment using the UPI
          details and QR provided.
        </p>

        {!data && (
          <p className="text-center text-gray-400">Loading payment details...</p>
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
                ₹{data.cost}
              </p>
            </div>

            {/* Payment Methods */}
            <div className="bg-[#020617] border border-gray-800 rounded-2xl p-4 sm:p-5">
              <h2 className="text-lg font-semibold mb-3">Available Payments</h2>
              <div className="space-y-5">
                {data.payments.map((pay, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 md:items-center"
                  >
                    <div className="flex-1 space-y-2">
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
                      <img
                        src={pay.imgUrl}
                        alt="UPI QR"
                        className="w-32 h-32 object-contain rounded-lg border border-gray-700 bg-black"
                      />
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
                    Upload payment screenshot (optional but recommended)
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
    </div>
  );
}

export default Payment;
