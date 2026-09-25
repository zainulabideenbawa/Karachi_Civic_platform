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
    "Municipal engineering team deployed on ground. Site cleared, structural repairs completed, and verified with GPS ground evidence.";

  const shareOrigin =
    typeof window !== "undefined" ? window.location.origin : "https://karachicivic.org";
  const shareUrl = `${shareOrigin}?issue=${issue.id}`;

  const whatsappMessage = `✅ *WORK COMPLETED • UC Municipal Update*

*Issue Resolved:* "${issue.title}"
*Location:* ${issue.ucName || activeUC.name}, Karachi
*Delivered by:* ${activeUC.chairman.name} (${activeUC.chairman.seatTitle})
*Action Taken:* ${workNote}
*Citizen Impact:* ${issue.affectedCount} residents served

🔍 *View verified Before & After evidence on Karachi Civic:*
${shareUrl}

#KarachiWorks #KarachiCivic #GoodGovernance`;

  const twitterMessage = `✅ WORK COMPLETED: "${issue.title}" in ${issue.ucName || activeUC.name} has been resolved with verified ground evidence! Delivered by ${activeUC.chairman.name}. Impacting ${issue.affectedCount} residents. @KarachiCivic #KarachiWorks #GoodGovernance`;

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
          text: `✅ ${issue.title} in ${issue.ucName || activeUC.name} has been resolved by ${activeUC.chairman.name}!`,
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

  // Generate downloadable canvas composite card
  const handleDownloadCard = async () => {
    setIsGeneratingImage(true);
    showToast("Generating high-resolution Work Done card...");

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 700;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas context not supported");
      }

      // Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 700);
      bgGrad.addColorStop(0, "#090d16");
      bgGrad.addColorStop(0.5, "#0b1523");
      bgGrad.addColorStop(1, "#042f2e");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 700);

      // Header Banner
      ctx.fillStyle = "#0d9488";
      ctx.beginPath();
      ctx.arc(50, 45, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#2dd4bf";
      ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
      ctx.fillText("KARACHI CIVIC PLATFORM", 75, 52);

      // Verified Pill
      ctx.fillStyle = "#059669";
      ctx.roundRect(880, 25, 270, 44, 22);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
      ctx.fillText("✓ WORK COMPLETED", 920, 53);

      // Helper function to load image
      const loadImage = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = url;
        });
      };

      // Load both images with fallback
      try {
        const [imgBefore, imgAfter] = await Promise.all([
          loadImage(beforePhotoUrl),
          loadImage(afterPhotoUrl),
        ]);

        // Draw Before Photo Box
        ctx.save();
        ctx.roundRect(50, 100, 530, 360, 16);
        ctx.clip();
        ctx.drawImage(imgBefore, 50, 100, 530, 360);
        ctx.restore();

        // Draw After Photo Box
        ctx.save();
        ctx.roundRect(620, 100, 530, 360, 16);
        ctx.clip();
        ctx.drawImage(imgAfter, 620, 100, 530, 360);
        ctx.restore();
      } catch (imgErr) {
        console.warn("Could not load external image onto canvas, using fallback placeholders", imgErr);
        // Fallback placeholder blocks
        ctx.fillStyle = "#1e293b";
        ctx.roundRect(50, 100, 530, 360, 16);
        ctx.fill();
        ctx.roundRect(620, 100, 530, 360, 16);
        ctx.fill();
      }

      // Labels on images
      // Before Badge
      ctx.fillStyle = "rgba(185, 28, 28, 0.9)";
      ctx.roundRect(65, 115, 200, 32, 8);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.fillText("🚨 1. BEFORE (REPORTED)", 78, 137);

      // After Badge
      ctx.fillStyle = "rgba(5, 150, 105, 0.95)";
      ctx.roundRect(635, 115, 230, 32, 8);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.fillText("✅ 2. AFTER (RESOLVED)", 648, 137);

      // Footer Container
      ctx.fillStyle = "#0f172a";
      ctx.roundRect(50, 480, 1100, 180, 16);
      ctx.fill();
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Issue Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
      const displayTitle = issue.title.length > 55 ? issue.title.slice(0, 52) + "..." : issue.title;
      ctx.fillText(displayTitle, 80, 530);

      // Location & Official Attribution
      ctx.fillStyle = "#2dd4bf";
      ctx.font = "600 20px system-ui, -apple-system, sans-serif";
      ctx.fillText(`📍 ${issue.ucName || activeUC.name} • ${activeUC.townName}`, 80, 570);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "500 18px system-ui, -apple-system, sans-serif";
      ctx.fillText(
        `Delivered by: ${activeUC.chairman.name} (UC Chairman) • ${issue.affectedCount} Citizens Served`,
        80,
        605
      );

      ctx.fillStyle = "#64748b";
      ctx.font = "14px system-ui, sans-serif";
      ctx.fillText(`Verified on Karachi Civic Platform • ${shareOrigin}`, 80, 638);

      // Trigger download
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `karachi-work-done-${issue.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast("Work Done Card downloaded successfully!");
    } catch (err) {
      console.error("Canvas error:", err);
      // Fallback: download the after-photo directly
      const a = document.createElement("a");
      a.href = afterPhotoUrl;
      a.download = `karachi-fix-photo-${issue.id}.jpg`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast("Resolution photo downloaded!");
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
                  Ready to Share
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Share your completed civic fix with Before &amp; After evidence on social platforms
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
              <span>Fix Verified</span>
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-rose-600/90 text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
                1. Before
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-600/95 text-white text-[9px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5" />
                <span>2. After (Fix)</span>
              </div>
              <div className="absolute bottom-1.5 left-1.5 text-[10px] text-emerald-300 font-medium flex items-center gap-1">
                <span>📍 GPS Verified</span>
              </div>
            </div>
          </div>

          {/* Issue Meta Details */}
          <div className="space-y-1.5 pt-1">
            <h4 className="font-extrabold text-sm text-white leading-snug">
              {issue.title}
            </h4>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-teal-400 font-semibold">
                <MapPin className="w-3 h-3" />
                <span>{issue.ucName || activeUC.name}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Building2 className="w-3 h-3 text-amber-400" />
                <span>{activeUC.chairman.name} (Chairman)</span>
              </span>
            </div>

            <p className="text-[11px] text-slate-300 italic bg-slate-800/60 p-2 rounded-lg border border-slate-700/50 leading-relaxed">
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
              className="py-2.5 px-2 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingImage ? "Saving..." : "Save Image"}</span>
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
          <p className="text-[11px] text-slate-500">
            Open 7-day citizen confirmation window. Neighbours can confirm &amp; rate the fix.
          </p>
        </div>
      </div>
    </div>
  );
};
