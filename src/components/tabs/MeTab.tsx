"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import {
  UserCheck,
  ShieldCheck,
  Clock,
  Globe,
  Download,
  LogOut,
  MapPin,
  FileText,
  Calendar,
  Layers,
  Award,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export const MeTab: React.FC = () => {
  const {
    activeUC,
    issues,
    events,
    language,
    setLanguage,
    activeRole,
    offlineQueueCount,
    setIsWhatsAppAuthOpen,
    setIsBecomeLeaderOpen,
    setIsLeaderDashboardOpen,
    showToast,
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
              <div className="inline-block mt-1 text-[10px] font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                Verified Resident of {activeUC.name}
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

        {/* Resident Verification Goal Progress Bar (Section 4) */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Resident Voting Weight Status</span>
            </span>
            <span className="font-bold text-teal-700 dark:text-teal-400">100% (Weight 1.0)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            You completed 3 location-verified civic actions in {activeUC.name}. Your confirmations hold full mathematical weight.
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

      {/* Community Leadership (Spec Addendum 01, Workflow W11) */}
      <section className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-4 text-white shadow-md border border-indigo-800/60 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase tracking-wider">
              <Award className="w-4 h-4 text-indigo-400" />
              Community Leadership • Aspiring Reps
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
              Leader Workbench
            </span>
            <ChevronRight className="w-4 h-4 text-indigo-200" />
          </button>
        </div>
      </section>

      {/* 3. Settings & Preferences */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {/* Language Selection */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-teal-600" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Interface Language
              </div>
              <div className="text-[11px] text-slate-400">
                Current: {language === "en" ? "English" : language === "ur_roman" ? "Roman Urdu" : "Urdu (اردو)"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 rounded cursor-pointer ${
                language === "en" ? "bg-white dark:bg-slate-700 text-teal-700 shadow-xs" : "text-slate-500"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("ur_roman")}
              className={`px-2 py-1 rounded cursor-pointer ${
                language === "ur_roman" ? "bg-white dark:bg-slate-700 text-teal-700 shadow-xs" : "text-slate-500"
              }`}
            >
              Roman
            </button>
            <button
              onClick={() => setLanguage("ur")}
              className={`px-2 py-1 rounded cursor-pointer ${
                language === "ur" ? "bg-white dark:bg-slate-700 text-teal-700 shadow-xs" : "text-slate-500"
              }`}
            >
              اردو
            </button>
          </div>
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

        {/* Testing Role Status */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-teal-600" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Active User Mode
              </div>
              <div className="text-[11px] text-slate-400">
                Viewing platform as: <span className="font-semibold capitalize">{activeRole.replace("_", " ")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logout / Switch Device */}
      <button
        onClick={() => {
          setIsWhatsAppAuthOpen(true);
        }}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Switch Account / Reverse WhatsApp Login</span>
      </button>
    </div>
  );
};
