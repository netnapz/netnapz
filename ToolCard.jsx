import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Star, TrendingUp, Crown, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ToolDetailModal from "./ToolDetailModal";
import { base44 } from "@/api/base44Client";

export default function ToolCard({ tool, index }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleVisitClick = async (e) => {
    e.stopPropagation();
    
    // Track the click
    try {
      await base44.functions.invoke('trackToolClick', {
        tool_id: tool.id,
        tool_name: tool.name,
        click_type: tool.is_sponsored ? 'sponsored' : (tool.is_featured ? 'featured' : 'direct'),
        referrer: window.location.pathname
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }

    // Determine which link to use
    let linkToOpen = tool.external_link;
    
    // If custom affiliate link is set, use it
    if (tool.custom_affiliate_link) {
      linkToOpen = tool.custom_affiliate_link;
    }
    // Otherwise, Skimlinks will auto-convert the regular link
    
    // Open in new tab
    window.open(linkToOpen, '_blank', 'noopener,noreferrer');
  };

  const getPricingColor = (pricing) => {
    switch (pricing) {
      case "free":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "freemium":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "paid":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getSponsorBadge = (tier) => {
    const badges = {
      bronze: { color: "from-orange-400 to-orange-600", text: "Sponsored" },
      silver: { color: "from-gray-300 to-gray-500", text: "Premium Partner" },
      gold: { color: "from-yellow-400 to-yellow-600", text: "Gold Partner" },
      platinum: { color: "from-purple-400 to-pink-600", text: "Platinum Partner" }
    };
    
    if (tier && tier !== "none") {
      const badge = badges[tier];
      return (
        <Badge className={`bg-gradient-to-r ${badge.color} text-white border-0 flex items-center gap-1`}>
          <Crown className="w-3 h-3" />
          {badge.text}
        </Badge>
      );
    }
    return null;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.3 }}
        onClick={handleClick}
        className={`group relative glass rounded-3xl border ${
          tool.is_sponsored 
            ? 'border-yellow-500/50 shadow-xl shadow-yellow-500/10' 
            : 'border-gray-200/50 dark:border-gray-700/50'
        } overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2`}
      >
        {/* Sponsored glow effect */}
        {tool.is_sponsored && (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
        )}

        {/* Featured badge */}
        {tool.is_featured && !tool.is_sponsored && (
          <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10">
            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg flex items-center gap-1 text-xs">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </Badge>
          </div>
        )}

        {/* Sponsor badge */}
        {tool.is_sponsored && (
          <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10">
            {getSponsorBadge(tool.sponsor_tier)}
          </div>
        )}

        {/* 📱 MOBILE: Compact layout */}
        <div className="p-4 md:p-8">
          {/* Logo - smaller on mobile */}
          <div className="relative mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden">
              {tool.logo_url ? (
                <img
                  src={tool.logo_url}
                  alt={tool.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl md:text-2xl font-black text-gray-400">
                  {tool.name.charAt(0)}
                </span>
              )}
            </div>
          </div>

          {/* Content - more compact on mobile */}
          <h3 className="text-lg md:text-2xl font-black text-gray-900 dark:text-white mb-2 md:mb-3 leading-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
            {tool.name}
          </h3>

          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6 leading-relaxed line-clamp-2 md:line-clamp-3">
            {tool.description}
          </p>

          {/* Tags - hide on mobile if more than 2 */}
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
              {tool.tags.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 md:px-3 md:py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Stats bar - more compact on mobile */}
          <div className="flex items-center justify-between mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-200 dark:border-gray-700 text-xs md:text-sm">
            {/* Rating */}
            {tool.rating && (
              <div className="flex items-center gap-1.5">
                <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current" />
                <span className="font-bold text-gray-900 dark:text-white">
                  {tool.rating.toFixed(1)}
                </span>
              </div>
            )}

            {/* Click count - hide on mobile if no rating */}
            {tool.click_count > 0 && (
              <div className="hidden md:flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  {tool.click_count.toLocaleString()} clicks
                </span>
              </div>
            )}

            {/* Pricing */}
            <Badge className={`${getPricingColor(tool.pricing)} text-xs`}>
              {tool.pricing === "freemium" ? "Free + Paid" : tool.pricing}
            </Badge>
          </div>

          {/* CTA Button - more compact on mobile */}
          <button
            onClick={handleVisitClick}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 md:px-6 md:py-4 text-sm md:text-base ${
              tool.is_sponsored
                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700'
                : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
            } text-white rounded-xl md:rounded-2xl font-bold transition-all duration-300 group-hover:shadow-xl`}
          >
            <span>Visit</span>
            <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>

          {/* Affiliate indicator - hide on mobile */}
          {tool.affiliate_enabled && (
            <div className="mt-2 md:mt-3 text-center hidden md:block">
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" />
                Affiliate link - We may earn commission
              </span>
            </div>
          )}
        </div>
      </motion.div>

      <ToolDetailModal
        tool={tool}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}