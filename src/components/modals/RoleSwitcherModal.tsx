"use client";

import React from "react";
import { useCivic } from "@/context/CivicContext";
import { UserRole } from "@/types/civic";
import {
  X,
  UserCheck,
  ShieldCheck,
  Building2,
  Award,
  HeartHandshake,
  ShieldAlert,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    activeRole,
    setActiveRole,
    activeUC,
    setIsOfficialDashboardOpen,
    setIsLeaderDashboardOpen,
    setIsNGOsModalOpen,
    setIsAdminConsoleOpen,
    showToast,
  } = useCivic();

  if (!isOpen) return null;

  const rolesList: {
    id: UserRole;
    title: string;
    badge: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    borderActive: string;
    bgActive: string;
  }[] = [
    {
      id: "citizen",
      title: "Citizen (Public View)",
      badge: "Standard",
      subtitle: "Public Accountability & Issue Feeds",
      description: "Browse live reports, view chairman scorecards, and report issues in your neighborhood.",
      icon: <UserCheck className="w-5 h-5 text-slate-600 dark:text-slate-300" />,
      color: "text-slate-700 dark:text-slate-200",
      borderActive: "border-teal-500",
      bgActive: "bg-teal-50/70 dark:bg-teal-950/40",
    },
    {
      id: "verified_resident",
      title: "Verified Resident",
      badge: "1.0x Voting Weight",
      subtitle: "Geofenced & WhatsApp Verified",
      description: "Full voting power to confirm or dispute issue resolutions with ground photos.",
      icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
      color: "text-teal-700 dark:text-teal-300",
      borderActive: "border-teal-600",
      bgActive: "bg-teal-50 dark:bg-teal-950/50",
    },
    {
      id: "official",
      title: `UC Chairman (${activeUC.chairman.seatTitle})`,
      badge: "Official Command",
      subtitle: "Official Resolution & Scorecard Command",
      description: "Direct authority over work orders, official responses, and uploading verified completion proof.",
      icon: <Building2 className="w-5 h-5 text-amber-600" />,
      color: "text-amber-800 dark:text-amber-200",
      borderActive: "border-amber-500 ring-2 ring-amber-500/20",
      bgActive: "bg-amber-50 dark:bg-amber-950/50",
    },
    {
      id: "community_leader",
      title: "Community Leader (Ward Captain)",
      badge: "Grassroots",
      subtitle: "Pledges, Volunteer Drives & Adoptions",
      description: "Adopt unresolved civic issues (≥7d), mobilize neighborhood funding, and lead weekend cleanups.",
      icon: <Award className="w-5 h-5 text-indigo-600" />,
      color: "text-indigo-800 dark:text-indigo-200",
      borderActive: "border-indigo-500 ring-2 ring-indigo-500/20",
      bgActive: "bg-indigo-50 dark:bg-indigo-950/50",
    },
    {
      id: "ngo",
      title: "NGO Relief Partner (Saylani / Edhi / JDC)",
      badge: "Co-Action",
      subtitle: "Rapid Relief & Material Interventions",
      description: "Deploy water tankers, dewatering pumps, and co-sponsor heavy civic interventions.",
      icon: <HeartHandshake className="w-5 h-5 text-purple-600" />,
      color: "text-purple-800 dark:text-purple-200",
      borderActive: "border-purple-500 ring-2 ring-purple-500/20",
      bgActive: "bg-purple-50 dark:bg-purple-950/50",
    },
    {
      id: "admin",
      title: "City Oversight Admin",
      badge: "System Oversight",
      subtitle: "246 UCs Live Monitor & Anti-Fraud",
      description: "Audit resolution evidence, flag duplicate reports, and maintain citywide formula integrity.",
      icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
      color: "text-rose-800 dark:text-rose-200",
      borderActive: "border-rose-500 ring-2 ring-rose-500/20",
      bgActive: "bg-rose-50 dark:bg-rose-950/50",
    },
  ];

  const handleSelectRole = (role: UserRole) => {
    setActiveRole(role);
    onClose();
    if (role === "official") {
      showToast(`Switched to Chairman View (${activeUC.chairman.seatTitle})`);
    } else if (role === "community_leader") {
      showToast("Switched to Community Leader View");
    } else if (role === "ngo") {
      showToast("Switched to NGO Partner View");
    } else if (role === "admin") {
      showToast("Switched to City Oversight Admin View");
    } else if (role === "verified_resident") {
      showToast("Switched to Verified Resident (1.0x Weight)");
    } else {
      showToast("Returned to Standard Citizen View");
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] cursor-default"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Select View &amp; Persona
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Test how KarachiCivic transforms for every key stakeholder
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles List */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-2.5">
          {rolesList.map((r) => {
            const isSelected = activeRole === r.id;
            return (
              <div
                key={r.id}
                onClick={() => handleSelectRole(r.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? `${r.borderActive} ${r.bgActive} shadow-sm`
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs shrink-0 mt-0.5">
                      {r.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold ${r.color}`}>
                          {r.title}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {r.badge}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                        {r.subtitle}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-400 mt-1 leading-relaxed">
                        {r.description}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 mt-1">
                    {isSelected ? (
                      <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-300 group-hover:border-teal-500">
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 text-center">
          Switching views reconfigures your commands, actions on issue cards, and dashboards.
        </div>
      </div>
    </div>
  );
};
