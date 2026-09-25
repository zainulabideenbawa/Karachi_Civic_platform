"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import {
  MapPin,
  Search,
  ChevronDown,
  Check,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    activeUC,
    setActiveUC,
    allUCs,
    setActiveTab,
    setIsSearchOpen,
    setIsFindMyUCOpen,
    setIsOnboardingOpen,
    showToast,
  } = useCivic();

  const [isUcMenuOpen, setIsUcMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-2xl mx-auto px-3.5 sm:px-4 h-15 flex items-center justify-between gap-2.5">
        {/* Left: Brand Identity & Logo */}
        <div className="flex items-center gap-2.5">
          <div
            onClick={() => setActiveTab("my-uc")}
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            {/* Custom Modern Civic Seal Logo */}
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-800 via-teal-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-900/20 group-hover:scale-105 transition-transform duration-200">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white" stroke="none">
                <path d="M12 2L14.5 8H20.5L15.5 12L17.5 18L12 14.5L6.5 18L8.5 12L3.5 8H9.5L12 2Z" opacity="0.9" />
                <circle cx="12" cy="12" r="2.5" className="fill-emerald-200" />
              </svg>
              {/* Live Status indicator */}
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                  Karachi<span className="text-teal-600 dark:text-teal-400">Civic</span>
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 uppercase tracking-wider hidden sm:inline-block">
                  Live
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5">
                Civic Accountability
              </span>
            </div>
          </div>
        </div>

        {/* Center: Location Pill Selector (Sleek Glass Look) */}
        <div className="relative">
          <button
            onClick={() => setIsUcMenuOpen(!isUcMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/90 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 border border-slate-200 dark:border-slate-700 transition cursor-pointer text-left shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[110px] sm:max-w-[150px]">
              {activeUC.name}
            </span>
            <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-1.5 py-0.2 rounded-full hidden sm:inline-block">
              {activeUC.score}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {/* UC Dropdown Menu */}
          {isUcMenuOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Select Union Council</span>
                <span className="text-[10px] text-teal-600 font-normal">246 UCs</span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {allUCs.map((uc) => (
                  <button
                    key={uc.id}
                    onClick={() => {
                      setActiveUC(uc);
                      setIsUcMenuOpen(false);
                      showToast(`Switched view to ${uc.name}`);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition cursor-pointer text-left ${
                      uc.id === activeUC.id
                        ? "bg-teal-50 text-teal-900 dark:bg-teal-950/60 dark:text-teal-200 font-bold"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{uc.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {uc.townName} · Score: <strong className="text-teal-700 dark:text-teal-400">{uc.score}</strong>
                      </div>
                    </div>
                    {uc.id === activeUC.id && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
                  </button>
                ))}
              </div>
              <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setIsUcMenuOpen(false);
                    setIsFindMyUCOpen(true);
                  }}
                  className="w-full text-center py-2 px-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-xs font-bold text-teal-800 dark:text-teal-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>Find My UC (GPS &amp; Landmark Lookup)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Actions: Search, Help Guide, User Profile Button */}
        <div className="flex items-center gap-1">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Search"
            title="Search UCs, Landmarks, Issues (W6)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* How It Works / Onboarding Trigger (Section 11.3) */}
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="How It Works"
            title="How It Works (60-sec Guide)"
          >
            <HelpCircle className="w-4 h-4 text-teal-600" />
          </button>

          {/* User Profile Avatar Pill (Goes to MeTab) */}
          <button
            onClick={() => setActiveTab("me")}
            className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition cursor-pointer ml-0.5 border border-slate-200 dark:border-slate-700"
            title="My Profile & Settings"
          >
            <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
              ZB
            </div>
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0 hidden sm:inline-block" />
          </button>
        </div>
      </div>
    </header>
  );
};
