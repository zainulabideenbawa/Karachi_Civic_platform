"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useCivic } from "@/context/CivicContext";
import { CIVIC_CATEGORIES } from "@/config/categories";
import { Issue, UC } from "@/types/civic";
import { StatusPill } from "../StatusPill";
import {
  Clock,
  Users,
  ChevronRight,
  Layers,
  Crosshair,
  Flame,
  MapPin,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export const MapTab: React.FC = () => {
  const { issues, activeUC, setActiveUC, setActiveTab, allUCs, setSelectedIssue } = useCivic();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [monsoonMode, setMonsoonMode] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"pins" | "heatmap">("pins");
  const [showBoundaries, setShowBoundaries] = useState<boolean>(true);
  const [selectedIssuePin, setSelectedIssuePin] = useState<Issue | null>(null);
  const [selectedUCZone, setSelectedUCZone] = useState<UC | null>(null);

  // Filter issues
  const filteredIssues = issues.filter((iss) => {
    if (monsoonMode) {
      // Monsoon Mode: Only dangerous drainage, potholes/flooding, and electrical wires
      const isDrainOrFlood = iss.categoryId === "drains" || iss.categoryId === "streets" || iss.categoryId === "electricity";
      const isHazardOrOpen = iss.severity === "dangerous" || iss.status !== "confirmed";
      return isDrainOrFlood && isHazardOrOpen;
    }
    if (selectedCategory !== "all" && iss.categoryId !== selectedCategory) return false;
    if (selectedStatus !== "all" && iss.status !== selectedStatus) return false;
    return true;
  });

  useEffect(() => {
    // Select the first issue as initial pin highlight
    if (filteredIssues.length > 0 && !selectedIssuePin) {
      setSelectedIssuePin(filteredIssues[0]);
    }
  }, [filteredIssues, selectedIssuePin]);

  // Karachi coordinate bounding box around Gulshan Town
  // Center approx: 24.918, 67.097
  // Scale lat/lng to percentage in SVG/Canvas for immediate interactive map
  const minLat = 24.88;
  const maxLat = 24.94;
  const minLng = 67.04;
  const maxLng = 67.12;

  const getPositionPercent = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    return {
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(5, Math.min(95, y))}%`,
    };
  };

  return (
    <div className="relative h-[calc(100vh-8rem)] w-full flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-inner">
      {/* Top Floating Filter Bar */}
      <div className="absolute top-3 inset-x-3 z-20 flex flex-col gap-2">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-md cursor-pointer transition ${
              selectedCategory === "all"
                ? "bg-teal-700 text-white ring-2 ring-teal-400"
                : "bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 backdrop-blur-md"
            }`}
          >
            All Categories ({issues.length})
          </button>
          {CIVIC_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-md cursor-pointer transition ${
                selectedCategory === cat.id
                  ? "bg-teal-700 text-white font-bold ring-2 ring-teal-400"
                  : "bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 backdrop-blur-md"
              }`}
            >
              {cat.name.en}
            </button>
          ))}
        </div>

        {/* Status Pills Bar & Monsoon Emergency Mode */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs shadow-md border border-slate-200/50 dark:border-slate-700/50">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="marked_resolved">Waiting Confirmation</option>
                <option value="confirmed">Confirmed Fixed</option>
              </select>
            </div>

            {/* Heatmap vs Pins Toggle (Section 11.1) */}
            <div className="flex items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-lg p-0.5 border border-slate-200/50 dark:border-slate-700/50 shadow-md">
              <button
                onClick={() => setViewMode("pins")}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                  viewMode === "pins"
                    ? "bg-teal-700 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>Pins</span>
              </button>
              <button
                onClick={() => setViewMode("heatmap")}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                  viewMode === "heatmap"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                <Flame className="w-3 h-3" />
                <span>Heatmap</span>
              </button>
            </div>

            {/* UC Boundaries Toggle */}
            <button
              onClick={() => setShowBoundaries(!showBoundaries)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition shadow-md cursor-pointer ${
                showBoundaries
                  ? "bg-teal-700 text-white ring-2 ring-teal-400"
                  : "bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200/50"
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>UC Zones</span>
            </button>

            {/* Monsoon Mode Emergency Toggle (Section 15.1) */}
            <button
              onClick={() => setMonsoonMode(!monsoonMode)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition shadow-md cursor-pointer ${
                monsoonMode
                  ? "bg-sky-600 text-white ring-2 ring-sky-300 animate-pulse"
                  : "bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200/50"
              }`}
            >
              <span>🌧 Monsoon Floods</span>
              {monsoonMode && <span className="text-[10px] bg-sky-800 px-1 rounded">LIVE</span>}
            </button>
          </div>

          <div className="text-[11px] font-semibold text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-md">
            {monsoonMode
              ? "Emergency Water & Road Hazards"
              : viewMode === "heatmap"
              ? "Civic Issue Density Heatmap"
              : `Showing ${filteredIssues.length} issues in ${activeUC.townName}`}
          </div>
        </div>
      </div>

      {/* Interactive Map Visual Layer */}
      <div className="relative flex-1 w-full bg-[#1e293b] overflow-hidden select-none">
        {/* Background Map Grid & Roads Styling */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Stylized Arterial Roads and UC Boundary Polygons */}
        <svg className="absolute inset-0 w-full h-full pointer-events-auto">
          {/* UC Boundary Territories with Score Tinting (Section 11.1) */}
          {showBoundaries && (
            <g className="cursor-pointer">
              {/* UC-7 Gulshan (Score 74 - Emerald) */}
              <polygon
                points="15,15 15,220 280,210 240,20"
                className={`transition-all duration-200 ${
                  selectedUCZone?.id === "uc-7"
                    ? "fill-emerald-500/35 stroke-emerald-400 stroke-2"
                    : "fill-emerald-500/15 stroke-emerald-500/40 hover:fill-emerald-500/25 stroke-1"
                }`}
                onClick={() => {
                  const uc = allUCs.find((u) => u.id === "uc-7") || activeUC;
                  setSelectedUCZone(uc);
                  setSelectedIssuePin(null);
                }}
              />
              <text x="50" y="45" fill="#34d399" fontSize="11" fontWeight="bold">
                UC-7 Gulshan (74)
              </text>

              {/* UC-8 Jamia Farooqia (Score 58 - Amber) */}
              <polygon
                points="240,20 280,210 520,200 480,25"
                className={`transition-all duration-200 ${
                  selectedUCZone?.id === "uc-8"
                    ? "fill-amber-500/35 stroke-amber-400 stroke-2"
                    : "fill-amber-500/15 stroke-amber-500/40 hover:fill-amber-500/25 stroke-1"
                }`}
                onClick={() => {
                  const uc = allUCs.find((u) => u.id === "uc-8") || allUCs[1] || activeUC;
                  setSelectedUCZone(uc);
                  setSelectedIssuePin(null);
                }}
              />
              <text x="320" y="55" fill="#fbbf24" fontSize="11" fontWeight="bold">
                UC-8 Farooqia (58)
              </text>

              {/* UC-9 Civic Centre (Score 65 - Amber/Teal) */}
              <polygon
                points="15,220 15,480 270,470 280,210"
                className={`transition-all duration-200 ${
                  selectedUCZone?.id === "uc-9"
                    ? "fill-teal-500/35 stroke-teal-400 stroke-2"
                    : "fill-teal-500/15 stroke-teal-500/40 hover:fill-teal-500/25 stroke-1"
                }`}
                onClick={() => {
                  const uc = allUCs.find((u) => u.id === "uc-9") || allUCs[2] || activeUC;
                  setSelectedUCZone(uc);
                  setSelectedIssuePin(null);
                }}
              />
              <text x="60" y="320" fill="#2dd4bf" fontSize="11" fontWeight="bold">
                UC-9 Civic Centre (65)
              </text>

              {/* UC-10 Pehlwan Goth / Safoora (Score 42 - Rose) */}
              <polygon
                points="280,210 270,470 520,460 520,200"
                className={`transition-all duration-200 ${
                  selectedUCZone?.id === "uc-10"
                    ? "fill-rose-500/35 stroke-rose-400 stroke-2"
                    : "fill-rose-500/15 stroke-rose-500/40 hover:fill-rose-500/25 stroke-1"
                }`}
                onClick={() => {
                  const uc = allUCs.find((u) => u.id === "uc-10") || allUCs[3] || activeUC;
                  setSelectedUCZone(uc);
                  setSelectedIssuePin(null);
                }}
              />
              <text x="330" y="320" fill="#fb7185" fontSize="11" fontWeight="bold">
                UC-10 Safoora (42)
              </text>
            </g>
          )}

          {/* Arterial Roads */}
          <line x1="10%" y1="90%" x2="90%" y2="10%" stroke="#475569" strokeWidth="8" />
          <line x1="10%" y1="90%" x2="90%" y2="10%" stroke="#14b8a6" strokeWidth="3" opacity="0.3" />
          <line x1="20%" y1="10%" x2="80%" y2="90%" stroke="#475569" strokeWidth="6" />
          <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="#475569" strokeWidth="5" />
          <circle cx="50%" cy="50%" r="28" stroke="#2dd4bf" strokeWidth="3" opacity="0.4" fill="none" />
          <text x="52%" y="48%" fill="#94a3b8" fontSize="10" fontWeight="bold">NIPA CHOWRANGI</text>
          <text x="70%" y="25%" fill="#94a3b8" fontSize="9">UNIVERSITY ROAD</text>
          <text x="25%" y="75%" fill="#94a3b8" fontSize="9">CIVIC CENTRE</text>
        </svg>

        {/* Heatmap Visual Layer (Section 11.1) */}
        {viewMode === "heatmap" && (
          <div className="absolute inset-0 pointer-events-none">
            {filteredIssues.map((issue) => {
              const pos = getPositionPercent(issue.lat, issue.lng);
              const isHazard = issue.severity === "dangerous";
              return (
                <div
                  key={`heat-${issue.id}`}
                  style={{
                    left: pos.left,
                    top: pos.top,
                    transform: "translate(-50%, -50%)",
                  }}
                  className={`absolute rounded-full filter blur-xl pointer-events-none ${
                    isHazard
                      ? "w-36 h-36 bg-red-600/40 animate-pulse"
                      : "w-28 h-28 bg-amber-500/30"
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Issue Markers on Map (Pins Mode) */}
        {viewMode === "pins" &&
          filteredIssues.map((issue) => {
            const pos = getPositionPercent(issue.lat, issue.lng);
            const isSelected = selectedIssuePin?.id === issue.id;
            const isResolved = issue.status === "confirmed";
            const isHazard = issue.severity === "dangerous";

            return (
              <button
                key={issue.id}
                onClick={() => {
                  setSelectedIssuePin(issue);
                  setSelectedUCZone(null);
                }}
                style={{ left: pos.left, top: pos.top }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10 cursor-pointer ${
                  isSelected ? "scale-125 z-30" : "hover:scale-110"
                }`}
                title={`${issue.title} (${issue.status})`}
              >
                <div className="relative flex flex-col items-center">
                  {/* Ping ring for hazard or active issues */}
                  {isHazard && (
                    <span className="absolute -inset-1 rounded-full bg-red-500 animate-ping opacity-75" />
                  )}

                  {/* Marker Body */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 text-white font-bold text-xs ${
                      isResolved
                        ? "bg-emerald-600 border-white"
                        : isHazard
                        ? "bg-red-600 border-white"
                        : issue.status === "in_progress"
                        ? "bg-blue-600 border-white"
                        : issue.status === "marked_resolved"
                        ? "bg-purple-600 border-white"
                        : "bg-amber-500 border-white"
                    }`}
                  >
                    <span className="text-[10px]">
                      {issue.categoryId.slice(0, 1).toUpperCase()}
                    </span>
                  </div>

                  {/* Mini Tooltip on selection */}
                  {isSelected && (
                    <div className="absolute -top-7 px-2 py-0.5 rounded bg-black/90 text-white text-[10px] font-bold whitespace-nowrap shadow-md">
                      #{issue.id}
                    </div>
                  )}
                </div>
              </button>
            );
          })}

        {/* Center Target Button */}
        <button
          onClick={() => {
            if (filteredIssues[0]) setSelectedIssuePin(filteredIssues[0]);
          }}
          className="absolute bottom-4 right-4 z-20 p-2.5 rounded-full bg-white dark:bg-slate-900 text-teal-700 shadow-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100"
          title="Center on Pilot UC"
        >
          <Crosshair className="w-5 h-5" />
        </button>
      </div>

      {/* UC Zone Preview Bottom Sheet (Section 11.1) */}
      {selectedUCZone && (
        <div className="absolute bottom-3 inset-x-3 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-3.5 border border-teal-500/40 shadow-2xl animate-in slide-in-from-bottom-4 duration-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-teal-600 bg-slate-100">
              <Image
                src={selectedUCZone.chairman.photo}
                alt={selectedUCZone.chairman.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {selectedUCZone.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  Score: {selectedUCZone.score}/100
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  Rank #{selectedUCZone.townRank} in {selectedUCZone.townName}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                Chairman: <strong>{selectedUCZone.chairman.name}</strong> ({selectedUCZone.chairman.party})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                setActiveUC(selectedUCZone);
                setActiveTab("my-uc");
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <span>View UC</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedUCZone(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Bottom Floating Issue Preview Card */}
      {selectedIssuePin && !selectedUCZone && (
        <div className="absolute bottom-3 inset-x-3 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-3 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-bottom-4 duration-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
              <Image
                src={selectedIssuePin.photos[0]?.url || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&h=200&fit=crop"}
                alt={selectedIssuePin.title}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <StatusPill status={selectedIssuePin.status} daysOpen={selectedIssuePin.daysOpen} />
                <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{selectedIssuePin.daysOpen}d</span>
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Users className="w-3 h-3 text-teal-600" />
                  <span>{selectedIssuePin.affectedCount}</span>
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {selectedIssuePin.title}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                📍 {selectedIssuePin.addressApprox}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedIssue(selectedIssuePin)}
            className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            <span>View</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
