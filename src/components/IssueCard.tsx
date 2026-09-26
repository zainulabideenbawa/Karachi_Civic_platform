"use client";

import React from "react";
import Image from "next/image";
import { Issue } from "@/types/civic";
import { StatusPill } from "./StatusPill";
import { useCivic } from "@/context/CivicContext";
import {
  Users,
  AlertTriangle,
  MessageSquare,
  Clock,
  MapPin,
  Camera,
  Building2,
  Award,
  HeartHandshake,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  Share2,
  Shield,
  UserCheck,
} from "lucide-react";

interface IssueCardProps {
  issue: Issue;
  onClick: () => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
  const { activeRole, openWorkDoneShare } = useCivic();
  const issuePhotos = issue.photos || [];
  const photoUrl =
    issuePhotos[0]?.url ||
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
          {issuePhotos.length > 1 && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-bold bg-black/75 text-white backdrop-blur-md shadow-md border border-white/10">
              <Camera className="w-3 h-3 text-teal-400" />
              <span>{issuePhotos.length} angles</span>
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

          {/* Reporter & Origin Attribution Line */}
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5 min-w-0">
              {issue.isAnonymous ? (
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Anonymous Resident</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-teal-700 dark:text-teal-400 font-semibold truncate">
                  <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">Reported by {issue.reporterName || "Resident"}</span>
                </span>
              )}
            </div>

            {issue.comments && issue.comments.length > 0 && (
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md shrink-0">
                <MessageSquare className="w-3 h-3 text-slate-400" />
                <span>{issue.comments.length} notes</span>
              </span>
            )}
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

        {/* Role-Specific Action Strip */}
        {activeRole === "official" && issue.status !== "confirmed" && issue.status !== "marked_resolved" && (
          <div className="mt-1 pt-2 border-t border-amber-200/60 dark:border-amber-900/40 bg-amber-50/80 dark:bg-amber-950/40 -mx-4 -mb-4 px-3.5 py-2 flex items-center justify-between text-[11px]">
            <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Chairman Action: Dispatch / Resolve</span>
            </span>
            <span className="text-amber-700 dark:text-amber-300 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Act <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        )}

        {activeRole === "official" && (issue.status === "marked_resolved" || issue.status === "confirmed") && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              openWorkDoneShare(issue);
            }}
            className="mt-1 pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/80 dark:bg-emerald-950/40 -mx-4 -mb-4 px-3.5 py-2 flex items-center justify-between text-[11px] hover:bg-emerald-100/90 dark:hover:bg-emerald-900/60 transition cursor-pointer"
          >
            <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Work Done: Verified Resolution</span>
            </span>
            <span className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Proof</span>
            </span>
          </div>
        )}

        {activeRole === "community_leader" && issue.daysOpen >= 7 && issue.status !== "confirmed" && !issue.adoptedByType && (
          <div className="mt-1 pt-2 border-t border-indigo-200/60 dark:border-indigo-900/40 bg-indigo-50/80 dark:bg-indigo-950/40 -mx-4 -mb-4 px-3.5 py-2 flex items-center justify-between text-[11px]">
            <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <span>Eligible for Community Adoption (≥7d)</span>
            </span>
            <span className="text-indigo-700 dark:text-indigo-300 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Adopt <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        )}

        {activeRole === "ngo" && issue.severity === "dangerous" && issue.status !== "confirmed" && (
          <div className="mt-1 pt-2 border-t border-purple-200/60 dark:border-purple-900/40 bg-purple-50/80 dark:bg-purple-950/40 -mx-4 -mb-4 px-3.5 py-2 flex items-center justify-between text-[11px]">
            <span className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-purple-600" />
              <span>Critical NGO Relief Target</span>
            </span>
            <span className="text-purple-700 dark:text-purple-300 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Deploy <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        )}

        {activeRole === "admin" && (
          <div className="mt-1 pt-2 border-t border-rose-200/60 dark:border-rose-900/40 bg-rose-50/80 dark:bg-rose-950/40 -mx-4 -mb-4 px-3.5 py-2 flex items-center justify-between text-[11px]">
            <span className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Oversight Inspection: Verification Weight Active</span>
            </span>
            <span className="text-rose-700 dark:text-rose-300 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Audit <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
