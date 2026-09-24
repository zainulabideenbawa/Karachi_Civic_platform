"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import { X, Shield, History, CheckCircle, Database } from "lucide-react";

export const AdminConsoleModal: React.FC = () => {
  const { isAdminConsoleOpen, setIsAdminConsoleOpen, auditLog, showToast } = useCivic();
  const [activeSubTab, setActiveSubTab] = useState<"audit" | "engine" | "moderation">("audit");

  if (!isAdminConsoleOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-base font-bold">Admin &amp; Public Transparency Console</h2>
              <p className="text-xs text-slate-400">Section 14.3: Public Audit Trail &amp; Scoring Engine</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminConsoleOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab("audit")}
            className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer ${
              activeSubTab === "audit"
                ? "border-purple-600 text-purple-700 dark:text-purple-400 bg-white dark:bg-slate-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Public Audit Log
          </button>
          <button
            onClick={() => setActiveSubTab("engine")}
            className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer ${
              activeSubTab === "engine"
                ? "border-purple-600 text-purple-700 dark:text-purple-400 bg-white dark:bg-slate-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Scoring Engine (pg_cron)
          </button>
          <button
            onClick={() => setActiveSubTab("moderation")}
            className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer ${
              activeSubTab === "moderation"
                ? "border-purple-600 text-purple-700 dark:text-purple-400 bg-white dark:bg-slate-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Moderation Queue
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {activeSubTab === "audit" && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-200 flex items-center gap-2">
                <History className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  Every administrative action affecting UC scores is permanently cryptographically published.
                </span>
              </div>

              <div className="space-y-2">
                {auditLog.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                      <span>{log.date}</span>
                      <span>#{log.id}</span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      {log.action}
                    </div>
                    <div className="text-slate-600 dark:text-slate-300">
                      Target: <span className="font-semibold text-teal-600">{log.affectedUcOrOfficial}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                      {log.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === "engine" && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-purple-600" />
                    <span>Database Score Daemon (pg_cron)</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Healthy (v1.0.0)</span>
                  </span>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Scheduled recalculation executes every 6 hours across all 246 Union Councils using PostgreSQL PostGIS queries with zero application memory overhead.
                </p>
                <div className="p-2.5 rounded-lg bg-black text-emerald-400 font-mono text-[11px] overflow-x-auto">
                  SELECT cron.schedule(&apos;recalculate_scores&apos;, &apos;0 */6 * * *&apos;, &apos;SELECT recalculate_all_uc_scores()&apos;);
                </div>
              </div>

              <button
                onClick={() => showToast("Triggered manual test run of recalculate_all_uc_scores()")}
                className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold cursor-pointer transition shadow-xs"
              >
                Run Manual Test Cycle (Simulate 6h Recalculation)
              </button>
            </div>
          )}

          {activeSubTab === "moderation" && (
            <div className="text-center py-8 space-y-2 text-xs text-slate-400">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
              <div className="font-bold text-slate-800 dark:text-slate-200">
                Moderation Queue Clear
              </div>
              <p>
                Zero flagged reports or abusive comments pending human review.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
