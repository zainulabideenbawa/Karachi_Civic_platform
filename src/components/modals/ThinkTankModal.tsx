"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import {
  X,
  FileText,
  TrendingUp,
  CheckCircle2,
  Clock,
  Send,
  Building,
  Target,
  Zap,
  Users,
  Share2,
  Download,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  FileCheck,
  Ban,
  Calendar,
} from "lucide-react";
import { ProposalTrackerStatus, ThinkTankBrief } from "@/types/civic";

export const ThinkTankModal: React.FC = () => {
  const {
    isThinkTankModalOpen,
    setIsThinkTankModalOpen,
    thinkTankBriefs,
    selectedBrief,
    submitStageApplication,
    updateProposalStatus,
    activeRole,
    showToast,
  } = useCivic();

  const [activeTab, setActiveTab] = useState<"briefs" | "tracker" | "apply">("briefs");
  const [selectedBriefId, setSelectedBriefId] = useState<string>(
    selectedBrief?.id || thinkTankBriefs[0]?.id || ""
  );

  // Application form state
  const [applicantName, setApplicantName] = useState("");
  const [applicantRole, setApplicantRole] = useState("");
  const [applicantOrg, setApplicantOrg] = useState("");
  const [proposalPitch, setProposalPitch] = useState("");
  const [contactWhatsApp, setContactWhatsApp] = useState("");
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);

  // Official / Admin status update state
  const [statusUpdateNote, setStatusUpdateNote] = useState("");
  const [targetNewStatus, setTargetNewStatus] = useState<ProposalTrackerStatus>("acknowledged");

  if (!isThinkTankModalOpen) return null;

  const currentBrief: ThinkTankBrief =
    thinkTankBriefs.find((b) => b.id === selectedBriefId) || thinkTankBriefs[0];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !proposalPitch.trim() || !contactWhatsApp.trim()) {
      showToast("Please fill all required fields");
      return;
    }

    setIsSubmittingApp(true);
    submitStageApplication({
      briefId: currentBrief.id,
      applicantName,
      applicantRole: applicantRole || "Civic Citizen",
      organization: applicantOrg,
      proposalPitch,
      contactWhatsApp,
    });

    setApplicantName("");
    setApplicantRole("");
    setApplicantOrg("");
    setProposalPitch("");
    setContactWhatsApp("");
    setIsSubmittingApp(false);
    setActiveTab("briefs");
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    updateProposalStatus(currentBrief.id, targetNewStatus, statusUpdateNote);
    setStatusUpdateNote("");
  };

  const handleShareBrief = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(
        `🏛️ Karachi Think Tank Policy Brief: ${currentBrief.topic}\n\nTarget Authority: ${currentBrief.targetOfficialName} (${currentBrief.responsibleBody})\nSpecific Ask: ${currentBrief.specificAsk}\nStatus: ${currentBrief.proposalStatus.toUpperCase()}\n\nRead the full 1-page data brief on Karachi Civic Platform.`
      );
      showToast("Policy Brief summary copied to clipboard!");
    }
  };

  const handlePrintBrief = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const getStatusBadge = (status: ProposalTrackerStatus) => {
    switch (status) {
      case "sent":
        return { label: "Sent to Authority", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300", icon: Send };
      case "acknowledged":
        return { label: "Acknowledged", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300", icon: Clock };
      case "adopted":
        return { label: "Adopted into Plan", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300", icon: FileCheck };
      case "implemented":
        return { label: "Implemented in Field", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300", icon: CheckCircle2 };
      case "verified":
        return { label: "Verified on Ground", color: "bg-emerald-600 text-white", icon: ShieldCheck };
      case "declined":
        return { label: "Declined", color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300", icon: Ban };
    }
  };

  const statusSteps: ProposalTrackerStatus[] = ["sent", "acknowledged", "adopted", "implemented", "verified"];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <FileText className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg sm:text-xl text-white">Think Tanks & Policy Briefs</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Spec Sec 9
                </span>
              </div>
              <p className="text-xs text-emerald-100/80">
                Monthly sessions on one Karachi problem, grounded in live citizen data
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsThinkTankModalOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-4 pt-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("briefs")}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === "briefs"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <FileText className="w-4 h-4" />
            One-Page Briefs
          </button>
          <button
            onClick={() => setActiveTab("tracker")}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === "tracker"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Proposal Tracker
          </button>
          <button
            onClick={() => setActiveTab("apply")}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === "apply"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Users className="w-4 h-4" />
            Apply for Stage
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Brief Topic Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-medium shrink-0">Sessions:</span>
            {thinkTankBriefs.map((brief) => {
              const isSelected = brief.id === currentBrief.id;
              return (
                <button
                  key={brief.id}
                  onClick={() => setSelectedBriefId(brief.id)}
                  className={`px-3 py-1.5 rounded-full shrink-0 font-medium transition-all ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {brief.month}: #{brief.sessionNumber}
                </button>
              );
            })}
          </div>

          {activeTab === "briefs" && (
            <div className="space-y-6">
              {/* Brief Header Card */}
              <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-800/40 dark:to-emerald-950/20">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                        {currentBrief.month} Session #{currentBrief.sessionNumber}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Published {currentBrief.publishedDate}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {currentBrief.topic}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Target Area: {currentBrief.targetArea}
                    </p>
                  </div>

                  {/* Status Badge & Actions */}
                  <div className="flex items-center gap-2">
                    {(() => {
                      const badge = getStatusBadge(currentBrief.proposalStatus);
                      const Icon = badge.icon;
                      return (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {badge.label}
                        </span>
                      );
                    })()}

                    <button
                      onClick={handleShareBrief}
                      title="Share Brief"
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handlePrintBrief}
                      title="Print / Save PDF"
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 1. Problem & Live Data Summary (Spec 9.1) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs">
                    1
                  </div>
                  <h4>Problem & Platform Data Summary</h4>
                </div>
                <div className="pl-8 space-y-2">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {currentBrief.problemStatement}
                  </p>
                  <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200">
                    <strong>Live Evidence:</strong> {currentBrief.dataSummary}
                  </div>
                </div>
              </div>

              {/* 2. Root Cause (Spec 9.2) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <div className="w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs">
                    2
                  </div>
                  <h4>Root Cause Analysis</h4>
                </div>
                <div className="pl-8 space-y-2">
                  {currentBrief.rootCauses.map((cause, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2"
                    >
                      <span className="font-bold text-amber-600">•</span>
                      <span>{cause}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Solutions: Low-Cost vs Structural (Spec 9.3 & 9.4) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs">
                    3
                  </div>
                  <h4>Proposed Two-Tier Solutions</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8">
                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      <Zap className="w-3.5 h-3.5" /> Low-Cost Immediate Solution
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      {currentBrief.proposedSolution.title}
                    </h5>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {currentBrief.lowCostSolution || currentBrief.proposedSolution.description}
                    </p>
                    <div className="pt-1 flex items-center gap-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      <span>Est. Cost: {currentBrief.proposedSolution.estimatedCostPkr}</span>
                      <span>•</span>
                      <span>Timeline: {currentBrief.proposedSolution.timelineWeeks}w</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/30 dark:bg-blue-950/20 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                      <Building className="w-3.5 h-3.5" /> Structural Reform Solution
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {currentBrief.structuralSolution ||
                        "Requires municipal policy amendment, long-term PC-1 budget allocation, and inter-agency coordination between KMC, Town, and Provincial bodies."}
                    </p>
                    <span className="inline-block text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                      Multi-agency capital intervention
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Responsible Official & Specific Ask (Spec 9.5 & 9.6) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <div className="w-6 h-6 rounded-md bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs">
                    4
                  </div>
                  <h4>Responsible Official & Specific Municipal Ask</h4>
                </div>

                <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-purple-50/30 dark:bg-purple-950/20 space-y-3 pl-8">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-100 dark:border-purple-900/40 pb-2">
                    <div>
                      <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                        Designated Municipal Authority
                      </span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {currentBrief.targetOfficialName} — {currentBrief.responsibleBody}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" /> Single Specific Ask Requested
                    </span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                      "{currentBrief.specificAsk}"
                    </p>
                  </div>
                </div>
              </div>

              {/* 5. Three Quick Wins within 30 Days (Spec 9.7) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <div className="w-6 h-6 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs">
                    5
                  </div>
                  <h4>Quick Wins (&lt; 30 Days, Near-Zero Cost)</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-8">
                  {currentBrief.quickWins.map((win, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-teal-200/80 dark:border-teal-800/50 bg-teal-50/20 dark:bg-teal-950/10 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {win}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action Footer */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-sm">Want to speak or present at this session?</h5>
                  <p className="text-xs text-slate-400">
                    Engineers, community activists, and affected residents can apply for a 10-minute stage slot.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("apply")}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  Apply to Take the Stage <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {activeTab === "tracker" && (
            <div className="space-y-6">
              {/* Proposal Lifecycle Pipeline */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Public Proposal Lifecycle
                  </h4>
                  <span className="text-xs text-slate-500">
                    Published on {currentBrief.publishedDate}
                  </span>
                </div>

                {/* Stepper */}
                <div className="grid grid-cols-5 gap-1 sm:gap-2">
                  {statusSteps.map((step, idx) => {
                    const currentIdx = statusSteps.indexOf(currentBrief.proposalStatus);
                    const isCompleted = currentIdx >= idx;
                    const isCurrent = currentBrief.proposalStatus === step;

                    return (
                      <div key={step} className="flex flex-col items-center text-center">
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCurrent
                              ? "bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-900/50"
                              : isCompleted
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <span className="text-[10px] sm:text-xs font-medium capitalize mt-1.5 text-slate-700 dark:text-slate-300">
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status History Timeline */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  Audit Trail & Official Responses
                </h4>

                <div className="space-y-2.5">
                  {(currentBrief.statusHistory && currentBrief.statusHistory.length > 0) ? (
                    currentBrief.statusHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Status: {item.status}
                          </span>
                          <span className="text-slate-400">{item.date}</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">{item.note}</p>
                        <span className="text-[11px] text-slate-400 font-medium block">
                          Actor: {item.actor}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          Status: {currentBrief.proposalStatus}
                        </span>
                        <span className="text-slate-400">{currentBrief.publishedDate}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        {currentBrief.statusUpdateNote || "Proposal officially delivered to relevant municipal authority."}
                      </p>
                      <span className="text-[11px] text-slate-400 font-medium block">
                        Actor: Karachi Civic Think Tank Directorate
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Official / Admin Management Form */}
              {(activeRole === "official" || activeRole === "admin") && (
                <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" /> Authority / Admin Status Action
                  </div>
                  <form onSubmit={handleUpdateStatus} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                          Transition Proposal Status
                        </label>
                        <select
                          value={targetNewStatus}
                          onChange={(e) => setTargetNewStatus(e.target.value as ProposalTrackerStatus)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                          <option value="sent">Sent to Authority</option>
                          <option value="acknowledged">Acknowledged</option>
                          <option value="adopted">Adopted into Municipal Plan</option>
                          <option value="implemented">Implemented on Ground</option>
                          <option value="verified">Verified by Civic Platform</option>
                          <option value="declined">Declined</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                          Official Response / Decision Note
                        </label>
                        <input
                          type="text"
                          value={statusUpdateNote}
                          onChange={(e) => setStatusUpdateNote(e.target.value)}
                          placeholder="e.g. Budget approved for PC-1 tender"
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Update Public Status
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeTab === "apply" && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800/60 dark:to-slate-800/40 border border-emerald-200/80 dark:border-emerald-800/40">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Take the Stage at the Next Think Tank Session
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Every month, our Think Tank hosts 4 speakers on stage: 1 municipal officer, 1 technical engineer, 1 NGO leader, and 1 directly affected citizen. Sessions are live-streamed and published as public policy briefs.
                </p>
              </div>

              <form onSubmit={handleApply} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Engr. Salman Raza"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Professional Role / Title *
                    </label>
                    <input
                      type="text"
                      value={applicantRole}
                      onChange={(e) => setApplicantRole(e.target.value)}
                      placeholder="e.g. Urban Hydrologist / Resident Representative"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Organization / University / Neighborhood
                    </label>
                    <input
                      type="text"
                      value={applicantOrg}
                      onChange={(e) => setApplicantOrg(e.target.value)}
                      placeholder="e.g. NED University / Korangi Sector 7"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      WhatsApp Contact *
                    </label>
                    <input
                      type="text"
                      value={contactWhatsApp}
                      onChange={(e) => setContactWhatsApp(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Your 10-Minute Presentation Pitch & Proposed Solution *
                  </label>
                  <textarea
                    rows={4}
                    value={proposalPitch}
                    onChange={(e) => setProposalPitch(e.target.value)}
                    placeholder="Summarize your data findings, low-cost practical intervention, or personal ground experience related to this problem..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                  <span className="text-[11px] text-slate-400">
                    Max 250 words. Selected presenters are notified 7 days before the session.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingApp}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {isSubmittingApp ? "Submitting Application..." : "Submit Stage Speaker Application"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Karachi Think Tank Initiative • Section 9 Public Policy Architecture</span>
          <button
            onClick={() => setIsThinkTankModalOpen(false)}
            className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
