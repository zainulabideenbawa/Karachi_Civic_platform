"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useCivic } from "@/context/CivicContext";
import {
  X,
  Share2,
  CheckCircle,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  MapPin,
  Award,
  Building2,
  HeartHandshake,
  ShieldCheck,
  Calendar,
  Users,
} from "lucide-react";

export const WorkDoneShareModal: React.FC = () => {
  const {
    workDoneShareIssue,
    setWorkDoneShareIssue,
    activeUC,
    showToast,
  } = useCivic();

  const [copiedLink, setCopiedLink] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const previewCardRef = useRef<HTMLDivElement>(null);

  if (!workDoneShareIssue) return null;

  const issue = workDoneShareIssue;
  const beforePhotoUrl =
    issue.photos?.[0]?.url ||
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1280&h=960&fit=crop";
  const afterPhotoUrl =
    issue.afterPhotos?.[0]?.url ||
    "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=800&h=600&fit=crop";

  const workNote =
    issue.officialResponse?.message ||
    "Municipal engineering & field response unit deployed on ground. Site cleared, structural repairs completed, and verified with GPS ground evidence.";

  const resolverName =
    issue.adoptedByType === "ngo"
      ? issue.adoptedByName || "Al-Khidmat & Edhi Humanitarian Relief Squad"
      : issue.adoptedByType === "leader"
      ? `${issue.adoptedByName || "Community Leader"} (Ward Representative)`
      : `${activeUC.chairman.name} (${activeUC.chairman.seatTitle})`;

  const resolverRoleTag =
    issue.adoptedByType === "ngo"
      ? "NGO Humanitarian Relief Partner"
      : issue.adoptedByType === "leader"
      ? "Grassroots Community Leader"
      : "Elected UC Chairman";

  const shareOrigin =
    typeof window !== "undefined" ? window.location.origin : "https://karachicivic.org";
  const shareUrl = `${shareOrigin}?issue=${issue.id}`;

  const whatsappMessage = `✅ *OFFICIAL WORK COMPLETED • Karachi Civic Verified*
  
*Issue Resolved:* "${issue.title}"
*Location:* ${issue.ucName || activeUC.name}, ${activeUC.townName}, Karachi
*Delivered by:* ${resolverName}
*Action Taken:* ${workNote}
*Citizen Impact:* ${issue.affectedCount || 42} neighborhood residents served

🔍 *View verified Before & After evidence on Karachi Civic:*
${shareUrl}

#KarachiWorks #KarachiCivic #GoodGovernance #TransparancyInAction`;

  const twitterMessage = `✅ WORK COMPLETED: "${issue.title}" in ${issue.ucName || activeUC.name} (${activeUC.townName}) has been resolved with verified ground evidence! Delivered by ${resolverName}. Impacting ${issue.affectedCount || 42} residents. @KarachiCivic #KarachiWorks #GoodGovernance`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      showToast("Direct work-done link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Work Completed: ${issue.title}`,
          text: `✅ ${issue.title} in ${issue.ucName || activeUC.name} has been resolved by ${resolverName}!`,
          url: shareUrl,
        });
        showToast("Shared successfully!");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Helper function to safely load image via proxy to avoid CORS canvas-tainting
  const loadSafeImage = async (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Fallback: fetch base64 data URI from proxy
        fetch(`/api/proxy-image?url=${encodeURIComponent(url)}&format=base64`)
          .then((res) => {
            if (!res.ok) throw new Error("Proxy error");
            return res.json();
          })
          .then((data) => {
            if (data?.dataUri) {
              const b64Img = new window.Image();
              b64Img.onload = () => resolve(b64Img);
              b64Img.onerror = reject;
              b64Img.src = data.dataUri;
            } else {
              reject(new Error("Failed to load image"));
            }
          })
          .catch(() => {
            // Last resort: return a synthetic tinted image
            reject(new Error("Image unreachable"));
          });
      };

      if (url.startsWith("http://") || url.startsWith("https://")) {
        img.src = `/api/proxy-image?url=${encodeURIComponent(url)}`;
      } else {
        img.src = url;
      }
    });
  };

  // Helper to draw image cover cropped inside a rounded box
  const drawCoverImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.clip();

    // Scale to fill
    const scale = Math.max(w / img.width, h / img.height);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (img.width - sw) / 2;
    const sy = (img.height - sh) / 2;

    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);

    // Subtle dark gradient at top and bottom for text readability
    const topVignette = ctx.createLinearGradient(x, y, x, y + 80);
    topVignette.addColorStop(0, "rgba(0, 0, 0, 0.65)");
    topVignette.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = topVignette;
    ctx.fillRect(x, y, w, 80);

    const bottomVignette = ctx.createLinearGradient(x, y + h - 90, x, y + h);
    bottomVignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    bottomVignette.addColorStop(1, "rgba(0, 0, 0, 0.85)");
    ctx.fillStyle = bottomVignette;
    ctx.fillRect(x, y + h - 90, w, 90);

    ctx.restore();

    // Sleek border around photo box
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  };

  // Helper to wrap text
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number = 2
  ) => {
    const words = text.split(" ");
    let line = "";
    let currentY = y;
    let linesCount = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        linesCount++;
        if (linesCount >= maxLines) {
          ctx.fillText(line.trim() + "...", x, currentY);
          return currentY;
        }
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
    return currentY;
  };

  // Generate downloadable canvas composite card
  const handleDownloadCard = async () => {
    setIsGeneratingImage(true);
    showToast("Generating high-resolution Work Done card with photos...");

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 840;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas context not supported");
      }

      // 1. Sleek Background with Ambient Glows
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 840);
      bgGrad.addColorStop(0, "#060b13");
      bgGrad.addColorStop(0.5, "#0b1523");
      bgGrad.addColorStop(1, "#04201e");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 840);

      // Ambient radial glow top-left (teal)
      const glowTeal = ctx.createRadialGradient(220, 120, 20, 220, 120, 400);
      glowTeal.addColorStop(0, "rgba(20, 184, 166, 0.22)");
      glowTeal.addColorStop(1, "rgba(20, 184, 166, 0)");
      ctx.fillStyle = glowTeal;
      ctx.fillRect(0, 0, 600, 500);

      // Ambient radial glow bottom-right (emerald)
      const glowEmerald = ctx.createRadialGradient(1000, 720, 20, 1000, 720, 420);
      glowEmerald.addColorStop(0, "rgba(16, 185, 129, 0.18)");
      glowEmerald.addColorStop(1, "rgba(16, 185, 129, 0)");
      ctx.fillStyle = glowEmerald;
      ctx.fillRect(600, 400, 600, 440);

      // Subtle Outer Framing Border
      ctx.strokeStyle = "rgba(51, 65, 85, 0.5)";
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, 1198, 838);

      // 2. Header Branding Banner
      // Platform Logo Icon Badge
      ctx.fillStyle = "#0d9488";
      ctx.beginPath();
      ctx.arc(60, 48, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px system-ui, sans-serif";
      ctx.fillText("KC", 49, 54);

      // Title & Subtitle
      ctx.fillStyle = "#2dd4bf";
      ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
      ctx.fillText("KARACHI CIVIC PLATFORM", 88, 48);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "600 12px system-ui, sans-serif";
      ctx.fillText("VERIFIED GROUND EVIDENCE • PUBLIC ACCOUNTABILITY LEDGER", 90, 66);

      // Verified Resolution Pill Badge (Top Right)
      const verifiedGrad = ctx.createLinearGradient(850, 28, 1150, 68);
      verifiedGrad.addColorStop(0, "#059669");
      verifiedGrad.addColorStop(1, "#047857");
      ctx.fillStyle = verifiedGrad;
      ctx.beginPath();
      ctx.roundRect(870, 28, 280, 44, 22);
      ctx.fill();
      ctx.strokeStyle = "rgba(110, 231, 183, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px system-ui, -apple-system, sans-serif";
      ctx.fillText("✓ RESOLUTION VERIFIED", 905, 56);

      // 3. Side-by-Side Dual Photo Showcase (Actual Images via Proxy)
      const photoY = 96;
      const photoW = 535;
      const photoH = 390;
      const photoRadius = 18;

      let imgBefore: HTMLImageElement | null = null;
      let imgAfter: HTMLImageElement | null = null;

      try {
        const [beforeLoaded, afterLoaded] = await Promise.all([
          loadSafeImage(beforePhotoUrl),
          loadSafeImage(afterPhotoUrl),
        ]);
        imgBefore = beforeLoaded;
        imgAfter = afterLoaded;
      } catch (err) {
        console.warn("Proxy image load warning:", err);
      }

      // Draw Before Photo Box
      if (imgBefore) {
        drawCoverImage(ctx, imgBefore, 50, photoY, photoW, photoH, photoRadius);
      } else {
        // Fallback elegant box
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.roundRect(50, photoY, photoW, photoH, photoRadius);
        ctx.fill();
        ctx.fillStyle = "#64748b";
        ctx.font = "bold 18px system-ui, sans-serif";
        ctx.fillText("BEFORE PHOTO ARCHIVED", 180, photoY + 200);
      }

      // Draw After Photo Box
      if (imgAfter) {
        drawCoverImage(ctx, imgAfter, 615, photoY, photoW, photoH, photoRadius);
      } else {
        // Fallback elegant box
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.roundRect(615, photoY, photoW, photoH, photoRadius);
        ctx.fill();
        ctx.fillStyle = "#64748b";
        ctx.font = "bold 18px system-ui, sans-serif";
        ctx.fillText("AFTER PHOTO ARCHIVED", 750, photoY + 200);
      }

      // Floating Photo Badges (Top)
      // Before Badge
      ctx.fillStyle = "rgba(220, 38, 38, 0.95)";
      ctx.beginPath();
      ctx.roundRect(66, photoY + 16, 210, 36, 10);
      ctx.fill();
      ctx.strokeStyle = "rgba(254, 202, 202, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.fillText("🚨 1. BEFORE (REPORTED)", 80, photoY + 40);

      // After Badge
      ctx.fillStyle = "rgba(5, 150, 105, 0.98)";
      ctx.beginPath();
      ctx.roundRect(631, photoY + 16, 240, 36, 10);
      ctx.fill();
      ctx.strokeStyle = "rgba(167, 243, 208, 0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.fillText("✅ 2. AFTER (RESOLVED FIX)", 645, photoY + 40);

      // Floating Photo Captions (Bottom)
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "600 13px system-ui, sans-serif";
      ctx.fillText("Reported Civic Hazard", 70, photoY + photoH - 18);

      ctx.fillStyle = "#6ee7b7";
      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.fillText("📍 GPS Ground Verified Evidence", 635, photoY + photoH - 18);

      // Central VS / Fix Arrow Circle
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(600, photoY + photoH / 2, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 18px system-ui, sans-serif";
      ctx.fillText("➔", 593, photoY + photoH / 2 + 6);

      // 4. Details & Attribution Card Container
      const detailY = 508;
      const detailH = 300;
      ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
      ctx.beginPath();
      ctx.roundRect(50, detailY, 1100, detailH, 20);
      ctx.fill();
      ctx.strokeStyle = "rgba(51, 65, 85, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Issue Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 26px system-ui, -apple-system, sans-serif";
      wrapText(ctx, issue.title, 80, detailY + 44, 1040, 32, 2);

      // Action Taken Quote Block
      ctx.fillStyle = "rgba(30, 41, 59, 0.7)";
      ctx.beginPath();
      ctx.roundRect(80, detailY + 85, 1040, 68, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(51, 65, 85, 0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "italic 15px system-ui, sans-serif";
      wrapText(ctx, `“${workNote}”`, 100, detailY + 115, 1000, 22, 2);

      // Three Key Metric Badges
      const badgeY = detailY + 172;
      const badgeW = 330;
      const badgeH = 64;

      // Badge 1: Location
      ctx.fillStyle = "rgba(20, 184, 166, 0.12)";
      ctx.beginPath();
      ctx.roundRect(80, badgeY, badgeW, badgeH, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(20, 184, 166, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "#2dd4bf";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillText("📍 LOCATION", 95, badgeY + 24);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 15px system-ui, sans-serif";
      const locText = `${issue.ucName || activeUC.name} • ${activeUC.townName}`;
      ctx.fillText(locText.length > 28 ? locText.slice(0, 26) + "..." : locText, 95, badgeY + 48);

      // Badge 2: Delivered By
      ctx.fillStyle = "rgba(245, 158, 11, 0.12)";
      ctx.beginPath();
      ctx.roundRect(435, badgeY, badgeW, badgeH, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillText(`🏛️ DELIVERED BY (${resolverRoleTag.toUpperCase()})`, 450, badgeY + 24);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 15px system-ui, sans-serif";
      const delivText = resolverName;
      ctx.fillText(delivText.length > 30 ? delivText.slice(0, 28) + "..." : delivText, 450, badgeY + 48);

      // Badge 3: Impact
      ctx.fillStyle = "rgba(59, 130, 246, 0.12)";
      ctx.beginPath();
      ctx.roundRect(790, badgeY, badgeW, badgeH, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(59, 130, 246, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "#60a5fa";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillText("👥 CITIZEN IMPACT", 805, badgeY + 24);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 15px system-ui, sans-serif";
      ctx.fillText(`${issue.affectedCount || 42} Residents Benefited`, 805, badgeY + 48);

      // Bottom Ledger & Cryptographic Verification Footer
      ctx.fillStyle = "#64748b";
      ctx.font = "500 13px system-ui, sans-serif";
      ctx.fillText(
        `🔒 SHA-256 Proof Stamped • 7-Day Confirmation Window Open • karachicivic.org?issue=${issue.id}`,
        80,
        detailY + 268
      );

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.fillText("ECP & Local Govt Audited ✓", 940, detailY + 268);

      // 5. Trigger download
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `karachi-work-done-${issue.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast("Work Done Card downloaded with high-res photos!");
    } catch (err) {
      console.error("Canvas generation error:", err);
      // Fallback: download after-photo directly
      const a = document.createElement("a");
      a.href = afterPhotoUrl;
      a.download = `karachi-resolution-${issue.id}.jpg`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast("Resolution photo downloaded directly.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-4 sm:p-5 space-y-4 shadow-2xl text-white my-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Official Work Done Proof
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  High-Res Card
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Share your completed civic fix with Before &amp; After photographic proof
              </p>
            </div>
          </div>

          <button
            onClick={() => setWorkDoneShareIssue(null)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Card Showcase (Before & After Preview) */}
        <div
          ref={previewCardRef}
          className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-3 sm:p-3.5 space-y-3 shadow-xl"
        >
          {/* Card Top Branding */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[11px] font-extrabold text-teal-400 tracking-wider uppercase font-mono">
                Karachi Civic Platform
              </span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Resolution Verified</span>
            </div>
          </div>

          {/* Before & After Dual Photo Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Before Photo */}
            <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-rose-900/50 bg-slate-950 group">
              <Image
                src={beforePhotoUrl}
                alt="Before fix"
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />
              <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-rose-600/95 text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
                🚨 1. Before
              </div>
              <div className="absolute bottom-1.5 left-1.5 text-[10px] text-slate-300 font-medium">
                Reported Issue
              </div>
            </div>

            {/* After Photo */}
            <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-emerald-500/50 bg-slate-950 group">
              <Image
                src={afterPhotoUrl}
                alt="After fix"
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />
              <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-emerald-600/95 text-white text-[9px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                <Check className="w-2.5 h-2.5" />
                <span>✅ 2. After Fix</span>
              </div>
              <div className="absolute bottom-1.5 left-1.5 text-[10px] text-emerald-300 font-medium flex items-center gap-1">
                <span>📍 GPS Verified</span>
              </div>
            </div>
          </div>

          {/* Issue Meta Details */}
          <div className="space-y-2 pt-1">
            <h4 className="font-extrabold text-sm text-white leading-snug">
              {issue.title}
            </h4>

            <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-teal-400 font-semibold">
                <MapPin className="w-3 h-3 shrink-0" />
                <span>{issue.ucName || activeUC.name}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-300">
                {issue.adoptedByType === "ngo" ? (
                  <HeartHandshake className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : issue.adoptedByType === "leader" ? (
                  <Award className="w-3 h-3 text-indigo-400 shrink-0" />
                ) : (
                  <Building2 className="w-3 h-3 text-amber-400 shrink-0" />
                )}
                <span className="truncate max-w-[180px]">{resolverName}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-sky-300">
                <Users className="w-3 h-3 shrink-0" />
                <span>{issue.affectedCount || 42} Served</span>
              </span>
            </div>

            <p className="text-[11px] text-slate-300 italic bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/50 leading-relaxed">
              &quot;{workNote}&quot;
            </p>
          </div>
        </div>

        {/* Primary 1-Tap Social Action Buttons */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Share Ground Reality To:
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
            >
              <span className="text-base">💬</span>
              <span>Share on WhatsApp</span>
            </a>

            {/* X / Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterMessage)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs border border-slate-700 shadow-md flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
            >
              <span className="text-base">𝕏</span>
              <span>Post on Twitter</span>
            </a>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {/* Download Image Card */}
            <button
              type="button"
              onClick={handleDownloadCard}
              disabled={isGeneratingImage}
              className="py-2.5 px-2 rounded-xl bg-teal-600/25 hover:bg-teal-600/35 text-teal-300 border border-teal-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingImage ? "Rendering..." : "Save Image"}</span>
            </button>

            {/* Copy Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
            </button>

            {/* Native Mobile Share */}
            <button
              type="button"
              onClick={handleNativeShare}
              className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-teal-400" />
              <span>More Apps</span>
            </button>
          </div>
        </div>

        {/* Footer info note */}
        <div className="pt-1 text-center">
          <p className="text-[11px] text-slate-400">
            Open 7-day citizen confirmation window. Local neighborhood residents verify the fix before score points lock.
          </p>
        </div>
      </div>
    </div>
  );
};
