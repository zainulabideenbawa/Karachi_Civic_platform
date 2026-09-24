"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCivic } from "@/context/CivicContext";
import { ScoreRing } from "../ScoreRing";
import { IssueCard } from "../IssueCard";
import {
  Calendar,
  Sparkles,
  Vote,
  Filter,
  CheckCircle,
  HelpCircle,
  Users,
  Building,
  Mic,
  ShieldAlert,
  Award,
} from "lucide-react";
import { CIVIC_CATEGORIES } from "@/config/categories";

export const MyUCTab: React.FC = () => {
  const {
    activeUC,
    issues,
    events,
    promises,
    setSelectedIssue,
    setIsScoreFormulaOpen,
    setIsPollsModalOpen,
    setIsNGOsModalOpen,
    setIsBaithakPanelModalOpen,
    setSelectedEventForPanel,
    rsvpEvent,
    showToast,
  } = useCivic();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"oldest" | "affected" | "recent">("oldest");

  // Filter issues for this UC
  const ucIssues = issues.filter((iss) => iss.ucId === activeUC.id);

  const filteredIssues = ucIssues.filter((iss) => {
    if (activeCategoryFilter === "all") return true;
    return iss.categoryId === activeCategoryFilter;
  });

  // Sort issues
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === "oldest") return b.daysOpen - a.daysOpen; // Oldest first (Section 10.1)
    if (sortBy === "affected") return b.affectedCount - a.affectedCount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const ucEvents = events.filter((ev) => ev.ucId === activeUC.id);
  const ucPromises = promises.filter((p) => p.officialId === activeUC.chairman.id);

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* 1. Chairman & UC Report Card Header */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
        {/* Top District Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="text-[11px] font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span>{activeUC.townName} · {activeUC.name}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
              Rank #{activeUC.cityRank} of 246
            </span>
            <span className="text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-md">
              +{activeUC.trend30d}
            </span>
          </div>
        </div>

        {/* Main Official Info Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Avatar and Name */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 shadow-xs">
              <Image
                src={activeUC.chairman.photo}
                alt={activeUC.chairman.name}
                fill
                sizes="64px"
                className="object-cover"
                priority
              />
              {activeUC.chairman.isClaimed && (
                <div
                  className="absolute bottom-0 inset-x-0 bg-teal-800/90 text-white text-[7px] font-bold text-center py-0.5 uppercase tracking-wider"
                  title="Official profile verified and claimed"
                >
                  Claimed
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                {activeUC.chairman.name}
              </h1>
              <p className="text-xs text-slate-500 font-medium truncate pt-0.5">
                {activeUC.chairman.seatTitle}
              </p>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                Party: <span className="text-slate-700 dark:text-slate-300 font-semibold">{activeUC.chairman.party}</span>
              </p>
            </div>
          </div>

          {/* Score Indicator Ring */}
          <div className="shrink-0 flex flex-col items-center pl-2">
            <ScoreRing
              score={activeUC.score}
              cityRank={activeUC.cityRank}
              trend30d={activeUC.trend30d}
              size="md"
            />
            <button
              onClick={() => setIsScoreFormulaOpen(true)}
              className="text-[10px] text-teal-700 dark:text-teal-400 hover:underline font-semibold mt-1 cursor-pointer flex items-center gap-0.5"
            >
              <span>Score Formula</span>
              <HelpCircle className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Badges Strip (Clean, Horizontal Muted Micro-Pills) */}
        {activeUC.chairman.badges.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {activeUC.chairman.badges.map((badge, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700/80"
              >
                <Award className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                <span>{badge}</span>
              </span>
            ))}
          </div>
        )}

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Resolutions</div>
            <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {activeUC.resolvedIssues} <span className="text-[10px] text-slate-400 font-normal">/ {activeUC.totalEligibleIssues}</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Oldest Issue</div>
            <div className={`text-sm font-bold tabular-nums ${activeUC.oldestOpenDays > 30 ? "text-red-600" : "text-amber-600"}`}>
              {activeUC.oldestOpenDays} days
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Fix Rating</div>
            <div className="text-sm font-bold text-teal-700 dark:text-teal-400 tabular-nums">
              {activeUC.chairman.fixSatisfaction}★ <span className="text-[10px] text-slate-400 font-normal">({activeUC.chairman.thankYouCount})</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Action Buttons: Suggest Idea, UC Polls, & NGOs/NO-GOs */}
      <section className="grid grid-cols-3 gap-2">
        <button
          onClick={() => showToast("Idea submitted for UC-7 community review!")}
          className="flex flex-col items-start p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition cursor-pointer text-left shadow-xs"
        >
          <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 shrink-0 mb-1.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Suggest Idea</div>
          <div className="text-[10px] text-slate-400">For UC Baithak</div>
        </button>

        <button
          onClick={() => setIsPollsModalOpen(true)}
          className="flex flex-col items-start p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition cursor-pointer text-left shadow-xs group"
        >
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 shrink-0 mb-1.5 group-hover:scale-105 transition">
            <Vote className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
            <span>UC Polls</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-[10px] text-slate-400">Direct Democracy</div>
        </button>

        <button
          onClick={() => setIsNGOsModalOpen(true)}
          className="flex flex-col items-start p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition cursor-pointer text-left shadow-xs group"
        >
          <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 shrink-0 mb-1.5 group-hover:scale-105 transition">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100">NGOs &amp; Rules</div>
          <div className="text-[10px] text-slate-400">NO-GO Firewalls</div>
        </button>
      </section>

      {/* 3. Category Filter Chips (Horizontal Scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveCategoryFilter("all")}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
            activeCategoryFilter === "all"
              ? "bg-teal-700 text-white"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          }`}
        >
          All Issues ({ucIssues.length})
        </button>

        {CIVIC_CATEGORIES.slice(0, 6).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryFilter(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition ${
              activeCategoryFilter === cat.id
                ? "bg-teal-700 text-white font-semibold"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
            }`}
          >
            {cat.name.en}
          </button>
        ))}
      </div>

      {/* 4. Active Issues Header & Sort Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Public Civic Evidence
          </h2>
          <span className="text-xs text-slate-400">({sortedIssues.length})</span>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "oldest" | "affected" | "recent")}
            className="bg-transparent text-slate-600 dark:text-slate-300 text-xs font-medium cursor-pointer focus:outline-hidden"
          >
            <option value="oldest">Oldest First</option>
            <option value="affected">Most Affected</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>

      {/* Issues Grid */}
      {sortedIssues.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sortedIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onClick={() => setSelectedIssue(issue)}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
            No issues found in this category
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Tap Report below to add a photo-backed civic report in {activeUC.name}.
          </p>
        </div>
      )}

      {/* 5. Upcoming UC Events & Baithaks */}
      {ucEvents.length > 0 && (
        <section className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>UC Events &amp; Baithaks</span>
            </h2>
          </div>

          <div className="space-y-2">
            {ucEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="inline-block text-[10px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded">
                    {ev.date} · {ev.time}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {ev.description}
                  </p>
                  <div className="text-[11px] text-slate-400 font-medium">
                    📍 {ev.locationName}
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    <span>{ev.rsvpCount}</span>
                  </div>
                  <div className="flex flex-col gap-1 w-28">
                    <button
                      onClick={() => rsvpEvent(ev.id)}
                      className={`w-full py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                        ev.isUserRsvpd
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300"
                          : "bg-teal-700 hover:bg-teal-800 text-white shadow-xs"
                      }`}
                    >
                      {ev.isUserRsvpd ? "✓ Attending" : "I'll Join"}
                    </button>
                    {(ev.type === "uc_baithak" || ev.type === "town_hall") && (
                      <button
                        onClick={() => {
                          setSelectedEventForPanel(ev);
                          setIsBaithakPanelModalOpen(true);
                        }}
                        className="w-full py-1 rounded-lg text-[10px] font-bold border border-teal-500/40 bg-teal-50/70 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 hover:bg-teal-100 cursor-pointer transition flex items-center justify-center gap-1"
                      >
                        <Mic className="w-3 h-3 text-teal-600" />
                        <span>Apply for Panel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Promise Tracker Snapshot */}
      {ucPromises.length > 0 && (
        <section className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-teal-600" />
              <span>Chairman Promises ({activeUC.chairman.promisesKept}/{activeUC.chairman.promisesTotal} Kept)</span>
            </span>
            <span className="font-mono text-teal-700 dark:text-teal-400 font-bold">
              {Math.round((activeUC.chairman.promisesKept / activeUC.chairman.promisesTotal) * 100)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all duration-500"
              style={{
                width: `${(activeUC.chairman.promisesKept / activeUC.chairman.promisesTotal) * 100}%`,
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
};
