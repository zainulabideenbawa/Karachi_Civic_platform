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

import dynamic from "next/dynamic";
import { RoleBanner } from "@/components/RoleBanner";
import { PWAInstallDrawer } from "@/components/PWAInstallDrawer";

// Code-split all modals to minimize initial JS bundle size and maximize first paint speed
const IssueDetailModal = dynamic(() => import("@/components/modals/IssueDetailModal").then((m) => m.IssueDetailModal), { ssr: false });
const WhatsAppAuthModal = dynamic(() => import("@/components/modals/WhatsAppAuthModal").then((m) => m.WhatsAppAuthModal), { ssr: false });
const ScoreFormulaModal = dynamic(() => import("@/components/modals/ScoreFormulaModal").then((m) => m.ScoreFormulaModal), { ssr: false });
const OfficialDashboardModal = dynamic(() => import("@/components/dashboards/OfficialDashboardModal").then((m) => m.OfficialDashboardModal), { ssr: false });
const AdminConsoleModal = dynamic(() => import("@/components/dashboards/AdminConsoleModal").then((m) => m.AdminConsoleModal), { ssr: false });
const SearchModal = dynamic(() => import("@/components/modals/SearchModal").then((m) => m.SearchModal), { ssr: false });
const UCPollsModal = dynamic(() => import("@/components/modals/UCPollsModal").then((m) => m.UCPollsModal), { ssr: false });
const NGOsModal = dynamic(() => import("@/components/modals/NGOsModal").then((m) => m.NGOsModal), { ssr: false });
const BaithakPanelModal = dynamic(() => import("@/components/modals/BaithakPanelModal").then((m) => m.BaithakPanelModal), { ssr: false });
const LeaderProfileModal = dynamic(() => import("@/components/modals/LeaderProfileModal").then((m) => m.LeaderProfileModal), { ssr: false });
const BecomeLeaderModal = dynamic(() => import("@/components/modals/BecomeLeaderModal").then((m) => m.BecomeLeaderModal), { ssr: false });
const LeaderDashboardModal = dynamic(() => import("@/components/dashboards/LeaderDashboardModal").then((m) => m.LeaderDashboardModal), { ssr: false });
const UCIdeasBoardModal = dynamic(() => import("@/components/modals/UCIdeasBoardModal").then((m) => m.UCIdeasBoardModal), { ssr: false });
const FindMyUCModal = dynamic(() => import("@/components/modals/FindMyUCModal").then((m) => m.FindMyUCModal), { ssr: false });
const OnboardingModal = dynamic(() => import("@/components/modals/OnboardingModal").then((m) => m.OnboardingModal), { ssr: false });
const OfficialProfileModal = dynamic(() => import("@/components/modals/OfficialProfileModal").then((m) => m.OfficialProfileModal), { ssr: false });
const RoleSwitcherModal = dynamic(() => import("@/components/modals/RoleSwitcherModal").then((m) => m.RoleSwitcherModal), { ssr: false });
const WorkDoneShareModal = dynamic(() => import("@/components/modals/WorkDoneShareModal").then((m) => m.WorkDoneShareModal), { ssr: false });
const NGODashboardModal = dynamic(() => import("@/components/dashboards/NGODashboardModal").then((m) => m.NGODashboardModal), { ssr: false });
const ThinkTankModal = dynamic(() => import("@/components/modals/ThinkTankModal").then((m) => m.ThinkTankModal), { ssr: false });

function CivicAppContent() {
  const { activeTab, language } = useCivic();
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = React.useState(false);

  return (
    <div
      dir={language === "ur" ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white"
    >
      {/* Top Application Header */}
      <Header onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)} />

      {/* Persistent Role Mode Banner (Transforms app into Chairman, Leader, NGO, Admin mode) */}
      <RoleBanner onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)} />

      {/* Main Responsive Container (Section 11.0b: Mobile-first 360-430px centered up to 640px) */}
      <main className="flex-1 w-full max-w-xl mx-auto px-3 sm:px-4 pt-3 pb-8">
        {activeTab === "my-uc" && <MyUCTab />}
        {activeTab === "map" && <MapTab />}
        {activeTab === "report" && <ReportTab />}
        {activeTab === "rankings" && <RankingsTab />}
        {activeTab === "me" && <MeTab />}
      </main>

      {/* Floating PWA Install Drawer */}
      <PWAInstallDrawer />

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
      <UCPollsModal />
      <NGOsModal />
      <BaithakPanelModal />
      <LeaderProfileModal />
      <BecomeLeaderModal />
      <LeaderDashboardModal />
      <UCIdeasBoardModal />
      <FindMyUCModal />
      <OnboardingModal />
      <OfficialProfileModal />
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
      />
      <WorkDoneShareModal />
      <NGODashboardModal />
      <ThinkTankModal />
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
