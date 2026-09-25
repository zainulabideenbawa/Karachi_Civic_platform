"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, Sparkles, Share, PlusSquare } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PWAInstallDrawer: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true); // default true until client check
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed as PWA)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        // @ts-expect-error iOS Safari specific
        Boolean(window.navigator.standalone);
      setIsStandalone(isStandaloneMode);

      // Check if user dismissed previously in this session
      const dismissed = sessionStorage.getItem("kcp_pwa_dismissed");
      if (!isStandaloneMode && !dismissed) {
        setIsDismissed(false);
      }
    };

    checkStandalone();

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // Listen for beforeinstallprompt (Chrome / Android / Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!sessionStorage.getItem("kcp_pwa_dismissed")) {
        setIsDismissed(false);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsDismissed(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("kcp_pwa_dismissed", "true");
  };

  if (isStandalone || isDismissed) return null;

  return (
    <div className="fixed bottom-20 inset-x-3 z-40 max-w-md mx-auto animate-in slide-in-from-bottom-5 duration-300">
      <div className="relative bg-slate-900/95 dark:bg-slate-900/95 text-white backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-teal-500/40 ring-1 ring-white/10">
        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          aria-label="Dismiss install banner"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Main Banner Content */}
        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-md ring-2 ring-teal-400/20">
            <Smartphone className="w-6 h-6 text-white" />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-xs font-bold text-white tracking-wide">
                Install Karachi Civic App
              </h4>
              <span className="text-[10px] font-semibold bg-teal-500/20 text-teal-300 px-1.5 py-0.2 rounded-full border border-teal-400/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-teal-300" />
                <span>Fast &amp; Offline</span>
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug">
              Instant camera capture, GPS accuracy, and civic push alerts directly on your home screen.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>

          <button
            onClick={handleDismiss}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
          >
            Not Now
          </button>
        </div>

        {/* Guided Step Popup for iOS or Browsers without prompt */}
        {showIOSGuide && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-teal-500/40 text-xs space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between font-bold text-teal-300 text-[11px]">
              <span>📱 How to install on your phone:</span>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            {isIOS ? (
              <div className="text-[11px] text-slate-300 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Share className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>1. Tap the <strong>Share</strong> button at the bottom of Safari.</span>
                </div>
                <div className="flex items-center gap-2">
                  <PlusSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>2. Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>.</span>
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-slate-300 space-y-1.5">
                <div>1. Tap your browser menu (<strong>⋮</strong> three dots at the top right).</div>
                <div>2. Tap <strong>&ldquo;Install app&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
