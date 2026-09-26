"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useCivic } from "@/context/CivicContext";
import { compressImageTiers } from "@/lib/image-compression";
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
  HeartHandshake,
  Camera,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  UserCheck,
  Shield,
  MessageSquare,
  Flag,
} from "lucide-react";

export const IssueDetailModal: React.FC = () => {
  const {
    selectedIssue,
    setSelectedIssue,
    toggleAffected,
    voteConfirmation,
    setIsLeaderDashboardOpen,
    setIsNGOsModalOpen,
    showToast,
    activeUC,
    activeRole,
    addOfficialResponse,
    officialMarkResolved,
    flagJurisdiction,
    openWorkDoneShare,
    addCommentToIssue,
  } = useCivic();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showOfficialStation, setShowOfficialStation] = useState(false);
  const [officialStationTab, setOfficialStationTab] = useState<"reply" | "resolve" | "flag">("reply");
  const [officialReplyInput, setOfficialReplyInput] = useState("");
  const [officialResolveNote, setOfficialResolveNote] = useState("");
  const [officialResolveProof, setOfficialResolveProof] = useState("");
  const officialCameraInputRef = useRef<HTMLInputElement>(null);
  const officialGalleryInputRef = useRef<HTMLInputElement>(null);

  const triggerOfficialCamera = () => {
    if (officialCameraInputRef.current) {
      officialCameraInputRef.current.value = "";
      officialCameraInputRef.current.click();
    }
  };

  const triggerOfficialGallery = () => {
    if (officialGalleryInputRef.current) {
      officialGalleryInputRef.current.value = "";
      officialGalleryInputRef.current.click();
    }
  };

  const handleOfficialPhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const img = new window.Image();
      img.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = dataUrl;
      });

      const result = await compressImageTiers(
        img,
        img.naturalWidth || 1280,
        img.naturalHeight || 960,
        { lat: activeUC.lat, lng: activeUC.lng }
      );
      setOfficialResolveProof(result.full.dataUrl);
      showToast("Resolution completion photo verified & attached!");
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setOfficialResolveProof(reader.result);
          showToast("Resolution photo attached!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const SAMPLE_RESOLUTIONS = [
    {
      title: "Road Paved",
      url: "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=800&h=600&fit=crop",
    },
    {
      title: "Waste Cleared",
      url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&h=600&fit=crop",
    },
    {
      title: "Drain Repaired",
      url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&h=600&fit=crop",
    },
  ];
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
  const issueComments = selectedIssue.comments || [];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedIssue) return;

    addCommentToIssue(selectedIssue.id, commentText.trim());
    setCommentText("");
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
              onClick={() => {
                if (
                  selectedIssue.status === "marked_resolved" ||
                  selectedIssue.status === "confirmed" ||
                  hasAfterPhoto
                ) {
                  openWorkDoneShare(selectedIssue);
                } else {
                  setShowShareModal(true);
                }
              }}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title={hasAfterPhoto ? "Share Work Done Proof" : "Share Civic Card"}
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

            {/* Action buttons if after-photo is present */}
            {hasAfterPhoto && (
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                <button
                  type="button"
                  onClick={() => openWorkDoneShare(selectedIssue)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-lg shadow-emerald-950/40 cursor-pointer transition active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5 text-white" />
                  <span>Share Work Done</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSlider(!showSlider)}
                  className="flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-md backdrop-blur-xs cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
                  <span>{showSlider ? "Standard" : "Slider"}</span>
                </button>
              </div>
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

            {/* Reporter Origin & Verification Attribution */}
            <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {selectedIssue.isAnonymous ? (
                  <>
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Anonymous Resident</span>
                    <span className="text-[10px] text-slate-400 font-mono">(Geofence Verified)</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      Reported by {selectedIssue.reporterName || "Verified Resident"}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      1.0x Weight
                    </span>
                  </>
                )}
              </div>

              <span className="text-slate-400 text-[11px] font-medium">
                {new Date(selectedIssue.createdAt).toLocaleDateString("en-PK", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
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
            ) : activeRole === "official" ? (
              // Official Chairman Authority Station
              <div className="space-y-3 p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
                    <Building2 className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <span>Chairman Action Desk · {activeUC.chairman.seatTitle}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                    Official Command
                  </span>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      addOfficialResponse(selectedIssue.id, "Crew dispatched to site for inspection & repair.", "in_progress");
                      showToast("Status updated to In Progress: Crew dispatched");
                    }}
                    className="flex-1 py-2 px-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>👷 Dispatch Crew</span>
                  </button>
                  <button
                    onClick={() => setShowOfficialStation(!showOfficialStation)}
                    className="flex-1 py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>✓ Resolve with Proof</span>
                  </button>
                </div>

                {/* Expanded Resolve/Reply Form */}
                {showOfficialStation && (
                  <div className="space-y-2.5 pt-2 border-t border-amber-200 dark:border-amber-900 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={officialReplyInput}
                        onChange={(e) => setOfficialReplyInput(e.target.value)}
                        placeholder="Official pinned statement (e.g. Pipeline patched and debris cleared)..."
                        className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                      <button
                        onClick={() => {
                          if (officialReplyInput.trim()) {
                            addOfficialResponse(selectedIssue.id, officialReplyInput.trim(), "in_progress");
                            setOfficialReplyInput("");
                            showToast("Official statement pinned to public record");
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-amber-700 text-white text-xs font-bold hover:bg-amber-800 transition cursor-pointer shrink-0"
                      >
                        Reply
                      </button>
                    </div>

                    {/* Hidden Native Camera & Gallery Inputs */}
                    <input
                      ref={officialCameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="sr-only"
                      aria-hidden="true"
                      onChange={handleOfficialPhotoSelect}
                    />
                    <input
                      ref={officialGalleryInputRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      aria-hidden="true"
                      onChange={handleOfficialPhotoSelect}
                    />

                    <div className="space-y-2.5 p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-amber-200 dark:border-amber-850 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>Resolution Completion Photo Proof</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>GPS Stamped</span>
                        </span>
                      </div>

                      {officialResolveProof ? (
                        /* Attached Photo Preview */
                        <div className="space-y-2">
                          <div className="relative w-full h-40 rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-950 shadow-inner group">
                            <Image
                              src={officialResolveProof}
                              alt="Resolution completion proof"
                              fill
                              unoptimized
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />

                            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-600/90 text-white text-[10px] font-bold shadow-xs">
                              <CheckCircle className="w-3 h-3" />
                              <span>Live Fix Proof Attached</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => setOfficialResolveProof("")}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white transition shadow-sm cursor-pointer"
                              title="Remove photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-slate-200 font-medium">
                              <span>📍 {activeUC.name} Ground Site</span>
                              <span className="bg-black/50 px-1.5 py-0.5 rounded text-[9px] font-mono">
                                Geotagged
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={triggerOfficialCamera}
                              className="py-2 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-98"
                            >
                              <Camera className="w-3.5 h-3.5 text-teal-600" />
                              <span>Retake with Camera</span>
                            </button>
                            <button
                              type="button"
                              onClick={triggerOfficialGallery}
                              className="py-2 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-98"
                            >
                              <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Pick from Gallery</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Dual Camera & Gallery Capture Trigger Card */
                        <div className="p-3.5 rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-700/70 bg-amber-50/50 dark:bg-amber-950/20 text-center space-y-2.5">
                          <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                            <span>Snap live site photo or upload from device gallery</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={triggerOfficialCamera}
                              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-98 transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Camera className="w-4 h-4 text-white" />
                              <span>Open Camera</span>
                            </button>

                            <button
                              type="button"
                              onClick={triggerOfficialGallery}
                              className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 shadow-xs active:scale-98 transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <ImageIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                              <span>Device Gallery</span>
                            </button>
                          </div>

                          <div className="pt-1 flex items-center justify-center gap-1.5 flex-wrap text-[10px] text-slate-500">
                            <span className="font-semibold text-slate-400">Quick presets:</span>
                            {SAMPLE_RESOLUTIONS.map((s) => (
                              <button
                                key={s.title}
                                type="button"
                                onClick={() => {
                                  setOfficialResolveProof(s.url);
                                  showToast(`Selected "${s.title}" sample resolution evidence`);
                                }}
                                className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-slate-700 dark:text-slate-300 text-[10px] cursor-pointer transition hover:bg-teal-50 dark:hover:bg-teal-950/40"
                              >
                                + {s.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <input
                        type="text"
                        value={officialResolveNote}
                        onChange={(e) => setOfficialResolveNote(e.target.value)}
                        placeholder="Resolution notes (e.g. Cleared 2 tons debris & replaced asphalt)..."
                        className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          if (!officialResolveProof) {
                            showToast("Please capture or upload a completion photo proof first!");
                            return;
                          }
                          officialMarkResolved(
                            selectedIssue.id,
                            officialResolveProof,
                            officialResolveNote || "Resolved by UC municipal team"
                          );
                          setShowOfficialStation(false);
                          showToast("Issue resolved! 7-day citizen confirmation window opened.");
                        }}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                      >
                        <Check className="w-4 h-4" />
                        <span>Submit Fix Proof &amp; Mark Resolved</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : activeRole === "community_leader" ? (
              // Community Leader Adoption Station
              <div className="space-y-2 p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-left">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <span>Community Leader Adoption Station</span>
                  </span>
                  <span className="text-[10px] bg-indigo-200/80 dark:bg-indigo-900 px-2 py-0.5 rounded-full">
                    Leader Mode
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Take ownership of this issue, organize volunteers, or fund a community fix.
                </p>
                <button
                  onClick={() => {
                    setSelectedIssue(null);
                    setIsLeaderDashboardOpen(true);
                  }}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Adopt Issue &amp; Coordinate Volunteers in Leader Studio</span>
                </button>
              </div>
            ) : activeRole === "ngo" ? (
              // NGO Relief Action Desk
              <div className="space-y-2 p-3 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-left">
                <div className="flex items-center justify-between text-xs font-bold text-purple-900 dark:text-purple-200">
                  <span className="flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-purple-600" />
                    <span>NGO Relief Action Desk</span>
                  </span>
                  <span className="text-[10px] bg-purple-200/80 dark:bg-purple-900 px-2 py-0.5 rounded-full">
                    NGO Mode
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedIssue(null);
                    setIsNGOsModalOpen(true);
                  }}
                  className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Sponsor Resolution &amp; Dispatch Relief Supplies</span>
                </button>
              </div>
            ) : (
              // Standard "I'm Affected" (Me Too) Action for Citizens
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

          {/* 5. Evidence & Community Discussion Notes */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                <span>Community Evidence &amp; Citizen Notes ({issueComments.length})</span>
              </h3>
              <span className="text-[10px] text-slate-400">Public &amp; Audited</span>
            </div>

            {issueComments.length === 0 ? (
              <div className="p-3 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-400">
                No notes or evidence comments yet. Be the first neighbor or official to add ground context!
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {issueComments.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-5 h-5 rounded-full bg-teal-600/20 text-teal-700 dark:text-teal-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {c.userName[0]}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                          {c.userName}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold shrink-0 ${
                            c.userRole === "official"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : c.userRole === "ngo"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : c.userRole === "community_leader"
                              ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                              : c.userRole === "admin"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                              : "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                          }`}
                        >
                          {c.userRole === "official"
                            ? "UC Chairman"
                            : c.userRole === "ngo"
                            ? "NGO Relief"
                            : c.userRole === "community_leader"
                            ? "Ward Leader"
                            : c.userRole === "admin"
                            ? "City Admin"
                            : "Verified Resident"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-slate-400 font-mono text-[10px]">
                          {new Date(c.createdAt).toLocaleDateString("en-PK", { month: "short", day: "numeric" })}
                        </span>
                        <button
                          type="button"
                          onClick={() => showToast("Comment flagged for civic moderator review (Section 6 integrity queue)")}
                          title="Report content (abusive, fake or private)"
                          className="text-slate-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                        >
                          <Flag className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                      {c.body}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Add note input */}
            <form onSubmit={handleAddComment} className="space-y-1.5 pt-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add ground evidence or neighborhood update (280 chars)..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between px-1">
                <span>
                  Posting as:{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    {activeRole === "official"
                      ? `${activeUC.chairman.name} (Chairman)`
                      : activeRole === "ngo"
                      ? "Al-Khidmat / Edhi Relief Unit"
                      : activeRole === "community_leader"
                      ? "Community Leader"
                      : activeRole === "admin"
                      ? "City Oversight SuperAdmin"
                      : "Zain Bawa (Verified Resident)"}
                  </strong>
                </span>
                <span>SHA-256 Public Audit</span>
              </div>
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
