import React from "react";
import { IssueStatus } from "@/types/civic";

interface StatusPillProps {
  status: IssueStatus;
  daysOpen?: number;
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  daysOpen = 0,
  className = "",
}) => {
  // Section 11.0 Rule 6 - Strict status color & label mapping
  if (status === "open" && daysOpen > 30) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5 animate-pulse" />
        Open &gt;30d
      </span>
    );
  }

  switch (status) {
    case "open":
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
          Open
        </span>
      );

    case "acknowledged":
    case "in_progress":
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5" />
          In Progress
        </span>
      );

    case "marked_resolved":
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mr-1.5 animate-pulse" />
          Waiting Confirmation
        </span>
      );

    case "confirmed":
    case "community_resolved":
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5" />
          Confirmed Fixed
        </span>
      );

    case "reopened":
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mr-1.5" />
          Reopened by Citizens
        </span>
      );

    case "jurisdiction_flagged":
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5" />
          Jurisdiction Disputed
        </span>
      );

    case "not_scored":
    default:
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5" />
          Not Scored
        </span>
      );
  }
};
