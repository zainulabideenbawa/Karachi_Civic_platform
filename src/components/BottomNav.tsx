"use client";

import React from "react";
import { useCivic, NavTab } from "@/context/CivicContext";
import { Home, Map, Plus, Trophy, User } from "lucide-react";

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useCivic();

  const navItems: { tab: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { tab: "my-uc", label: "My UC", icon: Home },
    { tab: "map", label: "Map", icon: Map },
    { tab: "rankings", label: "Rankings", icon: Trophy },
    { tab: "me", label: "Me", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe transition-colors">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around relative">
        {/* Tab 1: My UC */}
        <button
          onClick={() => setActiveTab("my-uc")}
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-colors ${
            activeTab === "my-uc"
              ? "text-teal-700 dark:text-teal-400 font-semibold"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === "my-uc" ? "stroke-[2.4]" : "stroke-[1.8]"}`} />
          <span className="text-[10px] mt-1">{navItems[0].label}</span>
        </button>

        {/* Tab 2: Map */}
        <button
          onClick={() => setActiveTab("map")}
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-colors ${
            activeTab === "map"
              ? "text-teal-700 dark:text-teal-400 font-semibold"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Map className={`w-5 h-5 ${activeTab === "map" ? "stroke-[2.4]" : "stroke-[1.8]"}`} />
          <span className="text-[10px] mt-1">{navItems[1].label}</span>
        </button>

        {/* Tab 3 (Centre): Floating Report Button */}
        <div className="flex flex-col items-center justify-center flex-1 relative -top-3">
          <button
            onClick={() => setActiveTab("report")}
            className="group flex flex-col items-center justify-center w-14 h-14 rounded-full bg-teal-700 hover:bg-teal-800 text-white shadow-lg shadow-teal-700/30 transition-transform transform active:scale-95 cursor-pointer"
            aria-label="Report Civic Issue"
          >
            <Plus className="w-7 h-7 stroke-[2.5] group-hover:rotate-90 transition-transform duration-300" />
          </button>
          <span className="text-[10px] font-bold text-teal-800 dark:text-teal-400 mt-0.5 tracking-tight">
            Report
          </span>
        </div>

        {/* Tab 4: Rankings */}
        <button
          onClick={() => setActiveTab("rankings")}
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-colors ${
            activeTab === "rankings"
              ? "text-teal-700 dark:text-teal-400 font-semibold"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Trophy className={`w-5 h-5 ${activeTab === "rankings" ? "stroke-[2.4]" : "stroke-[1.8]"}`} />
          <span className="text-[10px] mt-1">{navItems[2].label}</span>
        </button>

        {/* Tab 5: Me */}
        <button
          onClick={() => setActiveTab("me")}
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-colors ${
            activeTab === "me"
              ? "text-teal-700 dark:text-teal-400 font-semibold"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === "me" ? "stroke-[2.4]" : "stroke-[1.8]"}`} />
          <span className="text-[10px] mt-1">{navItems[3].label}</span>
        </button>
      </div>
    </nav>
  );
};
