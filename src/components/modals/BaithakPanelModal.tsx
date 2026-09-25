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
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  Building2,
  Check,
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

  const [activeTab, setActiveTab] = useState<"apply" | "briefs">("apply");
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
                Citizens Civic Stage · Section 9
              </div>
              <h2 className="text-base font-bold">Think Tanks &amp; Baithak Panels</h2>
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

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-1">
          <button
            onClick={() => setActiveTab("apply")}
            className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "apply"
                ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Apply for Stage (9.1)</span>
          </button>

          <button
            onClick={() => setActiveTab("briefs")}
            className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "briefs"
                ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Think Tank Briefs (9)</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {activeTab === "apply" ? (
            <>
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
                      <strong>Transparent Selection:</strong> To prevent political favoritism, stage seats are allocated by code: &ge;40% verified local residents, 1 subject expert, 1 NGO, with final seats filled by a verifiable random draw.
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
                      2. Your background (education, occupation or lived experience)
                    </label>
                    <input
                      type="text"
                      required
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      placeholder="e.g. Civil engineering graduate / 12 years resident of Block 13..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    />
                  </div>

                  {/* 3. Proposed Solution / Insight */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                      3. What specific solution or ground insight will you present? (Max 500 chars)
                    </label>
                    <textarea
                      rows={3}
                      maxLength={500}
                      required
                      value={solutionProposal}
                      onChange={(e) => setSolutionProposal(e.target.value)}
                      placeholder="Explain your practical proposal. Quality & practicality are scored by rubric..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden resize-none"
                    />
                    <div className="text-[10px] text-slate-400 text-right">
                      {solutionProposal.length}/500 chars
                    </div>
                  </div>

                  {/* 4. Consent */}
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={consentRecorded}
                      onChange={(e) => setConsentRecorded(e.target.checked)}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>
                      I consent to being recorded and named in the published Think Tank Brief (Section 9.1).
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={!consentRecorded}
                    className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Stage Application</span>
                  </button>
                </form>
              ) : (
                <div className="p-6 text-center space-y-3 bg-teal-50/70 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800">
                  <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-teal-950 dark:text-teal-100">
                    Stage Application Received!
                  </h3>
                  <p className="text-xs text-teal-800/90 dark:text-teal-300 leading-relaxed">
                    Your application has been anonymized and sent to the rubric scoring pipeline. Qualified applicants (&ge;3.0/5) enter the randomized seating draw 72 hours before the session.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setIsBaithakPanelModalOpen(false);
                    }}
                    className="px-5 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </>
          ) : (
            /* TAB 2: THINK TANK BRIEFS & PROPOSAL TRACKER (Section 9) */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                    Published Brief · September 2026
                  </span>
                  <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                    Brief #TT-09
                  </span>
                </div>
                <h3 className="text-sm font-bold leading-snug">
                  Monsoon Drainage Siltation &amp; Trunk Sewer Bypass in Gulshan UC-7 &amp; UC-8
                </h3>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Platform data recorded 61 overflowing drains across 1.4 km², with median resolution delays exceeding 14 days due to silted link drains.
                </p>
              </div>

              {/* Proposal Lifecycle Tracker */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  <span>Proposal Tracker (Section 9.2)</span>
                  <span className="text-[11px] text-teal-600 font-semibold">Status: Adopted</span>
                </div>

                <div className="flex items-center justify-between relative text-[10px] font-bold text-center">
                  <div className="absolute top-3 left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-700 z-0" />
                  {[
                    { label: "Sent", done: true },
                    { label: "Acknowledged", done: true },
                    { label: "Adopted", done: true, active: true },
                    { label: "Implemented", done: false },
                    { label: "Verified", done: false },
                  ].map((step, idx) => (
                    <div key={idx} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] mb-1 transition ${
                          step.active
                            ? "bg-teal-600 text-white ring-4 ring-teal-100 dark:ring-teal-950 font-bold"
                            : step.done
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                        }`}
                      >
                        {step.done ? <Check className="w-3 h-3" /> : idx + 1}
                      </div>
                      <span className={step.active ? "text-teal-700 dark:text-teal-300 font-bold" : "text-slate-400"}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brief Content Breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Root Causes</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-300">
                    <li>Uncovered manholes allowing plastic debris into trunk lines</li>
                    <li>Silt buildup from recent road construction on Block 13B</li>
                    <li>Jurisdiction ambiguity between UC sanitation and KWSC mains</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-teal-600">Specific Ask to Official</div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium">
                    Formal allocation of UC machinery for pre-monsoon suction clearing of 12 choke points identified on the civic heatmap.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-indigo-600">Quick Wins for Residents &amp; NGOs</div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Community installation of mesh filters over storm drains along Block 13 market street; NGO welfare drive scheduled for Oct 10.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
