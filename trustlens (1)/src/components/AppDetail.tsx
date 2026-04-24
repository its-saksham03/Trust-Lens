import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Info, 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  History, 
  Globe, 
  FileText,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSimulatedInstalledApps, formatScore, cn } from '@/lib/utils';
import { analyzeAppPrivacy } from '@/lib/gemini';

export default function AppDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [app, setApp] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getSimulatedInstalledApps().find(a => a.packageName === id);
    if (!data) {
      navigate('/');
      return;
    }
    setApp(data);
    
    // Trigger AI analysis simulation
    const runAnalysis = async () => {
      setLoading(true);
      const res = await analyzeAppPrivacy(data.name, data.category, data.permissions);
      setAnalysis(res);
      setLoading(false);
    };
    runAnalysis();
  }, [id]);

  if (!app) return null;

  const scoreData = formatScore(app.trustScore);

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
      className="max-w-5xl mx-auto space-y-8 pb-12"
    >
      <motion.button 
        variants={item}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-bold group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Dashboard</span>
      </motion.button>

      {/* Header Card */}
      <motion.div variants={item} className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 flex items-center justify-center rounded-2xl p-2 shrink-0">
            <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">{app.name}</h3>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{app.category} | {app.packageName}</span>
          </div>
        </div>

        <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="40" cy="40" r="36" stroke="#f1f5f9" strokeWidth="8" fill="none" />
            <motion.circle 
              initial={{ strokeDashoffset: 226.2 }}
              animate={{ strokeDashoffset: 226.2 - (226.2 * app.trustScore) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="40" cy="40" r="36" 
              stroke={app.trustScore < 55 ? "#ef4444" : "#10b981"} 
              strokeWidth="8" 
              strokeDasharray="226.2" 
              fill="none" 
              strokeLinecap="round"
            />
          </svg>
          <span className={cn("absolute inset-0 flex items-center justify-center text-sm font-bold", app.trustScore < 55 ? "text-red-600" : "text-emerald-600")}>
            {app.trustScore}%
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {app.trustScore < 55 && (
            <motion.div variants={item} className="bg-red-50 p-6 rounded-xl border border-red-100">
              <h4 className="text-red-700 font-bold text-xs uppercase mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Critical Security Alert
              </h4>
              <p className="text-red-800 text-sm leading-relaxed">
                Permission Mismatch detected: This app requested sensitive identifiers including <b>Contacts</b> and <b>SMS access</b> which are unnecessary for a {app.category} application.
              </p>
            </motion.div>
          )}

          <motion.div variants={item} className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-lg">AI Intelligence Analysis</h3>
            </div>
            
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-slate-50 rounded w-full"></div>
                <div className="h-4 bg-slate-50 rounded w-5/6"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-slate-600 text-sm leading-relaxed">
                  {analysis?.summary || "Analyzing app package and manifest data..."}
                </p>

                {analysis?.permissionGaps && analysis.permissionGaps.length > 0 && (
                  <div className="p-4 rounded-xl border border-red-100 bg-red-50/50 mt-4">
                    <h4 className="text-red-800 font-bold text-xs mb-3 flex items-center gap-2 uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" /> Unjustified Permissions
                    </h4>
                    <ul className="space-y-2">
                       {analysis.permissionGaps.map((gap: string, idx: number) => (
                         <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                            <span className="mt-1 text-red-500 shrink-0">•</span> {gap}
                         </li>
                       ))}
                    </ul>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                   <div className="p-5 rounded-xl border border-slate-100 bg-slate-50 flex flex-col gap-2">
                      <h4 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-500" /> Community Sentiment
                      </h4>
                      <div className="text-2xl font-black text-slate-800">
                        {analysis?.sentimentScore ? `${analysis.sentimentScore}/100` : "N/A"}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">Based on recent user reviews and privacy concern reports modeled by our AI engine.</p>
                   </div>
                   
                   <div className="p-5 rounded-xl border border-blue-100 bg-blue-50/50 flex flex-col gap-2">
                      <h4 className="text-blue-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-blue-500" /> TrustLens Recommendation
                      </h4>
                      <p className="text-sm text-blue-900 leading-relaxed font-medium mt-1">
                        {analysis?.recommendation || "Maintain standard privacy hygiene and update settings."}
                      </p>
                   </div>
                </div>
                
                <div className="space-y-5 mt-6 border-t border-slate-100 pt-6">
                   <MetricRow 
                      label="Data Collection Risk" 
                      score={100 - (analysis?.trustScore || app.trustScore || 50)} 
                      color={app.trustScore < 55 ? "bg-red-500" : "bg-orange-400"} 
                      labelColor={app.trustScore < 55 ? "text-red-600" : "text-orange-600"} 
                      status={app.trustScore > 70 ? 'Low' : 'Elevated'} 
                   />
                   <MetricRow 
                      label="Community Trust" 
                      score={analysis?.sentimentScore || 50} 
                      color="bg-blue-500" 
                      labelColor="text-blue-600" 
                      status={(analysis?.sentimentScore || 0) > 60 ? 'Positive' : 'Negative'} 
                   />
                </div>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
              <button className="py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-100">Deep Scan</button>
              <button className="py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-all">Uninstall App</button>
            </div>
          </motion.div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
           {app.trustScore < 55 && (
             <motion.section variants={item} className="bg-white rounded-xl border border-red-200 p-6 shadow-sm shadow-red-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-0 opacity-50"></div>
                <div className="relative z-10">
                  <h4 className="font-bold flex items-center gap-2 mb-4 text-red-800">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    Safer Alternatives
                  </h4>
                  <div className="space-y-3">
                    {app.category === "Tools" ? (
                      <>
                        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 cursor-pointer">
                          <div>
                            <div className="font-bold text-sm text-slate-800">Secure Calc Pro</div>
                            <div className="text-xs text-slate-500">Zero network permissions</div>
                          </div>
                          <span className="text-emerald-600 font-bold text-sm">95%</span>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 cursor-pointer">
                          <div>
                            <div className="font-bold text-sm text-slate-800">Standard Calc</div>
                            <div className="text-xs text-slate-500">Open source</div>
                          </div>
                          <span className="text-emerald-600 font-bold text-sm">90%</span>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 cursor-pointer">
                          <div>
                            <div className="font-bold text-sm text-slate-800">Signal Private Messenger</div>
                            <div className="text-xs text-slate-500">E2E Encryption</div>
                          </div>
                          <span className="text-emerald-600 font-bold text-sm">98%</span>
                        </motion.div>
                      </>
                    )}
                  </div>
                </div>
             </motion.section>
           )}

           <motion.section variants={item} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold flex items-center gap-2 mb-4 text-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Standard Protections
              </h4>
              <ul className="space-y-3">
                {app.permissions.slice(0, 4).map((perm: string) => (
                  <li key={perm} className="flex items-center gap-3 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {perm} access verified
                  </li>
                ))}
              </ul>
           </motion.section>

           <motion.section variants={item} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold flex items-center gap-2 mb-4 text-slate-800">
                <Globe className="w-5 h-5 text-blue-400" />
                Community Sentiment
              </h4>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 italic text-xs text-slate-600 leading-relaxed">
                  "Too many permissions. Why does a calculator need my location?"
                </div>
              </div>
           </motion.section>

           <motion.section variants={item} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold flex items-center gap-2 mb-4 text-slate-800">
                <FileText className="w-5 h-5 text-slate-400" />
                Legal Documents
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-all cursor-pointer group">
                   <span className="text-xs font-medium text-slate-700">Privacy Policy</span>
                   <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-all cursor-pointer group">
                   <span className="text-xs font-medium text-slate-700">Terms of Service</span>
                   <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-600" />
                </div>
              </div>
           </motion.section>
        </div>
      </div>
    </motion.div>
  );
}

function MetricRow({ label, score, color, labelColor, status }: any) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold mb-1.5">
        <span className="text-slate-700">{label}</span>
        <span className={labelColor}>{status}</span>
      </div>
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div className={cn("h-full transition-all duration-1000", color)} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );
}

function PermissionCard({ permission, category }: { permission: string; category: string }) {
  const isSuspicious = (permission === 'CONTACTS' || permission === 'SMS' || permission === 'LOCATION') && category === 'Tools';
  
  return (
    <div className={cn(
      "p-4 rounded-2xl border transition-all flex items-start gap-3",
      isSuspicious ? "bg-red-50 border-red-100" : "bg-white border-gray-100"
    )}>
      {isSuspicious ? (
        <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
      )}
      <div>
        <h5 className={cn("text-sm font-bold", isSuspicious ? "text-red-900" : "text-gray-900")}>
          {permission}
        </h5>
        <p className={cn("text-xs mt-1", isSuspicious ? "text-red-700" : "text-gray-500")}>
          {isSuspicious 
            ? `Extremely abnormal for a ${category} app to request this.` 
            : `Standard usage for ${category} features.`
          }
        </p>
      </div>
    </div>
  );
}
