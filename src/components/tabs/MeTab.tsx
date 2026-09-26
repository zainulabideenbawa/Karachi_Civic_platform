"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import {
  UserCheck,
  ShieldCheck,
  Clock,
  Download,
  LogOut,
  MapPin,
  FileText,
  Calendar,
  Layers,
  Award,
  Sparkles,
  ChevronRight,
  Building2,
  Shield,
  Check,
  Globe,
  Bell,
  Share2,
  HeartHandshake,
  Ban,
  AlertTriangle,
  Scale,
  RotateCcw,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

export const MeTab: React.FC = () => {
  const {
    activeUC,
    issues,
    events,
    activeRole,
    setActiveRole,
    offlineQueueCount,
    setIsWhatsAppAuthOpen,
    setIsBecomeLeaderOpen,
    setIsLeaderDashboardOpen,
    setIsOfficialDashboardOpen,
    setIsAdminConsoleOpen,
    setIsNGOsModalOpen,
    isNGODashboardOpen,
    setIsNGODashboardOpen,
    managedUsers,
    officialVerificationClaims,
    jurisdictionDisputes,
    openWorkDoneShare,
    showToast,
    language,
    setLanguage,
    resetDemoData,
    setIsThinkTankModalOpen,
    theme,
    setTheme,
  } = useCivic();

  const myReports = issues.filter((i) => i.reporterId === "user-101");
  const myRsvps = events.filter((e) => e.isUserRsvpd);
  const [showPWAInstructions, setShowPWAInstructions] = useState(false);

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* 1. Verified Identity Header */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-md">
              ZB
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Zain Bawa
                </h2>
                <ShieldCheck className="w-4 h-4 text-teal-600" />
              </div>
              <p className="text-xs text-slate-400 font-mono">
                +92 300 ••••582
              </p>
              <div className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded border">
                {activeRole === "admin" ? (
                  <span className="text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
                    City Oversight SuperAdmin • 246 UCs
                  </span>
                ) : activeRole === "ngo" ? (
                  <span className="text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
                    Verified NGO Relief Partner • Disaster Fleet
                  </span>
                ) : activeRole === "official" ? (
                  <span className="text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                    UC Chairman • {activeUC.chairman.seatTitle} ({activeUC.name})
                  </span>
                ) : activeRole === "community_leader" ? (
                  <span className="text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800">
                    Certified Community Leader • Ward Captain
                  </span>
                ) : (
                  <span className="text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-800">
                    Verified Resident of {activeUC.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsWhatsAppAuthOpen(true)}
            className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
          >
            Manage Auth
          </button>
        </div>

        {/* Resident / Role Verification Goal Progress Bar */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>
                {activeRole === "admin"
                  ? "Platform Governance Authority"
                  : activeRole === "ngo"
                  ? "Humanitarian Relief Status"
                  : activeRole === "official"
                  ? "Official ECP Verification"
                  : activeRole === "community_leader"
                  ? "Community Leader Contender Status"
                  : "Resident Voting Weight Status"}
              </span>
            </span>
            <span className="font-bold text-teal-700 dark:text-teal-400">
              {activeRole === "admin"
                ? "Root Privilege"
                : activeRole === "ngo"
                ? "Field Ready"
                : activeRole === "official"
                ? "ECP Gazette Verified"
                : activeRole === "community_leader"
                ? "Leader Verified"
                : "100% (Weight 1.0)"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {activeRole === "admin"
              ? "SuperAdmin oversight enabled across all 246 Union Councils with full moderation and ECP audit powers."
              : activeRole === "ngo"
              ? "Emergency response deployment enabled. 40 Water bowsers and 25 dewatering pumps synced."
              : activeRole === "official"
              ? `Elected municipal chairman authority active for ${activeUC.name}. Official resolutions verified.`
              : activeRole === "community_leader"
              ? "Ward leader track active. You can adopt unresolved issues (≥7d) and build public voter trust."
              : `You completed 3 location-verified civic actions in ${activeUC.name}. Your confirmations hold full mathematical weight.`}
          </p>
        </div>
      </section>

      {/* 2. My Activity Quick Counters */}
      <section className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <FileText className="w-4 h-4 text-teal-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {myReports.length}
          </div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase">
            My Reports
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <Calendar className="w-4 h-4 text-teal-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {myRsvps.length}
          </div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase">
            Events RSVP
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <Clock className="w-4 h-4 text-teal-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {offlineQueueCount}
          </div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase">
            Offline Queue
          </div>
        </div>
      </section>

      {/* Role-Specific Command Centers */}
      {activeRole === "admin" ? (
        <section className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-900 rounded-2xl p-4 text-white shadow-md border border-purple-800/60 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 uppercase tracking-wider">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>SuperAdmin &amp; Platform Integrity Terminal</span>
              </div>
              <h3 className="text-sm font-black text-white">
                Citywide Governance, Moderation &amp; ECP Verification
              </h3>
              <p className="text-[11px] text-slate-300 max-w-sm">
                Root oversight over all 246 Union Councils. Moderate abusive users, audit brigading vote spikes, and verify elected Chairman claims against official gazettes.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
              SUPERADMIN
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-purple-900/40 text-center">
            <div>
              <div className="text-base font-extrabold text-rose-400">
                {managedUsers.filter((u) => u.isFlaggedForBrigading).length}
              </div>
              <div className="text-[9px] font-semibold text-slate-400 uppercase">Brigading Alerts</div>
            </div>
            <div>
              <div className="text-base font-extrabold text-amber-400">
                {officialVerificationClaims.filter((c) => c.status === "pending").length}
              </div>
              <div className="text-[9px] font-semibold text-slate-400 uppercase">Pending ECP Claims</div>
            </div>
            <div>
              <div className="text-base font-extrabold text-teal-400">
                {jurisdictionDisputes.filter((d) => d.status === "pending").length}
              </div>
              <div className="text-[9px] font-semibold text-slate-400 uppercase">Jurisdiction Disputes</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setIsAdminConsoleOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold text-xs transition cursor-pointer flex items-center justify-between shadow-xs"
            >
              <span className="flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5" />
                <span>Open Moderation &amp; Banning Console</span>
              </span>
              <ChevronRight className="w-4 h-4 text-white" />
            </button>

            <button
              onClick={() => setIsAdminConsoleOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition cursor-pointer flex items-center justify-between border border-white/15"
            >
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Verify Chairman Appointments</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </section>
      ) : activeRole === "ngo" ? (
        <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 rounded-2xl p-4 text-white shadow-md border border-emerald-800/60 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                <span>NGO Humanitarian &amp; Relief Command Desk</span>
              </div>
              <h3 className="text-sm font-black text-white">
                Disaster Response • Rapid Material Intervention
              </h3>
              <p className="text-[11px] text-slate-300 max-w-sm">
                Al-Khidmat Foundation &amp; Edhi Emergency Relief units. Deploy water tankers, dewatering pumps, and cover open gutters abandoned by municipal officials.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              RELIEF FLEET
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-emerald-900/40 text-center">
            <div>
              <div className="text-base font-extrabold text-amber-400">
                {issues.filter((i) => i.status === "open" && !i.adoptedById && (i.categoryId === "water" || i.categoryId === "sewerage" || i.affectedCount >= 10)).length}
              </div>
              <div className="text-[9px] font-semibold text-slate-400 uppercase">Abandoned (≥7d)</div>
            </div>
            <div>
              <div className="text-base font-extrabold text-emerald-400">
                {issues.filter((i) => i.adoptedByType === "ngo" && i.status !== "confirmed").length}
              </div>
              <div className="text-[9px] font-semibold text-slate-400 uppercase">Active Relief Ops</div>
            </div>
            <div>
              <div className="text-base font-extrabold text-sky-400">
                40
              </div>
              <div className="text-[9px] font-semibold text-slate-400 uppercase">Bowsers Ready</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setIsNGODashboardOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs transition cursor-pointer flex items-center justify-between shadow-xs"
            >
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Open NGO Relief Workbench</span>
              </span>
              <ChevronRight className="w-4 h-4 text-white" />
            </button>

            <button
              onClick={() => {
                const resolved = issues.find(
                  (i) => (i.status === "marked_resolved" || i.status === "confirmed") && i.adoptedByType === "ngo"
                );
                if (resolved) {
                  openWorkDoneShare(resolved);
                } else {
                  setIsNGODashboardOpen(true);
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition cursor-pointer flex items-center justify-between border border-white/15"
            >
              <span className="flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Share Relief Work Card</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </section>
      ) : activeRole === "official" ? (
        <section className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 rounded-2xl p-4 text-white shadow-md border border-amber-800/60 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>UC Chairman Official Command</span>
              </div>
              <h3 className="text-sm font-black text-white">
                Municipal Governance &amp; Resolution Command
              </h3>
              <p className="text-[11px] text-slate-300 max-w-sm">
                Elected authority for {activeUC.name}. Respond to public petitions, submit verified completion photos, and track responsiveness.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
              Official
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setIsOfficialDashboardOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center justify-between shadow-xs"
            >
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Open Chairman Workbench</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={() => {
                const resolved = issues.find(
                  (i) => (i.status === "marked_resolved" || i.status === "confirmed") && i.ucId === activeUC.id
                );
                if (resolved) {
                  openWorkDoneShare(resolved);
                } else {
                  showToast("No resolved issues yet in this UC to share.");
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition cursor-pointer flex items-center justify-between border border-white/15"
            >
              <span className="flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Share Work Done Proofs</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </section>
      ) : activeRole === "community_leader" ? (
        <section className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-2xl p-4 text-white shadow-md border border-indigo-800/60 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Community Leader Studio</span>
              </div>
              <h3 className="text-sm font-black text-white">
                Active Contender Track • Local Elections 2027
              </h3>
              <p className="text-[11px] text-slate-300 max-w-sm">
                Your civic track record, adopted issues, and verified citizen ratings in {activeUC.name} are active.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
              Leader Track
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setIsLeaderDashboardOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-between shadow-xs"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Leader Workbench</span>
              </span>
              <ChevronRight className="w-4 h-4 text-indigo-200" />
            </button>
            <button
              onClick={() => {
                const myResolved = issues.find(
                  (i) => (i.status === "marked_resolved" || i.status === "confirmed") && i.adoptedByType === "leader"
                );
                if (myResolved) {
                  openWorkDoneShare(myResolved);
                } else {
                  showToast("Resolve an adopted issue to generate a Work Done proof card.");
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition cursor-pointer flex items-center justify-between border border-white/15"
            >
              <span className="flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Share Completed Work</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </section>
      ) : (
        /* Regular Citizen & Verified Resident Track */
        <section className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-4 text-white shadow-md border border-indigo-800/60 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Community Leadership • Aspiring Reps</span>
              </div>
              <h3 className="text-sm font-black text-white">
                Adopt Issues. Build a Verified Track Record.
              </h3>
              <p className="text-[11px] text-slate-300 max-w-sm">
                Residents who want to contest local elections or serve their UC can adopt issues, make pledges, and earn a public score.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setIsBecomeLeaderOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition cursor-pointer flex items-center justify-between shadow-xs"
            >
              <span>Become a Community Leader</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setIsLeaderDashboardOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs transition cursor-pointer flex items-center justify-between border border-indigo-400/30"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Leader Workbench</span>
              </span>
              <ChevronRight className="w-4 h-4 text-indigo-200" />
            </button>
          </div>
        </section>
      )}

      {/* 3. Settings & Preferences */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {/* Language Selection (Section 11.4: Urdu, Roman Urdu, English) */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-teal-600" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Language &amp; Script
              </div>
              <div className="text-[11px] text-slate-400">
                Choose UI language (Urdu RTL supported)
              </div>
            </div>
          </div>
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => {
                setLanguage("en");
                showToast("Switched language to English");
              }}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                language === "en"
                  ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => {
                setLanguage("ur_roman");
                showToast("Switched language to Roman Urdu");
              }}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                language === "ur_roman"
                  ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Roman
            </button>
            <button
              onClick={() => {
                setLanguage("ur");
                showToast("اردو زبان منتخب کی گئی (Urdu RTL)");
              }}
              className={`px-2 py-1 rounded-lg transition cursor-pointer font-sans ${
                language === "ur"
                  ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              اردو
            </button>
          </div>
        </div>

        {/* Appearance / Theme (System, Light, Dark) */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sun className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Appearance &amp; Theme
              </div>
              <div className="text-[11px] text-slate-400">
                Switch between Light, Dark, or System mode
              </div>
            </div>
          </div>
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => {
                setTheme("system");
                showToast("Theme set to System default");
              }}
              title="Match system theme"
              className={`p-1.5 px-2 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                theme === "system"
                  ? "bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Auto</span>
            </button>
            <button
              onClick={() => {
                setTheme("light");
                showToast("Light mode activated");
              }}
              title="Light mode"
              className={`p-1.5 px-2 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                theme === "light"
                  ? "bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Light</span>
            </button>
            <button
              onClick={() => {
                setTheme("dark");
                showToast("Dark mode activated");
              }}
              title="Dark mode"
              className={`p-1.5 px-2 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                theme === "dark"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dark</span>
            </button>
          </div>
        </div>

        {/* Notifications (Section 12.1) */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-teal-600" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Civic Notifications
              </div>
              <div className="text-[11px] text-slate-400">
                Instant alerts when your reported fixes are ready
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            Enabled (Web Push)
          </span>
        </div>

        {/* Think Tanks & Policy Briefs (Section 9) */}
        <div
          onClick={() => setIsThinkTankModalOpen(true)}
          className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition"
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-emerald-600" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>Think Tanks &amp; Policy Briefs</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Sec 9
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                1-page data briefs, proposal tracker, apply for stage
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Home Union Council */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-teal-600" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Home Union Council
              </div>
              <div className="text-[11px] text-slate-400">
                {activeUC.name} (Can change once per 90 days)
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
            Locked
          </span>
        </div>

        {/* PWA Offline / Install Prompt (Section 11.8) */}
        <div className="p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-teal-600" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Install as Mobile App (PWA)
                </div>
                <div className="text-[11px] text-slate-400">
                  Fast offline access, camera capture, push alerts
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowPWAInstructions(!showPWAInstructions)}
              className="px-3 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer"
            >
              {showPWAInstructions ? "Hide Guide" : "Install Guide"}
            </button>
          </div>

          {showPWAInstructions && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-teal-500/30 text-xs space-y-3 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* iOS Instructions */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>🍏 iPhone (Safari)</span>
                  </div>
                  <ol className="list-decimal list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                    <li>Tap the <strong>Share</strong> button (box with up arrow) in Safari.</li>
                    <li>Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>.</li>
                    <li>Tap <strong>Add</strong> to get instant camera and push notifications.</li>
                  </ol>
                </div>

                {/* Android Instructions */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>🤖 Android (Chrome)</span>
                  </div>
                  <ol className="list-decimal list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                    <li>Tap the <strong>three dots menu (⋮)</strong> in Chrome.</li>
                    <li>Select <strong>&ldquo;Install app&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.</li>
                    <li>Full offline reporting and GPS work automatically.</li>
                  </ol>
                </div>
              </div>

              <div className="text-[10px] text-teal-700 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-950/60 p-2 rounded-md">
                💡 Tip: Once installed, login sessions persist for 180 days with automatic offline queueing when mobile data is weak.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Role Switcher & Workbench Launcher (Demo & Testing Controls) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Stakeholder Role Switcher
              </h3>
              <p className="text-[11px] text-slate-400">
                Switch perspective &amp; test dedicated workbenches
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 capitalize">
            {activeRole.replace("_", " ")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {/* 1. Citizen */}
          <button
            onClick={() => {
              setActiveRole("citizen");
              showToast("Switched to Citizen view");
            }}
            className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
              activeRole === "citizen"
                ? "border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-slate-500" />
              <div>
                <div className="text-xs font-bold">Citizen</div>
                <div className="text-[10px] text-slate-400">Public viewer</div>
              </div>
            </div>
            {activeRole === "citizen" && <Check className="w-4 h-4 text-teal-600" />}
          </button>

          {/* 2. Verified Resident */}
          <button
            onClick={() => {
              setActiveRole("verified_resident");
              showToast("Switched to Verified Resident (Full 1.0 Voting Weight)");
            }}
            className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
              activeRole === "verified_resident"
                ? "border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <div>
                <div className="text-xs font-bold">Verified Resident</div>
                <div className="text-[10px] text-slate-400">1.0 weight vote</div>
              </div>
            </div>
            {activeRole === "verified_resident" && <Check className="w-4 h-4 text-teal-600" />}
          </button>

          {/* 3. UC Chairman */}
          <button
            onClick={() => {
              setActiveRole("official");
              setIsOfficialDashboardOpen(true);
              showToast(`Logged into ${activeUC.chairman.seatTitle} Workbench`);
            }}
            className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
              activeRole === "official"
                ? "border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-600" />
              <div>
                <div className="text-xs font-bold">UC Chairman</div>
                <div className="text-[10px] text-slate-400">Official Workbench</div>
              </div>
            </div>
            {activeRole === "official" ? (
              <Check className="w-4 h-4 text-amber-600" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* 4. Community Leader */}
          <button
            onClick={() => {
              setActiveRole("community_leader");
              setIsLeaderDashboardOpen(true);
              showToast("Switched to Community Leader Workbench");
            }}
            className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
              activeRole === "community_leader"
                ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <div>
                <div className="text-xs font-bold">Community Leader</div>
                <div className="text-[10px] text-slate-400">Pledges &amp; Adoptions</div>
              </div>
            </div>
            {activeRole === "community_leader" ? (
              <Check className="w-4 h-4 text-indigo-600" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* 5. NGO Partner */}
          <button
            onClick={() => {
              setActiveRole("ngo");
              setIsNGOsModalOpen(true);
              showToast("Switched to NGO Partner Directory");
            }}
            className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
              activeRole === "ngo"
                ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-xs font-bold">NGO Partner</div>
                <div className="text-[10px] text-slate-400">Adopt Open Issues</div>
              </div>
            </div>
            {activeRole === "ngo" ? (
              <Check className="w-4 h-4 text-blue-600" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* 6. Admin Console */}
          <button
            onClick={() => {
              setActiveRole("admin");
              setIsAdminConsoleOpen(true);
              showToast("Switched to Admin Console");
            }}
            className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
              activeRole === "admin"
                ? "border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <div>
                <div className="text-xs font-bold">Admin Console</div>
                <div className="text-[10px] text-slate-400">Audit &amp; Moderation</div>
              </div>
            </div>
            {activeRole === "admin" ? (
              <Check className="w-4 h-4 text-purple-600" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>
      </section>

      {/* Logout / Switch Device */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          onClick={() => {
            setIsWhatsAppAuthOpen(true);
          }}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Switch Account / WhatsApp</span>
        </button>

        <button
          onClick={resetDemoData}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-bold transition cursor-pointer"
          title="Clear localStorage and reset to initial demo data"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </div>
  );
};
