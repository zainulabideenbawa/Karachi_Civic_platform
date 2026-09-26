"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import {
  X,
  HeartHandshake,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Camera,
  Share2,
  Truck,
  Droplet,
  ShieldCheck,
  MapPin,
  ThumbsUp,
  FileCheck,
  ChevronRight,
  Flame,
  ArrowRight,
  Upload,
} from "lucide-react";
import { Issue } from "@/types/civic";

export const NGODashboardModal: React.FC = () => {
  const {
    isNGODashboardOpen,
    setIsNGODashboardOpen,
    issues,
    adoptNGOIssue,
    resolveNGOIssue,
    openWorkDoneShare,
    showToast,
    activeUC,
  } = useCivic();

  const [activeTab, setActiveTab] = useState<"abandoned" | "active_ops" | "fleet" | "charter">("abandoned");
  const [selectedIssueToAdopt, setSelectedIssueToAdopt] = useState<Issue | null>(null);
  const [adoptTurnaroundDays, setAdoptTurnaroundDays] = useState(2);
  const [adoptReliefNote, setAdoptReliefNote] = useState("");

  // Resolving state
  const [resolvingIssue, setResolvingIssue] = useState<Issue | null>(null);
  const [resolveProofUrl, setResolveProofUrl] = useState("");
  const [resolveNote, setResolveNote] = useState("");
  const [isCapturingProof, setIsCapturingProof] = useState(false);

  if (!isNGODashboardOpen) return null;

  // Filter abandoned issues: either flagged, open with high age/urgency, or unaddressed by UC official
  const abandonedIssues = issues.filter(
    (iss) =>
      iss.status === "open" &&
      !iss.adoptedById &&
      (iss.categoryId === "water" ||
        iss.categoryId === "sewerage" ||
        iss.categoryId === "electricity" ||
        iss.categoryId === "roads" ||
        iss.affectedCount >= 10)
  );

  // Active NGO operations
  const activeOps = issues.filter(
    (iss) =>
      (iss.adoptedByType === "ngo" || iss.status === "in_progress") &&
      iss.status !== "confirmed" &&
      iss.status !== "marked_resolved"
  );

  // Fast resolution proof templates for quick demo
  const sampleProofPhotos = [
    {
      title: "Iron Manhole Cover Installed",
      url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80",
    },
    {
      title: "Clean Water Bowser Distributed",
      url: "https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?w=600&auto=format&fit=crop&q=80",
    },
    {
      title: "Dewatering Pump Cleared Road",
      url: "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=600&auto=format&fit=crop&q=80",
    },
  ];

  const handleConfirmAdopt = () => {
    if (!selectedIssueToAdopt) return;
    const res = adoptNGOIssue(
      selectedIssueToAdopt.id,
      "Al-Khidmat & Edhi Joint Disaster Relief",
      adoptTurnaroundDays,
      adoptReliefNote || "Emergency humanitarian intervention: volunteer crew and dewatering equipment deployed."
    );
    if (res.success) {
      setSelectedIssueToAdopt(null);
      setAdoptReliefNote("");
      setActiveTab("active_ops");
    }
  };

  const handleConfirmResolve = () => {
    if (!resolvingIssue) return;
    const photoToUse =
      resolveProofUrl ||
      "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80";

    const res = resolveNGOIssue(
      resolvingIssue.id,
      photoToUse,
      resolveNote || "Relief work completed by NGO volunteer response unit."
    );

    if (res.success) {
      showToast("NGO relief work completed! Opening Work Done Share Card.");
      const resolvedIssue = {
        ...resolvingIssue,
        status: "marked_resolved" as const,
        adoptedByName: "Al-Khidmat & Edhi Relief Fleet",
        adoptedByType: "ngo" as const,
      };
      setResolvingIssue(null);
      setResolveProofUrl("");
      setResolveNote("");
      setIsCapturingProof(false);
      openWorkDoneShare(resolvedIssue);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsNGODashboardOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsNGODashboardOpen]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsNGODashboardOpen(false);
      }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[94vh] cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-emerald-950 text-white border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">NGO Humanitarian &amp; Relief Workbench</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-800 text-emerald-200 border border-emerald-600/60">
                  VERIFIED RELIEF FLEET
                </span>
              </div>
              <p className="text-xs text-emerald-300">
                Al-Khidmat Foundation • Edhi Emergency Fleet • Saylani Disaster Response
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNGODashboardOpen(false)}
            className="p-1.5 rounded-lg hover:bg-emerald-900 text-emerald-400 hover:text-white cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab("abandoned")}
            className={`flex-shrink-0 px-4 py-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === "abandoned"
                ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800/80"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Abandoned Issues Radar (≥7 Days)</span>
            {abandonedIssues.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {abandonedIssues.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("active_ops")}
            className={`flex-shrink-0 px-4 py-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === "active_ops"
                ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800/80"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>Active Relief Operations</span>
            {activeOps.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-500 text-white text-[10px] font-bold">
                {activeOps.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("fleet")}
            className={`flex-shrink-0 px-4 py-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === "fleet"
                ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800/80"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-purple-500" />
            <span>Relief Fleet &amp; Asset Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab("charter")}
            className={`flex-shrink-0 px-4 py-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === "charter"
                ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800/80"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>10-Point NGO Civic Charter</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: ABANDONED ISSUES RADAR */}
          {activeTab === "abandoned" && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Humanitarian Emergency Safety Valve</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    When elected municipal officials fail to address critical hazards within 7 days (open gutter manholes, contaminated water lines, flooded streets), verified NGOs step in to provide immediate emergency relief without letting government off the hook.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {abandonedIssues.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-400">
                    No critical abandoned issues pending NGO relief.
                  </div>
                ) : (
                  abandonedIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-3 hover:border-emerald-500/50 transition shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start gap-3">
                          {issue.photos[0] && (
                            <img
                              src={issue.photos[0].url}
                              alt={issue.title}
                              className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                                {issue.title}
                              </h3>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                                7+ DAYS INACTION
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {issue.description}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {issue.addressApprox}
                              </span>
                              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                                <ThumbsUp className="w-3 h-3" />
                                {issue.affectedCount} Affected Citizens
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedIssueToAdopt(issue)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
                        >
                          <HeartHandshake className="w-4 h-4" />
                          Adopt for Relief
                        </button>
                      </div>

                      {/* Adoption Confirmation Drawer */}
                      {selectedIssueToAdopt?.id === issue.id && (
                        <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 space-y-3 pt-3">
                          <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200">
                            <span>Deploy NGO Emergency Relief Unit</span>
                            <button
                              onClick={() => setSelectedIssueToAdopt(null)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                                Relief Target Window
                              </label>
                              <select
                                value={adoptTurnaroundDays}
                                onChange={(e) => setAdoptTurnaroundDays(Number(e.target.value))}
                                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                              >
                                <option value={1}>24 Hours (Immediate Rapid Response)</option>
                                <option value={2}>48 Hours (Standard NGO Deployment)</option>
                                <option value={3}>72 Hours (Extensive Dewatering / Pipeline)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                                Relief Action Plan
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Installing reinforced steel manhole cover..."
                                value={adoptReliefNote}
                                onChange={(e) => setAdoptReliefNote(e.target.value)}
                                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              onClick={() => setSelectedIssueToAdopt(null)}
                              className="px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleConfirmAdopt}
                              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Confirm Adoption &amp; Deploy
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE RELIEF OPERATIONS */}
          {activeTab === "active_ops" && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Active Humanitarian Relief Projects</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    After resolving an issue on the ground, upload photographic proof to initiate the 7-day citizen confirmation window and generate a branded Work Done Share Card for public credit.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {activeOps.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-400">
                    No active NGO operations currently deployed. Adopt an issue from the Radar tab!
                  </div>
                ) : (
                  activeOps.map((op) => (
                    <div
                      key={op.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                              {op.title}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                              IN PROGRESS
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {op.addressApprox} • Adopted by: <span className="font-semibold text-emerald-600">{op.adoptedByName || "NGO Relief Squad"}</span>
                          </p>
                        </div>

                        <button
                          onClick={() => setResolvingIssue(op)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
                        >
                          <Camera className="w-4 h-4" />
                          Submit Relief Proof &amp; Complete
                        </button>
                      </div>

                      {/* Equipment and notes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg">
                        <div>
                          <span className="text-slate-400">Target Completion:</span>{" "}
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {op.targetDate ? "Scheduled" : "2 Days Rapid Response"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Deployed Volunteers:</span>{" "}
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            4 Field Workers + 1 Team Lead
                          </span>
                        </div>
                      </div>

                      {/* Interactive Resolve Modal / Drawer */}
                      {resolvingIssue?.id === op.id && (
                        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 space-y-3">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
                            <span className="flex items-center gap-1.5">
                              <Camera className="w-4 h-4 text-emerald-600" />
                              Upload Fix Completion Proof
                            </span>
                            <button
                              onClick={() => setResolvingIssue(null)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Quick Photo Selector or URL input */}
                          <div className="space-y-2">
                            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">
                              Select from Verified Relief Photo Archive or paste custom link:
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {sampleProofPhotos.map((photo, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setResolveProofUrl(photo.url)}
                                  className={`p-1 rounded-lg border text-left cursor-pointer transition ${
                                    resolveProofUrl === photo.url
                                      ? "border-emerald-600 ring-2 ring-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40"
                                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                                  }`}
                                >
                                  <img
                                    src={photo.url}
                                    alt={photo.title}
                                    className="w-full h-14 object-cover rounded-sm mb-1"
                                  />
                                  <span className="text-[10px] line-clamp-1 font-medium text-slate-700 dark:text-slate-300">
                                    {photo.title}
                                  </span>
                                </button>
                              ))}
                            </div>

                            <input
                              type="text"
                              placeholder="Or paste photo proof URL..."
                              value={resolveProofUrl}
                              onChange={(e) => setResolveProofUrl(e.target.value)}
                              className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                            />

                            <textarea
                              rows={2}
                              placeholder="Summary of relief work completed (e.g. Cleared 2,000 gallons of stagnant floodwater)..."
                              value={resolveNote}
                              onChange={(e) => setResolveNote(e.target.value)}
                              className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              onClick={() => setResolvingIssue(null)}
                              className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleConfirmResolve}
                              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              Publish Fix &amp; Generate Share Card
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: RELIEF FLEET & ASSET MATRIX */}
          {activeTab === "fleet" && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Humanitarian Relief Equipment Fleet</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Live telemetry and readiness status of emergency intervention vehicles and hardware across Karachi districts.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-sky-500" />
                      Potable Water Bowsers (1,000 Gal)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                      34 ACTIVE / 6 ON STANDBY
                    </span>
                  </div>
                  <p className="text-slate-500">
                    Supplying clean RO drinking water to water-stressed settlements in Orangi, Lyari, and Korangi.
                  </p>
                  <button
                    onClick={() => showToast("Dispatched Water Bowser to UC 45 District Central")}
                    className="w-full py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold cursor-pointer transition text-xs"
                  >
                    Dispatch Bowser to {activeUC.name}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-500" />
                      Dewatering Heavy Suction Pumps
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      22 DEPLOYED / 8 READY
                    </span>
                  </div>
                  <p className="text-slate-500">
                    High-power diesel sludge pumps for rapid drainage of monsoon rainwater from primary intersections.
                  </p>
                  <button
                    onClick={() => showToast("Dispatched Dewatering Pump Unit to active UC")}
                    className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer transition text-xs"
                  >
                    Dispatch Dewatering Unit
                  </button>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-500" />
                      Reinforced Iron Manhole Covers
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      120 IN STOCK
                    </span>
                  </div>
                  <p className="text-slate-500">
                    Lockable circular manhole covers manufactured locally to immediately cover lethal open gutters.
                  </p>
                  <button
                    onClick={() => showToast("Allocated 5 Iron Manhole Covers for immediate installation")}
                    className="w-full py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold cursor-pointer transition text-xs"
                  >
                    Allocate 5 Covers to {activeUC.name}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-rose-500" />
                      Rapid First Response Ambulances
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                      18 EDHI UNITS ON CALL
                    </span>
                  </div>
                  <p className="text-slate-500">
                    Emergency triage and paramedical support for electrocution hazards and open trench injuries.
                  </p>
                  <button
                    onClick={() => showToast("Notified central ambulance dispatch for emergency standby")}
                    className="w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer transition text-xs"
                  >
                    Notify Central Dispatch
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 10-POINT CHARTER */}
          {activeTab === "charter" && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  The 10 Non-Negotiable Civic Rules for Karachi NGOs
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  NGOs provide emergency lifelines, but must never substitute long-term governmental accountability or obscure municipal negligence.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    rule: "1. Never Erase Municipal Inaction",
                    desc: "Official inaction counter remains publicly displayed on the issue even after NGO emergency adoption.",
                  },
                  {
                    rule: "2. 7-Day Waiting Window",
                    desc: "NGOs can only adopt municipal issues after 7 calendar days of zero official progress.",
                  },
                  {
                    rule: "3. Cryptographic Photo Proof",
                    desc: "Every completed intervention requires GPS-stamped before and after photography.",
                  },
                  {
                    rule: "4. Strict Non-Partisan Conduct",
                    desc: "Relief interventions cannot feature political party banners or campaign electioneering.",
                  },
                  {
                    rule: "5. Citizen Confirmation Mandate",
                    desc: "An issue is only certified resolved if local neighborhood residents verify the fix within 7 days.",
                  },
                  {
                    rule: "6. Open Financial Transparency",
                    desc: "Equipment and material costs are published for community oversight and donor trust.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-1"
                  >
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                      {item.rule}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
