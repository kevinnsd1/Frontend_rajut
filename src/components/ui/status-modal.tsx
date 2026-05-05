"use client";

import * as React from "react";
import { CheckCircle2, XCircle, Info, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export type StatusModalType = "success" | "error" | "info" | "loading";

interface StatusModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  type: StatusModalType;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export function StatusModal({
  isOpen,
  onOpenChange,
  type,
  title,
  description,
  actionText = "Tutup",
  onAction,
}: StatusModalProps) {
  
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-12 w-12 text-emerald-500" />;
      case "error":
        return <XCircle className="h-12 w-12 text-rose-500" />;
      case "info":
        return <Info className="h-12 w-12 text-blue-500" />;
      case "loading":
        return <Loader2 className="h-12 w-12 text-primary animate-spin" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-50",
          glow: "shadow-emerald-200/50",
          button: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200",
        };
      case "error":
        return {
          bg: "bg-rose-50",
          glow: "shadow-rose-200/50",
          button: "bg-rose-600 hover:bg-rose-700 shadow-rose-200",
        };
      case "info":
        return {
          bg: "bg-blue-50",
          glow: "shadow-blue-200/50",
          button: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
        };
      case "loading":
        return {
           bg: "bg-primary/5",
           glow: "shadow-primary-200/50",
           button: "bg-primary hover:opacity-90 shadow-primary-200",
        };
    }
  };

  const colors = getColors();

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[380px] overflow-hidden border-none p-0 bg-white/80 backdrop-blur-xl shadow-2xl ring-1 ring-black/5">
        <div className="relative p-8 flex flex-col items-center text-center">
          {/* Background Gradient Glow */}
          <div className={cn(
            "absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 blur-3xl rounded-full -z-10 opacity-20",
            type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
          )} />

          <div className={cn(
            "mb-6 flex h-20 w-20 items-center justify-center rounded-2xl shadow-xl transition-all duration-500 ease-out animate-in zoom-in-50 fade-in-0 fill-mode-both",
            colors.bg,
            colors.glow
          )}>
            {getIcon()}
          </div>

          <AlertDialogHeader className="flex flex-col items-center space-y-2 p-0">
            <AlertDialogTitle className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </AlertDialogTitle>
            {description && (
              <AlertDialogDescription className="text-base text-muted-foreground max-w-[280px]">
                {description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>

          <AlertDialogFooter className="w-full mt-8 flex-row justify-center sm:justify-center p-0 bg-transparent border-none">
            <AlertDialogAction
              onClick={onAction}
              className={cn(
                "w-full h-12 rounded-xl text-white font-semibold text-lg transition-all duration-200 active:scale-95 shadow-lg",
                colors.button
              )}
            >
              {actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
