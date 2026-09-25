"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import {
  X,
  Sparkles,
  ThumbsUp,
  Lightbulb,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  Filter,
} from "lucide-react";
import { CIVIC_CATEGORIES } from "@/config/categories";

export const UCIdeasBoardModal: React.FC = () => {
  const {
    isIdeasModalOpen,
    setIsIdeasModalOpen,
    activeUC,
    ideas,
    upvoteIdea,
    submitIdea,
    showToast,
  } = useCivic();

  const [activeTab, setActiveTab] = useState<"browse" | "suggest">("browse");
  const [filterStatus, setFilterStatus] = useState<"all" | "planned" | "done" | "thinktank">("all");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("streetlights");

  if (!isIdeasModalOpen) return null;

  const ucIdeas = ideas.filter((idea) => idea.ucId === activeUC.id);

  const filteredIdeas = ucIdeas.filter((idea) => {
    if (filterStatus === "planned") return idea.status === "planned";
    if (filterStatus === "done") return idea.status === "done";
    if (filterStatus === "thinktank") return idea.isInThinkTankPool;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast("Please provide both a title and description for your idea.");
      return;
    }

    submitIdea({
      title: title.trim(),
      description: description.trim(),
      category,
    });

    setTitle("");
    setDescription("");
    setActiveTab("browse");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planned":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            Planned for Action
          </span>
        );
      case "done":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            ✓ Done &amp; Implemented
          </span>
        );
      case "not_possible":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
            Outside Jurisdiction
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Under Community Review
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-600/30 text-teal-400 border border-teal-500/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Citizen Proposals • Workflow W7
              </div>
              <h2 className="text-base font-bold">UC Ideas Board ({activeUC.name})</h2>
            </div>
          </div>
          <button
            onClick={() => setIsIdeasModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-1">
          <button
            onClick={() => setActiveTab("browse")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "browse"
                ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Community Ideas ({ucIdeas.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("suggest")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "suggest"
                ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Suggest an Idea</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {activeTab === "browse" && (
            <>
              {/* Filter Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition ${
                    filterStatus === "all"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  All ({ucIdeas.length})
                </button>
                <button
                  onClick={() => setFilterStatus("planned")}
                  className={`px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition ${
                    filterStatus === "planned"
                      ? "bg-amber-600 text-white font-bold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Planned
                </button>
                <button
                  onClick={() => setFilterStatus("done")}
                  className={`px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition ${
                    filterStatus === "done"
                      ? "bg-emerald-600 text-white font-bold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Implemented
                </button>
                <button
                  onClick={() => setFilterStatus("thinktank")}
                  className={`px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition flex items-center gap-1 ${
                    filterStatus === "thinktank"
                      ? "bg-indigo-600 text-white font-bold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span>Think Tank Nominees</span>
                  <span className="text-[10px]">🌟</span>
                </button>
              </div>

              {/* Ideas Cards List */}
              <div className="space-y-3">
                {filteredIdeas.length === 0 ? (
                  <div className="p-8 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                    <Lightbulb className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      No ideas matching this filter
                    </div>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      Have a practical improvement for {activeUC.name}? Be the first to suggest it!
                    </p>
                    <button
                      onClick={() => setActiveTab("suggest")}
                      className="mt-2 px-4 py-2 rounded-xl bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 cursor-pointer"
                    >
                      + Suggest an Idea
                    </button>
                  </div>
                ) : (
                  filteredIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 space-y-2.5 transition"
                    >
                      {/* Top Meta */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {getStatusBadge(idea.status)}
                          {idea.isInThinkTankPool && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              🌟 Think Tank Topic Pool
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 capitalize">
                            • {idea.category}
                          </span>
                        </div>

                        {/* Upvote Button */}
                        <button
                          onClick={() => upvoteIdea(idea.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                            idea.userUpvoted
                              ? "bg-teal-600 text-white shadow-xs"
                              : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:border-teal-500"
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{idea.upvotes}</span>
                        </button>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {idea.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {idea.description}
                        </p>
                      </div>

                      {/* Author */}
                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span>
                          Proposed by <strong className="text-slate-700 dark:text-slate-300">{idea.authorName}</strong> ({idea.authorRole})
                        </span>
                        <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                      </div>

                      {/* Official Response Banner (If present) */}
                      {idea.officialReply && (
                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 text-teal-600" />
                              Official Council Reply
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {idea.officialReply.seatTitle}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 italic text-[11px]">
                            &ldquo;{idea.officialReply.message}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* TAB 2: SUGGEST AN IDEA (Workflow W7 Form) */}
          {activeTab === "suggest" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 text-xs text-teal-900 dark:text-teal-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  How Ideas Work in {activeUC.name}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your idea goes straight to the UC Ideas Board. Verified residents upvote it. UC Chairman and Town Officials review top ideas each week. The top 3 ideas across Karachi qualify for the monthly televised Think Tank!
                </p>
              </div>

              {/* Title Input (80 chars) */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-900 dark:text-white">
                    Idea Title (Summary in one line)
                  </label>
                  <span className={`text-[10px] ${title.length > 70 ? "text-amber-500 font-bold" : "text-slate-400"}`}>
                    {title.length}/80
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={80}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Install 12 solar lights along Block 13-D park walking track"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {/* Category Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 dark:text-white">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {CIVIC_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description Input (500 chars) */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-900 dark:text-white">
                    Details &amp; Practical Solution
                  </label>
                  <span className={`text-[10px] ${description.length > 450 ? "text-amber-500 font-bold" : "text-slate-400"}`}>
                    {description.length}/500
                  </span>
                </div>
                <textarea
                  maxLength={500}
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain why this is needed, exact location/block, and how it can be implemented with local UC or community support..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("browse")}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  Publish Idea to {activeUC.name} Board
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
