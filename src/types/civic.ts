export type IssueStatus =
  | "open"
  | "acknowledged"
  | "in_progress"
  | "marked_resolved"
  | "confirmed"
  | "reopened"
  | "community_resolved"
  | "jurisdiction_flagged"
  | "not_scored";

export type UserRole =
  | "visitor"
  | "citizen"
  | "verified_resident"
  | "official"
  | "community_leader"
  | "ngo"
  | "think_tank"
  | "admin";

export type ResponsibleLevel = "uc" | "town" | "city" | "utility" | "other";

export type Language = "en" | "ur_roman" | "ur";

export interface Category {
  id: string;
  name: {
    en: string;
    ur_roman: string;
    ur: string;
  };
  iconName: string;
  responsibleLevel: ResponsibleLevel;
  responsibleBodyDefault: string;
  scoredInMVP: boolean;
  color: string;
  bgTint: string;
}

export interface Town {
  id: string;
  name: string;
  slug: string;
  district: string;
  totalUcs: number;
  teamScore: number;
  rank: number;
  townChairmanName: string;
  townChairmanPhoto: string;
  townChairmanParty: string;
}

export interface UC {
  id: string;
  townId: string;
  townName: string;
  number: number;
  name: string;
  slug: string;
  neighborhoods: string[];
  lat: number;
  lng: number;
  chairman: Official;
  viceChairman?: Official;
  score: number;
  cityRank: number;
  townRank: number;
  trend30d: number; // positive = improved, negative = dropped
  totalEligibleIssues: number;
  resolvedIssues: number;
  oldestOpenDays: number;
  hasEnoughData: boolean;
}

export interface Official {
  id: string;
  name: string;
  slug: string;
  seatTitle: string; // e.g. "Chairman UC-7 Gulshan"
  photo: string;
  party: string;
  officeContact: string;
  termStart: string;
  termEnd: string;
  isClaimed: boolean;
  badges: string[];
  promisesKept: number;
  promisesTotal: number;
  eventsHeld: number;
  thankYouCount: number;
  fixSatisfaction: number; // 1-5 scale
}

export interface IssuePhoto {
  id: string;
  kind: "report" | "evidence" | "after";
  url: string;
  capturedAt: string;
  lat: number;
  lng: number;
  uploaderName?: string;
}

export interface Issue {
  id: string; // e.g. "K-10492"
  ucId: string;
  ucName: string;
  townId: string;
  townName: string;
  categoryId: string;
  categoryName: string;
  subCategory?: string;
  title: string;
  description?: string;
  lat: number;
  lng: number;
  addressApprox: string;
  gpsAccuracyMeters: number;
  severity: "normal" | "dangerous";
  isAnonymous: boolean;
  reporterName: string;
  reporterId: string;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
  daysOpen: number;
  eligible: boolean;
  affectedCount: number;
  weightedAffected: number;
  isUserAffected?: boolean;
  photos: IssuePhoto[];
  afterPhotos?: IssuePhoto[];
  officialResponse?: {
    officialId: string;
    officialName: string;
    seatTitle: string;
    respondedAt: string;
    message: string;
    statusUpdate: IssueStatus;
  };
  ngoAdoption?: {
    ngoId: string;
    ngoName: string;
    adoptedAt: string;
    targetDate: string;
  };
  adoptedByType?: "ngo" | "leader";
  adoptedById?: string;
  adoptedByName?: string;
  adoptedAt?: string;
  targetDate?: string;
  leaderResponse?: {
    leaderId: string;
    leaderName: string;
    respondedAt: string;
    message: string;
  };
  jurisdictionFlag?: {
    flaggedBy: string;
    suggestedBody: string;
    reason: string;
    rulingStatus: "pending" | "accepted" | "rejected";
  };
  confirmationWindow?: {
    markedResolvedAt: string;
    expiresAt: string;
    fixedVotes: number;
    notFixedVotes: number;
    userVoted?: "fixed" | "not_fixed";
  };
  comments?: CommentRecord[];
}

export interface CommentRecord {
  id: string;
  issueId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  type: "evidence" | "info" | "solution" | "official" | "ngo";
  body: string;
  photoUrl?: string;
  createdAt: string;
}

export interface CivicEvent {
  id: string;
  title: string;
  type: "community_action" | "uc_baithak" | "town_hall" | "online_session" | "camp";
  date: string;
  time: string;
  locationName: string;
  lat?: number;
  lng?: number;
  ucId: string;
  ucName: string;
  organizerName: string;
  organizerRole: string;
  description: string;
  rsvpCount: number;
  isUserRsvpd?: boolean;
  isVerified: boolean;
  proofPhotos?: string[];
}

