"use client";

import React, { useState, useRef, useEffect } from "react";
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
  MapPin,
  Compass,
  Plus,
  Trash2,
  Globe,
  Navigation,
  Layers,
  Award,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Town, UC } from "@/types/civic";

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
    allTowns,
    allUCs,
    addNewTown,
    addNewUC,
    deleteUC,
    deleteTown,
    seedStandardKarachiTowns,
    issues,
    showToast,
  } = useCivic();

  const [activeSubTab, setActiveSubTab] = useState<
    "geography" | "moderation" | "officials" | "leaders" | "jurisdiction" | "audit" | "engine"
  >("geography");

  // Moderation state
  const [userSearch, setUserSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "flagged" | "banned" | "active">("all");
  const [banReasonInput, setBanReasonInput] = useState<{ [userId: string]: string }>({});
  const [activeBanUserId, setActiveBanUserId] = useState<string | null>(null);

  // Geography & Delimitations state
  const [geoFilter, setGeoFilter] = useState<"all" | "towns" | "ucs">("all");
  const [geoSearch, setGeoSearch] = useState("");
  const [isAddTownModalOpen, setIsAddTownModalOpen] = useState(false);
  const [isAddUCModalOpen, setIsAddUCModalOpen] = useState(false);

  // New Town Form state
  const [newTownName, setNewTownName] = useState("");
  const [newTownDistrict, setNewTownDistrict] = useState("East");
  const [newTownTotalUcs, setNewTownTotalUcs] = useState("12");
  const [newTownChairman, setNewTownChairman] = useState("");
  const [newTownParty, setNewTownParty] = useState("Independent");

  // New UC Form state
  const [newUCTownId, setNewUCTownId] = useState(allTowns[0]?.id || "");
  const [newUCNumber, setNewUCNumber] = useState("");
  const [newUCName, setNewUCName] = useState("");
  const [newUCNeighborhoods, setNewUCNeighborhoods] = useState("");
  const [newUCLat, setNewUCLat] = useState("24.8607");
  const [newUCLng, setNewUCLng] = useState("67.0011");
  const [newUCChairman, setNewUCChairman] = useState("");
  const [newUCParty, setNewUCParty] = useState("Independent");
  const [newUCOfficeContact, setNewUCOfficeContact] = useState("");

  const adminMapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminMapInstanceRef = useRef<any>(null);

  // Initialize interactive admin Leaflet map
  useEffect(() => {
    let isMounted = true;
    if (!isAdminConsoleOpen || activeSubTab !== "geography") return;

    const timer = setTimeout(async () => {
      if (!adminMapContainerRef.current) return;
      try {
        const L = (await import("leaflet")).default;
        if (!adminMapContainerRef.current) return;

        if (adminMapInstanceRef.current) {
          try {
            adminMapInstanceRef.current.remove();
          } catch (e) {
            console.warn("Leaflet remove error:", e);
          }
          adminMapInstanceRef.current = null;
        }

        // Essential Leaflet DOM guard: clear _leaflet_id so L.map never throws 'Map container is already initialized'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((adminMapContainerRef.current as any)?._leaflet_id) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (adminMapContainerRef.current as any)._leaflet_id = null;
        }

        const map = L.map(adminMapContainerRef.current, {
          center: [24.892, 67.075],
          zoom: 11,
          zoomControl: true,
          attributionControl: false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
          maxZoom: 19,
          subdomains: ["a", "b", "c"],
        }).addTo(map);

        allUCs.forEach((uc) => {
          if (!uc || typeof uc.lat !== "number" || typeof uc.lng !== "number") return;
          const marker = L.circleMarker([uc.lat, uc.lng], {
            radius: 8,
            fillColor: "#0f766e",
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
          }).addTo(map);

          marker.bindPopup(`
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; min-width: 170px; line-height: 1.4;">
              <strong style="color: #0f766e; font-size: 13px; display: block; margin-bottom: 2px;">${uc.name}</strong>
              <div style="color: #475569; font-size: 11px;">Town: <b>${uc.townName}</b></div>
              <div style="color: #1e293b;">Chairman: <b>${uc.chairman?.name || "Official"}</b></div>
              <div style="color: #64748b; font-size: 10px;">Party: ${uc.chairman?.party || "N/A"}</div>
              <div style="color: #059669; font-weight: bold; margin-top: 2px;">Score: ${uc.score}/100</div>
              <div style="color: #94a3b8; font-size: 9px; font-family: monospace; margin-top: 2px;">${uc.lat.toFixed(4)}, ${uc.lng.toFixed(4)}</div>
            </div>
          `);
        });

        if (isMounted) {
          adminMapInstanceRef.current = map;
        }
      } catch (err) {
        console.warn("Admin map init warning:", err);
      }
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (adminMapInstanceRef.current) {
        try {
          adminMapInstanceRef.current.remove();
        } catch (e) {
          console.warn("Cleanup map remove error:", e);
        }
        adminMapInstanceRef.current = null;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (adminMapContainerRef.current && (adminMapContainerRef.current as any)?._leaflet_id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (adminMapContainerRef.current as any)._leaflet_id = null;
      }
    };
  }, [isAdminConsoleOpen, activeSubTab, allUCs]);

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

  // Filter Towns & UCs
  const filteredTowns = allTowns.filter((t) => {
    if (!geoSearch) return true;
    const q = geoSearch.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.district.toLowerCase().includes(q) ||
      t.townChairmanName.toLowerCase().includes(q)
    );
  });

  const filteredUCs = allUCs.filter((u) => {
    if (!geoSearch) return true;
    const q = geoSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.townName.toLowerCase().includes(q) ||
      u.chairman.name.toLowerCase().includes(q) ||
      u.neighborhoods.some((n) => n.toLowerCase().includes(q))
    );
  });

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsAdminConsoleOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsAdminConsoleOpen]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAdminConsoleOpen(false);
      }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[94vh] cursor-default"
      >
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
            onClick={() => setActiveSubTab("geography")}
            className={`flex-shrink-0 px-4 py-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeSubTab === "geography"
                ? "border-teal-600 text-teal-700 dark:text-teal-400 bg-white dark:bg-slate-800/80 font-bold"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>Maps, Towns &amp; UCs Delimitations</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-[10px] font-bold">
              {allUCs.length} UCs
            </span>
          </button>

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
          {/* Executive Platform Health & Coverage Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60">
              <div className="text-[10px] uppercase font-bold text-teal-800 dark:text-teal-300">
                Registered Towns
              </div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>{allTowns.length} Towns</span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">25 Target</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60">
              <div className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300">
                Mapped UC Wards
              </div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>{allUCs.length} UCs</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">246 Target</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60">
              <div className="text-[10px] uppercase font-bold text-purple-800 dark:text-purple-300">
                Live Reports
              </div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>{issues.length} Issues</span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">Audited</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60">
              <div className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300">
                Integrity Alerts
              </div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span>{managedUsers.filter((u) => u.isFlaggedForBrigading).length} Flags</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Anti-Gaming</span>
              </div>
            </div>
          </div>

          {/* TAB 0: GEOGRAPHY & DELIMITATIONS (MAPS, TOWNS, UCS) */}
          {activeSubTab === "geography" && (
            <div className="space-y-4">
              {/* Header explanation & Actions */}
              <div className="p-3.5 rounded-xl bg-teal-50/90 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-xs text-teal-950 dark:text-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <Globe className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-teal-900 dark:text-teal-100">
                      Karachi Municipal Boundaries &amp; ECP Delimitation Registry
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                      Manage official Union Council seats, assign elected Chairmen, and provision new Towns across Karachi&apos;s 7 municipal districts.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setIsAddTownModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Town</span>
                  </button>
                  <button
                    onClick={() => {
                      if (allTowns.length === 0) {
                        showToast("Please register at least one Town first!");
                        return;
                      }
                      setNewUCTownId(allTowns[0].id);
                      setIsAddUCModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add UC Ward</span>
                  </button>
                  <button
                    onClick={seedStandardKarachiTowns}
                    className="px-2.5 py-1.5 rounded-lg border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-slate-700 text-xs font-semibold transition cursor-pointer"
                    title="Seed standard Karachi Towns like Saddar, Clifton, Malir, Keamari, Orangi"
                  >
                    Seed Standard Towns
                  </button>
                </div>
              </div>

              {/* Interactive Delimitation Map Preview */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 shadow-md">
                <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-2 font-bold text-teal-400">
                    <Navigation className="w-4 h-4" />
                    <span>Live Karachi Delimitation Map</span>
                    <span className="text-[10px] bg-teal-950 text-teal-300 px-1.5 py-0.5 rounded border border-teal-800">
                      {allUCs.length} Points Mapped
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    Click any marker to inspect UC details &amp; Chairman
                  </span>
                </div>
                <div className="relative w-full h-56 sm:h-72">
                  <div ref={adminMapContainerRef} className="w-full h-full z-0" />
                </div>
              </div>

              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-2 items-center justify-between pt-1">
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search Towns, UCs, neighborhoods, or chairmen..."
                    value={geoSearch}
                    onChange={(e) => setGeoSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="flex gap-1.5 w-full sm:w-auto">
                  <button
                    onClick={() => setGeoFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      geoFilter === "all"
                        ? "bg-teal-700 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    All ({allTowns.length + allUCs.length})
                  </button>
                  <button
                    onClick={() => setGeoFilter("towns")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      geoFilter === "towns"
                        ? "bg-teal-700 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    Towns ({allTowns.length})
                  </button>
                  <button
                    onClick={() => setGeoFilter("ucs")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      geoFilter === "ucs"
                        ? "bg-teal-700 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    UC Wards ({allUCs.length})
                  </button>
                </div>
              </div>

              {/* Towns Section */}
              {(geoFilter === "all" || geoFilter === "towns") && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-teal-600" />
                      <span>Registered Municipal Towns ({filteredTowns.length})</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Local Government Councils</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {filteredTowns.map((town) => (
                      <div
                        key={town.id}
                        className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 hover:border-teal-500/50 transition shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                                {town.name}
                              </h4>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                District {town.district}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Town Chairman: <strong className="text-slate-800 dark:text-slate-200">{town.townChairmanName}</strong> ({town.townChairmanParty})
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove ${town.name} from the platform?`)) {
                                deleteTown(town.id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer transition"
                            title="Remove Town"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-500">
                          <span>Capacity: <strong>{town.totalUcs} UCs</strong></span>
                          <span>Score: <strong className="text-emerald-600 font-bold">{town.teamScore}/100</strong> (Rank #{town.rank})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* UC Wards Section */}
              {(geoFilter === "all" || geoFilter === "ucs") && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>Registered UC Wards ({filteredUCs.length})</span>
                    </span>
                    <span className="text-[10px] text-slate-400">ECP Delimitated Constituencies</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {filteredUCs.map((uc) => (
                      <div
                        key={uc.id}
                        className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 hover:border-emerald-500/50 transition shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] flex items-center justify-center">
                                #{uc.number}
                              </span>
                              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                                {uc.name}
                              </h4>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {uc.townName} · Chairman: <strong className="text-slate-700 dark:text-slate-300">{uc.chairman.name}</strong> ({uc.chairman.party})
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove ${uc.name}?`)) {
                                deleteUC(uc.id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer transition"
                            title="Remove UC"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Neighborhoods tags */}
                        <div className="flex flex-wrap gap-1">
                          {uc.neighborhoods.slice(0, 3).map((nh, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                            >
                              {nh}
                            </span>
                          ))}
                          {uc.neighborhoods.length > 3 && (
                            <span className="text-[9px] text-slate-400">
                              +{uc.neighborhoods.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-400 font-mono">
                          <span>GPS: {uc.lat.toFixed(4)}, {uc.lng.toFixed(4)}</span>
                          <span className="font-sans font-bold text-emerald-600">{uc.score} Score</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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

        {/* ================= ADD NEW TOWN MODAL ================= */}
        {isAddTownModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-3 animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <span>Add Municipal Town Delimitation</span>
                </h3>
                <button
                  onClick={() => setIsAddTownModalOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newTownName.trim()) {
                    showToast("Please enter a Town Name!");
                    return;
                  }
                  addNewTown({
                    name: newTownName.trim(),
                    district: newTownDistrict,
                    totalUcs: Number(newTownTotalUcs) || 10,
                    townChairmanName: newTownChairman.trim() || "Elected Chairman",
                    townChairmanParty: newTownParty.trim() || "Independent",
                  });
                  setNewTownName("");
                  setNewTownChairman("");
                  setIsAddTownModalOpen(false);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Town Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saddar Town, Malir Town, Clifton Zone"
                    value={newTownName}
                    onChange={(e) => setNewTownName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      District
                    </label>
                    <select
                      value={newTownDistrict}
                      onChange={(e) => setNewTownDistrict(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
                    >
                      <option value="East">District East</option>
                      <option value="South">District South</option>
                      <option value="Central">District Central</option>
                      <option value="West">District West</option>
                      <option value="Korangi">District Korangi</option>
                      <option value="Malir">District Malir</option>
                      <option value="Keamari">District Keamari</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Total Expected UCs
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={newTownTotalUcs}
                      onChange={(e) => setNewTownTotalUcs(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Town Chairman Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Syed Rehan Ali"
                    value={newTownChairman}
                    onChange={(e) => setNewTownChairman(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Political Party
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. JI, PPP, MQM-P, Independent"
                    value={newTownParty}
                    onChange={(e) => setNewTownParty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddTownModalOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold cursor-pointer transition shadow-xs"
                  >
                    Register Town
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= ADD NEW UC MODAL ================= */}
        {isAddUCModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-3 overflow-y-auto animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 my-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Register Union Council (UC) Ward</span>
                </h3>
                <button
                  onClick={() => setIsAddUCModalOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newUCName.trim() || !newUCNumber) {
                    showToast("Please specify UC Number and Name!");
                    return;
                  }
                  const neighborhoodsArr = newUCNeighborhoods
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);

                  addNewUC({
                    townId: newUCTownId || allTowns[0]?.id || "town-gulshan",
                    number: Number(newUCNumber),
                    name: newUCName.trim(),
                    neighborhoods: neighborhoodsArr.length > 0 ? neighborhoodsArr : ["Main Ward Area"],
                    lat: Number(newUCLat) || 24.8607,
                    lng: Number(newUCLng) || 67.0011,
                    chairmanName: newUCChairman.trim() || `Chairman UC-${newUCNumber}`,
                    party: newUCParty.trim() || "Independent",
                    officeContact: newUCOfficeContact.trim() || `Secretariat Office, UC-${newUCNumber}`,
                  });

                  setNewUCNumber("");
                  setNewUCName("");
                  setNewUCNeighborhoods("");
                  setNewUCChairman("");
                  setIsAddUCModalOpen(false);
                }}
                className="space-y-3 text-xs"
              >
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Town *
                    </label>
                    <select
                      value={newUCTownId}
                      onChange={(e) => setNewUCTownId(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
                    >
                      {allTowns.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      UC Number *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="246"
                      required
                      placeholder="e.g. 14"
                      value={newUCNumber}
                      onChange={(e) => setNewUCNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    UC Name &amp; Description *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UC-14 Gulzar-e-Hijri (Saadi Town / Scheme 33)"
                    value={newUCName}
                    onChange={(e) => setNewUCName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Neighborhoods / Mohallas (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Block 4, Saadi Town, Chapal Sun City"
                    value={newUCNeighborhoods}
                    onChange={(e) => setNewUCNeighborhoods(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      GPS Coordinates (Lat, Lng)
                    </label>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">Presets:</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {[
                      { name: "Saddar", lat: "24.8560", lng: "67.0180" },
                      { name: "Clifton", lat: "24.8140", lng: "67.0330" },
                      { name: "Gulshan", lat: "24.9180", lng: "67.0970" },
                      { name: "Nazimabad", lat: "24.9150", lng: "67.0330" },
                      { name: "Korangi", lat: "24.8320", lng: "67.1260" },
                      { name: "Malir", lat: "24.8930", lng: "67.1950" },
                    ].map((preset) => (
                      <button
                        type="button"
                        key={preset.name}
                        onClick={() => {
                          setNewUCLat(preset.lat);
                          setNewUCLng(preset.lng);
                        }}
                        className="px-1.5 py-0.5 rounded text-[9px] bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Latitude (e.g. 24.9180)"
                      value={newUCLat}
                      onChange={(e) => setNewUCLat(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                    <input
                      type="text"
                      placeholder="Longitude (e.g. 67.0970)"
                      value={newUCLng}
                      onChange={(e) => setNewUCLng(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Chairman Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tariq Mehmood"
                      value={newUCChairman}
                      onChange={(e) => setNewUCChairman(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Party
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. JI, PPP, Independent"
                      value={newUCParty}
                      onChange={(e) => setNewUCParty(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Secretariat / Office Contact
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 021-34988712 · Block 4 Main Office"
                    value={newUCOfficeContact}
                    onChange={(e) => setNewUCOfficeContact(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddUCModalOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold cursor-pointer transition shadow-xs"
                  >
                    Register &amp; Map UC
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
