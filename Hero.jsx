/*
 * NetNapz Entertainment Hub - Hero Component
 * © 2025 NetNapz. All Rights Reserved.
 */

import React from "react";
import { Search, Sparkles, TrendingUp, Rocket, Music, Users, Zap, Crown, Calendar, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero({ onSearchChange, searchQuery, onAskNapz }) {
  const handleAsk = (e) => {
    e.preventDefault();
    if (searchQuery && searchQuery.trim()) {
      onAskNapz(searchQuery);
    }
  };

  const quickSearches = [
    "Billboard Top 10", 
    "YouTube Drama", 
    "TikTok Trends", 
    "Celebrity Feuds", 
    "New Music Releases",
    "UFC News",
    "Twitter Controversies",
    "Streaming Platform Updates"
  ];

  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden px-4 py-8 md:py-12">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6907bbc1d9a3081c7edf7dd0/de7781c73_create-a-cool-grafity-logo-for-red-splat-handprint-with-the-text-netnapzpunk-style-high-quality.jpg"
          alt="NetNapz Punk Style Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/85"></div>
        <div className="absolute inset-0 bg-[size:50px_50px] bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center w-full">
        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl mb-8 border-3 border-black shadow-lg">
            <Sparkles className="w-5 h-5 text-black" />
            <span className="text-sm font-black text-black uppercase tracking-wider">
              DAILY ENTERTAINMENT NEWS • AUTO-UPDATES • CLICK ARTICLES FOR SOURCES
            </span>
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-8xl font-black text-black mb-4 md:mb-6 leading-[1.1] tracking-tight">
            ENTERTAINMENT
            <span className="block mt-2 md:mt-3">
              <span className="text-yellow-500 drop-shadow-[3px_3px_0_black]">
                UNLEASHED
              </span>
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto leading-relaxed font-bold"
          >
            Real music charts • Creator drama • Viral moments • Tech news
            <span className="text-red-500 block mt-2">25+ fresh articles daily • Auto-reset 9 AM • Click for source links</span>
          </motion.p>
        </motion.div>

        {/* Premium Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative max-w-4xl mx-auto mb-8 md:mb-12"
        >
          <form onSubmit={handleAsk}>
            <div className="relative group">
              <div className="relative bg-white rounded-2xl border-3 border-black shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="relative flex items-center">
                  <div className="absolute left-6 md:left-8 flex items-center gap-4">
                    <Search className="w-6 h-6 md:w-7 md:h-7 text-gray-600" />
                    <div className="hidden md:block h-8 w-0.5 bg-gray-400"></div>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Ask about music charts, creator drama, viral trends, celebrity feuds, UFC news, streaming updates..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-20 md:pl-28 pr-36 md:pr-48 py-5 md:py-6 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-lg md:text-xl font-bold border-none"
                  />
                  
                  <button 
                    type="submit"
                    disabled={!searchQuery || !searchQuery.trim()}
                    className="absolute right-3 md:right-4 flex items-center gap-3 px-8 md:px-12 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-black text-base md:text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span className="hidden md:inline">SEARCH</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
          
          {/* Quick Search Tags */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="text-sm text-gray-600 font-black flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              TRENDING SEARCHES:
            </span>
            {quickSearches.map((example, i) => (
              <button
                key={i}
                onClick={() => onSearchChange(example)}
                className="px-4 py-2 bg-white border-2 border-gray-400 rounded-xl text-sm font-bold text-gray-700 hover:bg-yellow-200 hover:border-black transition-all duration-200 hover:scale-105"
              >
                {example}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Premium Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
        >
          {[
            { value: "25+", label: "Daily Articles", gradient: "from-red-500 to-pink-500", icon: TrendingUp },
            { value: "9AM", label: "Auto Reset", gradient: "from-purple-500 to-blue-500", icon: Calendar },
            { value: "CLICK", label: "Source Links", gradient: "from-green-500 to-teal-500", icon: ExternalLink },
            { value: "LIVE", label: "Real Images", gradient: "from-orange-500 to-yellow-500", icon: Rocket },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className="relative group"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-3 border-black p-4 md:p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center mb-3 mx-auto border-2 border-black`}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <div className={`text-2xl md:text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm font-black text-gray-700 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl border-3 border-black p-6 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <span className="text-lg font-black">REAL-TIME UPDATES • VERIFIED SOURCES • ENGAGEMENT METRICS</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold bg-black/20 px-4 py-2 rounded-xl">
              <Music className="w-4 h-4" />
              <span>MUSIC</span>
              <Users className="w-4 h-4" />
              <span>CREATORS</span>
              <Crown className="w-4 h-4" />
              <span>SPORTS</span>
              <Zap className="w-4 h-4" />
              <span>TECH</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}