"use client";

import React from "react";
import { useCivic } from "@/context/CivicContext";
import { computeUCScoreBreakdown } from "@/lib/scoring";
import { X, Calculator, ShieldCheck, CheckCircle2 } from "lucide-react";

export const ScoreFormulaModal: React.FC = () => {
  const { isScoreFormulaOpen, setIsScoreFormulaOpen, activeUC, issues } = useCivic();

  if (!isScoreFormulaOpen) return null;

  const ucIssues = issues.filter((i) => i.ucId === activeUC.id);
  const breakdown = computeUCScoreBreakdown(
    ucIssues,
    activeUC.chairman.eventsHeld,
    activeUC.chairman.promisesKept,
    activeUC.chairman.promisesTotal
  );

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsScoreFormulaOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsScoreFormulaOpen]);

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
                How UC Scores Work
              </h3>
              <p className="text-[11px] text-slate-400">
                Formula Version 1.0.0 · Published &amp; Immutable
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

        {/* Core Principles */}
        <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Rankings are 100% mathematical. No administrator, politician, or government official can edit a score. Recalculated every 6 hours by database job over a rolling 90-day window.
          </p>
        </div>

        {/* 6 Performance Components Breakdown Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
            <span>{activeUC.name} Breakdown</span>
            <span className="font-mono text-teal-700 dark:text-teal-400">
              Raw: {breakdown.rawScore} → Final: {activeUC.score}
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
                {breakdown.resolutionRateScore}/100
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
                {breakdown.speedScore}/100
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
                {breakdown.responsivenessScore}/100
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
                {breakdown.reliabilityScore}/100
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
                {breakdown.backlogScore}/100
              </span>
            </div>

            <div className="p-2.5 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Engagement (10% Weight)
                </span>
                <div className="text-[10px] text-slate-400">
                  Verified Baithaks + Kept Promises (Capped at 100)
                </div>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {breakdown.engagementScore}/100
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
