"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useCivic } from "@/context/CivicContext";
import { CIVIC_CATEGORIES } from "@/config/categories";
import { Issue } from "@/types/civic";
import { StatusPill } from "../StatusPill";
import {
  Layers,
  Crosshair,
  Compass,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  CloudRain,
  MapPin,
  ArrowRight,
  X,
  Sparkles,
  CheckCircle2,
  Clock,
  Users,
} from "lucide-react";

type MapStyle = "humanitarian" | "standard" | "satellite";

const MAP_STYLES: Record<
  MapStyle,
  { name: string; url: string; subdomains?: string[]; attribution: string; maxZoom: number }
> = {
  humanitarian: {
    name: "Civic Day",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    subdomains: ["a", "b", "c"],
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles by <a href="https://www.hotosm.org/">HOT</a>',
    maxZoom: 19,
  },
  standard: {
    name: "OpenStreetMap",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  satellite: {
    name: "Satellite Aerial",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP",
    maxZoom: 19,
  },
};

export const MapTab: React.FC = () => {
  const { issues, activeUC, setActiveUC, setSelectedIssue, allUCs, activeRole } = useCivic();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [monsoonMode, setMonsoonMode] = useState<boolean>(false);
  const [showBoundaries, setShowBoundaries] = useState<boolean>(true);
  const [selectedIssuePin, setSelectedIssuePin] = useState<Issue | null>(null);
  const [currentMapStyle, setCurrentMapStyle] = useState<MapStyle>("humanitarian");
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeTileLayerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersLayerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polygonsLayerRef = useRef<any>(null);

  // Filter issues
  const filteredIssues = issues.filter((iss) => {
    if (monsoonMode) {
      const isDrainOrFlood =
        iss.categoryId === "drains" ||
        iss.categoryId === "streets" ||
        iss.categoryId === "electricity";
      const isHazardOrOpen = iss.severity === "dangerous" || iss.status !== "confirmed";
      return isDrainOrFlood && isHazardOrOpen;
    }
    if (selectedCategory !== "all" && iss.categoryId !== selectedCategory) return false;
    if (selectedStatus !== "all" && iss.status !== selectedStatus) return false;
    return true;
  });

  // Initialize Leaflet map on mount with 100% open source, fast tiles (NO API keys, NO watermarks)
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      try {
        const L = (await import("leaflet")).default;

        const initialLat = activeUC?.lat || 24.918;
        const initialLng = activeUC?.lng || 67.097;

        const map = L.map(mapContainerRef.current, {
          center: [initialLat, initialLng],
          zoom: 14,
          zoomControl: false,
          attributionControl: false, // We render a clean minimal attribution pill
        });

        const styleConfig = MAP_STYLES[currentMapStyle];
        const tileLayer = L.tileLayer(styleConfig.url, {
          maxZoom: styleConfig.maxZoom,
          subdomains: styleConfig.subdomains || "abc",
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        const polygonsLayer = L.layerGroup().addTo(map);

        if (isMounted) {
          mapInstanceRef.current = map;
          activeTileLayerRef.current = tileLayer;
          markersLayerRef.current = markersLayer;
          polygonsLayerRef.current = polygonsLayer;
        }
      } catch (err) {
        console.warn("Leaflet map initialization warning:", err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch Tile Layer dynamically (Civic Day, Standard OSM, Satellite)
  useEffect(() => {
    async function updateTileLayer() {
      if (!mapInstanceRef.current || !activeTileLayerRef.current) return;
      const L = (await import("leaflet")).default;
      const map = mapInstanceRef.current;

      map.removeLayer(activeTileLayerRef.current);
      const styleConfig = MAP_STYLES[currentMapStyle];
      const newLayer = L.tileLayer(styleConfig.url, {
        maxZoom: styleConfig.maxZoom,
        subdomains: styleConfig.subdomains || "abc",
      }).addTo(map);

      activeTileLayerRef.current = newLayer;
    }

    updateTileLayer();
  }, [currentMapStyle]);

  // Update Markers & UC Boundary Polygons
  useEffect(() => {
    async function updateLayers() {
      if (!mapInstanceRef.current || !markersLayerRef.current) return;

      const L = (await import("leaflet")).default;
      const markersLayer = markersLayerRef.current;
      const polygonsLayer = polygonsLayerRef.current;

      markersLayer.clearLayers();
      if (polygonsLayer) polygonsLayer.clearLayers();

      // 1. Add UC Boundaries (Polygons) with score tints
      if (showBoundaries && polygonsLayer) {
        const ucPolygons = [
          {
            id: "uc-gulshan-7",
            name: "UC-7 Gulshan (NIPA / Block 13)",
            score: 79.4,
            coords: [
              [24.928, 67.085],
              [24.935, 67.108],
              [24.912, 67.115],
              [24.905, 67.090],
            ],
            color: "#059669",
          },
          {
            id: "uc-gulshan-4",
            name: "UC-4 Civic Centre",
            score: 66.8,
            coords: [
              [24.905, 67.090],
              [24.912, 67.115],
              [24.895, 67.120],
              [24.888, 67.095],
            ],
            color: "#0284c7",
          },
          {
            id: "uc-gulshan-6",
            name: "UC-6 Block 6 & 7",
            score: 62.4,
            coords: [
              [24.920, 67.075],
              [24.928, 67.085],
              [24.905, 67.090],
              [24.898, 67.080],
            ],
            color: "#d97706",
          },
          {
            id: "uc-gulshan-3",
            name: "UC-3 Essa Nagri",
            score: 38.2,
            coords: [
              [24.908, 67.060],
              [24.915, 67.072],
              [24.896, 67.075],
              [24.890, 67.062],
            ],
            color: "#e11d48",
          },
          {
            id: "uc-nazimabad-1",
            name: "UC-1 Paposh Nagar (Nazimabad No. 5)",
            score: 78.4,
            coords: [
              [24.935, 67.025],
              [24.938, 67.042],
              [24.922, 67.040],
              [24.920, 67.022],
            ],
            color: "#059669",
          },
          {
            id: "uc-nazimabad-2",
            name: "UC-2 Inquiry Office (Nazimabad No. 1 & 2)",
            score: 73.1,
            coords: [
              [24.920, 67.025],
              [24.922, 67.042],
              [24.905, 67.045],
              [24.902, 67.028],
            ],
            color: "#0284c7",
          },
          {
            id: "uc-nazimabad-3",
            name: "UC-3 Chawla Market (Nazimabad No. 3 & 4)",
            score: 65.5,
            coords: [
              [24.922, 67.042],
              [24.925, 67.055],
              [24.908, 67.058],
              [24.905, 67.045],
            ],
            color: "#d97706",
          },
          {
            id: "uc-nazimabad-4",
            name: "UC-4 Golimar / Rizvia Society",
            score: 61.2,
            coords: [
              [24.902, 67.020],
              [24.905, 67.035],
              [24.890, 67.038],
              [24.886, 67.022],
            ],
            color: "#f59e0b",
          },
        ];

        ucPolygons.forEach((uc) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const poly = L.polygon(uc.coords as any, {
            color: uc.color,
            weight: 2,
            opacity: 0.85,
            fillColor: uc.color,
            fillOpacity: 0.12,
          });

          poly.bindTooltip(
            `<strong>${uc.name}</strong><br/>Score: ${uc.score}/100`,
            { sticky: true }
          );

          poly.on("click", () => {
            const found = allUCs.find((u) => u.id === uc.id);
            if (found) setActiveUC(found);
          });

          poly.addTo(polygonsLayer);
        });
      }

      // 2. Add Issue Markers
      filteredIssues.forEach((issue) => {
        const catObj = CIVIC_CATEGORIES.find((c) => c.id === issue.categoryId);
        const pinColor = catObj?.color || "#0f766e";
        const isDangerous = issue.severity === "dangerous";
        const isSelected = selectedIssuePin?.id === issue.id;

        // Custom HTML Marker Icon
        const iconHtml = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            ${
              isDangerous
                ? `<div style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background-color: rgba(220, 38, 38, 0.35); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
                : isSelected
                ? `<div style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background-color: rgba(15, 118, 110, 0.35);"></div>`
                : ""
            }
            <div style="
              width: ${isSelected ? "32px" : "24px"};
              height: ${isSelected ? "32px" : "24px"};
              border-radius: 9999px;
              background-color: ${isDangerous ? "#dc2626" : pinColor};
              border: 2.5px solid #ffffff;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-size: ${isSelected ? "11px" : "10px"};
              font-weight: 800;
              transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            ">
              ${issue.affectedCount > 1 ? issue.affectedCount : "•"}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-civic-marker",
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([issue.lat, issue.lng], { icon: customIcon });

        marker.on("click", () => {
          setSelectedIssuePin(issue);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo([issue.lat, issue.lng], { animate: true });
          }
        });

        marker.addTo(markersLayer);
      });
    }

    updateLayers();
  }, [filteredIssues, showBoundaries, monsoonMode, selectedIssuePin]);

  // Recenter on Active UC
  const handleCenterOnMyUC = () => {
    if (mapInstanceRef.current && activeUC) {
      mapInstanceRef.current.flyTo([activeUC.lat, activeUC.lng], 15, { duration: 0.8 });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  return (
    <div className="relative h-[calc(100dvh-7.6rem)] sm:h-[calc(100vh-8.5rem)] w-full flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-md">
      {/* Top Floating Sleek Control Bar */}
      <div className="absolute top-3 inset-x-3 z-[1000] flex flex-col gap-2 pointer-events-none">
        {/* Compact Glassmorphic Search & Category Ribbon */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pointer-events-auto pr-14">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-xs cursor-pointer transition shrink-0 ${
              selectedCategory === "all"
                ? "bg-teal-700 text-white shadow-teal-700/20"
                : "bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 backdrop-blur-md hover:bg-slate-50"
            }`}
          >
            All Categories ({issues.length})
          </button>
          {CIVIC_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-xs cursor-pointer transition shrink-0 ${
                selectedCategory === cat.id
                  ? "bg-teal-700 text-white font-bold shadow-teal-700/20"
                  : "bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 backdrop-blur-md hover:bg-slate-50"
              }`}
            >
              {cat.name.en}
            </button>
          ))}
        </div>

        {/* Minimal Sub-Filter Row - Guaranteed Zero Overlap with Floating Action Dock */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pointer-events-auto pr-16 py-0.5">
          {/* Issue Counter Badge (Left-Aligned, never obscured by GPS button) */}
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-200/90 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 shadow-xs flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{filteredIssues.length} Live Pins</span>
          </div>

          {/* Status Quick Pill Dropdown */}
          <div className="flex items-center gap-1 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-semibold shadow-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shrink-0">
            <Layers className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-hidden py-0.5"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open Issues</option>
              <option value="in_progress">In Progress</option>
              <option value="marked_resolved">Waiting Confirmation</option>
              <option value="confirmed">Confirmed Fixed</option>
            </select>
          </div>

          {/* Monsoon Floods Emergency Mode */}
          <button
            onClick={() => setMonsoonMode(!monsoonMode)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer border shrink-0 ${
              monsoonMode
                ? "bg-sky-600 text-white border-sky-500 shadow-sky-600/30 animate-pulse"
                : "bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span>Monsoon Hazard</span>
            {monsoonMode && <span className="text-[9px] bg-sky-800 text-white px-1 rounded">ON</span>}
          </button>

          {/* Role-Specific Fast Action Filter in Map */}
          {activeRole === "official" && (
            <button
              onClick={() => {
                if (selectedStatus === "open") setSelectedStatus("all");
                else setSelectedStatus("open");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer border shrink-0 ${
                selectedStatus === "open"
                  ? "bg-amber-600 text-white border-amber-500 shadow-amber-600/30"
                  : "bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700"
              }`}
            >
              <span>🏛️ Needs Action ({issues.filter(i => i.ucId === activeUC.id && i.status === "open").length})</span>
            </button>
          )}

          {activeRole === "community_leader" && (
            <button
              onClick={() => {
                if (selectedStatus === "adoptable") setSelectedStatus("all");
                else setSelectedStatus("open");
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer border shrink-0 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700"
            >
              <span>🎖️ Adoptable (≥7d) ({issues.filter(i => i.daysOpen >= 7 && i.status !== "confirmed" && !i.adoptedByType).length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Action Dock (Right Side - Apple & Google Maps Native Style) */}
      <div className="absolute right-3 top-28 sm:top-24 z-[1000] flex flex-col gap-2">
        {/* Recenter on My UC (High-Contrast Native GPS Crosshair) */}
        <button
          onClick={handleCenterOnMyUC}
          className="w-10 h-10 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md text-teal-700 dark:text-teal-400 border border-slate-200 dark:border-slate-700 shadow-lg hover:bg-teal-50 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition active:scale-90 group relative"
          title={`Recenter on ${activeUC.name}`}
          aria-label="Recenter on My UC"
        >
          <Crosshair className="w-5 h-5 text-teal-700 dark:text-teal-400 stroke-[2.2]" />
          <span className="absolute right-12 whitespace-nowrap bg-slate-900 text-white text-[11px] font-semibold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-md">
            My UC: {activeUC.name.split(" ")[0]}
          </span>
        </button>

        {/* UC Boundaries Toggle */}
        <button
          onClick={() => setShowBoundaries(!showBoundaries)}
          className={`w-10 h-10 rounded-2xl border shadow-lg flex items-center justify-center cursor-pointer transition active:scale-90 group relative backdrop-blur-md ${
            showBoundaries
              ? "bg-teal-700 text-white border-teal-600 shadow-teal-700/20"
              : "bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
          }`}
          title="Toggle UC Ward Boundaries"
          aria-label="Toggle UC Zones"
        >
          <Compass className="w-5 h-5 stroke-[2]" />
          <span className="absolute right-12 whitespace-nowrap bg-slate-900 text-white text-[11px] font-semibold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-md">
            {showBoundaries ? "Hide UC Zones" : "Show UC Zones"}
          </span>
        </button>

        {/* Layer Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition active:scale-95"
            title="Change Map Style"
          >
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </button>

          {/* Layer Menu Popup */}
          {isLayerMenuOpen && (
            <div className="absolute right-12 top-0 bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-1 w-44 animate-in fade-in zoom-in-95 duration-150">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Map Basemap
              </span>
              {(Object.keys(MAP_STYLES) as MapStyle[]).map((styleKey) => (
                <button
                  key={styleKey}
                  onClick={() => {
                    setCurrentMapStyle(styleKey);
                    setIsLayerMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    currentMapStyle === styleKey
                      ? "bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <span>{MAP_STYLES[styleKey].name}</span>
                  {currentMapStyle === styleKey && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-800 mt-2">
          <button
            onClick={handleZoomIn}
            className="w-10 h-9 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-200 dark:border-slate-700 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-9 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real Open Source Map Viewport */}
      <div className="relative flex-1 w-full h-full bg-slate-100 dark:bg-slate-900">
        <div ref={mapContainerRef} className="w-full h-full z-0" />
      </div>

      {/* Bottom Minimal Attribution Pill */}
      <div className="absolute bottom-1.5 left-2 z-[900] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] text-slate-500 font-medium pointer-events-none">
        Open Data © OpenStreetMap contributors
      </div>

      {/* Bottom Floating Issue Preview Card */}
      {selectedIssuePin && (
        <div className="absolute bottom-3 inset-x-3 z-[1000] p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
              <Image
                src={
                  selectedIssuePin.photos[0]?.url ||
                  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop"
                }
                alt={selectedIssuePin.title}
                fill
                sizes="56px"
                className="object-cover"
              />
              <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[9px] font-bold px-1 rounded">
                #{selectedIssuePin.id}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <StatusPill status={selectedIssuePin.status} daysOpen={selectedIssuePin.daysOpen} />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate">
                  {selectedIssuePin.ucName}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                {selectedIssuePin.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {selectedIssuePin.addressApprox} · <strong className="text-slate-700 dark:text-slate-200">{selectedIssuePin.affectedCount} affected</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setSelectedIssue(selectedIssuePin)}
              className="px-3.5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1"
            >
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSelectedIssuePin(null)}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
