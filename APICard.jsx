import React from "react";
import { motion } from "framer-motion";
import { 
  ExternalLink, 
  Star, 
  TrendingUp, 
  Shield,
  Zap,
  DollarSign,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function APICard({ api, index, onSelect }) {
  const pricingColors = {
    free: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    freemium: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    paid: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
    enterprise: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
  };

  const difficultyColors = {
    easy: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    moderate: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    advanced: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onSelect}
      className="group glass rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 relative overflow-hidden"
    >
      {/* Featured Badge */}
      {api.is_featured && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Featured
          </Badge>
        </div>
      )}

      {/* Verified Badge */}
      {api.is_verified && (
        <div className="absolute top-4 left-4">
          <Shield className="w-5 h-5 text-blue-500" />
        </div>
      )}

      {/* Logo & Title */}
      <div className="flex items-start gap-4 mb-4 mt-8">
        {api.logo_url ? (
          <img
            src={api.logo_url}
            alt={`${api.name} logo`}
            className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-gray-200 dark:border-gray-700"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-black text-white">
              {api.name.charAt(0)}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all truncate">
            {api.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {api.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      {api.tags && api.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {api.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-lg"
            >
              {tag}
            </span>
          ))}
          {api.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded-lg">
              +{api.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge className={pricingColors[api.pricing_model] || pricingColors.freemium}>
          <DollarSign className="w-3 h-3 mr-1" />
          {api.pricing_model.charAt(0).toUpperCase() + api.pricing_model.slice(1)}
        </Badge>

        {api.integration_difficulty && (
          <Badge className={difficultyColors[api.integration_difficulty]}>
            {api.integration_difficulty.charAt(0).toUpperCase() + api.integration_difficulty.slice(1)}
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
        {api.rating > 0 && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="font-semibold">{api.rating.toFixed(1)}</span>
            {api.review_count > 0 && (
              <span className="text-xs">({api.review_count})</span>
            )}
          </div>
        )}

        {api.click_count > 0 && (
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">{api.click_count} uses</span>
          </div>
        )}

        {api.bookmark_count > 0 && (
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="text-xs">{api.bookmark_count}</span>
          </div>
        )}
      </div>

      {/* CTA */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          window.open(api.documentation_url, '_blank');
        }}
        variant="outline"
        className="w-full group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:text-white group-hover:border-0"
      >
        View Documentation
        <ExternalLink className="w-4 h-4 ml-2" />
      </Button>

      {/* Free Tier Info */}
      {api.free_tier_limits && (
        <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
          <Zap className="w-3 h-3" />
          Free: {api.free_tier_limits}
        </p>
      )}
    </motion.div>
  );
}