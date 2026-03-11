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

  const btnClasses = "px-6 py-4 border-2 border-black font-black uppercase tracking-widest text-sm shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all";

  return (
    <div className="min-h-screen font-sans bg-[#f4efe6] flex justify-center items-center px-4 sm:px-6 py-20 pt-28 text-black">
      <div className="absolute top-6 left-6 z-20">
        <BackButton />
      </div>

      <div className="w-full max-w-3xl bg-white border-4 border-black p-6 sm:p-10 shadow-[8px_8px_0_0_#000] relative z-10">
        <div className="text-center mb-10 border-b-4 border-black pb-8">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest bg-black text-white inline-block mb-4">
            Secure Checkout
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-2">
            Complete your{" "}
            <span className="text-[#7a6cf0] block mt-2">
              Payment
            </span>
          </h1>
          <p className="font-serif italic text-gray-800 mt-4 max-w-md mx-auto">
            Review your event details and complete your payment to finalize registration.
          </p>
        </div>

        {paid && (
          <div className="bg-[#c3cfa1] border-4 border-black p-6 mb-8 text-center text-black font-black uppercase tracking-widest shadow-[4px_4px_0_0_#000]">
            ✅ This team has already completed the payment!
          </div>
        )}

        {data && eventData && !isTeamComplete && (
          <div className="bg-yellow-400 border-4 border-black p-6 mb-8 text-center text-black font-bold uppercase shadow-[4px_4px_0_0_#000]">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-2xl font-black mb-2 tracking-tighter">Team Incomplete</h3>
            <p className="text-sm tracking-widest">
              Your team currently has <span className="font-black underline">{currentMembers}</span> member(s), but a minimum of <span className="font-black underline">{minMembers}</span> members is required.
              <br /><br />
              Please share your <b className="bg-black text-white px-2 py-1">Team Code</b> with your members so they can join before paying.
            </p>
          </div>
        )}

        {data && (!eventData || isTeamComplete) && (
          <div className="space-y-8">
            {/* Event + Team Info */}
            <div className="bg-[#f4efe6] border-4 border-black p-6 space-y-4 shadow-[4px_4px_0_0_#000]">
              <h3 className="text-2xl font-black uppercase tracking-tighter border-b-2 border-black pb-2 mb-4">Order Summary</h3>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm font-bold uppercase tracking-widest border-b border-black pb-3">
                <span>Event Name</span>
                <span className="font-black text-lg">{data.name}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm font-bold uppercase tracking-widest border-b border-black pb-3 mt-3">
                <span>Team Name</span>
                <span className="font-black text-lg">{data.team.teamName}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm font-bold uppercase tracking-widest pt-3 mt-3">
                <span>Total Amount</span>
                <div className="text-left sm:text-right mt-2 sm:mt-0">
                  <span className="text-3xl font-black block">₹{data.cost * ((data.team.members?.length || 0) + 1)}</span>
                  <span className="text-xs bg-black text-white px-2 py-1 mt-1 inline-block">
                    (₹{data.cost} × {(data.team.members?.length || 0) + 1} members)
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0_0_#000]">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-2 border-black pb-2">
                Payment Instructions
              </h2>
              <div className="space-y-6">
                {data.payments.reverse().map((pay, idx) => (
                  <div
                    key={idx}
                    className="bg-[#f4efe6] border-2 border-black p-6 flex flex-col md:flex-row gap-8 items-start hover:-translate-y-1 transition-transform shadow-[4px_4px_0_0_#000]"
                  >
                    <div className="flex-1 space-y-3 w-full font-bold uppercase tracking-widest text-sm">
                      {pay.bankName && (
                        <div className="flex flex-col sm:flex-row sm:justify-between border-b border-black pb-2">
                          <span>Bank</span>
                          <span className="font-black">{pay.bankName}</span>
                        </div>
                      )}
                      {pay.accountNumber && (
                        <div className="flex flex-col sm:flex-row sm:justify-between border-b border-black pb-2">
                          <span>Account No</span>
                          <span className="font-black">{pay.accountNumber}</span>
                        </div>
                      )}
                      {pay.ifscCode && (
                        <div className="flex flex-col sm:flex-row sm:justify-between border-b border-black pb-2">
                          <span>IFSC</span>
                          <span className="font-black">{pay.ifscCode}</span>
                        </div>
                      )}
                      {pay.accountName && (
                        <div className="flex flex-col sm:flex-row sm:justify-between border-b border-black pb-2">
                          <span>Name</span>
                          <span className="font-black">{pay.accountName}</span>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row sm:justify-between pt-2">
                        <span className="text-[#7a6cf0] font-black items-center">UPI ID</span>
                        <span className="text-lg font-black bg-[#c3cfa1] px-2 border-2 border-black">{pay.upi}</span>
                      </div>
                      <p className="text-xs font-serif italic normal-case tracking-normal mt-4 bg-white p-3 border-2 border-black shadow-[2px_2px_0_0_#000]">
                        Scan the QR code or send payment directly to the UPI ID above. Note the exact transaction reference number.
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center p-4 bg-white border-4 border-black shadow-[4px_4px_0_0_#000]">
                      <img
                        src={pay.imgUrl}
                        alt="UPI QR"
                        className="w-40 h-40 object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Submission */}
            <div className="bg-[#c3cfa1] border-4 border-black p-6 shadow-[4px_4px_0_0_#000]">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-2 border-black pb-2">
                Verify Payment
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest mb-2">
                    Transaction / UPI Reference ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white border-2 border-black rounded-none px-4 py-4 text-black focus:outline-none focus:ring-0 focus:border-[#7a6cf0] transition-all shadow-[4px_4px_0_0_#000] text-lg font-mono font-bold tracking-widest uppercase placeholder:font-serif italic placeholder:normal-case placeholder:font-normal placeholder:tracking-normal"
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
                  <label className="block text-sm font-black uppercase tracking-widest mb-2">
                    Payment Screenshot <span className="text-red-500">*</span>
                  </label>

                  <div className="flex flex-col items-start gap-4">
                    {!payment.imgUrl ? (
                      <button
                        type="button"
                        onClick={() => wid.current && wid.current.open()}
                        className={`bg-white text-black w-full sm:w-auto ${btnClasses}`}
                      >
                        Upload Screenshot
                      </button>
                    ) : (
                      <div className="w-full relative group p-2 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] inline-block">
                        <img
                          src={payment.imgUrl}
                          alt="Payment proof"
                          className="w-full sm:w-64 h-auto max-h-64 object-cover border-2 border-black"
                        />
                        <button
                          type="button"
                          onClick={() => wid.current && wid.current.open()}
                          className="absolute bottom-4 left-4 bg-black text-white text-xs font-bold uppercase tracking-widest px-3 py-2 border-2 border-white hover:bg-white hover:text-black transition-colors"
                        >
                          Change Image
                        </button>
                        <div className="absolute top-4 right-4 bg-[#c3cfa1] text-black border-2 border-black text-xs font-black uppercase tracking-widest px-3 py-1 shadow-[2px_2px_0_0_#000]">
                          Uploaded
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-10 flex flex-col sm:flex-row justify-end gap-4 border-t-2 border-black mt-8">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={`w-full sm:w-auto bg-black text-white hover:bg-[#7a6cf0] ${btnClasses} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:translate-x-0 disabled:hover:translate-y-0`}
                  disabled={!payment.upi || !payment.imgUrl}
                >
                  Submit Processing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {
        showSuccessPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f4efe6]/90 p-4">
            <div className="bg-white border-4 border-black p-8 sm:p-10 max-w-md w-full shadow-[12px_12px_0_0_#000] text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-20 h-20 bg-[#c3cfa1] border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0_0_#000]">
                  <span className="text-4xl">✓</span>
                </div>

                <div>
                  <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 border-b-2 border-black pb-2">
                    Success!
                  </h3>
                  <p className="font-serif italic text-gray-800 leading-relaxed">
                    Transaction submitted. Our team will verify it shortly and send you an email confirmation.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/")}
                  className="mt-6 w-full py-4 bg-black text-white font-black uppercase tracking-widest text-sm border-2 border-black hover:bg-white hover:text-black transition-colors shadow-[4px_4px_0_0_#000]"
                >
                  Return Home
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default Payment;
