
import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { TrendingUp, ExternalLink, Flame, Sparkles, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TrendingFeed() {
  const { data: trendingTools = [], isLoading } = useQuery({
    queryKey: ["trendingTools"],
    queryFn: () => base44.entities.TrendingTool.filter({ is_active: true }, "-trending_score", 10),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (trendingTools.length === 0) {
    return null; // Don't show if no trending tools
  }

  return (
    <section className="pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl blur-xl opacity-60 animate-pulse"></div>
              <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Flame className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                🔥 Trending Now
              </h2>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                Hot tools the community is talking about
              </p>
            </div>
          </div>

          {/* Trending Tools Grid - 📱 MOBILE: 2 COLUMNS! */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {trendingTools.map((tool, index) => (
              <motion.a
                key={tool.id}
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 p-3 md:p-4 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {/* Trending Badge */}
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 flex items-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3" />
                    #{index + 1}
                  </Badge>
                  <div className="hidden md:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Flame className="w-3 h-3 text-orange-500" />
                    {tool.trending_score || 0}
                  </div>
                </div>

                {/* Tool Info */}
                <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {tool.tool_name}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 md:mb-3 line-clamp-2">
                  {tool.description}
                </p>

                {/* Tags - only show 2 on mobile */}
                <div className="flex flex-wrap gap-1 mb-2 md:mb-3">
                  {tool.tags?.slice(0, 2).map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                    {tool.source}
                  </span>
                  <ExternalLink className="w-3 h-3 md:w-4 md:h-4 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex-shrink-0" />
                </div>
              </motion.a>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="text-center mt-4 md:mt-6">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              🤖 Auto-updated daily by AI web scraping
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
