"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AuditLogEntry,
  CivicEvent,
  CommunityLeader,
  Issue,
  Language,
  Official,
  PollRecord,
  PromiseRecord,
  Town,
  UC,
  UCIdea,
  UserRole,
  ManagedUser,
  OfficialVerificationClaim,
  JurisdictionDispute,
  CommentRecord,
} from "@/types/civic";
import {
  MOCK_AUDIT_LOG,
  MOCK_COMMUNITY_LEADERS,
  MOCK_EVENTS,
  MOCK_IDEAS,
  MOCK_ISSUES,
  MOCK_POLLS,
  MOCK_PROMISES,
  MOCK_TOWNS,
  MOCK_UCS,
  MOCK_MANAGED_USERS,
  MOCK_OFFICIAL_CLAIMS,
  MOCK_JURISDICTION_DISPUTES,
} from "@/lib/mock-data";
import {
  supabase,
  recordAffectedVote,
  recordConfirmationVote,
} from "@/lib/supabase/client";

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
  selectedOfficial: Official | null;
  setSelectedOfficial: (official: Official | null) => void;
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
  isPollsModalOpen: boolean;
  setIsPollsModalOpen: (open: boolean) => void;
  isNGOsModalOpen: boolean;
  setIsNGOsModalOpen: (open: boolean) => void;
  isBaithakPanelModalOpen: boolean;
  setIsBaithakPanelModalOpen: (open: boolean) => void;
  selectedEventForPanel: CivicEvent | null;
  setSelectedEventForPanel: (event: CivicEvent | null) => void;
  
  // Community Leaders (Spec Addendum 01)
  communityLeaders: CommunityLeader[];
  selectedLeader: CommunityLeader | null;
  setSelectedLeader: (leader: CommunityLeader | null) => void;
  isLeaderProfileOpen: boolean;
  setIsLeaderProfileOpen: (open: boolean) => void;
  isBecomeLeaderOpen: boolean;
  setIsBecomeLeaderOpen: (open: boolean) => void;
  isLeaderDashboardOpen: boolean;
  setIsLeaderDashboardOpen: (open: boolean) => void;
  
  // UC Ideas Board (Workflow W7) & Find My UC (Workflow W1)
  ideas: UCIdea[];
  isIdeasModalOpen: boolean;
  setIsIdeasModalOpen: (open: boolean) => void;
  isFindMyUCOpen: boolean;
  setIsFindMyUCOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  
  // Work Done Sharing
  workDoneShareIssue: Issue | null;
  setWorkDoneShareIssue: (issue: Issue | null) => void;
  openWorkDoneShare: (issue: Issue) => void;

  // NGO Workbench
  isNGODashboardOpen: boolean;
  setIsNGODashboardOpen: (open: boolean) => void;
  adoptNGOIssue: (issueId: string, ngoName: string, targetDays: number, reliefNote: string) => { success: boolean; message: string };
  resolveNGOIssue: (issueId: string, afterPhotoUrl: string, note: string) => { success: boolean; message: string };

  // Admin & User Moderation
  managedUsers: ManagedUser[];
  banUser: (userId: string, reason: string) => void;
  unbanUser: (userId: string) => void;
  shadowbanUser: (userId: string) => void;

  // Official Verifications
  officialVerificationClaims: OfficialVerificationClaim[];
  approveOfficialClaim: (claimId: string) => void;
  rejectOfficialClaim: (claimId: string) => void;

  // Community Leader Applications
  approveLeaderApplicant: (leaderId: string) => void;
  rejectLeaderApplicant: (leaderId: string) => void;

  // Jurisdiction Disputes
  jurisdictionDisputes: JurisdictionDispute[];
  resolveJurisdictionDispute: (disputeId: string, decision: "transfer" | "keep") => void;
  
  // Actions
  toggleAffected: (issueId: string) => void;
  voteConfirmation: (
    issueId: string,
    vote: "fixed" | "not_fixed",
    reason?: string,
    rating?: number,
    sayThanks?: boolean
  ) => void;
  addNewIssue: (newIssue: Omit<Issue, "id" | "createdAt" | "updatedAt" | "daysOpen" | "affectedCount" | "weightedAffected">) => string;
  addOfficialResponse: (issueId: string, message: string, statusUpdate: Issue["status"]) => void;
  officialMarkResolved: (issueId: string, afterPhotoUrl: string, note: string) => void;
  flagJurisdiction: (issueId: string, targetBody: string, reason: string) => void;
  rsvpEvent: (eventId: string) => void;
  checkInEvent: (eventId: string) => void;
  votePoll: (pollId: string, optionId: string) => void;
  upvoteIdea: (ideaId: string) => void;
  submitIdea: (data: { title: string; description: string; category: string }) => void;
  adoptIssue: (issueId: string, adopterType: "leader" | "ngo", adopterId: string, adopterName: string, targetDays: number) => { success: boolean; message: string };
  resolveAdoptedIssue: (issueId: string, afterPhotoUrl: string, note: string) => { success: boolean; message: string };
  applyBecomeLeader: (data: { realName: string; photoUrl: string; bio: string; whyServe: string; party: string; plansToContest: "yes" | "no" | "prefer_not_to_say"; ucId: string }) => void;
  followLeader: (leaderId: string) => void;
  addCommentToIssue: (issueId: string, body: string, customAuthorName?: string) => void;
  resetDemoData: () => void;
  
  // Toasts with Undo
  toast: ToastMessage | null;
  showToast: (text: string, undoAction?: () => void, undoLabel?: string) => void;
  dismissToast: () => void;
  offlineQueueCount: number;
  isOnline: boolean;
}

const CivicContext = createContext<CivicContextType | undefined>(undefined);

