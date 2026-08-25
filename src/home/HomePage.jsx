
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">

      {/* Ambient Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-600/20 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-indigo-600/20 blur-[160px] rounded-full animate-pulse" />
      </div>

      <Navbar />

      {/* Executive Data Ticker */}
      <div className="bg-[#0b1120] border-b border-white/5 text-xs text-gray-400 px-12 py-2 tracking-wide">
        Live System Status • Allocation Efficiency +87% • Asset Utilisation 84% • Governance Stable
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-7xl px-12 py-16">

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

    </div>
  );
};

export default HomePage;