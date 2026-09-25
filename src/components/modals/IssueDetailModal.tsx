"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCivic } from "@/context/CivicContext";
import { StatusPill } from "../StatusPill";
import {
  X,
  Share2,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building2,
  Send,
  SlidersHorizontal,
  Copy,
  Check,
  ExternalLink,
  Download,
  Award,
  Star,
  ThumbsUp,
  RotateCcw,
} from "lucide-react";

export const IssueDetailModal: React.FC = () => {
  const {
    selectedIssue,
    setSelectedIssue,
    toggleAffected,
    voteConfirmation,
    setIsLeaderDashboardOpen,
    showToast,
    activeUC,
  } = useCivic();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<
    { id: string; user: string; role: string; text: string; time: string }[]
  >([
    {
      id: "c-1",
      user: "Rashid Minhas",
      role: "Verified Resident",
      text: "This overflow has been persistent since Monday. Pedestrians can't reach the bank.",
      time: "2 days ago",
    },
  ]);

  const [showSlider, setShowSlider] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);

  // Workflow W5 Confirmation & Rating states
  const [w5Mode, setW5Mode] = useState<"idle" | "rating" | "reject">("idle");
  const [w5Rating, setW5Rating] = useState<number>(5);
  const [w5SayThanks, setW5SayThanks] = useState<boolean>(true);
  const [w5RejectReason, setW5RejectReason] = useState<"Not fixed at all" | "Partly fixed" | "Came back">("Not fixed at all");
  const [w5RejectNote, setW5RejectNote] = useState<string>("");

  if (!selectedIssue) return null;

  const isConfirmationWindow = selectedIssue.status === "marked_resolved";
  const hasAfterPhoto = selectedIssue.afterPhotos && selectedIssue.afterPhotos.length > 0;
  const beforePhoto = selectedIssue.photos[0]?.url || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop";
  const afterPhoto = selectedIssue.afterPhotos?.[0]?.url || "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=800&h=600&fit=crop";

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        user: "Zain Bawa",
        role: "Verified Resident",
        text: commentText.trim(),
        time: "Just now",
      },
    ]);
    setCommentText("");
    showToast("Evidence note added to public issue record");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400">
              #{selectedIssue.id}
            </span>
            <span className="text-xs text-slate-400">· {selectedIssue.categoryName}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Share Card Trigger */}
            <button
              onClick={() => setShowShareModal(true)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title="Share Viral Card"
            >
              <Share2 className="w-4 h-4 text-teal-600" />
            </button>

            {/* Close Modal */}
            <button
              onClick={() => setSelectedIssue(null)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 1. Media Section (Photos or Before/After Comparison) */}
          <div className="relative w-full h-64 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {hasAfterPhoto && showSlider ? (
              // Before / After Comparison Slider
              <div className="relative w-full h-full select-none">
                <Image
                  src={afterPhoto}
                  alt="After fix"
                  fill
                  sizes="(max-width: 640px) 100vw, 640px"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <Image
                    src={beforePhoto}
                    alt="Before fix"
                    fill
                    sizes="(max-width: 640px) 100vw, 640px"
                    className="object-cover"
                  />
                </div>
                {/* Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-xl cursor-ew-resize flex items-center justify-center"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-6 h-6 rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center text-[10px] font-bold">
                    ⇄
                  </div>
                </div>
                {/* Slider input control */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
                />
                <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  BEFORE
                </span>
                <span className="absolute bottom-2 right-2 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  AFTER FIX
                </span>
              </div>
            ) : (
              // Standard Photo View
              <div className="relative w-full h-full">
                <Image
                  src={selectedIssue.photos[activePhotoIndex]?.url || beforePhoto}
                  alt={selectedIssue.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 640px"
                  className="object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/75 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="tabular-nums">
                    {selectedIssue.status === "confirmed"
                      ? `Fixed in ${selectedIssue.daysOpen} days`
                      : `${selectedIssue.daysOpen} days open`}
                  </span>
                </div>
              </div>
            )}

            {/* Toggle Before/After Slider if after-photo is present */}
            {hasAfterPhoto && (
              <button
                onClick={() => setShowSlider(!showSlider)}
                className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 text-xs font-bold px-2.5 py-1 rounded-md shadow-md backdrop-blur-xs cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
                <span>{showSlider ? "Standard View" : "Before/After Slider"}</span>
              </button>
            )}
          </div>

          {/* Multi-Photo Angle Switcher */}
          {selectedIssue.photos.length > 1 && !showSlider && (
            <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              {selectedIssue.photos.map((photo, pIdx) => (
                <button
                  key={photo.id || pIdx}
                  onClick={() => setActivePhotoIndex(pIdx)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    activePhotoIndex === pIdx
                      ? "bg-teal-700 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700"
                  }`}
                >
                  <span>Angle {pIdx + 1}</span>
                  {activePhotoIndex === pIdx && <span className="w-1.5 h-1.5 rounded-full bg-teal-300" />}
                </button>
              ))}
            </div>
          )}

          {/* 2. Title, Location & Status */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusPill status={selectedIssue.status} daysOpen={selectedIssue.daysOpen} />
              {selectedIssue.severity === "dangerous" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                  <AlertTriangle className="w-3 h-3" />
                  Immediate Hazard
                </span>
              )}
            </div>

            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {selectedIssue.title}
            </h2>

            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{selectedIssue.addressApprox} · {selectedIssue.ucName}</span>
            </div>

            {selectedIssue.description && (
              <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">
                {selectedIssue.description}
              </p>
            )}
          </div>

          {/* 3. Action Zone: Confirmation Window OR "I'm Affected" */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            {isConfirmationWindow ? (
              // 7-Day Confirmation Window (Section 5.3 & Workflow W5)
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-800 dark:text-purple-300">
                    Municipal Team Marked Fixed · Citizen Confirmation Required
                  </span>
                  {selectedIssue.confirmationWindow?.userVoted && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      ✓ Voted {selectedIssue.confirmationWindow.userVoted.toUpperCase()}
                    </span>
                  )}
                </div>

                {w5Mode === "idle" && (
                  <>
                    <p className="text-[11px] text-slate-500">
                      Did the municipal team resolve this on ground? Your verification directly impacts the UC Chairman&apos;s score.
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setW5Mode("rating")}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Fixed ({selectedIssue.confirmationWindow?.fixedVotes || 0})</span>
                      </button>

                      <button
                        onClick={() => setW5Mode("reject")}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Not Fixed ({selectedIssue.confirmationWindow?.notFixedVotes || 0})</span>
                      </button>
                    </div>
                  </>
                )}

                {/* W5: Rating & Say Thanks Subflow */}
                {w5Mode === "rating" && (
                  <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Confirm Fix Quality (Workflow W5)</span>
                      </h4>
                      <button
                        onClick={() => setW5Mode("idle")}
                        className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Star Rating */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">
                        How good was the fix on the ground?
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setW5Rating(star)}
                            className="p-1 hover:scale-110 transition cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= w5Rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-300 dark:text-slate-600"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 ml-1">
                          {w5Rating === 5 ? "5/5 · Excellent" : w5Rating === 4 ? "4/5 · Good" : w5Rating === 3 ? "3/5 · Acceptable" : w5Rating === 2 ? "2/5 · Mediocre" : "1/5 · Poor"}
                        </span>
                      </div>
                    </div>

                    {/* Say Thanks Toggle */}
                    <div className="flex items-center justify-between pt-1 border-t border-emerald-100 dark:border-emerald-900/40">
                      <div className="flex items-center gap-1.5">
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                          Send Public Thank You to {activeUC.chairman.name}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={w5SayThanks}
                        onChange={(e) => setW5SayThanks(e.target.checked)}
                        className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                    </div>

                    <button
                      onClick={() => {
                        voteConfirmation(selectedIssue.id, "fixed", undefined, w5Rating, w5SayThanks);
                        setW5Mode("idle");
                      }}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Submit Verified Fix ({w5Rating}★)</span>
                    </button>
                  </div>
                )}

                {/* W5: Reopen & Reason Subflow */}
                {w5Mode === "reject" && (
                  <div className="p-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 space-y-2.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-rose-950 dark:text-rose-100 flex items-center gap-1">
                        <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                        <span>Why is the fix incomplete?</span>
                      </h4>
                      <button
                        onClick={() => setW5Mode("idle")}
                        className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Reason Options */}
                    <div className="grid grid-cols-3 gap-1.5">
                      {(["Not fixed at all", "Partly fixed", "Came back"] as const).map((reason) => (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => setW5RejectReason(reason)}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition cursor-pointer text-center ${
                            w5RejectReason === reason
                              ? "bg-rose-600 text-white shadow-xs"
                              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-rose-200/60 dark:border-rose-900/40"
                          }`}
                        >
                          {reason}
                        </button>
                      ))}
                    </div>

                    {/* Note input */}
                    <input
                      type="text"
                      value={w5RejectNote}
                      onChange={(e) => setW5RejectNote(e.target.value)}
                      placeholder="Optional ground details (e.g. debris left behind)..."
                      className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                    />

                    <button
                      onClick={() => {
                        const fullReason = `${w5RejectReason}${w5RejectNote.trim() ? `: ${w5RejectNote.trim()}` : ""}`;
                        voteConfirmation(selectedIssue.id, "not_fixed", fullReason);
                        setW5Mode("idle");
                      }}
                      className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reopen Issue with Penalty</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Standard "I'm Affected" (Me Too) Action
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-teal-600" />
                    <span>{selectedIssue.affectedCount} Neighbors Affected</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    One tap adds your weight to this report
                  </div>
                </div>

                <button
                  onClick={() => toggleAffected(selectedIssue.id)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-xs ${
                    selectedIssue.isUserAffected
                      ? "bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-200 border border-teal-300"
                      : "bg-teal-700 hover:bg-teal-800 text-white"
                  }`}
                >
                  {selectedIssue.isUserAffected ? "✓ I'm Affected" : "+ Me Too (I'm Affected)"}
                </button>
              </div>
            )}
          </div>

          {/* 4. Pinned Official Response */}
          {selectedIssue.officialResponse && (
            <div className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-teal-700" />
                  <span>Pinned Official Response</span>
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">
                  {selectedIssue.officialResponse.seatTitle}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                &ldquo;{selectedIssue.officialResponse.message}&rdquo;
              </p>
            </div>
          )}

          {/* 4b. Community Leader Response (Spec Addendum 01, Section 3 - Always below official response) */}
          {selectedIssue.leaderResponse && (
            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Community Leader Response</span>
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                  {selectedIssue.leaderResponse.leaderName}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                &ldquo;{selectedIssue.leaderResponse.message}&rdquo;
              </p>
            </div>
          )}

          {/* 4c. Community Adoption Status (Spec Addendum 01) */}
          {selectedIssue.adoptedByType ? (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Adopted for Resolution</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                  {selectedIssue.adoptedByType === "leader" ? "Community Leader" : "NGO Partner"}
                </span>
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                Championed by <strong className="text-slate-800 dark:text-slate-200">{selectedIssue.adoptedByName}</strong>
              </div>
              {selectedIssue.targetDate && (
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 pt-0.5">
                  <Clock className="w-3 h-3" /> Committed completion target: {selectedIssue.targetDate}
                </div>
              )}
            </div>
          ) : selectedIssue.daysOpen >= 7 && selectedIssue.status !== "marked_resolved" && selectedIssue.status !== "confirmed" ? (
            <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40 flex items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Open for Community Adoption</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Open $\ge 7$ days without official resolution. Eligible for Community Leader or NGO adoption.
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedIssue(null);
                  setIsLeaderDashboardOpen(true);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition cursor-pointer shrink-0"
              >
                Adopt in Workbench
              </button>
            </div>
          ) : null}

          {/* 5. Evidence & Community Notes */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Community Evidence &amp; Notes ({comments.length})
            </h3>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {c.user} <span className="text-teal-600 font-normal">({c.role})</span>
                    </span>
                    <span className="text-slate-400">{c.time}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {c.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Add note input */}
            <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add factual context (280 characters)..."
                className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* ================= VIRAL SHARE CARD MODAL (Section 11.2) ================= */}
        {showShareModal && (
          <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex flex-col justify-end sm:justify-center p-3 sm:p-5 animate-in fade-in duration-150">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-3.5 shadow-2xl text-white">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-teal-400">
                    Share Civic Accountability Card
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Auto-generated 1200x630 proof card for viral social pressure
                  </p>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* OG Card Live Preview */}
              <div className="relative w-full aspect-1200/630 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/og?id=${encodeURIComponent(selectedIssue.id)}&title=${encodeURIComponent(selectedIssue.title)}&uc=${encodeURIComponent(selectedIssue.ucName)}&town=${encodeURIComponent(activeUC.townName)}&daysOpen=${selectedIssue.daysOpen}&affected=${selectedIssue.affectedCount}&official=${encodeURIComponent(activeUC.chairman.name)}&status=${selectedIssue.status}`}
                  alt="Civic Accountability Card"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Share Channels */}
              <div className="grid grid-cols-2 gap-2">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `🚨 *Karachi Civic Alert* (${selectedIssue.ucName})\n"${selectedIssue.title}" has been open for *${selectedIssue.daysOpen} days* with ${selectedIssue.affectedCount} residents affected.\n\nResponsible: ${activeUC.chairman.name} (${activeUC.chairman.seatTitle})\nTrack on Karachi Civic: ${typeof window !== "undefined" ? window.location.origin : "https://karachicivic.org"}?issue=${selectedIssue.id}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-xs transition"
                >
                  <span>💬 WhatsApp</span>
                </a>

                {/* X / Twitter */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `🚨 Civic Accountability in #Karachi: "${selectedIssue.title}" in ${selectedIssue.ucName} has been open for ${selectedIssue.daysOpen} days. ${selectedIssue.affectedCount} neighbors affected. @KarachiCivic`
                  )}&url=${encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : "https://karachicivic.org"}?issue=${selectedIssue.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white border border-slate-600 shadow-xs transition"
                >
                  <span>𝕏 Post on Twitter</span>
                </a>
              </div>

              {/* Copy Link & Download Row */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const shareUrl = `${typeof window !== "undefined" ? window.location.origin : "https://karachicivic.org"}?issue=${selectedIssue.id}`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(shareUrl);
                      setCopiedLink(true);
                      showToast("Direct issue link copied to clipboard!");
                      setTimeout(() => setCopiedLink(false), 2000);
                    }
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                  <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
                </button>

                <a
                  href={`/api/og?id=${encodeURIComponent(selectedIssue.id)}&title=${encodeURIComponent(selectedIssue.title)}&uc=${encodeURIComponent(selectedIssue.ucName)}&town=${encodeURIComponent(activeUC.townName)}&daysOpen=${selectedIssue.daysOpen}&affected=${selectedIssue.affectedCount}&official=${encodeURIComponent(activeUC.chairman.name)}&status=${selectedIssue.status}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-slate-300" />
                  <span>Open Full Card</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