export function CivicProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<NavTab>("my-uc");
  const [allUCs, setAllUCs] = useState<UC[]>(MOCK_UCS);
  const [activeUC, setActiveUC] = useState<UC>(MOCK_UCS[0]); // UC-7 Gulshan
  const [allTowns, setAllTowns] = useState<Town[]>(MOCK_TOWNS);
  const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);
  const [events, setEvents] = useState<CivicEvent[]>(MOCK_EVENTS);
  const [promises, setPromises] = useState<PromiseRecord[]>(MOCK_PROMISES);
  const [polls, setPolls] = useState<PollRecord[]>(MOCK_POLLS);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOG);

  const [activeRole, setActiveRole] = useState<UserRole>("citizen");
  const [language, setLanguage] = useState<Language>("en");

  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [selectedOfficial, setSelectedOfficial] = useState<Official | null>(null);
  const [isWhatsAppAuthOpen, setIsWhatsAppAuthOpen] = useState(false);
  const [isScoreFormulaOpen, setIsScoreFormulaOpen] = useState(false);
  const [isOfficialDashboardOpen, setIsOfficialDashboardOpen] = useState(false);
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPollsModalOpen, setIsPollsModalOpen] = useState(false);
  const [isNGOsModalOpen, setIsNGOsModalOpen] = useState(false);
  const [isBaithakPanelModalOpen, setIsBaithakPanelModalOpen] = useState(false);
  const [selectedEventForPanel, setSelectedEventForPanel] = useState<CivicEvent | null>(null);

  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [offlineQueueCount] = useState(0);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Community Leaders (Spec Addendum 01)
  const [communityLeaders, setCommunityLeaders] = useState<CommunityLeader[]>(MOCK_COMMUNITY_LEADERS);
  const [selectedLeader, setSelectedLeader] = useState<CommunityLeader | null>(null);
  const [isLeaderProfileOpen, setIsLeaderProfileOpen] = useState(false);
  const [isBecomeLeaderOpen, setIsBecomeLeaderOpen] = useState(false);
  const [isLeaderDashboardOpen, setIsLeaderDashboardOpen] = useState(false);

  // UC Ideas Board (Workflow W7) & Find My UC (Workflow W1) & Onboarding (Section 11.3)
  const [ideas, setIdeas] = useState<UCIdea[]>(MOCK_IDEAS);
  const [isIdeasModalOpen, setIsIdeasModalOpen] = useState(false);
  const [isFindMyUCOpen, setIsFindMyUCOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [workDoneShareIssue, setWorkDoneShareIssue] = useState<Issue | null>(null);
  const [isNGODashboardOpen, setIsNGODashboardOpen] = useState(false);
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>(MOCK_MANAGED_USERS);
  const [officialVerificationClaims, setOfficialVerificationClaims] = useState<OfficialVerificationClaim[]>(MOCK_OFFICIAL_CLAIMS);
  const [jurisdictionDisputes, setJurisdictionDisputes] = useState<JurisdictionDispute[]>(MOCK_JURISDICTION_DISPUTES);
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  const openWorkDoneShare = (issue: Issue) => {
    setWorkDoneShareIssue(issue);
  };

  const banUser = (userId: string, reason: string) => {
    setManagedUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: "banned" as const, banReason: reason || "Administrative platform ban" }
          : u
      )
    );
    const newLog: AuditLogEntry = {
      id: `log-ban-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      actor: "SuperAdmin (ID: admin-root)",
      action: `User Suspended / Banned: ${userId}`,
      affectedUcOrOfficial: `Target User: ${userId}`,
      reason: reason || "Violated civic integrity guidelines",
    };
    setAuditLog((prev) => [newLog, ...prev]);
    showToast(`User ${userId} banned from platform`);
  };

  const unbanUser = (userId: string) => {
    setManagedUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: "active" as const, banReason: undefined, isFlaggedForBrigading: false } : u
      )
    );
    showToast(`User ${userId} restored to Active status`);
  };

  const shadowbanUser = (userId: string) => {
    setManagedUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: "shadowbanned" as const, banReason: "Silent moderation: vote weight zeroed out" }
          : u
      )
    );
    showToast(`User ${userId} shadowbanned (Vote weight reduced to 0.0)`);
  };

  const approveOfficialClaim = (claimId: string) => {
    const claim = officialVerificationClaims.find((c) => c.id === claimId);
    if (!claim) return;

    setOfficialVerificationClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: "approved" as const } : c))
    );

    setAllUCs((prev) =>
      prev.map((uc) => {
        if (uc.id === claim.ucId || uc.chairman.id === claim.officialId) {
          return {
            ...uc,
            chairman: {
              ...uc.chairman,
              isClaimed: true,
              badges: Array.from(new Set([...uc.chairman.badges, "Verified Official ECP"])),
            },
          };
        }
        return uc;
      })
    );

    const newLog: AuditLogEntry = {
      id: `log-claim-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      actor: "SuperAdmin (ID: admin-root)",
      action: `Official Seat Claim Approved: ${claim.officialName}`,
      affectedUcOrOfficial: `${claim.seatTitle} (${claim.ucName})`,
      reason: `Verified Government Notification: ${claim.appointmentGazetteNotice}`,
    };
    setAuditLog((prev) => [newLog, ...prev]);
    showToast(`Verified official badge granted to ${claim.officialName}!`);
  };

  const rejectOfficialClaim = (claimId: string) => {
    setOfficialVerificationClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: "rejected" as const } : c))
    );
    showToast("Official claim rejected");
  };

  const approveLeaderApplicant = (leaderId: string) => {
    setCommunityLeaders((prev) =>
      prev.map((lead) =>
        lead.id === leaderId
          ? { ...lead, status: "active" as const, identityVerified: true, identityVerifiedAt: new Date().toISOString() }
          : lead
      )
    );
    showToast("Community Leader application approved & verified!");
  };

  const rejectLeaderApplicant = (leaderId: string) => {
    setCommunityLeaders((prev) =>
      prev.map((lead) => (lead.id === leaderId ? { ...lead, status: "removed" as const } : lead))
    );
    showToast("Community Leader application rejected.");
  };

  const resolveJurisdictionDispute = (disputeId: string, decision: "transfer" | "keep") => {
    const disp = jurisdictionDisputes.find((d) => d.id === disputeId);
    if (!disp) return;

    setJurisdictionDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId ? { ...d, status: decision === "transfer" ? ("approved" as const) : ("rejected" as const) } : d
      )
    );

    if (decision === "transfer") {
      setIssues((prev) =>
        prev.map((iss) => {
          if (iss.id === disp.issueId) {
            return {
              ...iss,
              subCategory: `Reassigned to ${disp.claimedTargetBody}`,
              officialResponse: {
                officialId: "admin-system",
                officialName: "Admin Arbitration Board",
                seatTitle: "Admin Panel",
                respondedAt: new Date().toISOString(),
                message: `Jurisdiction transfer approved by Admin Panel. Transferred to ${disp.claimedTargetBody}. Shifted out of UC scoring backlog.`,
                statusUpdate: "in_progress",
              },
            };
          }
          return iss;
        })
      );
      showToast(`Dispute resolved: Issue transferred to ${disp.claimedTargetBody}`);
    } else {
      showToast("Dispute resolved: Issue kept within UC municipal jurisdiction");
    }
  };

  const adoptNGOIssue = (issueId: string, ngoName: string, targetDays: number, reliefNote: string) => {
    return adoptIssue(issueId, "ngo", "ngo-active", ngoName, targetDays);
  };

  const resolveNGOIssue = (issueId: string, afterPhotoUrl: string, note: string) => {
    return resolveAdoptedIssue(issueId, afterPhotoUrl, note);
  };

  // Sync with Supabase on mount (Hydrate all civic seed & live data from Postgres)
  useEffect(() => {
    async function loadFromSupabase() {
      try {
        // 1. Fetch Towns from Supabase
        const { data: dbTowns } = await supabase
          .from("towns")
          .select("*")
          .order("rank", { ascending: true });

        if (dbTowns && dbTowns.length > 0) {
          setAllTowns(
            dbTowns.map((t) => ({
              id: t.id,
              name: t.name,
              slug: t.slug,
              district: t.district,
              totalUcs: t.total_ucs,
              teamScore: Number(t.team_score),
              rank: t.rank,
              townChairmanName: t.town_chairman_name,
              townChairmanPhoto: t.town_chairman_photo,
              townChairmanParty: t.town_chairman_party,
            }))
          );
        }

        // 2. Fetch UCs joined with Officials from Supabase
        const { data: dbUCs } = await supabase
          .from("ucs")
          .select("*, officials(*)")
          .order("city_rank", { ascending: true });

        if (dbUCs && dbUCs.length > 0) {
          const mappedUCs: UC[] = dbUCs.map((u) => {
            const off = u.officials && u.officials[0];
            return {
              id: u.id,
              townId: u.town_id,
              townName: u.town_name,
              number: u.number,
              name: u.name,
              slug: u.slug,
              neighborhoods: u.neighborhoods || [],
              lat: Number(u.lat),
              lng: Number(u.lng),
              score: Number(u.score),
              cityRank: u.city_rank,
              townRank: u.town_rank,
              trend30d: Number(u.trend_30d),
              totalEligibleIssues: u.total_eligible_issues,
              resolvedIssues: u.resolved_issues,
              oldestOpenDays: u.oldest_open_days,
              hasEnoughData: u.has_enough_data,
              chairman: off
                ? {
                    id: off.id,
                    name: off.name,
                    slug: off.slug,
                    seatTitle: off.seat_title,
                    photo: off.photo,
                    party: off.party,
                    officeContact: off.office_contact,
                    termStart: off.term_start,
                    termEnd: off.term_end,
                    isClaimed: off.is_claimed,
                    badges: off.badges || [],
                    promisesKept: off.promises_kept,
                    promisesTotal: off.promises_total,
                    eventsHeld: off.events_held,
                    thankYouCount: off.thank_you_count,
                    fixSatisfaction: Number(off.fix_satisfaction),
                  }
                : {
                    id: `off-${u.id}`,
                    name: "UC Chairman",
                    slug: `chairman-${u.slug}`,
                    seatTitle: `Chairman, ${u.name}`,
                    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
                    party: "Independent",
                    officeContact: "021-34988712",
                    termStart: "2023-06-15",
                    termEnd: "2027-06-15",
                    isClaimed: false,
                    badges: [],
                    promisesKept: 0,
                    promisesTotal: 0,
                    eventsHeld: 0,
                    thankYouCount: 0,
                    fixSatisfaction: 4.0,
                  },
            };
          });
          setAllUCs(mappedUCs);
          setActiveUC((prev) => mappedUCs.find((u) => u.id === prev.id) || mappedUCs[0]);
        }

        // 3. Fetch Issues joined with Photos from Supabase
        const { data: dbIssues, error: issueErr } = await supabase
          .from("issues")
          .select("*, issue_photos(*)")
          .order("created_at", { ascending: false });

        if (!issueErr && dbIssues && dbIssues.length > 0) {
          const mappedIssues: Issue[] = dbIssues.map((row) => ({
            id: row.id,
            ucId: row.uc_id,
            ucName: row.uc_name,
            townId: row.town_id,
            townName: row.town_name,
            categoryId: row.category_id,
            categoryName: row.category_name,
            subCategory: row.sub_category,
            title: row.title,
            description: row.description,
            lat: Number(row.lat),
            lng: Number(row.lng),
            addressApprox: row.address_approx,
            gpsAccuracyMeters: Number(row.gps_accuracy_meters),
            severity: row.severity as "normal" | "dangerous",
            isAnonymous: row.is_anonymous,
            reporterName: row.reporter_name,
            reporterId: row.reporter_id,
            status: row.status as Issue["status"],
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            daysOpen: row.days_open,
            eligible: row.eligible,
            affectedCount: row.affected_count,
            weightedAffected: Number(row.weighted_affected),
            adoptedByType: row.adopted_by_type,
            adoptedById: row.adopted_by_id,
            adoptedByName: row.adopted_by_name,
            adoptedAt: row.adopted_at,
            targetDate: row.target_date,
            photos: (row.issue_photos || [])
              .filter((p: { kind: string }) => p.kind === "report")
              .map((p: { id: string; kind: "report"; url: string; captured_at: string; lat: number; lng: number; uploader_name?: string }) => ({
                id: p.id,
                kind: p.kind,
                url: p.url,
                capturedAt: p.captured_at,
                lat: Number(p.lat),
                lng: Number(p.lng),
                uploaderName: p.uploader_name,
              })),
            afterPhotos: (row.issue_photos || [])
              .filter((p: { kind: string }) => p.kind === "after")
              .map((p: { id: string; kind: "after"; url: string; captured_at: string; lat: number; lng: number; uploader_name?: string }) => ({
                id: p.id,
                kind: p.kind,
                url: p.url,
                capturedAt: p.captured_at,
                lat: Number(p.lat),
                lng: Number(p.lng),
                uploaderName: p.uploader_name,
              })),
            officialResponse: row.official_response,
            confirmationWindow: row.confirmation_window,
            jurisdictionFlag: row.jurisdiction_flag,
          }));

          setIssues(mappedIssues);
        }

        // 4. Fetch Events from Supabase
        const { data: dbEvents } = await supabase
          .from("events")
          .select("*")
          .order("created_at", { ascending: false });

        if (dbEvents && dbEvents.length > 0) {
          setEvents(
            dbEvents.map((ev) => ({
              id: ev.id,
              title: ev.title,
              type: ev.type,
              date: ev.date_str,
              time: ev.time_str,
              locationName: ev.location_name,
              ucId: ev.uc_id,
              ucName: ev.uc_name,
              organizerName: ev.organizer_name,
              organizerRole: ev.organizer_role,
              description: ev.description,
              rsvpCount: ev.rsvp_count,
              isUserRsvpd: false,
              isVerified: ev.is_verified,
              proofPhotos: ev.proof_photos || [],
            }))
          );
        }

        // 5. Fetch Promises from Supabase
        const { data: dbPromises } = await supabase
          .from("promises")
          .select("*")
          .order("created_at", { ascending: false });

        if (dbPromises && dbPromises.length > 0) {
          setPromises(
            dbPromises.map((pr) => ({
              id: pr.id,
              officialId: pr.official_id,
              officialName: pr.official_name,
              ucName: pr.uc_name,
              text: pr.text,
              source: pr.source,
              dateMade: pr.date_made,
              dueDate: pr.due_date,
              status: pr.status,
              proofPhoto: pr.proof_photo || undefined,
              ownerType: pr.owner_type || "official",
              ownerId: pr.owner_id || pr.official_id,
            }))
          );
        }

        // 6. Fetch Community Leaders from Supabase
        const { data: dbLeaders } = await supabase
          .from("community_leaders")
          .select("*")
          .order("score", { ascending: false });

        if (dbLeaders && dbLeaders.length > 0) {
          setCommunityLeaders(
            dbLeaders.map((lead, idx) => ({
              id: lead.id,
              userId: lead.user_id || `user-${lead.slug}`,
              ucId: lead.uc_id || "uc-gulshan-7",
              ucName: "UC-7 Gulshan (NIPA / Block 13)",
              townId: "town-gulshan",
              townName: "Gulshan Town",
              realName: lead.real_name,
              slug: lead.slug,
              photoUrl: lead.photo_url,
              bio: lead.bio || "",
              whyServe: lead.why_serve || "",
              party: lead.party || "Independent",
              plansToContest: (lead.plans_to_contest as "yes" | "no" | "prefer_not_to_say") || "yes",
              identityVerified: !!lead.identity_verified_at,
              identityVerifiedAt: lead.identity_verified_at || "",
              status: (lead.status as CommunityLeader["status"]) || "active",
              strikes: lead.strikes || 0,
              score: Number(lead.score) || 70,
              rankInUc: idx + 1,
              rankInTown: idx + 1,
              rankInCity: idx + 1,
              trend30d: 0,
              hasEnoughData: true,
              activeAdoptionsCount: 1,
              resolvedCountLifetime: 2,
              onTimeRate: 100,
              eventsCount: 1,
              pledgesKept: 2,
              pledgesTotal: 2,
              thankYouCount: 45,
              fixSatisfaction: 4.8,
              teamMembers: [],
            }))
          );
        }

        // 7. Fetch Audit Log from Supabase
        const { data: dbLogs } = await supabase
          .from("audit_log")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        if (dbLogs && dbLogs.length > 0) {
          setAuditLog(
            dbLogs.map((l) => ({
              id: l.id,
              date: l.date_str,
              actor: l.actor,
              action: l.action,
              affectedUcOrOfficial: l.affected_entity,
              reason: l.reason,
            }))
          );
        }
      } catch (err) {
        console.warn("Could not sync with Supabase, using local state cache:", err);
      }
    }

    loadFromSupabase();
  }, []);

  // Hydrate local cache on browser mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storedIssues = localStorage.getItem("karachi_civic_issues_v2");
      if (storedIssues) {
        const parsed = JSON.parse(storedIssues);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setIssues(parsed);
        }
      }
      const storedRole = localStorage.getItem("karachi_civic_role_v2");
      if (
        storedRole &&
        ["citizen", "official", "ngo", "community_leader", "admin", "visitor", "verified_resident"].includes(
          storedRole
        )
      ) {
        setActiveRole(storedRole as UserRole);
      }
      const storedUcId = localStorage.getItem("karachi_civic_uc_id_v2");
      if (storedUcId) {
        const found = allUCs.find((u) => u.id === storedUcId);
        if (found) setActiveUC(found);
      }
    } catch (e) {
      console.warn("Could not hydrate from localStorage:", e);
    } finally {
      setHasHydrated(true);
    }
  }, [allUCs]);

  // Persist issues on change
  useEffect(() => {
    if (!hasHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("karachi_civic_issues_v2", JSON.stringify(issues));
    } catch (e) {
      console.warn("Could not save issues to localStorage:", e);
    }
  }, [issues, hasHydrated]);

  // Persist active role on change
  useEffect(() => {
    if (!hasHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("karachi_civic_role_v2", activeRole);
    } catch (e) {
      console.warn("Could not save role to localStorage:", e);
    }
  }, [activeRole, hasHydrated]);

  // Persist active UC on change
  useEffect(() => {
    if (!hasHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("karachi_civic_uc_id_v2", activeUC.id);
    } catch (e) {
      console.warn("Could not save active UC to localStorage:", e);
    }
  }, [activeUC, hasHydrated]);

  const resetDemoData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("karachi_civic_issues_v2");
      localStorage.removeItem("karachi_civic_role_v2");
      localStorage.removeItem("karachi_civic_uc_id_v2");
    }
    setIssues(MOCK_ISSUES);
    setActiveRole("citizen");
    setActiveUC(MOCK_UCS[0]);
    setManagedUsers(MOCK_MANAGED_USERS);
    setOfficialVerificationClaims(MOCK_OFFICIAL_CLAIMS);
    setJurisdictionDisputes(MOCK_JURISDICTION_DISPUTES);
    showToast("Demo data reset to factory initial state!");
  };

  // Browser online/offline event listener (Section 11.6)
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOnline(navigator.onLine);
    const handleOnline = () => {
      setIsOnline(true);
      showToast("Connected: Real-time civic network online");
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast("Offline: Reports and confirmations queued locally");
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Deep linking URL hydration on mount (Section 11.0 Rule 12 & Section 12.2)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const issueParam = params.get("issue");
      const ucParam = params.get("uc");
      const officialParam = params.get("official");
      const leaderParam = params.get("leader");
      const tabParam = params.get("tab");

      if (issueParam) {
        const found = issues.find((i) => i.id.toLowerCase() === issueParam.toLowerCase());
        if (found) setSelectedIssue(found);
      }
      if (ucParam) {
        const foundUC = allUCs.find(
          (u) => u.id.toLowerCase() === ucParam.toLowerCase() || u.slug.toLowerCase() === ucParam.toLowerCase()
        );
        if (foundUC) setActiveUC(foundUC);
      }
      if (officialParam) {
        const foundOff = allUCs.map((u) => u.chairman).find(
          (c) => c.id.toLowerCase() === officialParam.toLowerCase() || c.slug.toLowerCase() === officialParam.toLowerCase()
        );
        if (foundOff) setSelectedOfficial(foundOff);
      }
      if (leaderParam) {
        const foundL = communityLeaders.find(
          (l) => l.id.toLowerCase() === leaderParam.toLowerCase() || l.slug.toLowerCase() === leaderParam.toLowerCase()
        );
        if (foundL) {
          setSelectedLeader(foundL);
          setIsLeaderProfileOpen(true);
        }
      }
      if (tabParam && ["my-uc", "map", "report", "rankings", "me"].includes(tabParam)) {
        setActiveTab(tabParam as NavTab);
      }
    } catch (e) {
      console.warn("Deep linking hydration error:", e);
    }
  }, [issues, allUCs, communityLeaders]);

  // URL search param sync when modal opens/closes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const url = new URL(window.location.href);
      if (selectedIssue) {
        url.searchParams.set("issue", selectedIssue.id);
      } else {
        url.searchParams.delete("issue");
      }
      if (selectedOfficial) {
        url.searchParams.set("official", selectedOfficial.id);
      } else {
        url.searchParams.delete("official");
      }
      window.history.replaceState(null, "", url.toString());
    } catch {
      // fallback safe
    }
  }, [selectedIssue, selectedOfficial]);

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

    // Persist to Supabase asynchronously
    recordAffectedVote(issueId, "user-101", 1.0);

    showToast("Count updated: You marked 'I am affected'", () => {
      toggleAffected(issueId);
    });
  };

  // Vote on confirmation window (Fixed vs Not Fixed, with Rating & Thank You - Section 11.9 W5)
  const voteConfirmation = (
    issueId: string,
    vote: "fixed" | "not_fixed",
    reason?: string,
    rating?: number,
    sayThanks?: boolean
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

    // Persist to Supabase RPC
    recordConfirmationVote(issueId, "user-101", vote, reason);

    if (vote === "fixed") {
      const thanksMsg = sayThanks ? " and sent a public Thank You!" : "";
      const ratingMsg = rating ? ` Rated ${rating}★` : "";
      showToast(`Confirmed!${ratingMsg}${thanksMsg} Thank you for holding officials accountable.`);
    } else {
      showToast(`Marked as Not Fixed (${reason || "unresolved"}). Sent back to official queue.`);
    }
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

    // Immediately update UC totals and score for Chairman & Official Dashboard
    setAllUCs((prev) =>
      prev.map((uc) => {
        if (uc.id === fullIssue.ucId) {
          const updatedTotal = uc.totalEligibleIssues + 1;
          const updatedScore = Math.max(
            0,
            Math.min(100, uc.score - (fullIssue.severity === "dangerous" ? 0.8 : 0.4))
          );
          return {
            ...uc,
            totalEligibleIssues: updatedTotal,
            score: Number(updatedScore.toFixed(1)),
          };
        }
        return uc;
      })
    );

    setActiveUC((current) => {
      if (current.id === fullIssue.ucId) {
        return {
          ...current,
          totalEligibleIssues: current.totalEligibleIssues + 1,
          score: Number(
            Math.max(
              0,
              Math.min(100, current.score - (fullIssue.severity === "dangerous" ? 0.8 : 0.4))
            ).toFixed(1)
          ),
        };
      }
      return current;
    });

    // Persist to Supabase asynchronously
    (async () => {
      try {
        // Insert issue into Supabase
        const { error: issueErr } = await supabase.from("issues").insert({
          id,
          uc_id: fullIssue.ucId,
          uc_name: fullIssue.ucName,
          town_id: fullIssue.townId,
          town_name: fullIssue.townName,
          category_id: fullIssue.categoryId,
          category_name: fullIssue.categoryName,
          sub_category: fullIssue.subCategory,
          title: fullIssue.title,
          description: fullIssue.description,
          lat: fullIssue.lat,
          lng: fullIssue.lng,
          address_approx: fullIssue.addressApprox,
          gps_accuracy_meters: fullIssue.gpsAccuracyMeters,
          severity: fullIssue.severity,
          is_anonymous: fullIssue.isAnonymous,
          reporter_name: fullIssue.reporterName,
          reporter_id: fullIssue.reporterId,
          status: "open",
          eligible: fullIssue.eligible,
          affected_count: 1,
          weighted_affected: 1.0,
        });

        if (issueErr) {
          console.error("Supabase issue insert error:", issueErr);
        }

        // Insert photos into Supabase
        if (fullIssue.photos.length > 0) {
          const photoInserts = fullIssue.photos.map((p, idx) => ({
            id: `p-${id}-${idx}-${Date.now()}`,
            issue_id: id,
            kind: "report",
            url: p.url,
            lat: fullIssue.lat,
            lng: fullIssue.lng,
            uploader_name: fullIssue.reporterName,
          }));
          await supabase.from("issue_photos").insert(photoInserts);
        }

        // Update UC stats in Supabase Postgres
        const targetUC = allUCs.find((u) => u.id === fullIssue.ucId);
        const newTotal = (targetUC?.totalEligibleIssues || 0) + 1;
        const newScore = Math.max(
          0,
          Math.min(100, (targetUC?.score || 50) - (fullIssue.severity === "dangerous" ? 0.8 : 0.4))
        );

        await supabase
          .from("ucs")
          .update({
            total_eligible_issues: newTotal,
            score: Number(newScore.toFixed(1)),
          })
          .eq("id", fullIssue.ucId);

        // Record public audit trail entry in Supabase
        await supabase.from("audit_log").insert({
          id: `log-${Date.now()}`,
          date_str: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          actor: fullIssue.reporterName,
          action: "Issue Reported",
          affected_entity: `${fullIssue.ucName} (${id})`,
          reason: `New ${fullIssue.severity} issue filed under ${fullIssue.categoryName}`,
        });
      } catch (err: unknown) {
        console.warn("Supabase issue insert warning:", err);
      }
    })();

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
    const respObj = {
      officialId: activeUC.chairman.id,
      officialName: activeUC.chairman.name,
      seatTitle: activeUC.chairman.seatTitle,
      respondedAt: new Date().toISOString(),
      message,
      statusUpdate,
    };

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            status: statusUpdate,
            officialResponse: respObj,
          };
        }
        return iss;
      })
    );

    // Persist to Supabase
    supabase
      .from("issues")
      .update({
        status: statusUpdate,
        official_response: respObj,
        updated_at: new Date().toISOString(),
      })
      .eq("id", issueId);

    showToast("Official response pinned to public issue record");
  };

  // Official Mark Resolved
  const officialMarkResolved = (
    issueId: string,
    afterPhotoUrl: string,
    note: string
  ) => {
    const respObj = {
      officialId: activeUC.chairman.id,
      officialName: activeUC.chairman.name,
      seatTitle: activeUC.chairman.seatTitle,
      respondedAt: new Date().toISOString(),
      message: note || "Work completed on site. Live after-photo uploaded for citizen verification.",
      statusUpdate: "marked_resolved" as const,
    };

    const confirmObj = {
      markedResolvedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      fixedVotes: 0,
      notFixedVotes: 0,
      userVoted: undefined,
    };

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
            officialResponse: respObj,
            confirmationWindow: confirmObj,
          };
        }
        return iss;
      })
    );

    // Persist to Supabase
    supabase
      .from("issues")
      .update({
        status: "marked_resolved",
        official_response: respObj,
        confirmation_window: confirmObj,
        updated_at: new Date().toISOString(),
      })
      .eq("id", issueId);

    // Automatically open Work Done sharing modal for Chairman to post on social platforms
    const targetIss = issues.find((i) => i.id === issueId);
    if (targetIss) {
      setWorkDoneShareIssue({
        ...targetIss,
        status: "marked_resolved",
        afterPhotos: [
          {
            id: `p-after-${Date.now()}`,
            kind: "after",
            url: afterPhotoUrl,
            capturedAt: new Date().toISOString(),
            lat: targetIss.lat,
            lng: targetIss.lng,
            uploaderName: `${activeUC.chairman.seatTitle} Inspection Team`,
          },
        ],
        officialResponse: respObj,
        confirmationWindow: confirmObj,
      });
    }

    supabase.from("issue_photos").insert({
      id: `p-after-${Date.now()}`,
      issue_id: issueId,
      kind: "after",
      url: afterPhotoUrl,
      lat: activeUC.lat,
      lng: activeUC.lng,
      uploader_name: `${activeUC.chairman.seatTitle} Inspection Team`,
    });

    showToast("Work marked resolved! 7-day citizen confirmation window opened.");
  };

  // Flag Jurisdiction
  const flagJurisdiction = (
    issueId: string,
    targetBody: string,
    reason: string
  ) => {
    const flagObj = {
      flaggedBy: activeUC.chairman.name,
      suggestedBody: targetBody,
      reason,
      rulingStatus: "pending" as const,
    };

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            status: "jurisdiction_flagged",
            jurisdictionFlag: flagObj,
          };
        }
        return iss;
      })
    );

    supabase
      .from("issues")
      .update({
        status: "jurisdiction_flagged",
        jurisdiction_flag: flagObj,
      })
      .eq("id", issueId);

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

  // Event Check-In (Workflow W8)
  const checkInEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          return {
            ...ev,
            isUserRsvpd: true,
            rsvpCount: ev.isUserRsvpd ? ev.rsvpCount : ev.rsvpCount + 1,
          };
        }
        return ev;
      })
    );
    showToast("✓ Checked in at event location! Verified attendance recorded.");
  };

  // UC Ideas Board Actions (Workflow W7)
  const upvoteIdea = (ideaId: string) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === ideaId) {
          const isCurrently = !!idea.userUpvoted;
          return {
            ...idea,
            userUpvoted: !isCurrently,
            upvotes: isCurrently ? idea.upvotes - 1 : idea.upvotes + 1,
          };
        }
        return idea;
      })
    );
    showToast("Idea upvote updated! Verified resident weight applied.");
  };

  const submitIdea = (data: { title: string; description: string; category: string }) => {
    const newIdea: UCIdea = {
      id: `idea-${Date.now()}`,
      ucId: activeUC.id,
      ucName: activeUC.name,
      title: data.title,
      description: data.description,
      category: data.category,
      authorName: "Zain Bawa",
      authorRole: "Verified Resident",
      upvotes: 1,
      userUpvoted: true,
      createdAt: new Date().toISOString(),
      status: "under_review",
      isInThinkTankPool: false,
    };
    setIdeas((prev) => [newIdea, ...prev]);
    showToast("Idea submitted to UC Ideas Board! Neighbors can now review and upvote.");
  };

  // Community Leader Actions (Spec Addendum 01)
  const adoptIssue = (
    issueId: string,
    adopterType: "leader" | "ngo",
    adopterId: string,
    adopterName: string,
    targetDays: number
  ): { success: boolean; message: string } => {
    const targetIssue = issues.find((i) => i.id === issueId);
    if (!targetIssue) {
      return { success: false, message: "Issue not found." };
    }

    // Anti-gaming rule 1: Issues reported by the leader cannot be adopted by that leader
    if (adopterType === "leader" && targetIssue.reporterId === adopterId) {
      return { success: false, message: "Anti-Gaming Rule: You cannot adopt an issue reported by yourself or your team." };
    }

    // Anti-gaming rule 2: Must be at least 7 days old
    if (targetIssue.daysOpen < 7) {
      return { success: false, message: `Issue must be at least 7 days old before community adoption (currently ${targetIssue.daysOpen} days).` };
    }

    // Anti-gaming rule 3: Cannot adopt if already adopted
    if (targetIssue.adoptedByType) {
      return { success: false, message: `Issue is already adopted by ${targetIssue.adoptedByName || "another entity"}.` };
    }

    // Anti-gaming rule 4: Adoption blocked if official marked in progress within last 14 days
    if (targetIssue.status === "in_progress" && targetIssue.daysOpen <= 14) {
      return { success: false, message: "Adoption blocked: An elected official is currently actively working on this issue." };
    }

    // Anti-gaming rule 5: Max 60 days target
    const clampedTargetDays = Math.min(Math.max(targetDays, 1), 60);
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + clampedTargetDays);
    const targetDateStr = targetDate.toISOString().split("T")[0];

    // Update Issue state
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            adoptedByType: adopterType,
            adoptedById: adopterId,
            adoptedByName: adopterName,
            adoptedAt: new Date().toISOString(),
            targetDate: targetDateStr,
            status: "in_progress",
          };
        }
        return iss;
      })
    );

    // Update leader adoption count if leader
    if (adopterType === "leader") {
      setCommunityLeaders((prev) =>
        prev.map((lead) =>
          lead.id === adopterId || lead.userId === adopterId
            ? { ...lead, activeAdoptionsCount: lead.activeAdoptionsCount + 1 }
            : lead
        )
      );
    }

    // Try syncing to Supabase in background
    supabase
      .from("issues")
      .update({
        adopted_by_type: adopterType,
        adopted_by_id: adopterId,
        adopted_by_name: adopterName,
        adopted_at: new Date().toISOString(),
        target_date: targetDateStr,
        status: "in_progress",
      })
      .eq("id", issueId)
      .then(() => {});

    showToast(`Issue ${issueId} successfully adopted! Committed target: ${targetDateStr}`);
    return { success: true, message: `Issue adopted with target date ${targetDateStr}.` };
  };

  const resolveAdoptedIssue = (
    issueId: string,
    afterPhotoUrl: string,
    note: string
  ): { success: boolean; message: string } => {
    const targetIssue = issues.find((i) => i.id === issueId);
    if (!targetIssue) {
      return { success: false, message: "Issue not found." };
    }

    const nowIso = new Date().toISOString();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            status: "marked_resolved",
            afterPhotos: [
              ...(iss.afterPhotos || []),
              {
                id: `p-after-lead-${Date.now()}`,
                kind: "after",
                url: afterPhotoUrl,
                capturedAt: nowIso,
                lat: iss.lat,
                lng: iss.lng,
                uploaderName: iss.adoptedByName || "Community Leader",
              },
            ],
            confirmationWindow: {
              markedResolvedAt: nowIso,
              expiresAt: expiry.toISOString(),
              fixedVotes: 1,
              notFixedVotes: 0,
            },
          };
        }
        return iss;
      })
    );

    if (targetIssue.adoptedById) {
      setCommunityLeaders((prev) =>
        prev.map((lead) =>
          lead.id === targetIssue.adoptedById || lead.userId === targetIssue.adoptedById
            ? {
                ...lead,
                activeAdoptionsCount: Math.max(0, lead.activeAdoptionsCount - 1),
                resolvedCountLifetime: lead.resolvedCountLifetime + 1,
              }
            : lead
        )
      );
    }

    showToast("Resolution submitted with after photo! 7-day citizen confirmation window opened.");
    return { success: true, message: "Resolution submitted for citizen confirmation." };
  };

  const applyBecomeLeader = (data: {
    realName: string;
    photoUrl: string;
    bio: string;
    whyServe: string;
    party: string;
    plansToContest: "yes" | "no" | "prefer_not_to_say";
    ucId: string;
  }) => {
    const ucObj = allUCs.find((u) => u.id === data.ucId) || activeUC;
    const newLeader: CommunityLeader = {
      id: `lead-${Date.now()}`,
      userId: `user-${Date.now()}`,
      ucId: ucObj.id,
      ucName: ucObj.name,
      townId: ucObj.townId,
      townName: ucObj.townName,
      realName: data.realName,
      slug: data.realName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      photoUrl: data.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&h=240&fit=crop&crop=face",
      bio: data.bio,
      whyServe: data.whyServe,
      party: data.party || "Independent",
      plansToContest: data.plansToContest,
      identityVerified: false,
      identityVerifiedAt: "",
      status: "pending",
      strikes: 0,
      score: 50.0,
      rankInUc: communityLeaders.filter((c) => c.ucId === ucObj.id).length + 1,
      rankInTown: 15,
      rankInCity: 100,
      trend30d: 0,
      hasEnoughData: false,
      activeAdoptionsCount: 0,
      resolvedCountLifetime: 0,
      onTimeRate: 100,
      eventsCount: 0,
      pledgesKept: 0,
      pledgesTotal: 0,
      thankYouCount: 0,
      fixSatisfaction: 0,
      teamMembers: [],
    };

    setCommunityLeaders((prev) => [newLeader, ...prev]);
    showToast("Community Leader application submitted! Video call identity check scheduled.");
  };

  const followLeader = (leaderId: string) => {
    const leader = communityLeaders.find((l) => l.id === leaderId);
    showToast(`Now following ${leader?.realName || "Community Leader"}. You'll receive updates on their adoptions & events!`);
  };

  const addCommentToIssue = (issueId: string, body: string, customAuthorName?: string) => {
    let author = customAuthorName || "Zain Bawa";
    let role = activeRole;
    let commentType: CommentRecord["type"] = "evidence";

    if (activeRole === "official") {
      author = `${activeUC.chairman.name} (UC Chairman)`;
      commentType = "official";
    } else if (activeRole === "ngo") {
      author = "Al-Khidmat & Edhi Disaster Relief Unit";
      commentType = "ngo";
    } else if (activeRole === "community_leader") {
      author = customAuthorName || "Tariq Aziz (Ward Leader)";
      commentType = "solution";
    } else if (activeRole === "admin") {
      author = "City Oversight SuperAdmin";
      commentType = "official";
    }

    const newComment: CommentRecord = {
      id: `comm-${Date.now()}`,
      issueId,
      userId: `user-${Date.now()}`,
      userName: author,
      userRole: role,
      type: commentType,
      body,
      createdAt: new Date().toISOString(),
    };

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            comments: [...(iss.comments || []), newComment],
          };
        }
        return iss;
      })
    );

    setSelectedIssue((prev) => {
      if (prev && prev.id === issueId) {
        return {
          ...prev,
          comments: [...(prev.comments || []), newComment],
        };
      }
      return prev;
    });

    showToast("Evidence note & comment published to issue record!");
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
        isPollsModalOpen,
        setIsPollsModalOpen,
        isNGOsModalOpen,
        setIsNGOsModalOpen,
        isBaithakPanelModalOpen,
        setIsBaithakPanelModalOpen,
        selectedEventForPanel,
        setSelectedEventForPanel,
        communityLeaders,
        selectedLeader,
        setSelectedLeader,
        isLeaderProfileOpen,
        setIsLeaderProfileOpen,
        isBecomeLeaderOpen,
        setIsBecomeLeaderOpen,
        isLeaderDashboardOpen,
        setIsLeaderDashboardOpen,
        ideas,
        isIdeasModalOpen,
        setIsIdeasModalOpen,
        isFindMyUCOpen,
        setIsFindMyUCOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        workDoneShareIssue,
        setWorkDoneShareIssue,
        openWorkDoneShare,
        toggleAffected,
        voteConfirmation,
        addNewIssue,
        addOfficialResponse,
        officialMarkResolved,
        flagJurisdiction,
        rsvpEvent,
        checkInEvent,
        votePoll,
        upvoteIdea,
        submitIdea,
        adoptIssue,
        resolveAdoptedIssue,
        applyBecomeLeader,
        followLeader,
        addCommentToIssue,
        toast,
        showToast,
        dismissToast,
        offlineQueueCount,
        selectedOfficial,
        setSelectedOfficial,
        isOnline,
        isNGODashboardOpen,
        setIsNGODashboardOpen,
        managedUsers,
        banUser,
        unbanUser,
        shadowbanUser,
        officialVerificationClaims,
        approveOfficialClaim,
        rejectOfficialClaim,
        approveLeaderApplicant,
        rejectLeaderApplicant,
        jurisdictionDisputes,
        resolveJurisdictionDispute,
        adoptNGOIssue,
        resolveNGOIssue,
        resetDemoData,
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
