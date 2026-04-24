import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldMinus, 
  Zap, 
  ChevronRight,
  TrendingDown,
  Info,
  Smartphone,
  Loader2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSimulatedInstalledApps, formatScore, cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { t } = useTranslation();
  const [apps, setApps] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, safe: 0, moderate: 0, risky: 0 });
  
  // Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanText, setScanText] = useState("Initializing ADB bridge...");

  useEffect(() => {
    loadApps();
    window.addEventListener('trustlens_apps_updated', loadApps);
    return () => window.removeEventListener('trustlens_apps_updated', loadApps);
  }, []);

  const loadApps = () => {
    const installed = getSimulatedInstalledApps();
    setApps(installed);

    const safe = installed.filter(a => a.trustScore >= 70).length;
    const moderate = installed.filter(a => a.trustScore >= 55 && a.trustScore < 70).length;
    const risky = installed.filter(a => a.trustScore < 55).length;

    setStats({ total: installed.length, safe, moderate, risky });
  };

  const startDeviceScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanText("Requesting PackageManager access...");
    
    setTimeout(() => { setScanProgress(25); setScanText("Extracting application manifests..."); }, 1500);
    setTimeout(() => { setScanProgress(50); setScanText("Querying TrustLens Intel Database..."); }, 3000);
    setTimeout(() => { setScanProgress(80); setScanText("Analyzing zero-day permission gaps..."); }, 4500);
    setTimeout(() => { 
      setScanProgress(100); 
      setScanText("Sync complete."); 
      setTimeout(() => setIsScanning(false), 1000);
      loadApps(); 
    }, 6000);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-8 relative"
    >
      {/* Device Scan Modal */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full border border-slate-200 shadow-2xl flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 relative">
                 <Smartphone className="w-8 h-8 text-blue-600" />
                 {scanProgress < 100 ? (
                   <Loader2 className="w-20 h-20 text-blue-600 absolute inset-0 animate-spin opacity-20" />
                 ) : (
                   <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="absolute -bottom-2 -right-2 bg-white rounded-full p-1"
                   >
                     <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100" />
                   </motion.div>
                 )}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Syncing Device...</h3>
              <p className="text-sm text-slate-500 font-mono mb-6 min-h-10">{scanText}</p>
              
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${scanProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={item} className="flex justify-between items-end">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Security Overview</h1>
           <p className="text-slate-500 text-sm mt-1">Continuous monitoring active for known device.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startDeviceScan}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm shadow-blue-200"
        >
          <Smartphone className="w-4 h-4" /> Sync Phone
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -4 }}>
          <StatCard label="Total Apps Scanned" value={stats.total} icon={Zap} bg="bg-white" iconBg="bg-blue-100" iconColor="text-blue-600" />
        </motion.div>
        <motion.div whileHover={{ y: -4 }}>
          <StatCard label="Safe Applications" value={stats.safe} icon={ShieldCheck} bg="bg-white" iconBg="bg-emerald-100" iconColor="text-emerald-600" />
        </motion.div>
        <motion.div whileHover={{ y: -4 }}>
          <StatCard label="Moderate Risk" value={stats.moderate} icon={ShieldMinus} bg="bg-white" iconBg="bg-orange-100" iconColor="text-orange-600" />
        </motion.div>
        <motion.div whileHover={{ y: -4 }}>
          <StatCard label="High Risk Detected" value={stats.risky} icon={ShieldAlert} bg="bg-white" iconBg="bg-red-100" iconColor="text-red-600" />
        </motion.div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-12 gap-6">
        {/* Recent Scans / App List */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-slate-200 flex flex-col shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
               Intelligence Activity
               {isScanning && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
            </h2>
            <button onClick={startDeviceScan} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              Scan New App
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-bold flex items-center gap-2">Application</th>
                  <th className="px-6 py-4 font-bold">Trust Score</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm border-t border-slate-100">
                <AnimatePresence>
                  {apps.map((app) => {
                    const scoreInfo = formatScore(app.trustScore);
                    return (
                      <motion.tr 
                        key={app.packageName}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ backgroundColor: "rgba(248, 250, 252, 1)" }}
                        layout
                        className="border-b border-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 flex items-center gap-3 font-medium text-slate-800">
                          <motion.div 
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-8 h-8 rounded-lg border border-slate-100 bg-white p-1"
                          >
                            <img src={app.icon} className="w-full h-full object-contain" alt="" />
                          </motion.div>
                          {app.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn("font-bold text-lg", scoreInfo.color)}>{app.trustScore}%</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest",
                            scoreInfo.bg,
                            scoreInfo.color.replace('text-', 'text-')
                          )}>
                            {scoreInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/app/${app.packageName}`} className="text-blue-600 font-bold hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg flex inline-flex items-center gap-1 group">
                            View Report <motion.div className="group-hover:translate-x-1 transition-transform"><ChevronRight className="w-3 h-3" /></motion.div>
                          </Link>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <div className="p-3 text-center border-t border-slate-100 text-[11px] text-slate-400 font-mono tracking-wide uppercase bg-slate-50/50">
            System Bridge: WebApp Sandbox (Simulated Local API)
          </div>
        </div>

        {/* Alerts / Tips Panel */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
           <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col gap-3 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
             <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 z-10 shrink-0">
               <ShieldAlert className="w-5 h-5" />
             </div>
             <div className="z-10">
               <h4 className="font-bold text-slate-800 text-sm">Critical Security Alert</h4>
               <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">"Super Calc" is requesting access to your SMS and Contacts. This is unnecessary for a calculator.</p>
               <button className="mt-4 text-blue-600 font-bold text-xs hover:underline transition-all">Review Mismatch</button>
             </div>
          </motion.div>
          
           <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col gap-3 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 z-10 shrink-0">
               <TrendingDown className="w-5 h-5" />
             </div>
             <div className="z-10">
               <h4 className="font-bold text-slate-800 text-sm">Sentiment Shift</h4>
               <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">Facebook score dropped 12% due to new community reports regarding unauthorized background location tracking.</p>
               <button className="mt-4 text-blue-600 font-bold text-xs hover:underline transition-all">Read Intel Report</button>
             </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ label, value, icon: Icon, bg, iconBg, iconColor }: any) {
  return (
    <div className={cn("p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4", bg)}>
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0", iconBg, iconColor)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{label}</div>
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const { color } = formatScore(score);
  return (
    <div className={cn("w-3 h-3 rounded-full animate-pulse", color.replace('text-', 'bg-'))}></div>
  );
}

import { Scan } from 'lucide-react';
