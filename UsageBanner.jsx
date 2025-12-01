import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Crown, TrendingUp, Sparkles, ShoppingCart, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

export default function UsageBanner({ usage, feature }) {
  if (!usage) return null;

  // Credit-based system
  const credits = usage.credits || 0;
  const isLowCredits = credits < 100; // Less than 1 video
  const isOutOfCredits = credits === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`mb-6 md:mb-8 glass rounded-2xl md:rounded-3xl border-2 p-4 md:p-6 ${
        isOutOfCredits
          ? "border-red-500/50 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10"
          : isLowCredits
          ? "border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10"
          : "border-cyan-500/50 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10"
      }`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${
          isOutOfCredits
            ? "bg-gradient-to-br from-red-500 to-orange-600"
            : isLowCredits
            ? "bg-gradient-to-br from-yellow-500 to-orange-600"
            : "bg-gradient-to-br from-cyan-500 to-blue-600"
        }`}>
          {isOutOfCredits ? (
            <AlertCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
          ) : (
            <Coins className="w-6 h-6 md:w-7 md:h-7 text-white" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-bold text-white mb-1">
            {isOutOfCredits
              ? "⚠️ Out of Credits"
              : isLowCredits
              ? "⚡ Low Credit Balance"
              : "💎 Credit Balance"}
          </h3>
          <p className="text-xs md:text-sm text-gray-300">
            {isOutOfCredits ? (
              <>
                You need credits to generate content. <span className="font-bold text-purple-400">Buy credits to continue!</span>
              </>
            ) : isLowCredits ? (
              <>
                You have <span className="font-bold text-yellow-400">{credits} credits</span> remaining.
                {feature === 'video_generations' 
                  ? ` That's ${Math.floor(credits / 100)} videos.`
                  : ` That's ${Math.floor(credits / 10)} images.`}
              </>
            ) : (
              <>
                You have <span className="font-bold text-cyan-400">{credits} credits</span>.
                {feature === 'video_generations' 
                  ? ` That's ${Math.floor(credits / 100)} videos or ${Math.floor(credits / 10)} images.`
                  : ` That's ${Math.floor(credits / 10)} images or ${Math.floor(credits / 100)} videos.`}
              </>
            )}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            💡 100 credits = 1 video • 10 credits = 1 image • Credits never expire
          </p>
        </div>

        <a href={createPageUrl("Pricing")}>
          <Button 
            className={`flex-shrink-0 ${
              isOutOfCredits || isLowCredits
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            } text-white font-bold shadow-lg h-10 md:h-12 px-4 md:px-6`}
          >
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            <span className="hidden md:inline">Buy Credits</span>
            <span className="md:hidden">Top Up</span>
          </Button>
        </a>
      </div>
    </motion.div>
  );
}