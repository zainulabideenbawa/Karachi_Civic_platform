"use client";

import React from "react";
import { CivicProvider, useCivic } from "@/context/CivicContext";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Toast } from "@/components/Toast";
import { MyUCTab } from "@/components/tabs/MyUCTab";
import { MapTab } from "@/components/tabs/MapTab";
import { ReportTab } from "@/components/tabs/ReportTab";
import { RankingsTab } from "@/components/tabs/RankingsTab";
import { MeTab } from "@/components/tabs/MeTab";

import { IssueDetailModal } from "@/components/modals/IssueDetailModal";
import { WhatsAppAuthModal } from "@/components/modals/WhatsAppAuthModal";
import { ScoreFormulaModal } from "@/components/modals/ScoreFormulaModal";
import { OfficialDashboardModal } from "@/components/dashboards/OfficialDashboardModal";
import { AdminConsoleModal } from "@/components/dashboards/AdminConsoleModal";
import { SearchModal } from "@/components/modals/SearchModal";

function CivicAppContent() {
  const { activeTab, language } = useCivic();

  return (
    <div
      dir={language === "ur" ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white"
    >
      {/* Top Application Header */}
      <Header />

      {/* Main Responsive Container (Section 11.0b: Mobile-first 360-430px centered up to 640px) */}
      <main className="flex-1 w-full max-w-xl mx-auto px-3 sm:px-4 pt-3 pb-8">
        {activeTab === "my-uc" && <MyUCTab />}
        {activeTab === "map" && <MapTab />}
        {activeTab === "report" && <ReportTab />}
        {activeTab === "rankings" && <RankingsTab />}
        {activeTab === "me" && <MeTab />}
      </main>

      {/* Sticky Bottom Navigation Bar */}
      <BottomNav />

      {/* 5-Second Undo Toast */}
      <Toast />

      {/* Global Modals & Dashboards */}
      <IssueDetailModal />
      <WhatsAppAuthModal />
      <ScoreFormulaModal />
      <OfficialDashboardModal />
      <AdminConsoleModal />
      <SearchModal />
    </div>
  );
}

export default function Home() {
  return (
    <CivicProvider>
      <CivicAppContent />
    </CivicProvider>
  );
}
