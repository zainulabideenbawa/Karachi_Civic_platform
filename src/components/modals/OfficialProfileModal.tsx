"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCivic } from "@/context/CivicContext";
import { ScoreRing } from "../ScoreRing";
import { IssueCard } from "../IssueCard";
import {
  X,
  Share2,
  Award,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Building2,
  ShieldCheck,
  Star,
  Heart,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export const OfficialProfileModal: React.FC = () => {
  const {
    selectedOfficial,
    setSelectedOfficial,
    activeUC,
    issues,
    promises,
    events,
    setSelectedIssue,
    setIsScoreFormulaOpen,
    showToast,
  } = useCivic();

  const [activeTab, setActiveTab] = useState<"overview" | "issues" | "fixes" | "promises">("overview");

  if (!selectedOfficial) return null;

  const officialIssues = issues.filter((iss) => iss.ucId === activeUC.id);
  const openIssues = officialIssues
    .filter((iss) => iss.status !== "confirmed" && iss.status !== "community_resolved")
    .sort((a, b) => b.daysOpen - a.daysOpen);

  const confirmedFixes = officialIssues.filter(
    (iss) => iss.status === "confirmed" && iss.afterPhotos && iss.afterPhotos.length > 0
  );

  const officialPromises = promises.filter((p) => p.officialId === selectedOfficial.id);
  const keptPromises = officialPromises.filter((p) => p.status === "kept");
  const brokenPromises = officialPromises.filter((p) => p.status === "broken");
  const pendingPromises = officialPromises.filter((p) => p.status === "pending");

  const handleShareProfile = () => {
    const url = typeof window !== "undefined"
      ? `${window.location.origin}?official=${selectedOfficial.id}`
      : `https://karachicivic.org/official/${selectedOfficial.slug}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast("Official report card link copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
              Elected Official Report Card · Section 7.1
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShareProfile}
              className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Share Report Card"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedOfficial(null)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 1. Official Hero Section */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white shadow-md relative overflow-hidden">
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-teal-400/40 bg-slate-800 shrink-0 shadow-lg">
                  <Image
                    src={selectedOfficial.photo}
                    alt={selectedOfficial.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  {selectedOfficial.isClaimed && (
                    <div className="absolute bottom-0 inset-x-0 bg-teal-600 text-white text-[8px] font-bold text-center py-0.5 uppercase tracking-wider">
                      Verified
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-bold leading-tight">
                      {selectedOfficial.name}
                    </h2>
                    {selectedOfficial.isClaimed && (
                      <span className="p-0.5 rounded-full bg-teal-500/20 text-teal-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-teal-200 font-medium pt-0.5">
                    {selectedOfficial.seatTitle}
                  </p>
                  <p className="text-[11px] text-slate-300 pt-0.5">
                    Party: <span className="font-semibold text-white">{selectedOfficial.party}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono pt-0.5">
                    Term: {selectedOfficial.termStart} - {selectedOfficial.termEnd}
                  </p>
                </div>
              </div>

              {/* Score Ring */}
              <div className="shrink-0 flex flex-col items-center">
                <div className="p-1 rounded-2xl bg-white/10 backdrop-blur-md">
                  <ScoreRing
                    score={activeUC.score}
                    cityRank={activeUC.cityRank}
                    trend30d={activeUC.trend30d}
                    size="md"
                  />
                </div>
                <div className="text-[10px] text-teal-300 font-bold mt-1">
                  Rank #{activeUC.cityRank} of 246
                </div>
              </div>
            </div>

            {/* Badges Strip */}
            {selectedOfficial.badges.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-3 mt-3 border-t border-white/10">
                {selectedOfficial.badges.map((b, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[10px] font-bold bg-white/15 backdrop-blur-xs text-teal-200 px-2 py-0.5 rounded-md border border-white/10"
                  >
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>{b}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Resolved</div>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {activeUC.resolvedIssues} <span className="text-[10px] text-slate-400 font-normal">/ {activeUC.totalEligibleIssues}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Promises</div>
              <div className="text-sm font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                {selectedOfficial.promisesKept} <span className="text-[10px] text-slate-400 font-normal">/ {selectedOfficial.promisesTotal}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Fix Rating</div>
              <div className="text-sm font-bold text-amber-500 tabular-nums flex items-center justify-center gap-0.5">
                <span>{selectedOfficial.fixSatisfaction}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Thanks</div>
              <div className="text-sm font-bold text-rose-500 tabular-nums flex items-center justify-center gap-0.5">
                <span>{selectedOfficial.thankYouCount}</span>
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
              </div>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === "overview"
                  ? "bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("issues")}
              className={`py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === "issues"
                  ? "bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Open ({openIssues.length})
            </button>
            <button
              onClick={() => setActiveTab("fixes")}
              className={`py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === "fixes"
                  ? "bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Fixes ({confirmedFixes.length})
            </button>
            <button
              onClick={() => setActiveTab("promises")}
              className={`py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === "promises"
                  ? "bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Promises ({officialPromises.length})
            </button>
          </div>

          {/* TAB 1: OVERVIEW & FORMULA BREAKDOWN (Section 7.2) */}
          {activeTab === "overview" && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Formula Score Breakdown (90-Day Rolling)
                  </h3>
                  <button
                    onClick={() => setIsScoreFormulaOpen(true)}
                    className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Inspect Weights</span>
                    <HelpCircle className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 pb-1">
                      <span>Resolution Rate (35%)</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {Math.round((activeUC.resolvedIssues / Math.max(1, activeUC.totalEligibleIssues)) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (activeUC.resolvedIssues / Math.max(1, activeUC.totalEligibleIssues)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 pb-1">
                      <span>Resolution Speed (20%)</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        5.2d (vs 9.8d city median)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-full rounded-full" style={{ width: "82%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 pb-1">
                      <span>Responsiveness &lt;72h (15%)</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">88%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full rounded-full" style={{ width: "88%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 pb-1">
                      <span>Reliability (10% - Reopen penalty)</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">92%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 pb-1">
                      <span>Backlog Clearance (10%)</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {activeUC.oldestOpenDays}d oldest
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          activeUC.oldestOpenDays > 30 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.max(20, 100 - activeUC.oldestOpenDays)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 pb-1">
                      <span>Engagement &amp; Promises (10% cap)</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {selectedOfficial.promisesKept} kept · {selectedOfficial.eventsHeld} baithaks
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: "75%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Public Office Contact & Right of Reply */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>Public Secretariat &amp; Contact</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {selectedOfficial.officeContact}
                </p>
                <div className="text-[11px] text-slate-400">
                  Section 1.5 Right of Reply: All responses are pinned to issues and cannot be hidden by anyone.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OPEN ISSUES (Oldest First) */}
          {activeTab === "issues" && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                Sorted oldest-first as mandated by Section 7.1 and 10.1:
              </div>
              {openIssues.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                  No open issues in this UC!
                </div>
              ) : (
                openIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onClick={() => setSelectedIssue(issue)}
                  />
                ))
              )}
            </div>
          )}

          {/* TAB 3: CONFIRMED FIXES (Before / After Pairs) */}
          {activeTab === "fixes" && (
            <div className="space-y-3">
              {confirmedFixes.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                  No confirmed before/after fixes recorded yet.
                </div>
              ) : (
                confirmedFixes.map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs cursor-pointer hover:border-teal-500 transition space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        #{issue.id} · {issue.title}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        ✓ Confirmed Fixed
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 h-32 rounded-lg overflow-hidden">
                      <div className="relative w-full h-full bg-slate-100">
                        <Image
                          src={issue.photos[0]?.url || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop"}
                          alt="Before"
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Before
                        </span>
                      </div>

                      <div className="relative w-full h-full bg-slate-100">
                        <Image
                          src={issue.afterPhotos?.[0]?.url || "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=600&h=400&fit=crop"}
                          alt="After"
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                        <span className="absolute bottom-1 left-1 bg-emerald-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          After Fix
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: PROMISE TRACKER (Section 8.3) */}
          {activeTab === "promises" && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                Manifesto and Baithak commitments tracked publicly:
              </div>

              {officialPromises.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                  No public promises logged for this official yet.
                </div>
              ) : (
                officialPromises.map((promise) => (
                  <div
                    key={promise.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-xs text-slate-900 dark:text-slate-100 leading-snug">
                        &quot;{promise.text}&quot;
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 uppercase ${
                          promise.status === "kept"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : promise.status === "broken"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {promise.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span>Source: {promise.source}</span>
                      <span>Due: {promise.dueDate}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
