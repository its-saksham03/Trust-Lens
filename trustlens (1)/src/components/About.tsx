import React from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Zap, Activity, Mail, MessageCircle } from 'lucide-react';

export default function About() {
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
      className="p-8 max-w-4xl mx-auto space-y-12 w-full pb-16"
    >
      <motion.div variants={item} className="text-center space-y-4 pt-4">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white rotate-3 shadow-lg shadow-blue-200">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-[#1A1A1A]">About TrustLens</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Bringing absolute transparency to the mobile ecosystem. We decode the opaque world of app permissions so you don't have to.
        </p>
      </motion.div>

      <motion.section variants={item} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-full -z-0 opacity-50"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              Our Mission
            </h2>
            <p className="text-slate-600 leading-relaxed">
              In an era where "free" applications often commoditize your personal data, TrustLens stands as your definitive line of defense. 
              Our mission is to democratize mobile security by instantly surfacing hidden privacy risks, unmasking aggressive data collection, and providing 
              actionable intelligence through advanced AI analysis.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section variants={item} className="space-y-6">
        <h2 className="text-2xl font-bold px-2">How Our Engine Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center font-bold text-lg">01</div>
            <div>
              <h3 className="font-bold text-slate-800 mb-2">Manifest Extraction</h3>
              <p className="text-sm text-slate-600 leading-relaxed">We locally intercept and analyze the target app's binary manifest, mapping every hardware and software privilege requested.</p>
            </div>
          </motion.div>
          
          <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">02</div>
            <div>
              <h3 className="font-bold text-slate-800 mb-2">AI Contextual Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Our Gemini AI model compares requested privileges against the app's declared category (e.g., checking if a Calculator truly needs GPS).</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg">03</div>
            <div>
              <h3 className="font-bold text-slate-800 mb-2">Trust Score Generation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">A weighted algorithm combines AI mismatch scoring, zero-day breach feeds, and community sentiment into a single unified health metric.</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section variants={item} className="bg-slate-900 rounded-3xl p-8 shadow-sm text-white flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-400" />
            Support & Intelligence
          </h2>
          <p className="text-slate-400 max-w-md">
            Having trouble making sense of an advanced scan? Need to report a malicious developer? Our team is available 24/7.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 transition-colors rounded-xl font-bold text-sm flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" /> support@trustlens.ai
          </button>
          <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" /> Priority Chat
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}
