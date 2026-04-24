import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, Lock, Chrome, Github, Fingerprint } from 'lucide-react';
import { signInWithPopup, signInAnonymously } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useTranslation } from 'react-i18next';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { t } = useTranslation();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-blue-100/50 border border-gray-100 p-10 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -ml-16 -mb-16 opacity-50"></div>
        
        <div className="relative">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">TrustLens</h1>
            <p className="text-gray-500 font-medium mt-1">Know What Your Apps Know.</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-4 border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 hover:border-blue-100 transition-all shadow-sm"
            >
              <Chrome className="w-5 h-5 text-red-500" />
              Continue with Google
            </button>
            
            <button className="w-full flex items-center justify-center gap-3 py-4 border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest text-gray-400 font-black px-4 bg-white">
                Or
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all font-medium" 
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all font-medium" 
                />
              </div>
              
              <button 
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-300 transition-all active:scale-[0.98]"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </div>

            <div className="pt-6 flex flex-col items-center gap-4">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors"
              >
                {isLogin ? "Don't have an account? Join Now" : "Already registered? Sign In"}
              </button>
              
              <button 
                onClick={handleGuestLogin}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Fingerprint className="w-4 h-4" />
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
