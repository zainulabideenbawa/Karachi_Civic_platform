"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AuditLogEntry,
  CivicEvent,
  Issue,
  Language,
  PollRecord,
  PromiseRecord,
  Town,
  UC,
  UserRole,
} from "@/types/civic";
import {
  MOCK_AUDIT_LOG,
  MOCK_EVENTS,
  MOCK_ISSUES,
  MOCK_POLLS,
  MOCK_PROMISES,
  MOCK_TOWNS,
  MOCK_UCS,
} from "@/lib/mock-data";

export type NavTab = "my-uc" | "map" | "report" | "rankings" | "me";

interface ToastMessage {
  id: string;
  text: string;
  undoAction?: () => void;
  undoLabel?: string;
}

interface CivicContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  activeUC: UC;
  setActiveUC: (uc: UC) => void;
  allUCs: UC[];
  allTowns: Town[];
  issues: Issue[];
  events: CivicEvent[];
  promises: PromiseRecord[];
  polls: PollRecord[];
  auditLog: AuditLogEntry[];
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // Modals & Navigation States
  selectedIssue: Issue | null;
  setSelectedIssue: (issue: Issue | null) => void;
  isWhatsAppAuthOpen: boolean;
  setIsWhatsAppAuthOpen: (open: boolean) => void;
  isScoreFormulaOpen: boolean;
  setIsScoreFormulaOpen: (open: boolean) => void;
  isOfficialDashboardOpen: boolean;
  setIsOfficialDashboardOpen: (open: boolean) => void;
  isAdminConsoleOpen: boolean;
  setIsAdminConsoleOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  // Actions
  toggleAffected: (issueId: string) => void;
  voteConfirmation: (issueId: string, vote: "fixed" | "not_fixed", reason?: string) => void;
  addNewIssue: (newIssue: Omit<Issue, "id" | "createdAt" | "updatedAt" | "daysOpen" | "affectedCount" | "weightedAffected">) => string;
  addOfficialResponse: (issueId: string, message: string, statusUpdate: Issue["status"]) => void;
  officialMarkResolved: (issueId: string, afterPhotoUrl: string, note: string) => void;
  flagJurisdiction: (issueId: string, targetBody: string, reason: string) => void;
  rsvpEvent: (eventId: string) => void;
  votePoll: (pollId: string, optionId: string) => void;
  
  // Toasts with Undo
  toast: ToastMessage | null;
  showToast: (text: string, undoAction?: () => void, undoLabel?: string) => void;
  dismissToast: () => void;
  offlineQueueCount: number;
}

const CivicContext = createContext<CivicContextType | undefined>(undefined);

