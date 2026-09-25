"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import { Search, X, MapPin, Building2, FileText, ArrowRight, Award, ShieldCheck } from "lucide-react";
import { MOCK_NGOS } from "@/lib/mock-data";

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    allUCs,
    issues,
    communityLeaders,
    setSelectedLeader,
    setIsLeaderProfileOpen,
    setIsNGOsModalOpen,
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

  const matchingLeaders = trimmed
    ? communityLeaders.filter(
        (lead) =>
          lead.realName.toLowerCase().includes(trimmed) ||
          lead.party.toLowerCase().includes(trimmed) ||
          lead.ucName.toLowerCase().includes(trimmed) ||
          lead.bio.toLowerCase().includes(trimmed)
      )
    : [];

  const matchingNGOs = trimmed
    ? MOCK_NGOS.filter(
        (ngo) =>
          ngo.name.toLowerCase().includes(trimmed) ||
          ngo.focusCategories.some((cat) => cat.toLowerCase().includes(trimmed)) ||
          ngo.activeTowns.some((t) => t.toLowerCase().includes(trimmed))
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

          {/* Community Leaders Results */}
          {matchingLeaders.length > 0 && (
            <div className="space-y-1 pt-2">
              <div className="text-[10px] font-bold uppercase text-indigo-400 px-2 flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>Community Leaders ({matchingLeaders.length})</span>
              </div>
              {matchingLeaders.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => {
                    setSelectedLeader(lead);
                    setIsSearchOpen(false);
                    setIsLeaderProfileOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 text-left transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={lead.photoUrl}
                      alt={lead.realName}
                      className="w-7 h-7 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate flex items-center gap-1">
                        <span>{lead.realName}</span>
                        {lead.identityVerified && <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {lead.ucName} • Score: {lead.score} • {lead.party}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          )}

          {/* NGO Results */}
          {matchingNGOs.length > 0 && (
            <div className="space-y-1 pt-2">
              <div className="text-[10px] font-bold uppercase text-teal-400 px-2 flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                <span>NGOs &amp; Civil Society ({matchingNGOs.length})</span>
              </div>
              {matchingNGOs.map((ngo) => (
                <button
                  key={ngo.id}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setIsNGOsModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-teal-50/50 dark:hover:bg-teal-950/40 text-left transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={ngo.logo}
                      alt={ngo.name}
                      className="w-7 h-7 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {ngo.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Focus: {ngo.focusCategories.join(", ")} • {ngo.activeTowns[0]}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          )}

          {trimmed && matchingUcs.length === 0 && matchingIssues.length === 0 && matchingLeaders.length === 0 && matchingNGOs.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching UCs, landmarks, leaders, or issues found for &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
