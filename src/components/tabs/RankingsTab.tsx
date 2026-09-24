"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCivic } from "@/context/CivicContext";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  HelpCircle,
  Trophy,
  Building2,
  Zap,
  Award,
  ShieldCheck,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

export const RankingsTab: React.FC = () => {
  const {
    allUCs,
    allTowns,
    activeUC,
    setActiveUC,
    setActiveTab,
    setIsScoreFormulaOpen,
    communityLeaders,
    setSelectedLeader,
    setIsLeaderProfileOpen,
    setIsBecomeLeaderOpen,
    showToast,
  } = useCivic();

  const [leaderboardType, setLeaderboardType] = useState<"ucs" | "towns" | "leaders" | "improved">("ucs");
  const [filterVolume, setFilterVolume] = useState<"all" | "high">("all");
  const [leadersScope, setLeadersScope] = useState<"city" | "town" | "uc">("city");

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
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setLeaderboardType("ucs")}
          className={`py-2 rounded-lg cursor-pointer transition text-center ${
            leaderboardType === "ucs"
              ? "bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          UCs
        </button>
        <button
          onClick={() => setLeaderboardType("towns")}
          className={`py-2 rounded-lg cursor-pointer transition text-center ${
            leaderboardType === "towns"
              ? "bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Towns
        </button>
        <button
          onClick={() => setLeaderboardType("leaders")}
          className={`py-2 rounded-lg cursor-pointer transition text-center flex items-center justify-center gap-1 ${
            leaderboardType === "leaders"
              ? "bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Leaders</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
        </button>
        <button
          onClick={() => setLeaderboardType("improved")}
          className={`py-2 rounded-lg cursor-pointer transition text-center ${
            leaderboardType === "improved"
              ? "bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Improved
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

      {/* Scope Filter Chips for Community Leaders */}
      {leaderboardType === "leaders" && (
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <button
              onClick={() => setLeadersScope("city")}
              className={`px-2.5 py-1 rounded-md cursor-pointer transition ${
                leadersScope === "city"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              All Karachi
            </button>
            <button
              onClick={() => setLeadersScope("town")}
              className={`px-2.5 py-1 rounded-md cursor-pointer transition ${
                leadersScope === "town"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              Gulshan Town
            </button>
            <button
              onClick={() => setLeadersScope("uc")}
              className={`px-2.5 py-1 rounded-md cursor-pointer transition ${
                leadersScope === "uc"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              UC-7 Gulshan
            </button>
          </div>

          <button
            onClick={() => setIsBecomeLeaderOpen(true)}
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 cursor-pointer"
          >
            + Apply as Leader
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

      {/* ================= LIST 3: COMMUNITY LEADERS (SPEC ADDENDUM 01) ================= */}
      {leaderboardType === "leaders" && (
        <div className="space-y-2">
          {/* Integrity & Disclaimer Notice */}
          <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Independent Leaderboard:</span> Community Leaders are resident volunteers and aspiring election candidates. Ranked strictly on verified problem resolutions, target dates, and kept pledges.
            </div>
          </div>

          {communityLeaders
            .filter((leader) => {
              if (leadersScope === "uc") return leader.ucId === activeUC.id;
              if (leadersScope === "town") return leader.townId === activeUC.townId;
              return true;
            })
            .sort((a, b) => b.score - a.score)
            .map((leader, index) => (
              <div
                key={leader.id}
                onClick={() => {
                  setSelectedLeader(leader);
                  setIsLeaderProfileOpen(true);
                }}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/70 hover:shadow-xs cursor-pointer transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-200 dark:border-indigo-900">
                    #{index + 1}
                  </div>

                  <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 ring-1 ring-slate-200 dark:ring-slate-700">
                    <img
                      src={leader.photoUrl}
                      alt={leader.realName}
                      className="w-full h-full object-cover"
                    />
                    {leader.identityVerified && (
                      <div
                        className="absolute -bottom-0.5 -right-0.5 bg-emerald-600 text-white p-0.5 rounded-full"
                        title="Identity Verified"
                      >
                        <ShieldCheck className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {leader.realName}
                      </span>
                      {leader.plansToContest === "yes" && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200/50">
                          Candidate
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {leader.ucName} • {leader.party}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-base font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {leader.score.toFixed(1)}
                    </div>
                    <div className="text-[9px] font-semibold text-emerald-600 flex items-center justify-end gap-0.5">
                      <TrendingUp className="w-2.5 h-2.5" /> +{leader.trend30d}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
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
