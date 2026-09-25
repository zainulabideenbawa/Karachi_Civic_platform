"use client";

import React from "react";
import Image from "next/image";
import { Issue } from "@/types/civic";
import { StatusPill } from "./StatusPill";
import { Users, AlertTriangle, MessageSquare, Clock, MapPin, Camera } from "lucide-react";

interface IssueCardProps {
  issue: Issue;
  onClick: () => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
  const photoUrl =
    issue.photos[0]?.url ||
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop";

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group text-left w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs hover:border-teal-500/60 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col active:scale-[0.99]"
    >
      {/* Photo and Overlaid Badges */}
      <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <Image
          src={photoUrl}
          alt={issue.title}
          fill
          sizes="(max-width: 640px) 100vw, 640px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Subtle dark gradient overlay for crystal-clear readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

        {/* Days Open Counter Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/75 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-xl shadow-md border border-white/10">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="tabular-nums">
            {issue.status === "confirmed" ? (
              <span className="text-emerald-400 font-extrabold">Fixed in {issue.daysOpen}d</span>
            ) : (
              <span>{issue.daysOpen} {issue.daysOpen === 1 ? "day" : "days"} open</span>
            )}
          </span>
        </div>

        {/* Hazard Badge */}
        {issue.severity === "dangerous" && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-600/90 backdrop-blur-md text-white text-xs font-extrabold px-2.5 py-1 rounded-xl shadow-md border border-red-500/30">
            <AlertTriangle className="w-3.5 h-3.5 text-white" />
            <span>Hazard</span>
          </div>
        )}

        {/* Bottom Left: Category & Angle Pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span className="inline-block px-2.5 py-1 rounded-xl text-xs font-bold bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 shadow-md backdrop-blur-md">
            {issue.categoryName}
          </span>
          {issue.photos.length > 1 && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-bold bg-black/75 text-white backdrop-blur-md shadow-md border border-white/10">
              <Camera className="w-3 h-3 text-teal-400" />
              <span>{issue.photos.length} angles</span>
            </span>
          )}
        </div>

        {/* Bottom Right: Affected Counter */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 shadow-md backdrop-blur-md">
          <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span className="tabular-nums font-mono">{issue.affectedCount} affected</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug line-clamp-2 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
            {issue.title}
          </h3>

          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mt-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-teal-600 dark:text-teal-400" />
            <span className="truncate">{issue.addressApprox}</span>
          </div>
        </div>

        {/* Bottom Status & Official Response Hint */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
          <StatusPill status={issue.status} daysOpen={issue.daysOpen} />

          {issue.officialResponse ? (
            <span className="flex items-center gap-1 text-teal-700 dark:text-teal-400 font-bold bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-lg border border-teal-200/60 dark:border-teal-800/60 text-[11px]">
              <MessageSquare className="w-3 h-3" />
              <span>Official Replied</span>
            </span>
          ) : (
            <span className="text-slate-400 font-mono text-[11px]">
              #{issue.id}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
