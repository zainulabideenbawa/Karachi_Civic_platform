"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCivic } from "@/context/CivicContext";
import { TrendingUp, TrendingDown, Minus, HelpCircle, Trophy, Building2, Zap } from "lucide-react";

export const RankingsTab: React.FC = () => {
  const {
    allUCs,
    allTowns,
    activeUC,
    setActiveUC,
    setActiveTab,
    setIsScoreFormulaOpen,
    showToast,
  } = useCivic();

  const [leaderboardType, setLeaderboardType] = useState<"ucs" | "towns" | "improved">("ucs");
  const [filterVolume, setFilterVolume] = useState<"all" | "high">("all");

  // Filter & sort UCs
  const sortedUCs = [...allUCs]
    .filter((uc) => {
      if (filterVolume === "high") return uc.totalEligibleIssues >= 40;
      return true;
    })
    .sort((a, b) => b.score - a.score);

  const mostImprovedUCs = [...allUCs]
    .filter((uc) => uc.trend30d > 0)
    .sort((a, b) => b.trend30d - a.trend30d);

  const sortedTowns = [...allTowns].sort((a, b) => b.teamScore - a.teamScore);

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Header & Score Explainer Trigger */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Public Civic Leaderboards</span>
          </h1>
          <p className="text-xs text-slate-400">
            Formula-calculated performance over rolling 90 days
          </p>
        </div>

        <button
          onClick={() => setIsScoreFormulaOpen(true)}
          className="flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Formula</span>
        </button>
      </div>

      {/* Segmented Control */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setLeaderboardType("ucs")}
          className={`py-2 rounded-lg cursor-pointer transition ${
            leaderboardType === "ucs"
              ? "bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Karachi UCs
        </button>
        <button
          onClick={() => setLeaderboardType("towns")}
          className={`py-2 rounded-lg cursor-pointer transition ${
            leaderboardType === "towns"
              ? "bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Town Teams
        </button>
        <button
          onClick={() => setLeaderboardType("improved")}
          className={`py-2 rounded-lg cursor-pointer transition ${
            leaderboardType === "improved"
              ? "bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Most Improved
        </button>
      </div>

      {/* Volume Filter Chips for UCs */}
      {leaderboardType === "ucs" && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px]">Compare:</span>
          <button
            onClick={() => setFilterVolume("all")}
            className={`px-2.5 py-1 rounded-md cursor-pointer ${
              filterVolume === "all"
                ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 font-semibold"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            All UCs ({allUCs.length})
          </button>
          <button
            onClick={() => setFilterVolume("high")}
            className={`px-2.5 py-1 rounded-md cursor-pointer ${
              filterVolume === "high"
                ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 font-semibold"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            High Activity (&gt;40 issues)
          </button>
        </div>
      )}

      {/* ================= LIST 1: KARACHI UCS ================= */}
      {leaderboardType === "ucs" && (
        <div className="space-y-2">
          {sortedUCs.map((uc, index) => {
            const isUserUc = uc.id === activeUC.id;
            return (
              <div
                key={uc.id}
                onClick={() => {
                  setActiveUC(uc);
                  setActiveTab("my-uc");
                  showToast(`Selected ${uc.name}`);
                }}
                className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                  isUserUc
                    ? "bg-teal-50/80 dark:bg-teal-950/40 border-teal-500 shadow-xs"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Rank Badge */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 tabular-nums ${
                      index === 0
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : index === 1
                        ? "bg-slate-200 text-slate-800"
                        : index === 2
                        ? "bg-amber-800/10 text-amber-900"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    #{index + 1}
                  </div>

                  {/* Chairman Avatar */}
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
                    <Image
                      src={uc.chairman.photo}
                      alt={uc.chairman.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {uc.name}
                      </span>
                      {isUserUc && (
                        <span className="text-[9px] font-bold bg-teal-600 text-white px-1.5 py-0.2 rounded">
                          MY UC
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {uc.chairman.name} · {uc.townName}
                    </div>
                  </div>
                </div>

                {/* Score & Trend */}
                <div className="flex flex-col items-end shrink-0 pl-2">
                  <div className="text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {uc.score.toFixed(1)}
                  </div>
                  <div
                    className={`flex items-center text-[10px] font-semibold ${
                      uc.trend30d > 0
                        ? "text-emerald-600"
                        : uc.trend30d < 0
                        ? "text-red-600"
                        : "text-slate-400"
                    }`}
                  >
                    {uc.trend30d > 0 ? (
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                    ) : uc.trend30d < 0 ? (
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                    ) : (
                      <Minus className="w-3 h-3 mr-0.5" />
                    )}
                    <span>{uc.trend30d > 0 ? `+${uc.trend30d}` : uc.trend30d}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= LIST 2: TOWN TEAMS ================= */}
      {leaderboardType === "towns" && (
        <div className="space-y-2">
          {sortedTowns.map((town, index) => (
            <div
              key={town.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                  #{index + 1}
                </div>

                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
                  <Image
                    src={town.townChairmanPhoto}
                    alt={town.townChairmanName}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                    {town.name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {town.townChairmanName} · {town.totalUcs} Union Councils
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <div className="text-base font-bold text-teal-700 dark:text-teal-400 tabular-nums">
                  {town.teamScore.toFixed(1)}
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Team Score
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= LIST 3: MOST IMPROVED ================= */}
      {leaderboardType === "improved" && (
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Recognizing UCs with the largest positive score movement over the last 30 days.
            </span>
          </div>

          {mostImprovedUCs.map((uc, index) => (
            <div
              key={uc.id}
              onClick={() => {
                setActiveUC(uc);
                setActiveTab("my-uc");
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 cursor-pointer transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="text-xs font-bold text-slate-400 w-5 text-center">
                  #{index + 1}
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {uc.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {uc.chairman.name} · Score: {uc.score}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="tabular-nums">+{uc.trend30d} pts</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
