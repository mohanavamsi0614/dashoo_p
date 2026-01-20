import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, AlertCircle, Mail, CreditCard, X } from "lucide-react";

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

    const { payment, mail, message, user, team } = data;

    // Determine the content based on the flags
    let title = "Registration Successful!";
    let description = "Your team has been registered successfully.";
    let icon = <CheckCircle className="w-16 h-16 text-green-500" />;
    let type = "success"; // success, warning, neutral

    if (payment && mail) {
        title = "Payment & Registration Complete";
        description = "User registration successful and payment mail has been sent, pay the amount from the mail. Please check your inbox.";
        icon = <CreditCard className="w-16 h-16 text-indigo-500" />;
        type = "success";
    } else if (!payment && !mail && data.payment !== undefined) {
        // Specifically checking if payment is explicitly false, implying it was attempted/expected but failed or config prevented it?
        // OR backend logic: event.cost && !event.auto_payment_mail -> payment:false, mail:false
        title = "Registered, Action Needed";
        description = message || "User registered successfully, but the payment email could not be sent. Please contact support.";
        icon = <AlertCircle className="w-16 h-16 text-yellow-500" />;
        type = "warning";
    } else if (!payment && mail) {
        title = "Registration Complete";
        description = "User registered for event successfully and welcome mail has been sent. Good luck!";
        icon = <Mail className="w-16 h-16 text-blue-500" />;
        type = "success";
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={timeLeft === 0 ? onClose : undefined}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Popup Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="relative w-full max-w-md bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Gradient Border Effect at top */}
                        <div className={`h-1.5 w-full ${type === 'warning' ? 'bg-yellow-500' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'}`} />

                        <button
                            onClick={onClose}
                            disabled={timeLeft > 0}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8 flex flex-col items-center text-center">
                            <div className="mb-6 p-4 rounded-full bg-white/5 border border-white/10 shadow-inner">
                                {icon}
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                {description}
                            </p>

                            <button
                                onClick={onClose}
                                disabled={timeLeft > 0}
                                className={`w-full py-3 px-6 rounded-xl font-semibold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed ${type === 'warning'
                                        ? "bg-yellow-600 hover:bg-yellow-700 shadow-yellow-500/20"
                                        : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
                                    }`}
                            >
                                {timeLeft > 0 ? `Please wait read the instructions above ${timeLeft}s` : "Continue to Dashboard"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
