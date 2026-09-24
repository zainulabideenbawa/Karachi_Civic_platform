"use client";

import React from "react";
import { useCivic } from "@/context/CivicContext";
import { CheckCircle2, RotateCcw, X } from "lucide-react";

export const Toast: React.FC = () => {
  const { toast, dismissToast } = useCivic();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 w-[92%] max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-xl border border-slate-700 dark:border-slate-300 flex items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <p className="text-xs font-medium leading-tight truncate">
            {toast.text}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {toast.undoAction && (
            <button
              onClick={() => {
                toast.undoAction?.();
                dismissToast();
              }}
              className="flex items-center gap-1 text-xs font-bold text-amber-400 dark:text-amber-600 hover:underline px-2 py-0.5 rounded cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{toast.undoLabel || "Undo"}</span>
            </button>
          )}

          <button
            onClick={dismissToast}
            className="text-slate-400 hover:text-white dark:hover:text-slate-900 p-0.5"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
