import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, AlertCircle, Mail, CreditCard, X, Copy } from "lucide-react";

export default function RegistrationSuccessPopup({ isOpen, onClose, data }) {
    const [timeLeft, setTimeLeft] = useState(10);

    useEffect(() => {
        if (isOpen) {
            setTimeLeft(10);
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isOpen]);

    if (!isOpen || !data) return null;

    const { payment, mail, message, user, team, teamCode } = data;

    // Determine the content based on the flags
    let title = "Registration Successful!";
    let description = "Your team has been registered successfully.";
    let icon = <CheckCircle className="w-12 h-12 text-black" />;
    let type = "success"; // success, warning, neutral

    if (payment && mail) {
        title = "Action Required";
        description = "Registration successful! A payment email has been sent to your inbox. Please complete the payment to finalize your registration.";
        icon = <CreditCard className="w-12 h-12 text-black" />;
        type = "success";
    } else if (!payment && !mail && data.payment !== undefined) {
        title = "Action Needed";
        description = message || "User registered successfully, but the payment email could not be sent. Please contact support.";
        icon = <AlertCircle className="w-12 h-12 text-black" />;
        type = "warning";
    } else if (!payment && mail) {
        title = "Registration Complete";
        description = "User registered for event successfully and welcome mail has been sent. Good luck!";
        icon = <Mail className="w-12 h-12 text-black" />;
        type = "success";
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
                    {/* Backdrop */}
                    <div
                        onClick={timeLeft === 0 ? onClose : undefined}
                        className="absolute inset-0 bg-[#f4efe6]/90"
                    />

                    {/* Popup Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full max-w-2xl bg-white border-[4px] border-black shadow-[16px_16px_0_0_#000] overflow-hidden"
                    >
                        {/* Top Accent Bar */}
                        <div className={`h-4 w-full border-b-[4px] border-black ${type === 'warning' ? 'bg-yellow-400' : 'bg-[#c3cfa1]'}`} />

                        <button
                            onClick={onClose}
                            disabled={timeLeft > 0}
                            className="absolute top-8 right-6 text-black hover:scale-110 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <X size={32} />
                        </button>

                        <div className="p-8 sm:p-12 flex flex-col">
                            <div className="flex items-center gap-6 mb-8 border-b-[4px] border-black pb-6">
                                <div className={`min-w-[5rem] w-20 h-20 border-[4px] border-black flex items-center justify-center shadow-[6px_6px_0_0_#000] ${type === 'warning' ? 'bg-yellow-400' : 'bg-[#c3cfa1]'}`}>
                                    {icon}
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-black leading-none flex-1">
                                    {title}
                                </h2>
                            </div>
                            
                            <p className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-8 border-l-[4px] border-black pl-5">
                                {description}
                            </p>

                            {teamCode && (
                                <div className="mb-10 w-full bg-[#f4efe6] border-[4px] border-black p-6 shadow-[8px_8px_0_0_#000]">
                                    <p className="text-xs font-black uppercase tracking-widest text-black mb-4">Your Team Code</p>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                                        <span className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-black bg-white px-4 border-[3px] border-black py-2 shadow-[4px_4px_0_0_#000]">
                                            {teamCode}
                                        </span>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(teamCode);
                                                window.alert("Team code copied!");
                                            }}
                                            className="px-6 py-4 bg-black text-white hover:bg-[#7a6cf0] hover:text-black font-black uppercase tracking-widest text-xs border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
                                            title="Copy Code"
                                        >
                                            <Copy size={20} /> Copy
                                        </button>
                                    </div>
                                    <p className="text-xs font-serif italic text-black mt-6 border-t-[2px] border-black pt-3">
                                        Share this code with your members so they can join your team.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={onClose}
                                disabled={timeLeft > 0}
                                className={`w-full py-5 px-6 font-black uppercase tracking-widest text-sm sm:text-base border-[4px] border-black transition-all shadow-[8px_8px_0_0_#000] hover:shadow-none hover:translate-y-1 hover:translate-x-1 text-black disabled:opacity-50 disabled:cursor-not-allowed ${type === 'warning'
                                    ? "bg-yellow-400 hover:bg-yellow-300"
                                    : "bg-[#7a6cf0] hover:bg-[#c3cfa1]"
                                    }`}
                            >
                                {timeLeft > 0 ? `Please read instructions (${timeLeft}s)` : "Continue to Dashboard"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
