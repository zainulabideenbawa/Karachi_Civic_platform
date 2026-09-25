"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useCivic } from "@/context/CivicContext";
import { CIVIC_CATEGORIES } from "@/config/categories";
import { Issue, UC } from "@/types/civic";
import { StatusPill } from "../StatusPill";
import {
  Clock,
  Users,
  Layers,
  Flame,
  MapPin,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Crosshair,
  Compass,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export const MapTab: React.FC = () => {
  const { issues, activeUC, setActiveUC, setSelectedIssue, allUCs } = useCivic();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [monsoonMode, setMonsoonMode] = useState<boolean>(false);
  const [showBoundaries, setShowBoundaries] = useState<boolean>(true);
  const [selectedIssuePin, setSelectedIssuePin] = useState<Issue | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
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

  // Initialize bright Leaflet map on client mount
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return; // already initialized

      try {
        const L = (await import("leaflet")).default;

        // Default center: Karachi Gulshan Town / Civic Centre area
        const map = L.map(mapContainerRef.current, {
          center: [activeUC.lat || 24.918, activeUC.lng || 67.097],
          zoom: 14,
          zoomControl: false,
        });

        // Bright, crisp, high-detail daylight street map tiles (CartoDB Voyager)
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19,
            subdomains: "abcd",
          }
        ).addTo(map);

        // Zoom control in bottom right
        L.control.zoom({ position: "bottomright" }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        const polygonsLayer = L.layerGroup().addTo(map);

        if (isMounted) {
          mapInstanceRef.current = map;
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

  // Update Markers & Polygons when filters or issues change
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
            id: "uc-7",
            name: "UC-7 Gulshan-e-Iqbal",
            score: 74,
            coords: [
              [24.928, 67.085],
              [24.935, 67.108],
              [24.912, 67.115],
              [24.905, 67.090],
            ],
            color: "#059669", // Emerald
          },
          {
            id: "uc-8",
            name: "UC-8 Jamia Farooqia",
            score: 58,
            coords: [
              [24.935, 67.108],
              [24.942, 67.132],
              [24.918, 67.140],
              [24.912, 67.115],
            ],
            color: "#d97706", // Amber
          },
          {
            id: "uc-9",
            name: "UC-9 Civic Centre",
            score: 65,
            coords: [
              [24.905, 67.090],
              [24.912, 67.115],
              [24.895, 67.120],
              [24.888, 67.095],
            ],
            color: "#0284c7", // Sky
          },
        ];

        ucPolygons.forEach((uc) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const poly = L.polygon(uc.coords as any, {
            color: uc.color,
            weight: 2,
            opacity: 0.8,
            fillColor: uc.color,
            fillOpacity: 0.12,
          });

          poly.bindTooltip(
            `<strong>${uc.name}</strong><br/>Civic Score: ${uc.score}/100`,
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
                ? `<div style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background-color: rgba(220, 38, 38, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
                : isSelected
                ? `<div style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background-color: rgba(15, 118, 110, 0.35);"></div>`
                : ""
            }
            <div style="
              width: ${isSelected ? "28px" : "22px"};
              height: ${isSelected ? "28px" : "22px"};
              border-radius: 9999px;
              background-color: ${isDangerous ? "#dc2626" : pinColor};
              border: 2px solid #ffffff;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-size: 10px;
              font-weight: 800;
              transition: all 0.2s ease;
            ">
              ${issue.affectedCount > 1 ? issue.affectedCount : "•"}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-civic-marker",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
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

  // Handle Center on My UC
  const handleCenterOnMyUC = () => {
    if (mapInstanceRef.current && activeUC) {
      mapInstanceRef.current.flyTo([activeUC.lat, activeUC.lng], 15, { duration: 1 });
    }
  };

  return (
    <div className="relative h-[calc(100vh-8.5rem)] w-full flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white shadow-md">
      {/* Top Floating Controls & Filter Ribbon */}
      <div className="absolute top-3 inset-x-3 z-[1000] flex flex-col gap-2 pointer-events-none">
        {/* Horizontal Category Scroll Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pointer-events-auto">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-md cursor-pointer transition ${
              selectedCategory === "all"
                ? "bg-teal-700 text-white ring-2 ring-teal-400"
                : "bg-white/95 text-slate-800 border border-slate-200 backdrop-blur-md hover:bg-slate-50"
            }`}
          >
            All Categories ({issues.length})
          </button>
          {CIVIC_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-md cursor-pointer transition ${
                selectedCategory === cat.id
                  ? "bg-teal-700 text-white font-bold ring-2 ring-teal-400"
                  : "bg-white/95 text-slate-800 border border-slate-200 backdrop-blur-md hover:bg-slate-50"
              }`}
            >
              {cat.name.en}
            </button>
          ))}
        </div>

        {/* Secondary Filter & Mode Ribbon */}
        <div className="flex items-center justify-between gap-2 flex-wrap pointer-events-auto">
          <div className="flex items-center gap-2">
            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-md border border-slate-200 text-slate-800">
              <Layers className="w-3.5 h-3.5 text-teal-700" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 cursor-pointer focus:outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="marked_resolved">Waiting Confirmation</option>
                <option value="confirmed">Confirmed Fixed</option>
              </select>
            </div>

            {/* UC Zones Toggle */}
            <button
              onClick={() => setShowBoundaries(!showBoundaries)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer border ${
                showBoundaries
                  ? "bg-teal-700 text-white border-teal-600 ring-2 ring-teal-400"
                  : "bg-white/95 text-slate-800 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>UC Zones</span>
            </button>

            {/* Monsoon Floods Emergency Mode (Section 15.1) */}
            <button
              onClick={() => setMonsoonMode(!monsoonMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer border ${
                monsoonMode
                  ? "bg-sky-600 text-white border-sky-500 ring-2 ring-sky-300 animate-pulse"
                  : "bg-white/95 text-slate-800 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>🌧 Monsoon Hazard Mode</span>
              {monsoonMode && <span className="text-[10px] bg-sky-800 text-white px-1.5 rounded">LIVE</span>}
            </button>
          </div>

          {/* Center on My UC Button */}
          <button
            onClick={handleCenterOnMyUC}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 text-slate-800 text-xs font-bold border border-slate-200 shadow-md hover:bg-slate-50 transition cursor-pointer"
            title="Recenter map on your home UC"
          >
            <Crosshair className="w-3.5 h-3.5 text-teal-700" />
            <span>My UC: {activeUC.name}</span>
          </button>
        </div>
      </div>

      {/* Real Daylight Bright Street Map Layer */}
      <div className="relative flex-1 w-full h-full bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-0" />
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
                <span className="text-[11px] text-slate-500 font-semibold truncate">
                  {selectedIssuePin.ucName}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                {selectedIssuePin.title}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                {selectedIssuePin.addressApprox} · <strong className="text-slate-700 dark:text-slate-300">{selectedIssuePin.affectedCount} affected</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedIssue(selectedIssuePin)}
            className="shrink-0 px-3.5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
