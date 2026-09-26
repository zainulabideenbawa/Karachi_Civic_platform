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

import { RoleBanner } from "@/components/RoleBanner";
import { PWAInstallDrawer } from "@/components/PWAInstallDrawer";

import { IssueDetailModal } from "@/components/modals/IssueDetailModal";
import { WhatsAppAuthModal } from "@/components/modals/WhatsAppAuthModal";
import { ScoreFormulaModal } from "@/components/modals/ScoreFormulaModal";
import { OfficialDashboardModal } from "@/components/dashboards/OfficialDashboardModal";
import { AdminConsoleModal } from "@/components/dashboards/AdminConsoleModal";
import { SearchModal } from "@/components/modals/SearchModal";
import { UCPollsModal } from "@/components/modals/UCPollsModal";
import { NGOsModal } from "@/components/modals/NGOsModal";
import { BaithakPanelModal } from "@/components/modals/BaithakPanelModal";
import { LeaderProfileModal } from "@/components/modals/LeaderProfileModal";
import { BecomeLeaderModal } from "@/components/modals/BecomeLeaderModal";
import { LeaderDashboardModal } from "@/components/dashboards/LeaderDashboardModal";
import { UCIdeasBoardModal } from "@/components/modals/UCIdeasBoardModal";
import { FindMyUCModal } from "@/components/modals/FindMyUCModal";
import { OnboardingModal } from "@/components/modals/OnboardingModal";
import { OfficialProfileModal } from "@/components/modals/OfficialProfileModal";
import { RoleSwitcherModal } from "@/components/modals/RoleSwitcherModal";
import { WorkDoneShareModal } from "@/components/modals/WorkDoneShareModal";
import { NGODashboardModal } from "@/components/dashboards/NGODashboardModal";
import { ThinkTankModal } from "@/components/modals/ThinkTankModal";

function CivicAppContent() {
  const { activeTab, setActiveTab, language, isAnyModalOpen, closeActiveModal } = useCivic();
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = React.useState(false);

  // Mobile Back Navigation & Gesture Support (PWA native-app back button & swipe back)
  const isAnyModalOpenRef = React.useRef(false);
  const activeTabRef = React.useRef(activeTab);
  activeTabRef.current = activeTab;

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Auto-recover if an outdated client encounters a stale chunk
    const handleChunkError = (e: ErrorEvent) => {
      if (e?.message && /loading chunk|chunkloaderror/i.test(e.message)) {
        window.location.reload();
      }
    };
    window.addEventListener("error", handleChunkError);
    return () => window.removeEventListener("error", handleChunkError);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const hasOpenModal = isAnyModalOpen || isRoleSwitcherOpen;
    if (hasOpenModal) {
      if (!isAnyModalOpenRef.current) {
        window.history.pushState({ modal: true }, "");
        isAnyModalOpenRef.current = true;
      }
    } else {
      isAnyModalOpenRef.current = false;
    }
  }, [isAnyModalOpen, isRoleSwitcherOpen]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      // 1. If role switcher modal is open, close it
      if (isRoleSwitcherOpen) {
        setIsRoleSwitcherOpen(false);
        isAnyModalOpenRef.current = false;
        return;
      }

      // 2. If any context modal is open, close it!
      if (isAnyModalOpen) {
        closeActiveModal();
        isAnyModalOpenRef.current = false;
        return;
      }

      // 3. If on a secondary tab (map, report, rankings, me), navigate back to Home ("my-uc")
      if (activeTabRef.current !== "my-uc") {
        setActiveTab("my-uc");
        return;
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isAnyModalOpen, isRoleSwitcherOpen, closeActiveModal, setActiveTab]);

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
