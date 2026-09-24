"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import {
  X,
  Mic,
  Calendar,
  Users,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Send,
} from "lucide-react";

export const BaithakPanelModal: React.FC = () => {
  const {
    isBaithakPanelModalOpen,
    setIsBaithakPanelModalOpen,
    selectedEventForPanel,
    activeUC,
    showToast,
    setIsWhatsAppAuthOpen,
    activeRole,
  } = useCivic();

  const [roleType, setRoleType] = useState<"resident" | "affected" | "expert" | "ngo">("resident");
  const [background, setBackground] = useState("");
  const [solutionProposal, setSolutionProposal] = useState("");
  const [consentRecorded, setConsentRecorded] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isBaithakPanelModalOpen) return null;

  const eventTitle = selectedEventForPanel?.title || `UC-${activeUC.number} Monthly Open Baithak: Water & Drainage`;
  const eventDate = selectedEventForPanel?.date || "Saturday, Oct 3, 2026 · 5:00 PM";
  const eventLocation = selectedEventForPanel?.locationName || "UC-7 Gulshan Council Hall & Online Stream";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole === "visitor") {
      showToast("Verification required: Sign in via WhatsApp to apply for the stage panel");
      setIsWhatsAppAuthOpen(true);
      return;
    }

    if (!solutionProposal.trim()) {
      showToast("Please provide your proposed solution or insight");
      return;
    }

    setIsSubmitted(true);
    showToast("Application submitted! Rubric scoring & random draw will confirm seats 72h prior.");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-teal-800 text-white flex items-center justify-between border-b border-teal-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-700/80 text-white shadow-xs">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-teal-200 font-semibold">
                Citizens Civic Stage · Section 9.1
              </div>
              <h2 className="text-base font-bold">Apply to Join the Baithak Panel</h2>
            </div>
          </div>
          <button
            onClick={() => {
              setIsBaithakPanelModalOpen(false);
              setIsSubmitted(false);
            }}
            className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Target Event Info */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase">
              Target Baithak Session
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {eventTitle}
            </h3>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{eventDate} · {eventLocation}</span>
            </div>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Algorithmic Balance Notice */}
              <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Transparent Selection:</strong> To prevent political favoritism, stage seats are allocated by code: $\ge 40\%$ verified local residents, 1 subject expert, 1 NGO, with final seats filled by a verifiable random draw.
                </p>
              </div>

              {/* 1. Connection Role */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                  1. What is your connection to this topic?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "resident", label: "Verified Resident of UC", desc: "Lives in affected neighborhood" },
                    { id: "affected", label: "Directly Affected Resident", desc: "Reported or upvoted issues" },
                    { id: "expert", label: "Subject Expert / Engineer", desc: "Urban planning or civil works" },
                    { id: "ngo", label: "Local NGO Representative", desc: "Registered community worker" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRoleType(r.id as typeof roleType)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                        roleType === r.id
                          ? "border-teal-600 bg-teal-50/80 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div className="font-bold text-xs">{r.label}</div>
                      <div className="text-[10px] text-slate-400">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Professional / Lived Experience Background */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                  2. Brief Background (Work, Education, or Community Role)
                </label>
                <input
                  type="text"
                  required
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="e.g. Civil engineer with 6 years experience in municipal drainage"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              {/* 3. Proposed Solution / Insight */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                  3. What practical solution or insight will you bring to the stage?
                </label>
                <textarea
                  required
                  rows={3}
                  value={solutionProposal}
                  onChange={(e) => setSolutionProposal(e.target.value)}
                  placeholder="Describe your specific, actionable recommendation for UC Chairman and town team..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-400">
                  Judged on substance and feasibility, whether written in Urdu, Roman Urdu or English.
                </span>
              </div>

              {/* 4. Consent */}
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={consentRecorded}
                  onChange={(e) => setConsentRecorded(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>I consent to speak publicly, follow civil decorum, and be recorded on the livestream.</span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!consentRecorded}
                className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Application for Panel Seat</span>
              </button>
            </form>
          ) : (
            // Success Confirmation Screen
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Panel Application Confirmed
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your application has been received and registered under Candidate Hash <span className="font-mono text-teal-600 font-bold">#PAN-7049</span>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-left space-y-1.5 border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-800 dark:text-slate-200">Next Steps:</div>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <div>• Rubric scoring runs 72 hours prior to the session.</div>
                  <div>• Confirmed speakers will receive a WhatsApp notification with the private Meet stage link.</div>
                  <div>• If not selected for the stage, your question is automatically queued for the live audience Q&amp;A.</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsBaithakPanelModalOpen(false);
                  setIsSubmitted(false);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs cursor-pointer"
              >
                Return to My UC
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
