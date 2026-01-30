"use client";

import React from "react";
import { motion } from "framer-motion";

export function SummitMap() {
  return (
    <div className="relative w-full h-48 md:h-64 bg-white/50 rounded-2xl border border-stone-gray/10 overflow-hidden flex items-center justify-center">
      {/* Simple Topographic Abstraction */}
      <svg
        className="w-full h-full absolute inset-0 text-stone-gray/20"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,150 C100,100 200,180 400,120"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M0,180 C150,150 250,200 400,160"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>

      {/* The Main Path */}
      <svg className="w-3/4 h-3/4 z-10 overflow-visible" viewBox="0 0 300 100">
        {/* Path Line */}
        <motion.path
          d="M10,80 C80,80 100,20 150,20 S220,80 290,50"
          fill="none"
          stroke="#66BB6A" // Sage Leaf
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Start Node */}
        <circle cx="10" cy="80" r="4" fill="#66BB6A" />

        {/* End Node (Flag) */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <circle cx="290" cy="50" r="6" fill="#66BB6A" />
          <path d="M290,50 L290,10" stroke="#66BB6A" strokeWidth="2" />
          <path d="M290,10 L310,20 L290,30" fill="#66BB6A" />
        </motion.g>
      </svg>
    </div>
  );
}
