"use client";

import React from "react";
import { useCivic } from "@/context/CivicContext";
import {
  X,
  MapPin,
  Camera,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Users,
} from "lucide-react";

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, setIsFindMyUCOpen, setActiveTab } = useCivic();

  if (!isOnboardingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Top Header Graphic */}
        <div className="relative p-6 bg-gradient-to-br from-teal-800 via-teal-900 to-slate-950 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700/60 border border-teal-500/30 text-teal-200 text-xs font-semibold mb-3">
            <span>🇵🇰 Karachi Civic Platform</span>
            <span>·</span>
            <span>Independent &amp; Non-Partisan</span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-white leading-tight">
            Fixing Karachi Street by Street.
          </h2>
          <p className="text-xs text-teal-200 mt-1 leading-relaxed">
            Data-driven civic accountability for all 246 Union Councils.
          </p>
        </div>

        {/* 3 Core Pillars (Section 11.3) */}
        <div className="p-5 space-y-4">
          <div className="space-y-3.5">
            {/* 1. Score your UC */}
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-900/40">
              <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-md">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  <span>See your UC&apos;s live scorecard</span>
                  <span className="text-[10px] text-teal-600 font-normal">(0–100)</span>
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Rankings are calculated solely from verified resolution speed and backlog clearance — never popularity or political clout.
                </p>
              </div>
            </div>

            {/* 2. Report in 30 seconds */}
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-md">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Report problems in 30 seconds
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  In-app geo-tagged camera capture records precise GPS coordinates, auto-assigning the issue to the responsible municipal team.
                </p>
              </div>
            </div>

            {/* 3. Hold officials accountable */}
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Citizens verify all fixes on ground
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Municipalities cannot mark issues fixed without confirmation from neighbors. Unfixed reports reopen with a score penalty.
                </p>
              </div>
            </div>
          </div>

          {/* Quick No-Friction Assurance */}
          <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>No account required to browse or search. Under 60-second setup.</span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                setIsOnboardingOpen(false);
                setIsFindMyUCOpen(true);
              }}
              className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-lg shadow-teal-700/20 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Find My Union Council (GPS / Landmark)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsOnboardingOpen(false);
                setActiveTab("map");
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer"
            >
              Explore Karachi Map &amp; Heatmap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
