"use client";

import React, { useState } from "react";
import { useCivic } from "@/context/CivicContext";
import {
  X,
  Shield,
  History,
  CheckCircle,
  Database,
  Ban,
  UserCheck,
  AlertTriangle,
  AlertCircle,
  Search,
  Check,
  RefreshCw,
  Scale,
  Building2,
  UserX,
  ExternalLink,
  Filter,
} from "lucide-react";

export const AdminConsoleModal: React.FC = () => {
  const {
    isAdminConsoleOpen,
    setIsAdminConsoleOpen,
    auditLog,
    managedUsers,
    banUser,
    unbanUser,
    shadowbanUser,
    officialVerificationClaims,
    approveOfficialClaim,
    rejectOfficialClaim,
    communityLeaders,
    approveLeaderApplicant,
    rejectLeaderApplicant,
    jurisdictionDisputes,
    resolveJurisdictionDispute,
    showToast,
  } = useCivic();

  const [activeSubTab, setActiveSubTab] = useState<
    "moderation" | "officials" | "leaders" | "jurisdiction" | "audit" | "engine"
  >("moderation");

  // Moderation state
  const [userSearch, setUserSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "flagged" | "banned" | "active">("all");
  const [banReasonInput, setBanReasonInput] = useState<{ [userId: string]: string }>({});
  const [activeBanUserId, setActiveBanUserId] = useState<string | null>(null);

  if (!isAdminConsoleOpen) return null;

  // Filter managed users
  const filteredUsers = managedUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phoneMasked.includes(userSearch) ||
      u.ucName.toLowerCase().includes(userSearch.toLowerCase());
    if (!matchesSearch) return false;

    if (statusFilter === "flagged") return u.isFlaggedForBrigading;
    if (statusFilter === "banned") return u.status === "banned" || u.status === "shadowbanned";
    if (statusFilter === "active") return u.status === "active";
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-950 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Karachi Civic Admin &amp; Governance Terminal</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-900/60 text-purple-300 border border-purple-700/50">
                  SUPERADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400">Section 14: User Moderation, ECP Official Verification &amp; Cryptographic Audit</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminConsoleOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveSubTab("moderation")}
            className={`flex-shrink-0 px-4 py-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeSubTab === "moderation"
                ? "border-purple-600 text-purple-700 dark:text-purple-400 bg-white dark:bg-slate-800/80"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            <span>User Moderation &amp; Banning</span>
            {managedUsers.filter((u) => u.isFlaggedForBrigading).length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {managedUsers.filter((u) => u.isFlaggedForBrigading).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab("officials")}
            className={`flex-shrink-0 px-4 py-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeSubTab === "officials"
                ? "border-purple-600 text-purple-700 dark:text-purple-400 bg-white dark:bg-slate-800/80"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Official Verifications (ECP)</span>
            {officialVerificationClaims.filter((c) => c.status === "pending").length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {officialVerificationClaims.filter((c) => c.status === "pending").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab("leaders")}
            className={`flex-shrink-0 px-4 py-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeSubTab === "leaders"
                ? "border-purple-600 text-purple-700 dark:text-purple-400 bg-white dark:bg-slate-800/80"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Leader Applicant Vetting</span>
            {communityLeaders.filter((l) => l.status === "pending").length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-500 text-white text-[10px] font-bold">
                {communityLeaders.filter((l) => l.status === "pending").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab("jurisdiction")}
            className={`flex-shrink-0 px-4 py-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeSubTab === "jurisdiction"
                ? "border-purple-600 text-purple-700 dark:text-purple-400 bg-white dark:bg-slate-800/80"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Jurisdiction Arbitration</span>
            {jurisdictionDisputes.filter((d) => d.status === "pending").length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-purple-500 text-white text-[10px] font-bold">
                {jurisdictionDisputes.filter((d) => d.status === "pending").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab("audit")}
            className={`flex-shrink-0 px-4 py-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeSubTab === "audit"
                ? "border-purple-600 text-purple-700 dark:text-purple-400 bg-white dark:bg-slate-800/80"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Public Audit Ledger</span>
          </button>

          <button
            onClick={() => setActiveSubTab("engine")}
            className={`flex-shrink-0 px-4 py-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeSubTab === "engine"
                ? "border-purple-600 text-purple-700 dark:text-purple-400 bg-white dark:bg-slate-800/80"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>PostGIS Engine (pg_cron)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: USER MODERATION & BANNING */}
          {activeSubTab === "moderation" && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Anti-Brigading &amp; Platform Integrity Engine</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Suspicious vote spikes (e.g. 5x abnormal upvotes within 10 minutes) trigger automatic brigading alerts. Admins can ban offending accounts or apply silent shadowbans (vote weight reduced to 0.0) to prevent UC score distortion.
                  </p>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, or UC..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto">
                  {(["all", "flagged", "banned", "active"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                        statusFilter === filter
                          ? "bg-purple-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* User List */}
              <div className="space-y-2.5">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No users matching selected moderation filter.
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-3.5 rounded-xl border transition space-y-2.5 ${
                        user.status === "banned"
                          ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60"
                          : user.status === "shadowbanned"
                          ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60"
                          : user.isFlaggedForBrigading
                          ? "bg-orange-50/50 dark:bg-orange-950/20 border-orange-300 dark:border-orange-800/60"
                          : "bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                            {user.name[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                                {user.name}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {user.phoneMasked}
                              </span>
                              {user.status === "banned" && (
                                <span className="px-1.5 py-0.5 rounded-sm text-[10px] font-bold bg-rose-600 text-white">
                                  BANNED
                                </span>
                              )}
                              {user.status === "shadowbanned" && (
                                <span className="px-1.5 py-0.5 rounded-sm text-[10px] font-bold bg-amber-600 text-white">
                                  SHADOWBANNED (0.0 WEIGHT)
                                </span>
                              )}
                              {user.isFlaggedForBrigading && (
                                <span className="px-1.5 py-0.5 rounded-sm text-[10px] font-bold bg-orange-600 text-white flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  BRIGADING DETECTED
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              UC: <span className="font-medium text-slate-700 dark:text-slate-300">{user.ucName}</span> • Reputation: <span className="font-mono font-semibold text-purple-600">{user.reputationScore}</span> • Reports: {user.reportsCount}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                          {user.status === "active" ? (
                            <>
                              <button
                                onClick={() => shadowbanUser(user.id)}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-200 transition cursor-pointer"
                                title="Set vote weight to 0.0 silently"
                              >
                                Shadowban
                              </button>
                              <button
                                onClick={() => setActiveBanUserId(activeBanUserId === user.id ? null : user.id)}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer flex items-center gap-1"
                              >
                                <Ban className="w-3 h-3" />
                                Ban
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => unbanUser(user.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Restore Active
                            </button>
                          )}
                        </div>
                      </div>

                      {user.banReason && (
                        <div className="text-[11px] text-rose-700 dark:text-rose-300 bg-rose-100/60 dark:bg-rose-950/50 p-2 rounded-lg">
                          <strong>Moderation Reason:</strong> {user.banReason}
                        </div>
                      )}

                      {/* Interactive Ban Reason Drawer */}
                      {activeBanUserId === user.id && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter reason for suspension (e.g. WhatsApp spam bot, fake GPS)..."
                            value={banReasonInput[user.id] || ""}
                            onChange={(e) =>
                              setBanReasonInput({ ...banReasonInput, [user.id]: e.target.value })
                            }
                            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                          />
                          <button
                            onClick={() => {
                              banUser(user.id, banReasonInput[user.id] || "Administrative suspension");
                              setActiveBanUserId(null);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-700 text-white hover:bg-rose-800 transition cursor-pointer shrink-0"
                          >
                            Confirm Ban
                          </button>
                          <button
                            onClick={() => setActiveBanUserId(null)}
                            className="px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: OFFICIALS VERIFICATION */}
          {activeSubTab === "officials" && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Official Seat Claims &amp; ECP Verification</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Review official appointment claims submitted by elected UC Chairmen and Councilors against official Sindh Local Government Gazette notifications. Approved officials receive the verified checkmark badge and workbench authority.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {officialVerificationClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {claim.officialName}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                            {claim.seatTitle}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              claim.status === "approved"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : claim.status === "rejected"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            }`}
                          >
                            {claim.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {claim.ucName} • Submitted {new Date(claim.submittedAt).toLocaleDateString()}
                        </p>
                      </div>

                      {claim.status === "pending" && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => approveOfficialClaim(claim.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve &amp; Issue Badge
                          </button>
                          <button
                            onClick={() => rejectOfficialClaim(claim.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg">
                      <div>
                        <span className="text-slate-400">CNIC:</span>{" "}
                        <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{claim.cnicMasked}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Contact:</span>{" "}
                        <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{claim.phoneMasked}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-400">Verification Document:</span>{" "}
                        <span className="font-medium text-purple-700 dark:text-purple-300">{claim.documentUrl}</span>
                      </div>
                      <div className="sm:col-span-2 border-t border-slate-200 dark:border-slate-700 pt-1.5">
                        <span className="text-slate-400">Appointment Gazette Citation:</span>{" "}
                        <span className="font-semibold text-purple-700 dark:text-purple-400">
                          {claim.appointmentGazetteNotice || "Verified Official Notification"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LEADER APPLICANT VETTING */}
          {activeSubTab === "leaders" && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Community Leader Applicant Vetting</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Review citizens stepping up to adopt civic issues and contest in the 2027 local government elections. Verify video identity checks and grant certified Community Leader badges.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {communityLeaders.map((leader) => (
                  <div
                    key={leader.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={leader.photoUrl}
                          alt={leader.realName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                              {leader.realName}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">
                              {leader.party}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                leader.status === "active"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : leader.status === "pending"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                  : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                              }`}
                            >
                              {leader.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {leader.ucName}, {leader.townName} • Contesting 2027:{" "}
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {leader.plansToContest.toUpperCase()}
                            </span>
                          </p>
                        </div>
                      </div>

                      {leader.status === "pending" && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => approveLeaderApplicant(leader.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition cursor-pointer flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Verify &amp; Approve
                          </button>
                          <button
                            onClick={() => rejectLeaderApplicant(leader.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                      <p className="text-slate-600 dark:text-slate-300 italic">
                        &quot;{leader.bio}&quot;
                      </p>
                      <p className="text-[11px] text-slate-500">
                        <strong>Why Serve:</strong> {leader.whyServe}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: JURISDICTION ARBITRATION */}
          {activeSubTab === "jurisdiction" && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <Scale className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Inter-Agency Jurisdiction Arbitration Panel</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    When an issue pertains to provincial utilities (KWSC 48&quot; bulk mains, SSWMB mega dumping, K-Electric transformers, or Cantonment Boards), UC Chairmen can flag it for reassignment. If approved, the issue is shifted out of the UC municipal scoring backlog.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {jurisdictionDisputes.map((disp) => (
                  <div
                    key={disp.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {disp.issueTitle}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300">
                            Target: {disp.claimedTargetBody}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              disp.status === "approved"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : disp.status === "rejected"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            }`}
                          >
                            {disp.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {disp.currentUcName} • Flagged by {disp.flaggedByOfficialName} ({new Date(disp.flaggedAt).toLocaleDateString()})
                        </p>
                      </div>

                      {disp.status === "pending" && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => resolveJurisdictionDispute(disp.id, "transfer")}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition cursor-pointer flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Transfer &amp; Exempt UC
                          </button>
                          <button
                            onClick={() => resolveJurisdictionDispute(disp.id, "keep")}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition cursor-pointer"
                          >
                            Keep in UC
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                      <p className="text-slate-400 font-semibold">Official Justification:</p>
                      <p className="text-slate-700 dark:text-slate-300">{disp.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PUBLIC AUDIT LEDGER */}
          {activeSubTab === "audit" && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-200 flex items-center gap-2">
                <History className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  Every administrative action affecting UC scores, user statuses, or official claims is permanently cryptographically published.
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
                      Target: <span className="font-semibold text-purple-600">{log.affectedUcOrOfficial}</span> • Actor: <span className="font-mono text-slate-500">{log.actor}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                      {log.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: POSTGIS ENGINE */}
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
                onClick={() => showToast("Triggered manual test run of recalculate_all_uc_scores() across 246 UCs")}
                className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold cursor-pointer transition shadow-xs flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Run Manual Test Cycle (Simulate 6h PostGIS Recalculation)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
