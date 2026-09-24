"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import {
  X,
  Vote,
  CheckCircle2,
  Share2,
  Clock,
  Sparkles,
  Lock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export const UCPollsModal: React.FC = () => {
  const {
    isPollsModalOpen,
    setIsPollsModalOpen,
    activeUC,
    polls,
    votePoll,
    showToast,
    setIsWhatsAppAuthOpen,
    activeRole,
  } = useCivic();

  const [activeTab, setActiveTab] = useState<"active" | "closed">("active");
  const [suggestedTopic, setSuggestedTopic] = useState("");
  const [hasSuggested, setHasSuggested] = useState(false);

  if (!isPollsModalOpen) return null;

  const ucPolls = polls.filter((p) => p.ucId === activeUC.id);
  const activePolls = ucPolls.filter((p) => !p.isClosed);
  const closedPolls = ucPolls.filter((p) => p.isClosed);

  const handleVote = (pollId: string, optionId: string) => {
    if (activeRole === "visitor") {
      showToast("Verification required: Sign in via WhatsApp to cast your vote");
      setIsWhatsAppAuthOpen(true);
      return;
    }
    votePoll(pollId, optionId);
    showToast("Vote recorded! Your choice directly shapes municipal priorities.");
  };

  const handleSuggest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestedTopic.trim()) return;
    setHasSuggested(true);
    setSuggestedTopic("");
    showToast("Poll suggestion submitted for UC-7 community review!");
    setTimeout(() => setHasSuggested(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-teal-800 text-white flex items-center justify-between border-b border-teal-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-700/80 text-white shadow-xs">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-teal-200 font-semibold">
                {activeUC.name} · Direct Democracy
              </div>
              <h2 className="text-base font-bold">Union Council Citizen Polls</h2>
            </div>
          </div>
          <button
            onClick={() => setIsPollsModalOpen(false)}
            className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-1">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "active"
                ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <span>Live Polls ({activePolls.length})</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
          <button
            onClick={() => setActiveTab("closed")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "closed"
                ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <span>Past Results ({closedPolls.length})</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Active Polls */}
          {activeTab === "active" && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/80 text-xs text-teal-900 dark:text-teal-200">
                <strong>Section 8.4:</strong> 1 verified resident = 1 vote. Polls do not alter Bayesian performance scores, but give officials real-time community mandate and priority guidance.
              </div>

              {activePolls.map((poll) => {
                const hasVoted = Boolean(poll.userVotedOptionId);
                return (
                  <div
                    key={poll.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                        {poll.title}
                      </h3>
                      <span className="shrink-0 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Active
                      </span>
                    </div>

                    {/* Options List */}
                    <div className="space-y-2 pt-1">
                      {poll.options.map((option) => {
                        const pct = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                        const isChosen = poll.userVotedOptionId === option.id;

                        return (
                          <button
                            key={option.id}
                            disabled={hasVoted}
                            onClick={() => handleVote(poll.id, option.id)}
                            className={`w-full relative overflow-hidden rounded-xl p-3 text-left transition border cursor-pointer ${
                              hasVoted
                                ? isChosen
                                  ? "border-teal-500 bg-teal-50/40 dark:bg-teal-950/30"
                                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 cursor-default"
                                : "border-slate-200 dark:border-slate-700 hover:border-teal-500 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-teal-50/20"
                            }`}
                          >
                            {/* Animated progress fill if voted */}
                            {hasVoted && (
                              <div
                                className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                                  isChosen ? "bg-teal-500/20 dark:bg-teal-500/30" : "bg-slate-200/60 dark:bg-slate-700/40"
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            )}

                            <div className="relative z-10 flex items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2 min-w-0">
                                {isChosen ? (
                                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                                ) : (
                                  <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0 flex items-center justify-center text-[9px] text-slate-400">
                                    •
                                  </span>
                                )}
                                <span className={`font-medium ${isChosen ? "text-teal-900 dark:text-teal-200 font-bold" : "text-slate-800 dark:text-slate-200"}`}>
                                  {option.text}
                                </span>
                              </div>

                              {hasVoted && (
                                <div className="shrink-0 flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                  <span>{pct}%</span>
                                  <span className="text-[10px] text-slate-400 font-normal">({option.votes})</span>
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Footer Stats */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                      <span>{poll.totalVotes} verified residents voted</span>
                      <button
                        onClick={() => {
                          showToast("Poll link copied to clipboard!");
                        }}
                        className="flex items-center gap-1 text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share Poll</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Suggest a Poll Topic Box */}
              <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Propose a Poll Topic for UC-7</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Have a priority question for your neighborhood? Verified residents can suggest issues for the UC Chairman to put to vote.
                </p>
                <form onSubmit={handleSuggest} className="flex gap-2">
                  <input
                    type="text"
                    value={suggestedTopic}
                    onChange={(e) => setSuggestedTopic(e.target.value)}
                    placeholder="e.g. Should the service road become one-way during school rush?"
                    className="flex-1 p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs cursor-pointer transition shrink-0"
                  >
                    Submit
                  </button>
                </form>
                {hasSuggested && (
                  <p className="text-xs text-emerald-600 font-semibold">
                    ✓ Your topic is under moderation and will appear once verified!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Closed Polls */}
          {activeTab === "closed" && (
            <div className="space-y-4">
              {closedPolls.map((poll) => {
                const winner = [...poll.options].sort((a, b) => b.votes - a.votes)[0];
                return (
                  <div
                    key={poll.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {poll.title}
                      </h3>
                      <span className="shrink-0 text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
                        Finalized
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/80 text-xs space-y-1">
                      <div className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Winning Resident Mandate</span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {winner?.text}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {winner?.votes} votes ({Math.round(((winner?.votes || 0) / poll.totalVotes) * 100)}% of {poll.totalVotes} total votes)
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[11px] text-slate-400">Closed on Sep 15, 2026</span>
                      <button
                        onClick={() => showToast("Official poll outcome certificate card copied!")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>Share Results Card</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
