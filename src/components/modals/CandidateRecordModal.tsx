"use client";

import React from "react";
import { useCivic } from "@/context/CivicContext";
import {
  X,
  Vote,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  TrendingUp,
  Award,
  ExternalLink,
  Info,
} from "lucide-react";

export const CandidateRecordModal: React.FC = () => {
  const {
    isCandidateRecordOpen,
    setIsCandidateRecordOpen,
    activeUC,
    communityLeaders,
    setSelectedLeader,
    setIsLeaderProfileOpen,
    isElectionMode,
  } = useCivic();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCandidateRecordOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsCandidateRecordOpen]);

  if (!isCandidateRecordOpen) return null;

  // Candidates in this UC who filed nomination papers
  const candidatesInUc = communityLeaders.filter(
    (l) => l.ucId === activeUC.id && (l.hasFiledNomination || l.plansToContest === "yes")
  );

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCandidateRecordOpen(false);
      }}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] cursor-default"
      >
        {/* Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-300">
                ECP Transparency Record • {activeUC.name}
              </div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Candidate Record (Spec Addendum 01, Section 6)
                {isElectionMode && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                    Scores Frozen for Election
                  </span>
                )}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsCandidateRecordOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Neutrality & ECP Disclaimer */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Strict Neutrality &amp; Non-Endorsement Policy</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              This public record lists Community Leaders who have filed local election nomination papers in {activeUC.name}. 
              It displays their verified, formula-calculated community work track record before they ever ask for a vote. 
              <strong> The Karachi Civic Platform does not endorse any candidate or political party.</strong> Candidates who did not register or resolve issues on the platform are not listed.
            </p>
          </div>

          {/* Candidate Cards */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Contesting Candidates with Verified Track Records ({candidatesInUc.length})
            </div>

            {candidatesInUc.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <Info className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  No Contesting Leaders Recorded Yet in {activeUC.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  Registered Community Leaders who file nomination papers will appear here with frozen civic records.
                </div>
              </div>
            ) : (
              candidatesInUc.map((candidate) => (
                <div
                  key={candidate.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={candidate.photoUrl}
                          alt={candidate.realName}
                          className="w-14 h-14 rounded-xl object-cover ring-2 ring-indigo-500/30"
                        />
                        {candidate.identityVerified && (
                          <div
                            className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full"
                            title="Identity Verified"
                          >
                            <ShieldCheck className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                            {candidate.realName}
                          </h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                            {candidate.hasFiledNomination ? "Papers Filed" : "Aspiring Contender"}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          Affiliation: <strong className="text-slate-800 dark:text-slate-200">{candidate.party}</strong> · {candidate.ucName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center sm:flex-col items-end gap-1">
                      <div className="text-xs text-slate-400 font-semibold">Pre-Election Score</div>
                      <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                        {candidate.score.toFixed(1)}
                      </div>
                      <div className="text-[10px] text-slate-400">Rank #{candidate.rankInUc} in UC</div>
                    </div>
                  </div>

                  {/* Verified Lifetime Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-center">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        {candidate.resolvedCountLifetime}
                      </div>
                      <div className="text-[10px] text-slate-500">Confirmed Fixes</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                        {candidate.onTimeRate}%
                      </div>
                      <div className="text-[10px] text-slate-500">On-Time Rate</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="text-sm font-black text-slate-900 dark:text-white">
                        {candidate.pledgesKept}/{candidate.pledgesTotal}
                      </div>
                      <div className="text-[10px] text-slate-500">Pledges Kept</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="text-sm font-black text-slate-900 dark:text-white">
                        {candidate.eventsCount}
                      </div>
                      <div className="text-[10px] text-slate-500">Events Organized</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 italic">
                      &ldquo;{candidate.bio.slice(0, 75)}...&rdquo;
                    </span>
                    <button
                      onClick={() => {
                        setSelectedLeader(candidate);
                        setIsLeaderProfileOpen(true);
                      }}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      View Complete Work Record <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="text-[11px] text-slate-500">
            Compliant with ECP Code of Conduct · Candidate records frozen during election cycle
          </div>
          <button
            onClick={() => setIsCandidateRecordOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
