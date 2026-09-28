"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import { computeUCScoreBreakdown, computeLeaderScoreBreakdown } from "@/lib/scoring";
import { X, Calculator, ShieldCheck, CheckCircle2, Award, Building2, AlertTriangle } from "lucide-react";

export const ScoreFormulaModal: React.FC = () => {
  const { isScoreFormulaOpen, setIsScoreFormulaOpen, activeUC, issues, communityLeaders } = useCivic();
  const [activeFormulaTab, setActiveFormulaTab] = useState<"official" | "leader">("official");

  if (!isScoreFormulaOpen) return null;

  const ucIssues = issues.filter((i) => i.ucId === activeUC.id);
  const officialBreakdown = computeUCScoreBreakdown(
    ucIssues,
    activeUC.chairman.eventsHeld,
    activeUC.chairman.promisesKept,
    activeUC.chairman.promisesTotal
  );

  const topLeader = communityLeaders.find((l) => l.ucId === activeUC.id) || communityLeaders[0];
  const leaderAdoptedIssues = issues.filter(
    (i) => i.adoptedById === topLeader?.id || i.adoptedById === topLeader?.userId
  );
  const leaderBreakdown = computeLeaderScoreBreakdown(
    leaderAdoptedIssues,
    topLeader?.eventsCount || 0,
    topLeader?.pledgesKept || 0,
    topLeader?.pledgesTotal || 0
  );

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsScoreFormulaOpen(false);
      }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 max-h-[90vh] overflow-y-auto cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                How Civic Scores Work
              </h3>
              <p className="text-[11px] text-slate-400">
                Formulas Published &amp; Immutable · Recalculated every 6h via pg_cron
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsScoreFormulaOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Officials vs Community Leaders */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveFormulaTab("official")}
            className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeFormulaTab === "official"
                ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>UC Municipal Score (Main Spec)</span>
          </button>
          <button
            onClick={() => setActiveFormulaTab("leader")}
            className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeFormulaTab === "leader"
                ? "bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-indigo-500" />
            <span>Community Leader Score (Addendum 01)</span>
          </button>
        </div>

        {/* OFFICIAL SCORE VIEW */}
        {activeFormulaTab === "official" && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Rankings are 100% mathematical. No administrator, politician, or government official can edit a score. Recalculated every 6 hours by database job over a rolling 90-day window.
              </p>
            </div>

            {/* Performance Components Breakdown Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
                <span>{activeUC.name} Municipal Breakdown</span>
                <span className="font-mono text-teal-700 dark:text-teal-400">
                  Raw: {officialBreakdown.rawScore} → Final: {activeUC.score}
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                <div className="p-2.5 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Resolution Rate (35% Weight)
                    </span>
                    <div className="text-[10px] text-slate-400">
                      Weighted confirmed resolved ÷ weighted eligible
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {officialBreakdown.resolutionRateScore}/100
                  </span>
                </div>

                <div className="p-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Speed to Fix (20% Weight)
                    </span>
                    <div className="text-[10px] text-slate-400">
                      Median days vs citywide benchmark
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {officialBreakdown.speedScore}/100
                  </span>
                </div>

                <div className="p-2.5 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Responsiveness (15% Weight)
                    </span>
                    <div className="text-[10px] text-slate-400">
                      % of issues acknowledged within 72 hours
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {officialBreakdown.responsivenessScore}/100
                  </span>
                </div>

                <div className="p-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Reliability (10% Weight)
                    </span>
                    <div className="text-[10px] text-slate-400">
                      (1 - Reopen rate) * 100
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {officialBreakdown.reliabilityScore}/100
                  </span>
                </div>

                <div className="p-2.5 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Backlog Control (10% Weight)
                    </span>
                    <div className="text-[10px] text-slate-400">
                      (1 - Share of open issues &gt;30 days) * 100
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {officialBreakdown.backlogScore}/100
                  </span>
                </div>

                <div className="p-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Engagement (10% Weight)
                    </span>
                    <div className="text-[10px] text-slate-400">
                      Verified Baithaks + Kept Promises
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {officialBreakdown.engagementScore}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Bayesian Adjustment Explanation */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs space-y-1.5 border border-slate-200 dark:border-slate-700">
              <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Bayesian Smoothing for Fairness (k = 15)</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                Final Score = [n / (n + 15)] × Raw + [15 / (n + 15)] × CityMean
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Prevents a UC with only 2 issues from unfairly dominating UCs handling hundreds of reports.
              </p>
            </div>
          </div>
        )}

        {/* COMMUNITY LEADER SCORE VIEW (SPEC ADDENDUM 01) */}
        {activeFormulaTab === "leader" && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
              <Award className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Work, Not Popularity:</strong> Community Leaders are ranked strictly on verified community problem resolutions, on-time delivery, and kept pledges. They are never ranked on likes, followers, or against elected officials.
              </p>
            </div>

            {/* 5 Components Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
                <span>Leader Score Components (Rolling 90 Days)</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">
                  {topLeader ? `${topLeader.realName}: ${topLeader.score.toFixed(1)}` : "5 Weights"}
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                <div className="p-2.5 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Impact (40% Weight)
                    </span>
                    <div className="text-[10px] text-slate-400">
                      Weighted adopted issues confirmed resolved (severity × affected)
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {leaderBreakdown.impactScore}/100
                  </span>
                </div>

                <div className="p-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Reliability (20% Weight)
                    </span>
                    <div className="text-[10px] text-slate-400">
                      Share resolved by target date minus reopen rate
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {leaderBreakdown.reliabilityScore}/100
                  </span>
                </div>

                <div className="p-2.5 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Community Events (15% Weight)
                    </span>
                    <div className="text-[10px] text-slate-400">
                      Verified cleanups, camps &amp; town halls (max 2/month counted)
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {leaderBreakdown.eventsScore}/100
                  </span>
                </div>

                <div className="p-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Pledges Kept (15% Weight)
                    </span>
                    <div className="text-[10px] text-slate-400">
                      Pledges kept ÷ pledges due (public measurable milestones)
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {leaderBreakdown.pledgesScore}/100
                  </span>
                </div>

                <div className="p-2.5 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Responsiveness (10% Weight)
                    </span>
                    <div className="text-[10px] text-slate-400">
                      Share of adoptions with a first update within 72 hours
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {leaderBreakdown.responsivenessScore}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Anti-Flooding & Activity Rules */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs space-y-2 border border-slate-200 dark:border-slate-700">
              <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Anti-Flooding Cap &amp; Activity Threshold (k = 10)</span>
              </div>
              <ul className="text-[11px] text-slate-500 space-y-1 list-disc pl-4">
                <li>
                  <strong>Monthly Cap:</strong> At most 15 resolved issues per month count toward Impact to prevent artificial flooding.
                </li>
                <li>
                  <strong>Minimum Activity Threshold:</strong> Fewer than 3 confirmed resolutions in 90 days shows &ldquo;Not enough activity&rdquo; and displays no public rank.
                </li>
                <li>
                  <strong>Bayesian Pull (k = 10):</strong> Smooths raw scores against city average to prevent small sample distortions.
                </li>
                <li>
                  <strong>Anti-Gaming Exclusion:</strong> Team member votes and confirmations are cryptographically zero-weighted.
                </li>
              </ul>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsScoreFormulaOpen(false)}
          className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs cursor-pointer"
        >
          Close Formula Explorer
        </button>
      </div>
    </div>
  );
};

