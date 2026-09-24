"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import { MOCK_NGOS } from "@/lib/mock-data";
import {
  X,
  ShieldAlert,
  Building,
  CheckCircle2,
  HeartHandshake,
  ShieldCheck,
  Phone,
  Mail,
  Lock,
  EyeOff,
  Flame,
  FileCheck,
  ChevronRight,
} from "lucide-react";

export const NGOsModal: React.FC = () => {
  const { isNGOsModalOpen, setIsNGOsModalOpen, activeUC, showToast } = useCivic();
  const [activeTab, setActiveTab] = useState<"ngos" | "nogos">("ngos");

  if (!isNGOsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-600/30 text-teal-400 border border-teal-500/40">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Civil Society &amp; Platform Invariants
              </div>
              <h2 className="text-base font-bold">NGOs &amp; Platform NO-GO Rules</h2>
            </div>
          </div>
          <button
            onClick={() => setIsNGOsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-1">
          <button
            onClick={() => setActiveTab("ngos")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "ngos"
                ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-teal-600" />
            <span>Active NGOs ({MOCK_NGOS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("nogos")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "nogos"
                ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Platform NO-GOs (Firewalls)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: NGOS & COMMUNITY GROUPS (Section 8.1) */}
          {activeTab === "ngos" && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 text-xs text-teal-900 dark:text-teal-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                  <span>Adopt-an-Issue System (Section 8.1)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-teal-800/90 dark:text-teal-300">
                  When a civic hazard remains unaddressed past 14 days or is flagged as outside UC jurisdiction, verified NGOs can adopt the spot, commit to a target fix date, and resolve it under citizen confirmation.
                </p>
              </div>

              {MOCK_NGOS.map((ngo) => (
                <div
                  key={ngo.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-teal-700 text-lg shrink-0">
                        {ngo.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {ngo.name}
                          </h3>
                          {ngo.verifiedBadge && (
                            <span className="text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              ✓ Verified NGO
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {ngo.registrationNumber} · Active in {ngo.activeTowns.join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Impact Rank</div>
                      <div className="font-bold text-sm text-teal-700 dark:text-teal-400">
                        #{ngo.impactRank} in KHI
                      </div>
                    </div>
                  </div>

                  {/* Impact Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Adopted</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{ngo.adoptedIssuesCount} issues</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Resolved On-Time</div>
                      <div className="font-bold text-emerald-600">{ngo.onTimeRate}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Thank Yous</div>
                      <div className="font-bold text-teal-600">{ngo.citizenThankYous} ♥</div>
                    </div>
                  </div>

                  {/* Actions & Contact */}
                  <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {ngo.contactPhone}
                      </span>
                    </div>

                    <button
                      onClick={() => showToast(`Contact details and adoption form opened for ${ngo.name}`)}
                      className="flex items-center gap-1 text-teal-700 dark:text-teal-400 hover:underline font-semibold cursor-pointer text-xs"
                    >
                      <span>Adopt Issue in {activeUC.townName}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: PLATFORM NO-GOs (CIVIC FIREWALLS & INVARIANTS) */}
          {activeTab === "nogos" && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-950 dark:text-rose-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-800 dark:text-rose-300">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Karachi Civic Platform Core Invariants &amp; Non-Negotiables</span>
                </div>
                <p className="text-[11px] leading-relaxed text-rose-900/90 dark:text-rose-300">
                  To prevent co-optation, corruption, or political retaliation, the platform enforces 5 absolute structural firewalls in code.
                </p>
              </div>

              {/* NO-GO 1 */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0">
                    ✕
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    NO-GO #1: Zero Political Party Bias or Party Score
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                  The platform measures individual performance of elected chairmen and municipal agencies, never political parties. Party affiliations are shown only as factual public record. No party advertisements or political endorsements are permitted under any condition.
                </p>
              </div>

              {/* NO-GO 2 */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0">
                    ✕
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    NO-GO #2: No Paid Rankings or Sponsored Score Alteration
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                  Rankings are 100% mathematical, calculated via the published Bayesian formula: <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1 rounded">S_Bayes = (v·S_raw + 15·54) / (v+15)</span>. No politician, donor, or sponsor can pay to improve, boost, or freeze their rank.
                </p>
              </div>

              {/* NO-GO 3 */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0">
                    ✕
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    NO-GO #3: Citizen Phone Privacy Firewall (Zero Doxxing)
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                  Citizen phone numbers are irreversible SHA-256 hashes on the backend. Phone numbers are never displayed on issue reports and are structurally firewalled from government officials to protect citizens from harassment or police intimidation.
                </p>
              </div>

              {/* NO-GO 4 */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0">
                    ✕
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    NO-GO #4: Immutable Audit Trail (No Deleting Evidence)
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                  Database trigger rules permanently block <code className="text-rose-600 font-mono">UPDATE</code> and <code className="text-rose-600 font-mono">DELETE</code> queries on public civic events and moderation actions. No politician or administrator can delete a report without an immutable public audit log entry explaining the exact reason.
                </p>
              </div>

              {/* NO-GO 5 */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0">
                    ✕
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    NO-GO #5: In-App Verified Camera Only (No Recycled Gallery Uploads)
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                  To eliminate old WhatsApp forwards and staged fake photos, reports must be captured live inside the platform camera with GPS accuracy within 100 meters. Every frame is stamped with cryptographic coordinates and timestamp.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