export interface PromiseRecord {
  id: string;
  officialId: string;
  officialName: string;
  ucName: string;
  text: string;
  source: string;
  dateMade: string;
  dueDate: string;
  status: "pending" | "kept" | "broken";
  proofPhoto?: string;
  ownerType?: "official" | "leader";
  ownerId?: string;
  ownerName?: string;
}

export interface CommunityLeader {
  id: string;
  userId: string;
  ucId: string;
  ucName: string;
  townId: string;
  townName: string;
  realName: string;
  slug: string;
  photoUrl: string;
  bio: string;
  whyServe: string;
  party: string;
  plansToContest: "yes" | "no" | "prefer_not_to_say";
  identityVerified: boolean;
  identityVerifiedAt: string;
  status: "pending" | "active" | "suspended" | "removed";
  strikes: number;
  score: number;
  rankInUc: number;
  rankInTown: number;
  rankInCity: number;
  trend30d: number;
  hasEnoughData: boolean;
  activeAdoptionsCount: number;
  resolvedCountLifetime: number;
  onTimeRate: number;
  eventsCount: number;
  pledgesKept: number;
  pledgesTotal: number;
  thankYouCount: number;
  fixSatisfaction: number;
  teamMembers: { id: string; name: string; role: string }[];
  isFrozenForElection?: boolean;
}

export interface PollRecord {
  id: string;
  ucId: string;
  ucName: string;
  title: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
  closesAt: string;
  isClosed: boolean;
  userVotedOptionId?: string;
}

export interface ScoreBreakdown {
  resolutionRateScore: number; // 35%
  speedScore: number;          // 20%
  responsivenessScore: number; // 15%
  reliabilityScore: number;    // 10%
  backlogScore: number;        // 10%
  engagementScore: number;     // 10%
  rawScore: number;
  smoothedScore: number;
  cityMean: number;
  kFactor: number;
  eligibleCount: number;
}

export interface AuditLogEntry {
  id: string;
  date: string;
  actor: string;
  action: string;
  affectedUcOrOfficial: string;
  reason: string;
}

export interface NGO {
  id: string;
  name: string;
  slug: string;
  logo: string;
  registrationNumber: string;
  focusCategories: string[];
  activeTowns: string[];
  contactPhone: string;
  contactEmail: string;
  verifiedBadge: boolean;
  adoptedIssuesCount: number;
  resolvedIssuesCount: number;
  onTimeRate: number; // e.g. 92%
  citizenThankYous: number;
  impactRank: number;
}

export interface PanelApplication {
  id: string;
  eventId: string;
  eventTitle: string;
  userName: string;
  connectionRole: "resident" | "affected" | "expert" | "ngo";
  solutionText: string;
  contactPhone: string;
  submittedAt: string;
  status: "submitted" | "shortlisted" | "confirmed";
}

export interface UCIdea {
  id: string;
  ucId: string;
  ucName: string;
  title: string;
  description: string;
  category: string;
  authorName: string;
  authorRole: string;
  upvotes: number;
  userUpvoted?: boolean;
  createdAt: string;
  status: "under_review" | "planned" | "not_possible" | "done";
  officialReply?: {
    officialName: string;
    seatTitle: string;
    message: string;
    repliedAt: string;
  };
  isInThinkTankPool?: boolean;
}

export interface ManagedUser {
  id: string;
  name: string;
  phoneMasked: string;
  ucName: string;
  reputationScore: number;
  reportsCount: number;
  status: "active" | "banned" | "shadowbanned";
  banReason?: string;
  joinedAt: string;
  isFlaggedForBrigading?: boolean;
}

export interface OfficialVerificationClaim {
  id: string;
  officialId: string;
  officialName: string;
  seatTitle: string;
  ucId: string;
  ucName: string;
  cnicMasked: string;
  phoneMasked: string;
  documentUrl: string;
  appointmentGazetteNotice?: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface JurisdictionDispute {
  id: string;
  issueId: string;
  issueTitle: string;
  currentUcId: string;
  currentUcName: string;
  flaggedByOfficialName: string;
  claimedTargetBody: string; // e.g. "KWSC (Water & Sewerage)", "SSWMB"
  reason: string;
  flaggedAt: string;
  status: "pending" | "approved" | "rejected";
}

