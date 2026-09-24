"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import { Search, X, MapPin, Building2, FileText, ArrowRight } from "lucide-react";

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    allUCs,
    issues,
    setActiveUC,
    setSelectedIssue,
    setActiveTab,
  } = useCivic();

  const [query, setQuery] = useState("");

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchingUcs = trimmed
    ? allUCs.filter(
        (uc) =>
          uc.name.toLowerCase().includes(trimmed) ||
          uc.townName.toLowerCase().includes(trimmed) ||
          uc.neighborhoods.some((n) => n.toLowerCase().includes(trimmed)) ||
          uc.chairman.name.toLowerCase().includes(trimmed)
      )
    : [];

  const matchingIssues = trimmed
    ? issues.filter(
        (iss) =>
          iss.id.toLowerCase().includes(trimmed) ||
          iss.title.toLowerCase().includes(trimmed) ||
          iss.categoryName.toLowerCase().includes(trimmed) ||
          iss.addressApprox.toLowerCase().includes(trimmed)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center p-3 sm:p-4 pt-14 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search block, road, landmark, official or #K-id..."
            className="flex-1 text-sm bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-semibold text-teal-700 dark:text-teal-400 px-2 py-1 cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* Results Area */}
        <div className="p-3 overflow-y-auto space-y-3">
          {!trimmed && (
            <div className="p-4 text-center text-xs text-slate-400 space-y-1">
              <div>Try searching for:</div>
              <div className="flex gap-1.5 justify-center flex-wrap pt-1 font-medium text-slate-600 dark:text-slate-300">
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  &quot;Disco Bakery&quot;
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  &quot;Block 13-D&quot;
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  &quot;Faisal Siddiqui&quot;
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  &quot;#K-10492&quot;
                </span>
              </div>
            </div>
          )}

          {/* UC Results */}
          {matchingUcs.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase text-slate-400 px-2">
                Union Councils &amp; Areas ({matchingUcs.length})
              </div>
              {matchingUcs.map((uc) => (
                <button
                  key={uc.id}
                  onClick={() => {
                    setActiveUC(uc);
                    setIsSearchOpen(false);
                    setActiveTab("my-uc");
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 text-left transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {uc.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Chairman: {uc.chairman.name} · Score: {uc.score}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          )}

          {/* Issue Results */}
          {matchingIssues.length > 0 && (
            <div className="space-y-1 pt-2">
              <div className="text-[10px] font-bold uppercase text-slate-400 px-2">
                Reported Civic Issues ({matchingIssues.length})
              </div>
              {matchingIssues.map((iss) => (
                <button
                  key={iss.id}
                  onClick={() => {
                    setSelectedIssue(iss);
                    setIsSearchOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 text-left transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                        #{iss.id} · {iss.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {iss.addressApprox} · {iss.daysOpen}d open
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          )}

          {trimmed && matchingUcs.length === 0 && matchingIssues.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching UCs, landmarks or issues found for &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
