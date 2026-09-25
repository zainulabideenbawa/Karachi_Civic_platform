"use client";

import React from "react";
import { useCivic, NavTab } from "@/context/CivicContext";
import { Home, Map, Plus, Trophy, User } from "lucide-react";

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, language } = useCivic();

  const getNavLabel = (tab: NavTab) => {
    if (language === "ur") {
      switch (tab) {
        case "my-uc": return "میری یو سی";
        case "map": return "نقشہ";
        case "report": return "رپورٹ";
        case "rankings": return "رینکنگ";
        case "me": return "میں";
      }
    }
    if (language === "ur_roman") {
      switch (tab) {
        case "my-uc": return "Meri UC";
        case "map": return "Naksha";
        case "report": return "Report";
        case "rankings": return "Ranking";
        case "me": return "Main";
      }
    }
    switch (tab) {
      case "my-uc": return "My UC";
      case "map": return "Map";
      case "report": return "Report";
      case "rankings": return "Rankings";
      case "me": return "Me";
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 pb-safe transition-colors select-none shadow-[0_-4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.2)]">
      <div className="max-w-md mx-auto px-2 sm:px-4 h-16 flex items-center justify-around relative">
        {/* Tab 1: My UC */}
        <button
          onClick={() => setActiveTab("my-uc")}
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-all active:scale-90 group relative ${
            activeTab === "my-uc"
              ? "text-teal-700 dark:text-teal-400 font-bold"
              : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 font-medium"
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === "my-uc" ? "bg-teal-50 dark:bg-teal-950/80 scale-105" : ""}`}>
            <Home className={`w-5 h-5 ${activeTab === "my-uc" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">{getNavLabel("my-uc")}</span>
        </button>

        {/* Tab 2: Map */}
        <button
          onClick={() => setActiveTab("map")}
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-all active:scale-90 group relative ${
            activeTab === "map"
              ? "text-teal-700 dark:text-teal-400 font-bold"
              : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 font-medium"
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === "map" ? "bg-teal-50 dark:bg-teal-950/80 scale-105" : ""}`}>
            <Map className={`w-5 h-5 ${activeTab === "map" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">{getNavLabel("map")}</span>
        </button>

        {/* Tab 3 (Centre): Floating Report Button (Native FAB) */}
        <div className="flex flex-col items-center justify-center flex-1 relative -top-3.5">
          <button
            onClick={() => setActiveTab("report")}
            className="group flex flex-col items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 hover:from-teal-800 hover:to-emerald-600 text-white shadow-xl shadow-teal-700/35 ring-4 ring-white dark:ring-slate-900 transition-all transform active:scale-90 cursor-pointer"
            aria-label="Report Civic Issue"
          >
            <Plus className="w-7 h-7 stroke-[2.6] group-hover:rotate-90 group-active:rotate-90 transition-transform duration-300 drop-shadow-sm" />
          </button>
          <span className="text-[10px] font-bold text-teal-800 dark:text-teal-400 mt-1 tracking-tight">
            {getNavLabel("report")}
          </span>
        </div>

        {/* Tab 4: Rankings */}
        <button
          onClick={() => setActiveTab("rankings")}
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-all active:scale-90 group relative ${
            activeTab === "rankings"
              ? "text-teal-700 dark:text-teal-400 font-bold"
              : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 font-medium"
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === "rankings" ? "bg-teal-50 dark:bg-teal-950/80 scale-105" : ""}`}>
            <Trophy className={`w-5 h-5 ${activeTab === "rankings" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">{getNavLabel("rankings")}</span>
        </button>

        {/* Tab 5: Me */}
        <button
          onClick={() => setActiveTab("me")}
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-all active:scale-90 group relative ${
            activeTab === "me"
              ? "text-teal-700 dark:text-teal-400 font-bold"
              : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 font-medium"
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === "me" ? "bg-teal-50 dark:bg-teal-950/80 scale-105" : ""}`}>
            <User className={`w-5 h-5 ${activeTab === "me" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">{getNavLabel("me")}</span>
        </button>
      </div>
    </nav>
  );
};
