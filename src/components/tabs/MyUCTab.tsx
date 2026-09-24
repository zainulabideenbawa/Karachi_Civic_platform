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
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          {/* Official Info */}
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-teal-600/30 shrink-0 bg-slate-100">
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
                  className="absolute bottom-0 inset-x-0 bg-teal-700/90 text-white text-[8px] font-bold text-center py-0.5"
                  title="Official profile verified and claimed"
                >
                  CLAIMED
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {activeUC.townName}
                </span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {activeUC.chairman.name}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {activeUC.chairman.seatTitle} · <span className="text-slate-600 dark:text-slate-300 font-semibold">{activeUC.chairman.party}</span>
              </p>
              
              {/* Badges */}
              <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                {activeUC.chairman.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-block text-[10px] font-semibold bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full border border-teal-200/60 dark:border-teal-800"
                  >
                    ★ {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Score Indicator Ring */}
          <div className="shrink-0 flex flex-col items-center">
            <ScoreRing
              score={activeUC.score}
              cityRank={activeUC.cityRank}
              trend30d={activeUC.trend30d}
              size="md"
            />
            <button
              onClick={() => setIsScoreFormulaOpen(true)}
              className="text-[11px] text-teal-700 dark:text-teal-400 hover:underline font-medium mt-1 cursor-pointer flex items-center gap-0.5"
            >
              <span>Score Breakdown</span>
              <HelpCircle className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Resolutions</div>
            <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {activeUC.resolvedIssues} <span className="text-[10px] text-slate-400 font-normal">/ {activeUC.totalEligibleIssues}</span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Oldest Issue</div>
            <div className={`text-sm font-bold tabular-nums ${activeUC.oldestOpenDays > 30 ? "text-red-600" : "text-amber-600"}`}>
              {activeUC.oldestOpenDays} days
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Fix Rating</div>
            <div className="text-sm font-bold text-teal-700 dark:text-teal-400 tabular-nums">
              {activeUC.chairman.fixSatisfaction}★ <span className="text-[10px] text-slate-400 font-normal">({activeUC.chairman.thankYouCount})</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Action Buttons: Suggest Idea & Polls */}
      <section className="grid grid-cols-2 gap-2">
        <button
          onClick={() => showToast("Idea submitted for UC-7 community review!")}
          className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition cursor-pointer text-left"
        >
          <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Suggest an Idea</div>
            <div className="text-[10px] text-slate-400">Propose for UC Baithak</div>
          </div>
        </button>

        <button
          onClick={() => showToast("Opening UC-7 active polls...")}
          className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition cursor-pointer text-left"
        >
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 shrink-0">
            <Vote className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">UC Polls</div>
            <div className="text-[10px] text-slate-400">Vote on priorities</div>
          </div>
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

                <div className="shrink-0 flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    <span>{ev.rsvpCount}</span>
                  </div>
                  <button
                    onClick={() => rsvpEvent(ev.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                      ev.isUserRsvpd
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300"
                        : "bg-teal-700 hover:bg-teal-800 text-white"
                    }`}
                  >
                    {ev.isUserRsvpd ? "✓ Attending" : "I'll Join"}
                  </button>
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
