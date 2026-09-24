"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ScoreRingProps {
  score: number;
  cityRank: number;
  totalUcs?: number;
  trend30d: number;
  size?: "sm" | "md" | "lg";
  showRank?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  cityRank,
  totalUcs = 246,
  trend30d,
  size = "md",
  showRank = true,
}) => {
  // Determine color based on score tier
  const getColor = (val: number) => {
    if (val >= 75) return { stroke: "#10B981", text: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-800" };
    if (val >= 60) return { stroke: "#0D9488", text: "text-teal-700 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950/40", border: "border-teal-200 dark:border-teal-800" };
    if (val >= 45) return { stroke: "#D97706", text: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-200 dark:border-amber-800" };
    return { stroke: "#DC2626", text: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/40", border: "border-red-200 dark:border-red-800" };
  };

  const colorTier = getColor(score);

  // SVG parameters
  const dimensions = size === "lg" ? 110 : size === "md" ? 84 : 60;
  const strokeWidth = size === "lg" ? 8 : size === "md" ? 6 : 4;
  const radius = (dimensions - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative flex items-center justify-center">
        <svg
          width={dimensions}
          height={dimensions}
          className="transform -rotate-90"
        >
          {/* Background Ring */}
          <circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          {/* Progress Ring */}
          <circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            stroke={colorTier.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Inner Score Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-bold tabular-nums tracking-tight leading-none ${
              size === "lg" ? "text-3xl" : size === "md" ? "text-xl" : "text-sm"
            } ${colorTier.text}`}
          >
            {score.toFixed(1)}
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mt-0.5">
            Score
          </span>
        </div>
      </div>

      {showRank && (
        <div className="flex items-center gap-1.5 mt-2">
          {/* Rank Chip */}
          <div className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs tabular-nums border border-slate-200 dark:border-slate-700">
            #{cityRank} <span className="text-slate-400 font-normal">of {totalUcs}</span>
          </div>

          {/* 30-day Trend Indicator */}
          <div
            className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded-full ${
              trend30d > 0
                ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40"
                : trend30d < 0
                ? "text-red-700 bg-red-50 dark:bg-red-950/40"
                : "text-slate-500 bg-slate-50 dark:bg-slate-800"
            }`}
            title="30-day score change"
          >
            {trend30d > 0 ? (
              <TrendingUp className="w-3 h-3 mr-0.5" />
            ) : trend30d < 0 ? (
              <TrendingDown className="w-3 h-3 mr-0.5" />
            ) : (
              <Minus className="w-3 h-3 mr-0.5" />
            )}
            <span className="tabular-nums">
              {trend30d > 0 ? `+${trend30d.toFixed(1)}` : trend30d.toFixed(1)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
