import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Shield, Bell, Key, LogOut, Info, ChevronRight } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { profile, logout } = useAuth();
  
  const [preferences, setPreferences] = useState({
    pushNotifications: true,
    weeklyReport: true,
    breachAlerts: true,
    installAlerts: true
  });

  const togglePref = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
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
      className="p-8 max-w-4xl mx-auto space-y-8 w-full"
    >
      <motion.div variants={item} className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-[#1A1A1A]">Your Profile</h1>
        <p className="text-slate-500 mt-2">Manage your account and privacy settings.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Details */}
        <motion.div variants={item} className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-black uppercase mb-4">
              {profile?.name?.charAt(0) || 'U'}
            </div>
            <h2 className="text-xl font-bold text-[#1A1A1A]">{profile?.name || 'User'}</h2>
            <p className="text-sm text-slate-500">{profile?.email}</p>
            <span className="mt-4 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full flex items-center">
              <Shield className="w-3 h-3 mr-1" /> Account Verified
            </span>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="w-full flex items-center justify-center p-4 bg-white border border-red-100 rounded-2xl text-red-600 font-bold hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" /> Sign Out
          </motion.button>
        </motion.div>

        {/* Preferences */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={item} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold flex items-center">
                <Bell className="w-5 h-5 text-blue-600 mr-2" /> Notification Preferences
              </h3>
              <p className="text-sm text-slate-500 mt-1">Control how and when TrustLens alerts you.</p>
            </div>
            
            <div className="divide-y divide-slate-100">
              <ToggleRow 
                title="Master Push Notifications" 
                desc="Allow native OS push alerts."
                active={preferences.pushNotifications}
                onToggle={() => togglePref('pushNotifications')}
              />
              <ToggleRow 
                title="Real-Time Install Alerts" 
                desc="Get notified the second a new app is installed."
                active={preferences.installAlerts}
                onToggle={() => togglePref('installAlerts')}
              />
              <ToggleRow 
                title="Zero-Day Breach Alerts" 
                desc="Immediate pings if one of your apps is compromised."
                active={preferences.breachAlerts}
                onToggle={() => togglePref('breachAlerts')}
              />
              <ToggleRow 
                title="Weekly Privacy Report" 
                desc="A summary payload every Monday morning."
                active={preferences.weeklyReport}
                onToggle={() => togglePref('weeklyReport')}
              />
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
             <h3 className="text-lg font-bold flex items-center mb-4">
                <Key className="w-5 h-5 text-blue-600 mr-2" /> Security
              </h3>
              <p className="text-sm text-slate-500 mb-6">Your authentication is securely managed by Firebase. TrustLens never stores your raw password.</p>
              <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                Manage Login Provider
              </button>
          </motion.div>

          <motion.div variants={item} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
             <Link to="/about" className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group">
               <div>
                  <h3 className="text-lg font-bold flex items-center">
                    <Info className="w-5 h-5 text-blue-600 mr-2" /> About TrustLens
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Read our mission, how scoring works, and contact us.</p>
               </div>
               <div className="w-10 h-10 rounded-full border border-slate-200 flex flex-col items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all text-slate-400">
                 <motion.div className="group-hover:translate-x-1 transition-transform">
                   <ChevronRight className="w-5 h-5" />
                 </motion.div>
               </div>
             </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function ToggleRow({ title, desc, active, onToggle }: { title: string, desc: string, active: boolean, onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between p-6">
      <div>
        <div className="font-semibold text-[#1A1A1A]">{title}</div>
        <div className="text-sm text-slate-500">{desc}</div>
      </div>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${active ? 'bg-blue-600' : 'bg-slate-200'}`}
      >
        <motion.div 
          initial={false}
          animate={{ x: active ? 24 : 0 }}
          className="w-4 h-4 rounded-full bg-white shadow-sm"
        />
      </button>
    </div>
  )
}
