"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import {
  X,
  ShieldCheck,
  Camera,
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  AlertTriangle,
  Building2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export const BecomeLeaderModal: React.FC = () => {
  const {
    isBecomeLeaderOpen,
    setIsBecomeLeaderOpen,
    activeUC,
    allUCs,
    applyBecomeLeader,
    showToast,
  } = useCivic();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [realName, setRealName] = useState("");
  const [bio, setBio] = useState("");
  const [whyServe, setWhyServe] = useState("");
  const [party, setParty] = useState("Independent");
  const [plansToContest, setPlansToContest] = useState<"yes" | "no" | "prefer_not_to_say">("yes");
  const [selectedUcId, setSelectedUcId] = useState(activeUC.id);
  const [photoUrl, setPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&h=240&fit=crop&crop=face"
  );
  const [verificationMethod, setVerificationMethod] = useState<"video" | "office">("video");
  const [preferredDate, setPreferredDate] = useState("Tomorrow, 3:00 PM PKT");

  if (!isBecomeLeaderOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!realName.trim()) {
      showToast("Please enter your real legal name as it appears on your CNIC.");
      return;
    }
    if (!bio.trim() || !whyServe.trim()) {
      showToast("Please complete your short bio and motivation statement.");
      return;
    }

    applyBecomeLeader({
      realName: realName.trim(),
      photoUrl,
      bio: bio.trim(),
      whyServe: whyServe.trim(),
      party,
      plansToContest,
      ucId: selectedUcId,
    });

    setIsBecomeLeaderOpen(false);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              Step {step} of 3
            </span>
            <h2 className="text-sm font-bold">Become a Community Leader</h2>
          </div>
          <button
            onClick={() => setIsBecomeLeaderOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Step 1: Principles and Rules */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2 border border-indigo-200 dark:border-indigo-800">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Serve Your UC. Build a Verified Track Record.
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Whether you plan to contest future local elections or simply want to improve your neighborhood, earn citizen trust through verified work before asking for a vote.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <strong className="text-slate-900 dark:text-white">Work, Not Popularity:</strong>
                    <div className="text-slate-600 dark:text-slate-400">
                      Ranked strictly on verified problem resolutions, target dates, and kept pledges. No likes, followers, or vanity metrics.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <div className="p-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <strong className="text-slate-900 dark:text-white">Separate Leaderboards:</strong>
                    <div className="text-slate-600 dark:text-slate-400">
                      You are never ranked against elected officials who hold official budgets. You appear on the UC page in a dedicated section: &ldquo;Residents working for this UC. Not elected officials.&rdquo;
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <div className="p-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <strong className="text-slate-900 dark:text-white">Strict Anti-Gaming &amp; Anti-Campaigning:</strong>
                    <div className="text-slate-600 dark:text-slate-400">
                      No campaign slogans (&ldquo;Vote for me&rdquo;), no party flags. Issues reported by you or your team cannot be adopted by you. 3 strikes for gaming = permanent removal.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  I Understand &amp; Agree • Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Application Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Community Leader profiles are public. Please provide authentic details that match your government ID.
              </div>

              {/* Photo & Name */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={photoUrl}
                    alt="Selfie"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      showToast("Camera activated. Selfie captured!");
                    }}
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 cursor-pointer"
                    title="Retake live photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-bold text-slate-900 dark:text-white">
                    Real Legal Name (as on CNIC)
                  </label>
                  <input
                    type="text"
                    value={realName}
                    onChange={(e) => setRealName(e.target.value)}
                    placeholder="e.g. Syed Hammad Raza"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* UC Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 dark:text-white">
                  Your Union Committee (Must be verified resident)
                </label>
                <select
                  value={selectedUcId}
                  onChange={(e) => setSelectedUcId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {allUCs.map((uc) => (
                    <option key={uc.id} value={uc.id}>
                      {uc.name} ({uc.townName})
                    </option>
                  ))}
                </select>
                <div className="text-[10px] text-slate-400">
                  *You can switch UC at most once every 12 months. Score history stays with the prior UC.
                </div>
              </div>

              {/* Short Bio (300 chars) */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-900 dark:text-white">Short Bio</label>
                  <span className="text-[10px] text-slate-400">{bio.length}/300</span>
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 300))}
                  placeholder="e.g. Civil engineering graduate & lifelong resident of Block 13-D focusing on street drains."
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Why You Want to Serve (300 chars) */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-900 dark:text-white">Why do you want to serve your UC?</label>
                  <span className="text-[10px] text-slate-400">{whyServe.length}/300</span>
                </div>
                <textarea
                  value={whyServe}
                  onChange={(e) => setWhyServe(e.target.value.slice(0, 300))}
                  placeholder="e.g. I want to solve neighborhood civic hazards directly and provide transparent accountability before asking for a vote."
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Party & Election Intent */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900 dark:text-white">Party Affiliation</label>
                  <select
                    value={party}
                    onChange={(e) => setParty(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Independent">Independent</option>
                    <option value="Jamaat-e-Islami (JI)">Jamaat-e-Islami (JI)</option>
                    <option value="Pakistan Peoples Party (PPP)">Pakistan Peoples Party (PPP)</option>
                    <option value="Pakistan Tehreek-e-Insaf (PTI)">Pakistan Tehreek-e-Insaf (PTI)</option>
                    <option value="Muttahida Qaumi Movement (MQM-P)">Muttahida Qaumi Movement (MQM-P)</option>
                  </select>
                  <div className="text-[10px] text-slate-400">Shown as a neutral plain fact. No party leaderboards.</div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900 dark:text-white">Plans to Contest Elections?</label>
                  <select
                    value={plansToContest}
                    onChange={(e) => setPlansToContest(e.target.value as "yes" | "no" | "prefer_not_to_say")}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="yes">Yes, planning to contest</option>
                    <option value="no">No, community service only</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                  <div className="text-[10px] text-slate-400">Publicly visible on your profile.</div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!realName.trim()) {
                      showToast("Please enter your real name.");
                      return;
                    }
                    setStep(3);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  Next: Identity Verification <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Identity Verification Booking */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 space-y-1">
                <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Mandatory Real Identity Verification
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Because Community Leaders adopt public issues and build a public election record, an admin must verify your live face against your CNIC. <strong>We do not store your CNIC number or image</strong> — only the verification timestamp and approval status.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 dark:text-white">Choose Verification Method</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setVerificationMethod("video")}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                      verificationMethod === "video"
                        ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-600"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white mb-1">
                      <Video className="w-4 h-4 text-indigo-600" />
                      Live Video Call (3 min)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Quick in-app video check with an authorized admin. Hold CNIC up to camera.
                    </div>
                  </div>

                  <div
                    onClick={() => setVerificationMethod("office")}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                      verificationMethod === "office"
                        ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-600"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white mb-1">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      Partner NGO Office
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Visit a certified Saylani or JDC civic desk in Gulshan Town for physical badge check.
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 dark:text-white">
                  Preferred Appointment Slot
                </label>
                <select
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Tomorrow, 11:00 AM PKT">Tomorrow, 11:00 AM PKT</option>
                  <option value="Tomorrow, 3:00 PM PKT">Tomorrow, 3:00 PM PKT</option>
                  <option value="Saturday, 12:00 PM PKT">Saturday, 12:00 PM PKT</option>
                  <option value="Monday, 5:00 PM PKT">Monday, 5:00 PM PKT</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" /> Submit Application &amp; Book Check
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
