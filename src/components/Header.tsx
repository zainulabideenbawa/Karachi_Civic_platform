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
  Globe,
} from "lucide-react";

interface HeaderProps {
  onOpenRoleSwitcher?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenRoleSwitcher }) => {
  const {
    activeUC,
    setActiveUC,
    allUCs,
    setActiveTab,
    setIsSearchOpen,
    setIsFindMyUCOpen,
    setIsOnboardingOpen,
    showToast,
    language,
    setLanguage,
    activeRole,
  } = useCivic();

  const [isUcMenuOpen, setIsUcMenuOpen] = useState(false);

  // Cycle languages on single tap for mobile efficiency
  const handleCycleLanguage = () => {
    const nextLang =
      language === "en" ? "ur_roman" : language === "ur_roman" ? "ur" : "en";
    setLanguage(nextLang);
    showToast(
      nextLang === "ur"
        ? "اردو منتخب کی گئی (Urdu RTL)"
        : nextLang === "ur_roman"
        ? "Roman Urdu selected"
        : "English selected"
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs select-none pt-[env(safe-area-inset-top,0px)]">
      <div className="w-full max-w-xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left: Brand Identity & Logo */}
        <div
          onClick={() => setActiveTab("my-uc")}
          className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group select-none shrink-0"
        >
          {/* Custom Modern Civic Seal Logo */}
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-800 via-teal-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-900/20 group-hover:scale-105 active:scale-95 transition-transform duration-200">
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current text-white" stroke="none">
              <path d="M12 2L14.5 8H20.5L15.5 12L17.5 18L12 14.5L6.5 18L8.5 12L3.5 8H9.5L12 2Z" opacity="0.9" />
              <circle cx="12" cy="12" r="2.5" className="fill-emerald-200" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          </div>

          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-900 dark:text-white">
                Karachi<span className="text-teal-600 dark:text-teal-400">Civic</span>
              </span>
              <span className="text-[8px] font-bold px-1 py-0.2 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 uppercase tracking-wider hidden md:inline-block">
                Live
              </span>
            </div>
            <span className="text-[9px] text-slate-400 font-medium tracking-tight hidden sm:inline-block mt-0.5">
              Accountability Layer
            </span>
          </div>
        </div>

        {/* Center: Location Pill Selector */}
        <div className="relative min-w-0 flex-1 max-w-[110px] min-[380px]:max-w-[130px] sm:max-w-[170px]">
          <button
            onClick={() => setIsUcMenuOpen(!isUcMenuOpen)}
            className="w-full flex items-center justify-between gap-1 px-2 sm:px-2.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/90 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 border border-slate-200 dark:border-slate-700 transition cursor-pointer text-left shadow-xs active:scale-95"
          >
            <div className="flex items-center gap-1 min-w-0 truncate">
              <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {activeUC.name}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {/* UC Dropdown Menu */}
          {isUcMenuOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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

        {/* Right Actions: Compact & Guaranteed Zero-Overflow */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Search"
            title="Search UCs, Landmarks, Issues (W6)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* 1-Tap Language Cycle Button (Takes only 36px on mobile) */}
          <button
            onClick={handleCycleLanguage}
            className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] sm:text-[11px] font-bold border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center gap-0.5"
            title="Switch Language: English / Roman Urdu / اردو"
          >
            <Globe className="w-3 h-3 text-teal-600 shrink-0" />
            <span>{language === "en" ? "EN" : language === "ur_roman" ? "Rom" : "اردو"}</span>
          </button>

          {/* Onboarding / How It Works (Hidden on narrow mobile, available on sm screens) */}
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition cursor-pointer hidden sm:flex"
            aria-label="How It Works"
            title="How It Works (60-sec Guide)"
          >
            <HelpCircle className="w-4 h-4 text-teal-600" />
          </button>

          {/* Role Persona Switcher Quick Pill */}
          <button
            onClick={onOpenRoleSwitcher || (() => setActiveTab("me"))}
            className={`px-1.5 sm:px-2 py-1 rounded-xl text-[10px] font-bold border transition cursor-pointer flex items-center gap-0.5 sm:gap-1 active:scale-95 shrink-0 ${
              activeRole === "official"
                ? "bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800"
                : activeRole === "community_leader"
                ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800"
                : activeRole === "ngo"
                ? "bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-800"
                : activeRole === "admin"
                ? "bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-800"
                : "hidden sm:flex bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            }`}
            title="Switch View & Persona"
          >
            <span>
              {activeRole === "official"
                ? "🏛️ Chairman"
                : activeRole === "community_leader"
                ? "🎖️ Leader"
                : activeRole === "ngo"
                ? "🤝 NGO"
                : activeRole === "admin"
                ? "🛡️ Admin"
                : "👤 Citizen"}
            </span>
          </button>

          {/* User Profile Avatar Pill (Always anchored inside screen, never cut off) */}
          <button
            onClick={() => setActiveTab("me")}
            className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs transition transform active:scale-95 cursor-pointer shrink-0 relative ${
              activeRole === "official"
                ? "bg-gradient-to-tr from-amber-700 to-amber-600 ring-2 ring-amber-400"
                : activeRole === "community_leader"
                ? "bg-gradient-to-tr from-indigo-700 to-indigo-600 ring-2 ring-indigo-400"
                : activeRole === "ngo"
                ? "bg-gradient-to-tr from-purple-700 to-purple-600 ring-2 ring-purple-400"
                : activeRole === "admin"
                ? "bg-gradient-to-tr from-rose-800 to-rose-600 ring-2 ring-rose-400"
                : "bg-gradient-to-tr from-teal-700 to-emerald-600 ring-2 ring-teal-500/20"
            }`}
            title={`Active: ${activeRole.replace("_", " ")} · Tap for Profile & Settings`}
          >
            <span>ZB</span>
            {activeRole !== "citizen" && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 ring-1.5 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
