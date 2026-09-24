"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCivic } from "@/context/CivicContext";
import { StatusPill } from "../StatusPill";
import {
  X,
  Building2,
  CheckCircle,
  Clock,
  Send,
  Camera,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { Issue } from "@/types/civic";

export const OfficialDashboardModal: React.FC = () => {
  const {
    isOfficialDashboardOpen,
    setIsOfficialDashboardOpen,
    activeUC,
    issues,
    addOfficialResponse,
    officialMarkResolved,
    flagJurisdiction,
    showToast,
  } = useCivic();

  const [selectedIssueToAct, setSelectedIssueToAct] = useState<Issue | null>(null);
  const [activeAction, setActiveAction] = useState<"reply" | "resolve" | "flag" | null>(null);

  // Form states
  const [replyText, setReplyText] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");
  const [afterPhotoUrl, setAfterPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=800&h=600&fit=crop"
  );
  const [flagTarget, setFlagTarget] = useState("KWSC (Water & Sewerage)");
  const [flagReason, setFlagReason] = useState("");

  if (!isOfficialDashboardOpen) return null;

  const ucIssues = issues.filter((i) => i.ucId === activeUC.id);
  // Sort oldest first (highest days open)
  const openIssues = ucIssues
    .filter((i) => i.status !== "confirmed")
    .sort((a, b) => b.daysOpen - a.daysOpen);

  const handleResolveSubmit = (issueId: string) => {
    officialMarkResolved(issueId, afterPhotoUrl, resolutionNote);
    setActiveAction(null);
    setSelectedIssueToAct(null);
  };

  const handleReplySubmit = (issueId: string) => {
    if (!replyText.trim()) return;
    addOfficialResponse(issueId, replyText, "in_progress");
    setReplyText("");
    setActiveAction(null);
    setSelectedIssueToAct(null);
  };

  const handleFlagSubmit = (issueId: string) => {
    if (!flagReason.trim()) return;
    flagJurisdiction(issueId, flagTarget, flagReason);
    setFlagReason("");
    setActiveAction(null);
    setSelectedIssueToAct(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-teal-800 text-white">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-teal-300" />
            <div>
              <h2 className="text-base font-bold">
                Official Workbench · {activeUC.chairman.seatTitle}
              </h2>
              <p className="text-xs text-teal-200">
                Logged in as {activeUC.chairman.name} ({activeUC.name})
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOfficialDashboardOpen(false)}
            className="p-1 rounded-lg hover:bg-teal-700 text-teal-200 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Top Urgency Callout */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Next Best Action:</strong> Replying to your 3 oldest open issues will boost your Responsiveness score by ~4.5 points.
              </span>
            </div>
          </div>

          {/* Issue Action Drawer if an issue is selected */}
          {selectedIssueToAct && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-teal-500 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-teal-600">
                    #{selectedIssueToAct.id}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {selectedIssueToAct.title}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedIssueToAct(null);
                    setActiveAction(null);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setActiveAction("reply")}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeAction === "reply"
                      ? "bg-teal-700 text-white"
                      : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border"
                  }`}
                >
                  Quick Reply
                </button>
                <button
                  onClick={() => setActiveAction("resolve")}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeAction === "resolve"
                      ? "bg-emerald-700 text-white"
                      : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border"
                  }`}
                >
                  Mark Resolved
                </button>
                <button
                  onClick={() => setActiveAction("flag")}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeAction === "flag"
                      ? "bg-rose-700 text-white"
                      : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border"
                  }`}
                >
                  Flag Jurisdiction
                </button>
              </div>

              {/* Action 1: Quick Reply Form */}
              {activeAction === "reply" && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Official Public Reply (Will be pinned to issue):
                  </label>
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      "UC sanitary team mobilized. Cleared by tomorrow.",
                      "Work initiated with municipal contractor.",
                      "Drain suction pump dispatched to site.",
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setReplyText(preset)}
                        className="text-[11px] bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-300 cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={2}
                    placeholder="Type official response to citizens..."
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                  <button
                    onClick={() => handleReplySubmit(selectedIssueToAct.id)}
                    className="w-full py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Official Response &amp; Mark In Progress</span>
                  </button>
                </div>
              )}

              {/* Action 2: Mark Resolved Form */}
              {activeAction === "resolve" && (
                <div className="space-y-3 pt-2">
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-800 dark:text-emerald-200">
                    Section 5.3: Requires an &quot;after&quot; photo taken live at the location. Opens a 7-day citizen confirmation window.
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative w-24 h-20 rounded-lg overflow-hidden border border-slate-300 shrink-0">
                      <Image
                        src={afterPhotoUrl}
                        alt="After fix photo"
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-teal-600" />
                        <span>Site After-Photo Captured</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        GPS verified within 100m of issue site
                      </div>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Work details (e.g. Cleared 2 tons debris and replaced slab)..."
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />

                  <button
                    onClick={() => handleResolveSubmit(selectedIssueToAct.id)}
                    className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Submit Live Resolution Proof</span>
                  </button>
                </div>
              )}

              {/* Action 3: Flag Jurisdiction Form */}
              {activeAction === "flag" && (
                <div className="space-y-2 pt-2">
                  <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-xs text-red-800 dark:text-red-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>
                      Flagging shifts responsibility if accepted by the Admin Panel within 7 days.
                    </span>
                  </div>

                  <select
                    value={flagTarget}
                    onChange={(e) => setFlagTarget(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs"
                  >
                    <option value="KWSC (Water & Sewerage)">KWSC (Water &amp; Sewerage Board)</option>
                    <option value="KMC (Karachi Metropolitan Corp)">KMC (Arterial Roads &gt;100ft)</option>
                    <option value="K-Electric">K-Electric (Power Cables/Transformers)</option>
                    <option value="SSGC">SSGC (Sui Southern Gas)</option>
                  </select>

                  <textarea
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    rows={2}
                    placeholder="Explain statutory justification (e.g. 150ft road under KMC jurisdiction)..."
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />

                  <button
                    onClick={() => handleFlagSubmit(selectedIssueToAct.id)}
                    className="w-full py-2.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs cursor-pointer"
                  >
                    Submit Jurisdiction Dispute to Admin
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Issues Inbox (Oldest First) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Issues Queue in {activeUC.name} ({openIssues.length} Unresolved)
            </h3>

            <div className="space-y-2">
              {openIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => {
                    setSelectedIssueToAct(issue);
                    setActiveAction("reply");
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 cursor-pointer transition shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                      <Image
                        src={issue.photos[0]?.url || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&h=200&fit=crop"}
                        alt={issue.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <StatusPill status={issue.status} daysOpen={issue.daysOpen} />
                        <span className="text-[11px] font-mono text-slate-400">#{issue.id}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                        {issue.title}
                      </h4>
                      <div className="text-[11px] text-slate-400 truncate">
                        {issue.affectedCount} affected · {issue.addressApprox}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-2">
                    <div className={`text-xs font-bold tabular-nums ${issue.daysOpen > 30 ? "text-red-600" : "text-amber-600"}`}>
                      {issue.daysOpen}d open
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
