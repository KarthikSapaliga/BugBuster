import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { AlertCircle, CheckCircle, Clock, PlayCircle, XCircle } from "lucide-react";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  if(!dateString) return null;
  return new Date(dateString).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
