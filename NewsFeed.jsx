import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Newspaper, ExternalLink, Clock, Sparkles, Loader2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default function NewsFeed() {
  const { data: newsItems = [], isLoading } = useQuery({
    queryKey: ["newsFeed"],
    queryFn: () => base44.entities.NewsFeedItem.list("-created_date", 12),
  });

  // Get fallback image based on category
  const getFallbackImage = (category) => {
    const images = {
      no_code: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
      ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      startup: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
      tool_update: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
      industry_news: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=400&fit=crop',
      tutorial: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop'
    };
    return images[category] || images.industry_news;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (newsItems.length === 0) {
    return null;
  }

  const featuredNews = newsItems.filter(item => item.is_featured).slice(0, 3);
  const regularNews = newsItems.filter(item => !item.is_featured);

  return (
    <section className="pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-xl opacity-60"></div>
              <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Newspaper className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
                📰 Latest News & Updates
              </h2>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                Fresh insights from the no-code & AI world
              </p>
            </div>
          </div>

          {/* Featured News - 📱 MOBILE: 2 COLUMNS! */}
          {featuredNews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
              {featuredNews.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={item.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group glass rounded-2xl md:rounded-3xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  {/* Image/Header - smaller on mobile */}
                  <div className="h-32 md:h-40 relative flex items-center justify-center overflow-hidden">
                    <img 
                      src={item.image_url || getFallbackImage(item.category)} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-500', 'via-purple-600', 'to-pink-600');
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <Badge className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/90 text-purple-600 border-0 text-xs shadow-lg">
                      Featured
                    </Badge>
                  </div>

                  {/* Content - more compact on mobile */}
                  <div className="p-3 md:p-6">
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                      <Badge variant="outline" className="text-xs">
                        {item.category?.replace('_', ' ')}
                      </Badge>
                      <span className="hidden md:flex text-xs text-gray-500 dark:text-gray-400 items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(item.published_date || item.created_date), { addSuffix: true })}
                      </span>
                    </div>

                    <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 md:line-clamp-3">
                      {item.summary}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-semibold truncate">{item.source}</span>
                      <ExternalLink className="w-3 h-3 md:w-4 md:h-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex-shrink-0" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          )}

          {/* Regular News - Compact List - 📱 MOBILE: 2 COLUMNS! */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
            {regularNews.slice(0, 6).map((item, index) => (
              <motion.a
                key={item.id}
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 p-3 md:p-4 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center flex-shrink-0 mx-auto md:mx-0 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                    <img 
                      src={item.image_url || getFallbackImage(item.category)} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const icon = document.createElement('div');
                        icon.innerHTML = '<svg class="w-6 h-6 md:w-8 md:h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>';
                        e.target.parentElement.appendChild(icon.firstChild);
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {item.category?.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <h4 className="text-xs md:text-sm font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {item.title}
                    </h4>
                    
                    <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="truncate">{item.source}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(item.published_date || item.created_date), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center mt-4 md:mt-6">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              🤖 Curated daily by AI • Sources: TechCrunch, ProductHunt, Medium & more
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}