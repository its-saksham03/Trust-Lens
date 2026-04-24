import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number) {
  if (score >= 85) return { label: "Very Safe", color: "text-green-500", bg: "bg-green-50", border: "border-green-200" };
  if (score >= 70) return { label: "Safe", color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" };
  if (score >= 55) return { label: "Moderate", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" };
  if (score >= 40) return { label: "Risky", color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200" };
  return { label: "Dangerous", color: "text-red-500", bg: "bg-red-50", border: "border-red-200" };
}

const DEFAULT_APPS = [
  { packageName: "com.facebook.katana", name: "Facebook", category: "Social", permissions: ["CAMERA", "LOCATION", "CONTACTS", "MICROPHONE"], icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg", trustScore: 42 },
  { packageName: "com.whatsapp", name: "WhatsApp", category: "Communication", permissions: ["CAMERA", "CONTACTS", "MICROPHONE", "STORAGE"], icon: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg", trustScore: 78 },
  { packageName: "com.google.android.apps.maps", name: "Google Maps", category: "Navigation", permissions: ["LOCATION", "STORAGE"], icon: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg", trustScore: 85 },
  { packageName: "com.calculator.tool", name: "Super Calc", category: "Tools", permissions: ["CONTACTS", "SMS", "LOCATION"], icon: "https://cdn-icons-png.flaticon.com/512/2344/2344132.png", trustScore: 12 },
  { packageName: "com.spotify.music", name: "Spotify", category: "Entertainment", permissions: ["STORAGE", "MICROPHONE"], icon: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg", trustScore: 72 }
];

export function getSimulatedInstalledApps() {
  const stored = localStorage.getItem('trustlens_apps');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('trustlens_apps', JSON.stringify(DEFAULT_APPS));
  return DEFAULT_APPS;
}

export function addSimulatedApp(app: any) {
  const apps = getSimulatedInstalledApps();
  // Prevent duplicate insertion
  if (!apps.find((a: any) => a.packageName === app.packageName)) {
    apps.unshift(app);
    localStorage.setItem('trustlens_apps', JSON.stringify(apps));
    window.dispatchEvent(new Event('trustlens_apps_updated'));
  }
}

