import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldQuestion, 
  LayoutDashboard, 
  User as UserIcon, 
  FileText, 
  Globe, 
  Bell, 
  LogOut,
  ChevronRight,
  Search,
  Scan,
  Download,
  AlertTriangle,
  Info,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import DeviceMonitor from './DeviceMonitor';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);
  // Using state to allow clearing alerts for empty state demo
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: '⚠️ High Risk App Installed',
      body: 'Flashlight Ultra has been classified as DANGEROUS. Review its permissions immediately.',
      time: 'Just now',
      read: false,
      type: 'danger'
    },
    {
      id: 2,
      title: '🚨 Data Breach Detected: TikTok',
      body: 'A CRITICAL severity breach impacting TikTok has been reported. Check your exposure.',
      time: '2 hours ago',
      read: false,
      type: 'warning'
    },
    {
      id: 3,
      title: 'New App Scanned: WhatsApp',
      body: 'TrustLens has verified WhatsApp as SAFE. Standard permissions detected.',
      time: '1 day ago',
      read: true,
      type: 'safe'
    }
  ]);

  const unreadCount = alerts.filter(a => !a.read).length;

  const handleAlertClick = () => {
    if (!alertsOpen) {
      setIsLoadingAlerts(true);
      setAlertsOpen(true);
      // Simulate network request loading time
      setTimeout(() => {
        setIsLoadingAlerts(false);
      }, 600);
    } else {
      setAlertsOpen(false);
    }
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ShieldCheck, label: 'Reports', path: '/reports' },
    { icon: UserIcon, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] text-[#1A1A1A]">
      <DeviceMonitor />
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3 text-blue-600">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">TL</div>
          <span className="text-xl font-bold tracking-tight">TrustLens</span>
        </div>

        <nav className="flex-1 py-4">
          <div className="px-6 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Security Suite</div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-6 py-3 transition-all",
                location.pathname === item.path 
                  ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-semibold" 
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
          
          <div className="px-6 py-4 mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Legal & System</div>
          <Link to="/about" className="flex items-center px-6 py-3 text-slate-600 hover:bg-slate-50 transition-colors">
            <Info className="w-5 h-5 mr-3" /> About TrustLens
          </Link>
          <Link to="/privacy" className="flex items-center px-6 py-3 text-slate-600 hover:bg-slate-50 transition-colors">
            <FileText className="w-5 h-5 mr-3" /> Privacy Policy
          </Link>
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-100 p-3 rounded-lg text-xs text-slate-500">
            Status: <span className="text-emerald-600 font-bold uppercase">Real-Time Active</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center text-sm">
            <span className="text-slate-400">Welcome back,</span>
            <span className="font-semibold ml-1">{profile?.name || 'Alexander Rossi'}</span>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => (window as any).simulateInstall?.()}
              className="flex items-center gap-2 bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <Download className="w-3.5 h-3.5" />
              Developer: Push App Install
            </button>
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 hover:bg-white hover:shadow-sm hover:border-slate-300 transition-all"
              title="Toggle Language"
            >
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                🌐
              </div>
              {i18n.language === 'hi' ? 'हिंदी (Hindi)' : 'English'}
            </button>
            <div className="relative">
              <div className="relative cursor-pointer" onClick={handleAlertClick}>
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                <Bell className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" />
              </div>
              
              <AnimatePresence>
                {alertsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-4 w-96 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden z-50 backdrop-blur-xl"
                  >
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <h3 className="font-bold text-[#1A1A1A]">Notifications</h3>
                      <div className="flex gap-3">
                         <button 
                           onClick={markAllAsRead}
                           className="text-xs text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                         >
                           Mark read
                         </button>
                         <button 
                           onClick={clearAllAlerts}
                           className="text-xs text-slate-500 font-semibold hover:text-red-600 transition-colors"
                         >
                           Clear
                         </button>
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto bg-slate-50/30">
                      {isLoadingAlerts ? (
                        <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
                          <p className="text-sm font-medium">Syncing alerts...</p>
                        </div>
                      ) : alerts.length === 0 ? (
                        <div className="p-12 flex flex-col items-center justify-center text-slate-400 text-center">
                          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                             <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                          </div>
                          <p className="font-bold text-slate-700">You're all caught up!</p>
                          <p className="text-xs mt-1">No new security alerts.</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 p-2">
                          {alerts.map(alert => (
                            <div 
                              key={alert.id} 
                              className={cn(
                                "p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group",
                                !alert.read ? 'shadow-sm' : 'opacity-70 shadow-none',
                                alert.type === 'danger' ? 'bg-red-50/30 border-red-100 hover:border-red-300' :
                                alert.type === 'warning' ? 'bg-amber-50/30 border-amber-100 hover:border-amber-300' :
                                'bg-emerald-50/30 border-emerald-100 hover:border-emerald-300'
                              )}
                            >
                              <div className={cn(
                                "absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl transition-colors",
                                alert.type === 'danger' ? 'bg-red-500' :
                                alert.type === 'warning' ? 'bg-amber-500' :
                                'bg-emerald-500'
                              )}></div>
                              
                              <div className="flex items-start gap-3 pl-2">
                                <div className={cn(
                                  "mt-1 p-2 rounded-full",
                                  alert.type === 'danger' ? 'bg-red-100 text-red-600' :
                                  alert.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                  'bg-emerald-100 text-emerald-600'
                                )}>
                                  {alert.type === 'danger' && <AlertTriangle className="w-4 h-4" />}
                                  {alert.type === 'warning' && <ShieldAlert className="w-4 h-4" />}
                                  {alert.type === 'safe' && <ShieldCheck className="w-4 h-4" />}
                                </div>
                                <div>
                                  <div className={cn(
                                    "text-sm font-bold",
                                    !alert.read ? 'text-[#1A1A1A]' : 'text-slate-700'
                                  )}>
                                    {alert.title}
                                  </div>
                                  <div className="text-xs text-slate-600 mt-1 leading-snug">{alert.body}</div>
                                  <div className="text-[10px] text-slate-400 mt-2 uppercase tracking-wide font-semibold">{alert.time}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="p-3 border-t border-slate-100 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors text-center text-xs font-bold text-slate-500">
                      View full history
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 uppercase">
              {profile?.name?.charAt(0) || 'U'}
            </div>
            <button 
              onClick={logout}
              className="text-slate-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#F8F9FB]">
          {children}
        </div>
      </main>
    </div>
  );
}