export function CivicProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<NavTab>("my-uc");
  const [allUCs] = useState<UC[]>(MOCK_UCS);
  const [activeUC, setActiveUC] = useState<UC>(MOCK_UCS[0]); // UC-7 Gulshan
  const [allTowns] = useState<Town[]>(MOCK_TOWNS);
  const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);
  const [events, setEvents] = useState<CivicEvent[]>(MOCK_EVENTS);
  const [promises] = useState<PromiseRecord[]>(MOCK_PROMISES);
  const [polls, setPolls] = useState<PollRecord[]>(MOCK_POLLS);
  const [auditLog] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOG);

  const [activeRole, setActiveRole] = useState<UserRole>("citizen");
  const [language, setLanguage] = useState<Language>("en");

  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isWhatsAppAuthOpen, setIsWhatsAppAuthOpen] = useState(false);
  const [isScoreFormulaOpen, setIsScoreFormulaOpen] = useState(false);
  const [isOfficialDashboardOpen, setIsOfficialDashboardOpen] = useState(false);
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [offlineQueueCount] = useState(0);

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (text: string, undoAction?: () => void, undoLabel: string = "Undo") => {
    setToast({
      id: Math.random().toString(),
      text,
      undoAction,
      undoLabel,
    });
  };

  const dismissToast = () => setToast(null);

  // Toggle "I'm Affected"
  const toggleAffected = (issueId: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          const isCurrently = !!iss.isUserAffected;
          const newAffected = isCurrently
            ? Math.max(1, iss.affectedCount - 1)
            : iss.affectedCount + 1;
          const newWeight = isCurrently
            ? Math.max(1, iss.weightedAffected - 1)
            : iss.weightedAffected + 1;
          return {
            ...iss,
            isUserAffected: !isCurrently,
            affectedCount: newAffected,
            weightedAffected: newWeight,
          };
        }
        return iss;
      })
    );

    // Keep selected issue updated
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue((prev) =>
        prev
          ? {
              ...prev,
              isUserAffected: !prev.isUserAffected,
              affectedCount: prev.isUserAffected
                ? Math.max(1, prev.affectedCount - 1)
                : prev.affectedCount + 1,
            }
          : null
      );
    }

    showToast("Count updated: You marked 'I am affected'", () => {
      // Revert action
      toggleAffected(issueId);
    });
  };

  // Vote on confirmation window (Fixed vs Not Fixed)
  const voteConfirmation = (
    issueId: string,
    vote: "fixed" | "not_fixed",
    reason?: string
  ) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId && iss.confirmationWindow) {
          const currentFixed = iss.confirmationWindow.fixedVotes;
          const currentNotFixed = iss.confirmationWindow.notFixedVotes;
          const newFixed = vote === "fixed" ? currentFixed + 1 : currentFixed;
          const newNotFixed =
            vote === "not_fixed" ? currentNotFixed + 1 : currentNotFixed;

          const updatedStatus: Issue["status"] =
            vote === "not_fixed" && newNotFixed >= 2
              ? "reopened"
              : vote === "fixed" && newFixed >= 2
              ? "confirmed"
              : iss.status;

          return {
            ...iss,
            status: updatedStatus,
            confirmationWindow: {
              ...iss.confirmationWindow,
              fixedVotes: newFixed,
              notFixedVotes: newNotFixed,
              userVoted: vote,
            },
          };
        }
        return iss;
      })
    );

    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue((prev) =>
        prev && prev.confirmationWindow
          ? {
              ...prev,
              confirmationWindow: {
                ...prev.confirmationWindow,
                fixedVotes:
                  vote === "fixed"
                    ? prev.confirmationWindow.fixedVotes + 1
                    : prev.confirmationWindow.fixedVotes,
                notFixedVotes:
                  vote === "not_fixed"
                    ? prev.confirmationWindow.notFixedVotes + 1
                    : prev.confirmationWindow.notFixedVotes,
                userVoted: vote,
              },
            }
          : null
      );
    }

    showToast(
      vote === "fixed"
        ? "Confirmed! Thank you for verifying the municipal fix."
        : `Issue marked as Not Fixed (${reason || "unresolved"}). Sent back to official queue.`
    );
  };

  // Submit new issue
  const addNewIssue = (
    newIssueData: Omit<
      Issue,
      "id" | "createdAt" | "updatedAt" | "daysOpen" | "affectedCount" | "weightedAffected"
    >
  ): string => {
    const id = `K-${Math.floor(10000 + Math.random() * 90000)}`;
    const fullIssue: Issue = {
      ...newIssueData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      daysOpen: 0,
      affectedCount: 1,
      weightedAffected: 1.0,
      isUserAffected: true,
    };

    setIssues((prev) => [fullIssue, ...prev]);
    showToast(
      `Issue #${id} reported! Added to ${newIssueData.ucName}'s public scorecard.`,
      () => {
        setIssues((prev) => prev.filter((i) => i.id !== id));
      },
      "Undo Report"
    );
    return id;
  };

  // Official Response
  const addOfficialResponse = (
    issueId: string,
    message: string,
    statusUpdate: Issue["status"]
  ) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            status: statusUpdate,
            officialResponse: {
              officialId: activeUC.chairman.id,
              officialName: activeUC.chairman.name,
              seatTitle: activeUC.chairman.seatTitle,
              respondedAt: new Date().toISOString(),
              message,
              statusUpdate,
            },
          };
        }
        return iss;
      })
    );
    showToast("Official response pinned to public issue record");
  };

  // Official Mark Resolved
  const officialMarkResolved = (
    issueId: string,
    afterPhotoUrl: string,
    note: string
  ) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            status: "marked_resolved",
            afterPhotos: [
              {
                id: `p-after-${Date.now()}`,
                kind: "after",
                url: afterPhotoUrl,
                capturedAt: new Date().toISOString(),
                lat: iss.lat,
                lng: iss.lng,
                uploaderName: `${activeUC.chairman.seatTitle} Inspection Team`,
              },
            ],
            officialResponse: {
              officialId: activeUC.chairman.id,
              officialName: activeUC.chairman.name,
              seatTitle: activeUC.chairman.seatTitle,
              respondedAt: new Date().toISOString(),
              message: note || "Work completed on site. Live after-photo uploaded for citizen verification.",
              statusUpdate: "marked_resolved",
            },
            confirmationWindow: {
              markedResolvedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              fixedVotes: 0,
              notFixedVotes: 0,
              userVoted: undefined,
            },
          };
        }
        return iss;
      })
    );
    showToast("Work marked resolved! 7-day citizen confirmation window opened.");
  };

  // Flag Jurisdiction
  const flagJurisdiction = (
    issueId: string,
    targetBody: string,
    reason: string
  ) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            status: "jurisdiction_flagged",
            jurisdictionFlag: {
              flaggedBy: activeUC.chairman.name,
              suggestedBody: targetBody,
              reason,
              rulingStatus: "pending",
            },
          };
        }
        return iss;
      })
    );
    showToast(`Jurisdiction disputed to ${targetBody}. Sent to admin ruling queue.`);
  };

  // Event RSVP
  const rsvpEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const isCurrently = !!ev.isUserRsvpd;
          return {
            ...ev,
            isUserRsvpd: !isCurrently,
            rsvpCount: isCurrently ? ev.rsvpCount - 1 : ev.rsvpCount + 1,
          };
        }
        return ev;
      })
    );
    showToast("RSVP updated for event!");
  };

  // Poll Vote
  const votePoll = (pollId: string, optionId: string) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id === pollId && !poll.userVotedOptionId) {
          return {
            ...poll,
            totalVotes: poll.totalVotes + 1,
            userVotedOptionId: optionId,
            options: poll.options.map((opt) =>
              opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            ),
          };
        }
        return poll;
      })
    );
    showToast("Your vote has been counted anonymously!");
  };

  return (
    <CivicContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeUC,
        setActiveUC,
        allUCs,
        allTowns,
        issues,
        events,
        promises,
        polls,
        auditLog,
        activeRole,
        setActiveRole,
        language,
        setLanguage,
        selectedIssue,
        setSelectedIssue,
        isWhatsAppAuthOpen,
        setIsWhatsAppAuthOpen,
        isScoreFormulaOpen,
        setIsScoreFormulaOpen,
        isOfficialDashboardOpen,
        setIsOfficialDashboardOpen,
        isAdminConsoleOpen,
        setIsAdminConsoleOpen,
        isSearchOpen,
        setIsSearchOpen,
        toggleAffected,
        voteConfirmation,
        addNewIssue,
        addOfficialResponse,
        officialMarkResolved,
        flagJurisdiction,
        rsvpEvent,
        votePoll,
        toast,
        showToast,
        dismissToast,
        offlineQueueCount,
      }}
    >
      {children}
    </CivicContext.Provider>
  );
}

export function useCivic() {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error("useCivic must be used within a CivicProvider");
  }
  return context;
}
