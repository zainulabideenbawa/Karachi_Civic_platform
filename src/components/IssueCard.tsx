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
  const photoUrl = issue.photos[0]?.url || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop";

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
      className="group text-left w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/50 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col active:scale-[0.99]"
    >
      {/* Photo and Badges */}
      <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <Image
          src={photoUrl}
          alt={issue.title}
          fill
          sizes="(max-width: 640px) 100vw, 640px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Days Open Counter Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/75 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="tabular-nums">
            {issue.status === "confirmed" ? (
              <span className="text-emerald-400">Fixed in {issue.daysOpen}d</span>
            ) : (
              <span>{issue.daysOpen} {issue.daysOpen === 1 ? "day" : "days"} open</span>
            )}
          </span>
        </div>

        {/* Dangerous Flag */}
        {issue.severity === "dangerous" && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-red-600/90 backdrop-blur-xs text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-xs">
            <AlertTriangle className="w-3 h-3" />
            <span>Hazard</span>
          </div>
        )}

        {/* Category Pill & Multi-Photo Pill Overlaid at bottom */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 shadow-xs backdrop-blur-xs">
            {issue.categoryName}
          </span>
          {issue.photos.length > 1 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/75 text-white backdrop-blur-xs shadow-xs">
              <Camera className="w-3 h-3 text-teal-400" />
              <span>{issue.photos.length} angles</span>
            </span>
          )}
        </div>

        {/* Affected Counter on bottom right */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs backdrop-blur-xs">
          <Users className="w-3 h-3 text-teal-600" />
          <span className="tabular-nums">{issue.affectedCount} affected</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug line-clamp-2">
              {issue.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mt-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{issue.addressApprox}</span>
          </div>
        </div>

        {/* Bottom Status & Official Response Hint */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <StatusPill status={issue.status} daysOpen={issue.daysOpen} />

          {issue.officialResponse ? (
            <span className="flex items-center gap-1 text-teal-700 dark:text-teal-400 font-medium">
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
