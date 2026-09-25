"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import { MapPin, Search, ChevronDown, Check, UserCheck, Shield, Building2 } from "lucide-react";
import { UserRole } from "@/types/civic";

export const Header: React.FC = () => {
  const {
    activeUC,
    setActiveUC,
    allUCs,
    activeRole,
    setActiveRole,
    language,
    setLanguage,
    setIsSearchOpen,
    setIsFindMyUCOpen,
    setIsOfficialDashboardOpen,
    setIsAdminConsoleOpen,
    showToast,
  } = useCivic();

  const [isUcMenuOpen, setIsUcMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const roles: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: "citizen", label: "Citizen", icon: <UserCheck className="w-3.5 h-3.5" /> },
    { role: "verified_resident", label: "Verified Resident", icon: <UserCheck className="w-3.5 h-3.5 text-teal-600" /> },
    { role: "official", label: "UC Chairman", icon: <Building2 className="w-3.5 h-3.5 text-amber-600" /> },
    { role: "ngo", label: "NGO / Community", icon: <Building2 className="w-3.5 h-3.5 text-blue-600" /> },
    { role: "admin", label: "Admin Console", icon: <Shield className="w-3.5 h-3.5 text-purple-600" /> },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        {/* Left: Location / UC Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsUcMenuOpen(!isUcMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition text-left cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] font-semibold uppercase text-slate-400">
                Location
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[130px] sm:max-w-[170px]">
                {activeUC.name}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* UC Dropdown */}
          {isUcMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Select Pilot Union Council
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
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition cursor-pointer text-left ${
                      uc.id === activeUC.id
                        ? "bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-200 font-semibold"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{uc.name}</div>
                      <div className="text-[11px] text-slate-400">{uc.townName} · Score: {uc.score}</div>
                    </div>
                    {uc.id === activeUC.id && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
                  </button>
                ))}
              </div>
              <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <button
                  onClick={() => {
                    setIsUcMenuOpen(false);
                    setIsFindMyUCOpen(true);
                  }}
                  className="w-full text-center py-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center justify-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Find My UC (GPS &amp; Landmark Lookup)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Actions: Search, Role Switcher, Language */}
        <div className="flex items-center gap-1.5">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Role Preview Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Switch role view for testing"
            >
              <span className="capitalize">{activeRole.replace("_", " ")}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in duration-150">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Testing Role Switcher
                </div>
                <div className="space-y-1 mt-1">
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        setActiveRole(r.role);
                        setIsRoleMenuOpen(false);
                        if (r.role === "official") {
                          setIsOfficialDashboardOpen(true);
                        } else if (r.role === "admin") {
                          setIsAdminConsoleOpen(true);
                        }
                        showToast(`Switched active role: ${r.label}`);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left cursor-pointer ${
                        activeRole === r.role
                          ? "bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 font-semibold"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {r.icon}
                        <span>{r.label}</span>
                      </div>
                      {activeRole === r.role && <Check className="w-3.5 h-3.5 text-teal-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Language Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLanguage("en")}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition ${
                language === "en"
                  ? "bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-300 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("ur_roman")}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition ${
                language === "ur_roman"
                  ? "bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-300 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
              title="Roman Urdu"
            >
              RU
            </button>
            <button
              onClick={() => setLanguage("ur")}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition ${
                language === "ur"
                  ? "bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-300 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
              title="Urdu"
            >
              اردو
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
