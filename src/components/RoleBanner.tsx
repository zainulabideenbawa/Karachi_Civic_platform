"use client";

import React from "react";
import { useCivic } from "@/context/CivicContext";
import {
  Building2,
  Award,
  HeartHandshake,
  ShieldAlert,
  ArrowRight,
  X,
  Repeat,
} from "lucide-react";

interface RoleBannerProps {
  onOpenRoleSwitcher: () => void;
}

export const RoleBanner: React.FC<RoleBannerProps> = ({ onOpenRoleSwitcher }) => {
  const {
    activeRole,
    setActiveRole,
    activeUC,
    issues,
    setIsOfficialDashboardOpen,
    setIsLeaderDashboardOpen,
    setIsNGOsModalOpen,
    setIsAdminConsoleOpen,
    showToast,
  } = useCivic();

  if (activeRole === "citizen") return null;

  const ucIssues = issues.filter((i) => i.ucId === activeUC.id);
  const urgentCount = ucIssues.filter(
    (i) => i.status === "open" && !i.officialResponse
  ).length;

  return (
    <aside aria-label="Active Role View" className="w-full z-30 select-none shadow-sm transition-all duration-200">
      {/* 1. UC Chairman View */}
      {activeRole === "official" && (
        <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-white px-3 py-2 text-xs border-b border-amber-900/30">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse shrink-0" />
              <div className="flex items-center gap-1.5 truncate">
                <Building2 className="w-4 h-4 text-amber-200 shrink-0" />
                <span className="font-extrabold truncate">
                  Chairman View: {activeUC.chairman.seatTitle} ({activeUC.name})
                </span>
                {urgentCount > 0 && (
                  <span className="bg-amber-950/80 text-amber-200 px-1.5 py-0.2 rounded-full text-[10px] font-bold border border-amber-400/40 shrink-0 hidden sm:inline-block">
                    {urgentCount} urgent
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsOfficialDashboardOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] transition cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>Workbench</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={onOpenRoleSwitcher}
                className="px-2 py-1 rounded-lg bg-black/20 hover:bg-black/30 text-amber-200 hover:text-white text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                title="Switch View / Persona"
              >
                <Repeat className="w-3 h-3" />
                <span className="hidden sm:inline">Switch</span>
              </button>
              <button
                onClick={() => {
                  setActiveRole("citizen");
                  showToast("Returned to Citizen View");
                }}
                className="p-1 rounded-lg hover:bg-black/20 text-amber-200 hover:text-white transition cursor-pointer"
                title="Exit to Citizen View"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Community Leader View */}
      {activeRole === "community_leader" && (
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white px-3 py-2 text-xs border-b border-indigo-900/30">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse shrink-0" />
              <div className="flex items-center gap-1.5 truncate">
                <Award className="w-4 h-4 text-indigo-200 shrink-0" />
                <span className="font-extrabold truncate">
                  Community Leader Mode: Ward Pledges &amp; Action
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsLeaderDashboardOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] transition cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>Leader Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={onOpenRoleSwitcher}
                className="px-2 py-1 rounded-lg bg-black/20 hover:bg-black/30 text-indigo-200 hover:text-white text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                title="Switch View / Persona"
              >
                <Repeat className="w-3 h-3" />
                <span className="hidden sm:inline">Switch</span>
              </button>
              <button
                onClick={() => {
                  setActiveRole("citizen");
                  showToast("Returned to Citizen View");
                }}
                className="p-1 rounded-lg hover:bg-black/20 text-indigo-200 hover:text-white transition cursor-pointer"
                title="Exit to Citizen View"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. NGO Partner View */}
      {activeRole === "ngo" && (
        <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 text-white px-3 py-2 text-xs border-b border-purple-900/30">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-purple-300 animate-pulse shrink-0" />
              <div className="flex items-center gap-1.5 truncate">
                <HeartHandshake className="w-4 h-4 text-purple-200 shrink-0" />
                <span className="font-extrabold truncate">
                  NGO Relief Partner: Saylani / Edhi / JDC Co-Action
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsNGOsModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] transition cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>Relief Hub</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={onOpenRoleSwitcher}
                className="px-2 py-1 rounded-lg bg-black/20 hover:bg-black/30 text-purple-200 hover:text-white text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                title="Switch View / Persona"
              >
                <Repeat className="w-3 h-3" />
                <span className="hidden sm:inline">Switch</span>
              </button>
              <button
                onClick={() => {
                  setActiveRole("citizen");
                  showToast("Returned to Citizen View");
                }}
                className="p-1 rounded-lg hover:bg-black/20 text-purple-200 hover:text-white transition cursor-pointer"
                title="Exit to Citizen View"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. City Admin View */}
      {activeRole === "admin" && (
        <div className="bg-gradient-to-r from-rose-800 via-rose-700 to-slate-900 text-white px-3 py-2 text-xs border-b border-rose-950/40">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shrink-0" />
              <div className="flex items-center gap-1.5 truncate">
                <ShieldAlert className="w-4 h-4 text-rose-300 shrink-0" />
                <span className="font-extrabold truncate">
                  City Oversight Admin: 246 UCs Live Monitor
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsAdminConsoleOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] transition cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>Console</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={onOpenRoleSwitcher}
                className="px-2 py-1 rounded-lg bg-black/20 hover:bg-black/30 text-rose-200 hover:text-white text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                title="Switch View / Persona"
              >
                <Repeat className="w-3 h-3" />
                <span className="hidden sm:inline">Switch</span>
              </button>
              <button
                onClick={() => {
                  setActiveRole("citizen");
                  showToast("Returned to Citizen View");
                }}
                className="p-1 rounded-lg hover:bg-black/20 text-rose-200 hover:text-white transition cursor-pointer"
                title="Exit to Citizen View"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Verified Resident View */}
      {activeRole === "verified_resident" && (
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 text-white px-3 py-1.5 text-xs border-b border-teal-900/30">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="font-bold truncate text-[11px]">
                Verified Resident Mode: Full 1.0x Resolution Confirmation Weight
              </span>
            </div>
            <button
              onClick={onOpenRoleSwitcher}
              className="text-[10px] text-teal-200 hover:text-white font-bold underline cursor-pointer shrink-0"
            >
              Change Persona
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
