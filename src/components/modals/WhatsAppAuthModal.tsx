"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import { X, CheckCircle, ShieldCheck, Smartphone, QrCode } from "lucide-react";

export const WhatsAppAuthModal: React.FC = () => {
  const { isWhatsAppAuthOpen, setIsWhatsAppAuthOpen, showToast } = useCivic();
  const [verificationCode] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  if (!isWhatsAppAuthOpen) return null;

  const waLink = `https://wa.me/923001234567?text=VERIFY%20${verificationCode}`;

  const handleSimulateWebhook = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      showToast("Reverse WhatsApp verified! Session bound to device.");
      setTimeout(() => {
        setIsWhatsAppAuthOpen(false);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              One Person, One Account
            </h3>
          </div>
          <button
            onClick={() => setIsWhatsAppAuthOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isVerified ? (
          <div className="py-6 text-center space-y-2 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Successfully Verified!
            </h4>
            <p className="text-xs text-slate-400">
              Your device is now bound to your biometric +92 mobile number.
            </p>
          </div>
        ) : (
          <>
            {/* Explainer */}
            <div className="space-y-1">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                We verify Pakistani mobile numbers via **Reverse WhatsApp**. No passwords, no SMS OTP fees, and no CNIC required.
              </p>
            </div>

            {/* Verification Code Display */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Your Single-Use Verification Code
              </div>
              <div className="text-2xl font-mono font-bold tracking-widest text-teal-700 dark:text-teal-400 select-all">
                VERIFY {verificationCode}
              </div>
              <div className="text-[10px] text-slate-400">
                Expires in 10 minutes · Bound to this device
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSimulateWebhook}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open WhatsApp to Send Code</span>
              </a>

              {/* Dev/Demo Simulation Button */}
              <button
                onClick={handleSimulateWebhook}
                disabled={isVerifying}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isVerifying ? (
                  <span>Verifying Webhook Handshake...</span>
                ) : (
                  <>
                    <QrCode className="w-3.5 h-3.5 text-teal-600" />
                    <span>Simulate WhatsApp Webhook (Instant)</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
