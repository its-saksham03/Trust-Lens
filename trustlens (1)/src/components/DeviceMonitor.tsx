import React, { useState, useEffect } from 'react';
import { analyzeAppPrivacy } from '@/lib/gemini';
import { addSimulatedApp } from '@/lib/utils';
import { AlertTriangle, Download, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DeviceMonitor() {
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Expose to window for easy demo trigger
    (window as any).simulateInstall = async () => {
      // 1. Initial State
      setNotification({ type: 'scanning', name: 'Flashlight Max' });

      // 2. Mock App Setup
      const newApp = {
        packageName: `com.malicious.flashlight.${Date.now()}`,
        name: "Flashlight Max",
        category: "Tools",
        permissions: ["CAMERA", "LOCATION", "MICROPHONE", "CONTACTS"],
        icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔦</text></svg>",
        trustScore: 0
      };

      // 3. Background AI Scan
      const analysis = await analyzeAppPrivacy(newApp.name, newApp.category, newApp.permissions);
      
      newApp.trustScore = analysis?.trustScore || 15;
      
      // 4. Save & Trigger UI updates
      addSimulatedApp(newApp);

      // 5. In-App Notification
      setNotification({
        type: 'result',
        app: newApp,
        analysis
      });

      // 6. Native Web (OS-level) Notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification('TrustLens Security Alert', {
          body: `New app "${newApp.name}" installed. Trust Score: ${newApp.trustScore}%. ${analysis?.summary || 'Review permissions immediately.'}`,
          icon: newApp.icon
        });
      }

      setTimeout(() => setNotification(null), 8000);
    };
  }, []);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div 
          initial={{ opacity: 0, y: 50, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 w-80 bg-white border border-slate-200 shadow-2xl rounded-xl overflow-hidden"
        >
          {notification.type === 'scanning' ? (
             <div className="p-4 flex items-center gap-4 bg-slate-50">
               <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                 <Zap className="w-5 h-5 text-blue-600 animate-pulse" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-slate-800">New App Detected</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{notification.name}</p>
                  <p className="text-xs text-blue-600 mt-1 font-semibold flex items-center gap-1">Analyzing privacy...</p>
               </div>
             </div>
          ) : (
             <div className="p-4 flex items-start gap-4 bg-red-50/50">
               <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200">
                 <AlertTriangle className="w-5 h-5 text-red-600" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-slate-800">Security Alert: {notification.app.name}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-3">
                    {notification.analysis?.summary || "High risk app detected matching malicious signatures."}
                  </p>
                  <a href={`/app/${notification.app.packageName}`} className="text-xs mt-2 font-bold text-red-600 hover:underline block">
                    View Threat Report &rarr;
                  </a>
               </div>
             </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
