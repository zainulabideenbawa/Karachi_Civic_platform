"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import {
  X,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  ShieldCheck,
  Target,
  Sparkles,
  Share2,
  Heart,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export const LeaderProfileModal: React.FC = () => {
  const {
    selectedLeader,
    isLeaderProfileOpen,
    setIsLeaderProfileOpen,
    followLeader,
    issues,
    setSelectedIssue,
    showToast,
  } = useCivic();

  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"adoptions" | "pledges" | "team">("adoptions");

  if (!isLeaderProfileOpen || !selectedLeader) return null;

  // Filter issues adopted or resolved by this leader
  const leaderAdoptions = issues.filter(
    (i) => i.adoptedById === selectedLeader.id || i.adoptedById === selectedLeader.userId
  );

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-600 dark:text-emerald-400 stroke-emerald-500";
    if (score >= 50) return "text-amber-600 dark:text-amber-400 stroke-amber-500";
    return "text-rose-600 dark:text-rose-400 stroke-rose-500";
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              Community Leader Profile
            </span>
            <span className="text-xs text-slate-400">• Spec Addendum 01</span>
          </div>
          <button
            onClick={() => setIsLeaderProfileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Official Disclaimer Banner */}
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Not an elected official:</span> Community Leaders are resident volunteers and aspiring election candidates. Ranked strictly on verified community outcomes, independent of official council rankings.
            </div>
          </div>

          {/* Profile Card Top */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={selectedLeader.photoUrl}
                alt={selectedLeader.realName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-md"
              />
              {selectedLeader.identityVerified && (
                <div
                  className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-md"
                  title="Verified Identity: Real face & CNIC live video check passed"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {selectedLeader.realName}
                </h2>
                {selectedLeader.identityVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Identity
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {selectedLeader.ucName} • {selectedLeader.townName}
              </div>

              {/* Facts (Party & Intent) */}
              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-xs">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
                  Affiliation: <strong className="text-slate-900 dark:text-white">{selectedLeader.party}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200 dark:border-indigo-800/60">
                  {selectedLeader.plansToContest === "yes"
                    ? "Plans to contest local elections"
                    : selectedLeader.plansToContest === "no"
                    ? "Community service focus only"
                    : "Election intent undisclosed"}
                </span>
              </div>
            </div>
          </div>

          {/* Bio & Reason to Serve */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div>
              <span className="font-semibold text-slate-900 dark:text-white">About: </span>
              <span className="text-slate-600 dark:text-slate-400">{selectedLeader.bio}</span>
            </div>
            {selectedLeader.whyServe && (
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Why I serve: </span>
                <span className="text-slate-600 dark:text-slate-400 italic">&ldquo;{selectedLeader.whyServe}&rdquo;</span>
              </div>
            )}
          </div>

          {/* Score & Ranking Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 flex flex-col items-center justify-center text-center">
              <div className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400">
                Leader Score
              </div>
              <div className={`text-2xl font-black ${getScoreColor(selectedLeader.score)}`}>
                {selectedLeader.score.toFixed(1)}
              </div>
              <div className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                {selectedLeader.trend30d >= 0 ? (
                  <>
                    <TrendingUp className="w-3 h-3" /> +{selectedLeader.trend30d}
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3 h-3" /> {selectedLeader.trend30d}
                  </>
                )}
                <span>(30d)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500">UC-7 Rank</div>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                #{selectedLeader.rankInUc}
              </div>
              <div className="text-[10px] text-slate-400">of active leaders</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500">Town Rank</div>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                #{selectedLeader.rankInTown}
              </div>
              <div className="text-[10px] text-slate-400">in Gulshan Town</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500">Karachi Rank</div>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                #{selectedLeader.rankInCity}
              </div>
              <div className="text-[10px] text-slate-400">city-wide</div>
            </div>
          </div>

          {/* Formula Breakdown Accordion */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
              className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/70 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 transition cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-500" />
                Rolling 90-Day Score Weights &amp; Components
              </span>
              {isBreakdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {isBreakdownOpen && (
              <div className="p-3 text-xs space-y-2 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Impact (Adopted issues confirmed resolved, severity × affected)</span>
                  <span className="font-bold text-slate-900 dark:text-white">40%</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Reliability (Resolved by target date minus reopen rate)</span>
                  <span className="font-bold text-slate-900 dark:text-white">20%</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Community Events (Verified attendance, max 2/mo)</span>
                  <span className="font-bold text-slate-900 dark:text-white">15%</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Pledges Kept (Kept ÷ Due measurable commitments)</span>
                  <span className="font-bold text-slate-900 dark:text-white">15%</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>Responsiveness (First update within 72 hrs of adoption)</span>
                  <span className="font-bold text-slate-900 dark:text-white">10%</span>
                </div>
                <div className="mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500">
                  *Recalculated every 6 hours by the locked PostgreSQL database role. Max 15 resolutions/mo count toward score to eliminate system flooding.
                </div>
              </div>
            )}
          </div>

          {/* Lifetime Verified Track Record */}
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">
              Lifetime Verified Track Record
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="text-base font-black text-indigo-600 dark:text-indigo-400">
                  {selectedLeader.resolvedCountLifetime}
                </div>
                <div className="text-[10px] text-slate-500">Issues Resolved</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  {selectedLeader.onTimeRate}%
                </div>
                <div className="text-[10px] text-slate-500">On-Time Rate</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="text-base font-black text-slate-900 dark:text-white">
                  {selectedLeader.eventsCount}
                </div>
                <div className="text-[10px] text-slate-500">Events Held</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="text-base font-black text-slate-900 dark:text-white">
                  {selectedLeader.pledgesKept}/{selectedLeader.pledgesTotal}
                </div>
                <div className="text-[10px] text-slate-500">Pledges Kept</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="text-base font-black text-amber-600 dark:text-amber-400">
                  {selectedLeader.fixSatisfaction.toFixed(1)} ★
                </div>
                <div className="text-[10px] text-slate-500">Fix Rating</div>
              </div>
            </div>
          </div>

          {/* Tabbed Section: Adoptions / Pledges / Declared Team */}
          <div className="space-y-3">
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveSection("adoptions")}
                className={`pb-2 px-3 text-xs font-bold transition cursor-pointer border-b-2 ${
                  activeSection === "adoptions"
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Active Adoptions ({leaderAdoptions.length})
              </button>
              <button
                onClick={() => setActiveSection("pledges")}
                className={`pb-2 px-3 text-xs font-bold transition cursor-pointer border-b-2 ${
                  activeSection === "pledges"
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Pledges &amp; Goals
              </button>
              <button
                onClick={() => setActiveSection("team")}
                className={`pb-2 px-3 text-xs font-bold transition cursor-pointer border-b-2 ${
                  activeSection === "team"
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Declared Team ({selectedLeader.teamMembers.length}/5)
              </button>
            </div>

            {/* Adoptions Tab Content */}
            {activeSection === "adoptions" && (
              <div className="space-y-2">
                {leaderAdoptions.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                    No active issues currently adopted. Check back soon or visit the Leader Dashboard.
                  </div>
                ) : (
                  leaderAdoptions.map((iss) => (
                    <div
                      key={iss.id}
                      onClick={() => {
                        setSelectedIssue(iss);
                      }}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500 transition cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">
                          #{iss.id} • {iss.categoryName}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                          {iss.status === "marked_resolved" ? "Awaiting Citizen Confirmation" : "Adopted • In Progress"}
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {iss.title}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                          <Clock className="w-3 h-3" /> Target Date: {iss.targetDate || "Within 30 days"}
                        </span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-0.5">
                          View details <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pledges Tab Content */}
            {activeSection === "pledges" && (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Clear Block 13-D storm drain choke points before monsoon
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                      Kept &amp; Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Mobilized community suction equipment and placed protective wire grates.
                  </p>
                  <div className="text-[10px] text-slate-400">Due: 2026-08-15 • Resolved with citizen photos</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Install 10 solar pole lanterns along residential park walkway
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                      In Progress
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Target completion: 6 pole mounts fabricated, awaiting delivery of battery assemblies.
                  </p>
                  <div className="text-[10px] text-slate-400">Target Date: 2026-10-20</div>
                </div>
              </div>
            )}

            {/* Team Tab Content */}
            {activeSection === "team" && (
              <div className="space-y-2.5">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Anti-Gaming Rule: </span>
                  Up to 5 declared team members. Their votes, affected marks, and resolution confirmations are cryptographically excluded from this leader&apos;s score calculations.
                </div>

                {selectedLeader.teamMembers.length === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-400">
                    No declared team members registered yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedLeader.teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5 text-xs"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{member.name}</div>
                          <div className="text-[10px] text-slate-500">{member.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(
                  `Check out Community Leader ${selectedLeader.realName}'s verified civic track record in ${selectedLeader.ucName} on the Karachi Civic Platform!`
                );
              }
              showToast("Profile share card link copied to clipboard!");
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition cursor-pointer flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            Share Profile
          </button>

          <button
            onClick={() => followLeader(selectedLeader.id)}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Heart className="w-4 h-4" />
            Follow Leader Updates
          </button>
        </div>
      </div>
    </div>
  );
};
