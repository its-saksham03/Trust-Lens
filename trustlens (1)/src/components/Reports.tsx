import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ShieldAlert, FileText, ChevronRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Reports() {
  const reports = [
    {
      id: 1,
      title: "Weekly Summary: April 17 - April 23",
      status: "Safe",
      scans: 42,
      risks: 0,
      date: "April 23, 2026"
    },
    {
      id: 2,
      title: "Weekly Summary: April 10 - April 16",
      status: "Warning",
      scans: 38,
      risks: 2, // e.g. Flashlight Ultra
      date: "April 16, 2026"
    },
    {
      id: 3,
      title: "Monthly Deep Scan Audit",
      status: "Safe",
      scans: 104,
      risks: 1,
      date: "April 1, 2026"
    }
  ];

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
      className="p-8 max-w-5xl mx-auto w-full"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#1A1A1A]">Privacy Reports</h1>
          <p className="text-slate-500 mt-2">Historical scan data and automated weekly insights.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Export All Data
        </motion.button>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Verified</div>
          <div className="text-4xl font-black text-[#1A1A1A]">142</div>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Threats Blocked</div>
          <div className="text-4xl font-black text-red-500">3</div>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Avg Trust Score</div>
          <div className="text-4xl font-black text-emerald-500">88.4</div>
        </motion.div>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold">Generated Reports</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {reports.map((report) => (
            <motion.div 
              key={report.id} 
              whileHover={{ backgroundColor: "rgba(248, 250, 252, 1)" }}
              className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer"
            >
              <div className="flex items-start mb-4 sm:mb-0">
                <div className={`p-3 rounded-2xl mr-4 ${report.status === 'Safe' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {report.status === 'Safe' ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A1A]">{report.title}</h3>
                  <div className="text-sm text-slate-500 mt-1">
                    {report.date} &bull; {report.scans} apps scanned
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                {report.risks > 0 && (
                  <span className="font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    {report.risks} Risks Found
                  </span>
                )}
                <div className="w-10 h-10 rounded-full border border-slate-200 flex flex-col items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all text-slate-400">
                  <motion.div className="group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
