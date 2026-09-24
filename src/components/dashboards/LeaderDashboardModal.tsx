"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import {
  X,
  Award,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Camera,
  Plus,
  Target,
  Users,
  Search,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  FileText,
  Sparkles,
} from "lucide-react";

export const LeaderDashboardModal: React.FC = () => {
  const {
    isLeaderDashboardOpen,
    setIsLeaderDashboardOpen,
    communityLeaders,
    activeUC,
    issues,
    adoptIssue,
    resolveAdoptedIssue,
    showToast,
    setSelectedIssue,
  } = useCivic();

  const [activeTab, setActiveTab] = useState<"discover" | "adoptions" | "pledges" | "team">("discover");
  
  // Use the top leader in this UC as the active dashboard session (e.g., Syed Hammad Raza)
  const currentLeader = communityLeaders.find((c) => c.ucId === activeUC.id) || communityLeaders[0];

  // Issue adoption form state
  const [selectedIssueToAdopt, setSelectedIssueToAdopt] = useState<string | null>(null);
  const [targetDays, setTargetDays] = useState(30);

  // Issue resolution form state
  const [resolvingIssueId, setResolvingIssueId] = useState<string | null>(null);
  const [resolutionPhoto, setResolutionPhoto] = useState(
    "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=800&h=600&fit=crop"
  );
  const [resolutionNote, setResolutionNote] = useState("");

  if (!isLeaderDashboardOpen || !currentLeader) return null;

  // Filter issues open for adoption in this UC (open >= 7 days, not adopted, not marked in_progress by official in last 14d)
  const openForAdoption = issues.filter(
    (i) =>
      i.ucId === currentLeader.ucId &&
      i.daysOpen >= 7 &&
      !i.adoptedByType &&
      i.status !== "marked_resolved" &&
      i.status !== "confirmed" &&
      i.reporterId !== currentLeader.userId &&
      i.reporterId !== currentLeader.id
  );

  // Filter issues currently adopted by this leader
  const myAdoptions = issues.filter(
    (i) => i.adoptedById === currentLeader.id || i.adoptedById === currentLeader.userId
  );

  const handleAdopt = (issueId: string) => {
    const res = adoptIssue(
      issueId,
      "leader",
      currentLeader.id,
      currentLeader.realName,
      targetDays
    );
    if (res.success) {
      setSelectedIssueToAdopt(null);
      setActiveTab("adoptions");
    }
  };

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingIssueId) return;
    const res = resolveAdoptedIssue(resolvingIssueId, resolutionPhoto, resolutionNote);
    if (res.success) {
      setResolvingIssueId(null);
      setResolutionNote("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Leader Workbench • {currentLeader.ucName}
              </div>
              <h2 className="text-base font-bold flex items-center gap-2">
                {currentLeader.realName}
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                  Active Leader
                </span>
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsLeaderDashboardOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Top Stats */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-500">Leader Score</div>
            <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
              {currentLeader.score.toFixed(1)}
            </div>
            <div className="text-[10px] font-semibold text-emerald-600 flex items-center justify-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +{currentLeader.trend30d} (30d)
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-500">UC Rank</div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              #{currentLeader.rankInUc}
            </div>
            <div className="text-[10px] text-slate-400">in {currentLeader.ucName.split(" ")[0]}</div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-500">Active Adoptions</div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">
              {currentLeader.activeAdoptionsCount}/10
            </div>
            <div className="text-[10px] text-slate-400">max 10 parallel</div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-500">Lifetime Fixes</div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {currentLeader.resolvedCountLifetime}
            </div>
            <div className="text-[10px] text-slate-400">confirmed resolved</div>
          </div>
        </div>

        {/* Next Best Action Banner */}
        <div className="mx-4 mt-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Next Best Action:</strong> {openForAdoption.length} issues in your UC have been open over 7 days without adoption.
            </span>
          </div>
          <button
            onClick={() => setActiveTab("discover")}
            className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px] hover:bg-indigo-700 transition shrink-0 cursor-pointer"
          >
            Review Issues
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 mt-3">
          <button
            onClick={() => setActiveTab("discover")}
            className={`pb-2 px-3 text-xs font-bold transition cursor-pointer border-b-2 ${
              activeTab === "discover"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Discover Open Issues ({openForAdoption.length})
          </button>
          <button
            onClick={() => setActiveTab("adoptions")}
            className={`pb-2 px-3 text-xs font-bold transition cursor-pointer border-b-2 ${
              activeTab === "adoptions"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            My Adoptions ({myAdoptions.length})
          </button>
          <button
            onClick={() => setActiveTab("pledges")}
            className={`pb-2 px-3 text-xs font-bold transition cursor-pointer border-b-2 ${
              activeTab === "pledges"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Pledges &amp; Events
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`pb-2 px-3 text-xs font-bold transition cursor-pointer border-b-2 ${
              activeTab === "team"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Team ({currentLeader.teamMembers.length}/5)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: DISCOVER ISSUES TO ADOPT */}
          {activeTab === "discover" && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                Issues eligible for adoption (must be reported by another resident, open $\ge 7$ days, and not already claimed).
              </div>

              {openForAdoption.length === 0 ? (
                <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    No unadopted 7+ day issues in {currentLeader.ucName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    All current issues are either newly reported or already in progress!
                  </div>
                </div>
              ) : (
                openForAdoption.map((iss) => (
                  <div
                    key={iss.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          #{iss.id} • {iss.categoryName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-semibold">
                          Open {iss.daysOpen} days
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {iss.affectedCount} citizens affected
                      </span>
                    </div>

                    <div className="text-xs text-slate-800 dark:text-slate-200 font-semibold">
                      {iss.title}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {iss.description}
                    </p>

                    <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <button
                        onClick={() => setSelectedIssue(iss)}
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Inspect Issue <ExternalLink className="w-3 h-3" />
                      </button>

                      {selectedIssueToAdopt === iss.id ? (
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Target Days:
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={60}
                            value={targetDays}
                            onChange={(e) => setTargetDays(Number(e.target.value))}
                            className="w-16 px-2 py-1 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                          />
                          <button
                            onClick={() => handleAdopt(iss.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                          >
                            Confirm Adoption
                          </button>
                          <button
                            onClick={() => setSelectedIssueToAdopt(null)}
                            className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (currentLeader.activeAdoptionsCount >= 10) {
                              showToast("Maximum active adoption limit (10) reached. Resolve existing issues first!");
                              return;
                            }
                            setSelectedIssueToAdopt(iss.id);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <Award className="w-3.5 h-3.5" />
                          Adopt This Issue
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: MY ADOPTIONS & RESOLUTION WORKBENCH */}
          {activeTab === "adoptions" && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                Issues you have committed to solve. Once complete, take a live after-photo at the site to initiate citizen confirmation.
              </div>

              {myAdoptions.length === 0 ? (
                <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                  <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    No active adoptions right now
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Switch to the &ldquo;Discover Open Issues&rdquo; tab to adopt a community problem.
                  </div>
                </div>
              ) : (
                myAdoptions.map((iss) => (
                  <div
                    key={iss.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">
                        #{iss.id} • {iss.categoryName}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                        {iss.status === "marked_resolved" ? "Awaiting Citizen Confirmation" : "Active Adoption"}
                      </span>
                    </div>

                    <div className="text-xs text-slate-800 dark:text-slate-200 font-semibold">
                      {iss.title}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                        <Clock className="w-3.5 h-3.5" /> Target: {iss.targetDate || "30 days"}
                      </span>
                      <span>Adopted: {iss.adoptedAt ? new Date(iss.adoptedAt).toLocaleDateString() : "Recent"}</span>
                    </div>

                    {iss.status !== "marked_resolved" && (
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                        <button
                          onClick={() => setSelectedIssue(iss)}
                          className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          View Problem Details
                        </button>
                        <button
                          onClick={() => setResolvingIssueId(iss.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark Resolved (Live Photo)
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* RESOLUTION MODAL POPUP */}
              {resolvingIssueId && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-600" />
                      Submit Resolution for #{resolvingIssueId}
                    </h3>
                    <button
                      onClick={() => setResolvingIssueId(null)}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    Per Section 5.3 of the spec: resolution requires a live in-app camera after-photo at the exact location. This triggers the 7-day citizen confirmation window.
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={resolutionPhoto}
                      alt="After fix photo"
                      className="w-20 h-20 rounded-xl object-cover ring-2 ring-emerald-500/40"
                    />
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => showToast("Live camera active. After-fix photo captured with GPS watermark!")}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer flex items-center gap-1"
                      >
                        <Camera className="w-3.5 h-3.5" /> Retake Photo
                      </button>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        ✓ GPS Verified within 50m of problem coordinates
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-900 dark:text-white">
                      Work Description &amp; Materials Used
                    </label>
                    <textarea
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      placeholder="e.g. Sucker team desilted the 200ft pipe, removed solid blockage, and installed new concrete reinforced cover."
                      rows={2}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    onClick={handleResolve}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Submit Resolution &amp; Open Citizen Confirmation Window
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PLEDGES & EVENTS */}
          {activeTab === "pledges" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Public commitments tracked on the official promise ledger.</span>
                <button
                  onClick={() => showToast("New pledge modal opened. Each pledge must have a measurable outcome & due date.")}
                  className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> New Pledge
                </button>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Clear Block 13-D storm drain choke points before monsoon
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                      Kept (Verified)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">Target Date: 2026-08-15 • Resolved with citizen photos</div>
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
                  <div className="text-[11px] text-slate-500">Target Date: 2026-10-20 • 6 mounts completed</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DECLARED TEAM */}
          {activeTab === "team" && (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-300">
                <span className="font-bold">Anti-Gaming Shield:</span> Up to 5 team members can assist you on site and organize events. Their votes and confirmations will never count toward your score.
              </div>

              <div className="space-y-2">
                {currentLeader.teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{member.name}</div>
                        <div className="text-[10px] text-slate-500">{member.role}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                      Verified Member
                    </span>
                  </div>
                ))}
              </div>

              {currentLeader.teamMembers.length < 5 && (
                <button
                  onClick={() => showToast("Invite team member link generated. Member must complete resident check.")}
                  className="w-full py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:border-indigo-500 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Team Member ({5 - currentLeader.teamMembers.length} slots left)
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>Anti-Gaming Layer 3 Active • 0 Strikes</span>
          </div>
          <button
            onClick={() => showToast("Monthly Leader Report Card PDF generated & downloaded.")}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition cursor-pointer flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" /> Export Report Card PDF
          </button>
        </div>
      </div>
    </div>
  );
};
