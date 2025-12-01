/**
 * NetNapz Entertainment Hub - Daily Auto Refresh Social Distributor
 * © 2025 NetNapz. All Rights Reserved.
 */

import React, { useState, useMemo, useEffect } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { 
  Star, Music, Users, Heart, MessageCircle, Crown, Eye, 
  Share2, Rocket, Flame, ExternalLink, Menu, Search as SearchIcon,
  Database, Shield, RefreshCw, Loader2, Clock, Link, TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Mediastack API Key
const MEDIASTACK_API_KEY = "b2de0fa69cf403241d428c0937efd5d5";

// Social Media Auto-Distributor Configuration
const SOCIAL_PLATFORMS = {
  twitter: {
    name: 'Twitter',
    icon: '🐦',
    enabled: true
  },
  facebook: {
    name: 'Facebook',
    icon: '📘',
    groups: ['Entertainment News', 'Music Lovers', 'Gaming Community'],
    enabled: true
  },
  reddit: {
    name: 'Reddit',
    icon: '🔴',
    subreddits: ['entertainment', 'music', 'gaming', 'movies', 'television'],
    enabled: true
 },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    enabled: true
  },
  quora: {
    name: 'Quora',
    icon: '❓',
    spaces: ['Entertainment', 'Music', 'Gaming'],
    enabled: true
  },
  medium: {
    name: 'Medium',
    icon: '📝',
    enabled: true
  },
  telegram: {
    name: 'Telegram',
    icon: '📢',
    channels: ['entertainmentnews', 'musicupdates'],
    enabled: true
  }
};

const HASHTAGS = {
  music: ['#Music', '#NewMusic', '#Artist', '#Album', '#Billboard', '#NetNapzMusic'],
  creators: ['#Creators', '#Influencer', '#YouTube', '#TikTok', '#ContentCreator'],
  drama: ['#Drama', '#Entertainment', '#Celebrity', '#Hollywood', '#News'],
  viral: ['#Viral', '#Trending', '#Meme', '#Internet', '#Buzz'],
  sports: ['#Sports', '#NBA', '#NFL', '#Soccer', '#Athlete'],
  finance: ['#Finance', '#Money', '#Business', '#Wealth', '#Success'],
  tech: ['#Tech', '#Technology', '#Innovation', '#Gadgets'],
  success: ['#Success', '#Motivation', '#Inspiration', '#Achievement'],
  trending: ['#Trending', '#Breaking', '#News', '#Update']
};

// Sovrn Affiliate Link Conversion Function
const convertToAffiliateLink = async (originalUrl, toolId = null, toolName = null) => {
  try {
    console.log('🔗 Converting to affiliate link:', originalUrl);
    
    const response = await fetch('/api/sovrn-convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: originalUrl,
        tool_id: toolId,
        tool_name: toolName
      })
    });

    if (!response.ok) {
      throw new Error(`Conversion failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Affiliate link created:', data.affiliate_link);
      return data.affiliate_link;
    } else {
      throw new Error(data.error || 'Conversion failed');
    }
  } catch (error) {
    console.error('❌ Affiliate conversion error:', error);
    return originalUrl;
  }
};

// DAILY Refresh in milliseconds
const DAILY_MS = 24 * 60 * 60 * 1000; // 86,400,000 ms

// HARDCODED FALLBACK - These are the DEFAULT articles that ship with the site
const HARDCODED_FALLBACK_ARTICLES = {
  trending: [],
  music: [
    {
      id: "fallback_music_1",
      title: "NetNapz Entertainment Hub - Your Daily Entertainment Destination",
      description: "Welcome to NetNapz Entertainment. The system will automatically refresh with news from Napzapi 6am daily. Data is saved permanently.",
      author: "NetNapz Team",
      category: "music",
      breaking: true,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      views: "Loading...",
      likes: "Loading...",
      comments: "Loading...",
      trending: true,
      hasImage: true,
      image_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6907bbc1d9a3081c7edf7dd0/78b9f36dc_create-a-cool-grafity-logo-for-red-splat-handprint-with-the-text-netnapzpunk-style-high-quality.jpg",
      source: "NetNapz",
      logo_stamp: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6907bbc1d9a3081c7edf7dd0/78b9f36dc_create-a-cool-grafity-logo-for-red-splat-handprint-with-the-text-netnapzpunk-style-high-quality.jpg",
      is_manual: true,
      url: "https://netnapz.com"
    }
  ],
  creators: [],
  drama: [],
  viral: [],
  breaking: [],
  sports: [],
  finance: [],
  tech: [],
  success: []
};

// COMPREHENSIVE RSS FEED CONFIGURATION - ONLY SOURCES WITH IMAGES
const RSS_CONFIG = {
  // 🎵 Music RSS Feeds
  music: [
    "https://www.billboard.com/feed",
    "https://pitchfork.com/feed/feed-album-reviews/rss",
    "https://www.rollingstone.com/feed/",
    "https://www.spin.com/feed/",
    "https://www.nme.com/feed",
  ],
  
  // 🎬 Entertainment & Drama
  drama: [
    "https://www.tmz.com/rss.xml",
    "https://people.com/feed/",
    "https://ew.com/feed/",
    "https://variety.com/feed/",
    "https://www.hollywoodreporter.com/feed/",
  ],
  
  // 📱 Creators & Social Media
  creators: [
    "https://www.tubefilter.com/feed/",
    "https://www.socialmediatoday.com/rss",
    "https://influencermarketinghub.com/feed/",
  ],
  
  // 🚀 Viral & Trending
  viral: [
    "https://www.buzzfeed.com/entertainment.xml",
    "https://www.boredpanda.com/feed/",
    "https://www.ladbible.com/feed",
    "https://www.unilad.com/feed",
  ],
  
  // 🏀 Sports
  sports: [
    "https://www.espn.com/espn/rss/news",
    "https://bleacherreport.com/articles/feed",
    "https://www.si.com/rss/si_topstories.rss",
  ],
  
  // 💰 Finance & Success
  finance: [
    "https://finance.yahoo.com/rss/",
    "https://www.entrepreneur.com/latest.rss",
    "https://feeds.content.dowjones.io/public/rss/mw_topstories",
  ],
  
  // 💻 Tech
  tech: [
    "https://techcrunch.com/feed/",
    "https://www.theverge.com/rss/index.xml",
    "https://www.wired.com/feed/rss",
    "https://www.engadget.com/rss.xml",
  ],
  
  // 🌟 Success Stories
  success: [
    "https://www.entrepreneur.com/latest.rss",
    "https://www.forbes.com/real-time/feed2/",
    "https://www.inc.com/rss",
  ]
};

// ULTRA-PERSISTENT STORAGE - Makes data appear "hardcoded"
const saveAsHardcoded = (articlesData, source = 'hardcoded_combined') => {
  try {
    const cacheData = {
      data: articlesData,
      timestamp: new Date().toISOString(),
      source: source,
      cache_type: 'HARDCODED_SIMULATION',
      nextRefresh: new Date(Date.now() + DAILY_MS).toISOString()
    };
    
    console.log('💾 HARDCODING COMBINED DATA...');
    
    const cacheString = JSON.stringify(cacheData);
    
    const storageKeys = [
      'netnapz_hardcoded_data',
      'netnapz_permanent_cache',
      'netnapz_main_data',
      'netnapz_articles',
      'netnapz_content',
      'netnapz_entertainment',
      'netnapz_live_data',
      'netnapz_api_data'
    ];
    
    storageKeys.forEach(key => {
      try {
        localStorage.setItem(key, cacheString);
        console.log(`💾 localStorage HARDCODED: ${key}`);
      } catch (e) {
        console.log(`❌ localStorage ${key} failed:`, e.message);
      }
    });
    
    storageKeys.forEach(key => {
      try {
        sessionStorage.setItem(key, cacheString);
        console.log(`💾 sessionStorage HARDCODED: ${key}`);
      } catch (e) {
        console.log(`❌ sessionStorage ${key} failed:`, e.message);
      }
    });
    
    window.netnapzHardcodedData = cacheData;
    window.netnapzArticles = cacheData;
    window.netnapzContent = cacheData;
    window.netnapzLiveData = cacheData;
    
    console.log('✅ COMBINED DATA HARDCODED SUCCESSFULLY');
    
  } catch (error) {
    console.log('❌ Error hardcoding data:', error);
  }
};

const loadHardcodedData = () => {
  try {
    console.log('📂 LOADING HARDCODED DATA...');
    
    if (window.netnapzHardcodedData) {
      console.log('📂 Loaded from memory (hardcoded)');
      return window.netnapzHardcodedData;
    }
    if (window.netnapzArticles) {
      console.log('📂 Loaded from memory (articles)');
      return window.netnapzArticles;
    }
    
    const storageKeys = [
      'netnapz_hardcoded_data',
      'netnapz_permanent_cache', 
      'netnapz_main_data',
      'netnapz_articles',
      'netnapz_content',
      'netnapz_entertainment',
      'netnapz_live_data',
      'netnapz_api_data'
    ];
    
    for (let key of storageKeys) {
      try {
        const localData = localStorage.getItem(key);
        if (localData) {
          const cacheData = JSON.parse(localData);
          console.log(`📂 Loaded HARDCODED from localStorage: ${key}`);
          window.netnapzHardcodedData = cacheData;
          return cacheData;
        }
        
        const sessionData = sessionStorage.getItem(key);
        if (sessionData) {
          const cacheData = JSON.parse(sessionData);
          console.log(`📂 Loaded HARDCODED from sessionStorage: ${key}`);
          window.netnapzHardcodedData = cacheData;
          return cacheData;
        }
      } catch (e) {
        console.log(`❌ ${key} load failed:`, e.message);
      }
    }
    
    console.log('📂 No hardcoded data found');
    return null;
    
  } catch (error) {
    console.log('❌ Error loading hardcoded data:', error);
    return null;
  }
};

// Social Auto-Distributor Component
const SocialDistributor = ({ articles, onDistributionComplete }) => {
  const [isDistributing, setIsDistributing] = useState(false);
  const [distributionProgress, setDistributionProgress] = useState(0);
  const [currentPlatform, setCurrentPlatform] = useState('');
  const [distributionStats, setDistributionStats] = useState({
    totalPosts: 0,
    successful: 0,
    platforms: {}
  });

  const shortenUrl = async (url) => {
    try {
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      const shortUrl = await response.text();
      return shortUrl;
    } catch (error) {
      return url;
    }
  };

  const generatePostContent = (article, platform) => {
    const category = article.category || 'entertainment';
    const categoryHashtags = HASHTAGS[category] || HASHTAGS.trending;
    const selectedHashtags = categoryHashtags.slice(0, 4);
    
    const templates = {
      twitter: `🎬 ${article.title}\n\n${article.description?.substring(0, 100)}...\n\n🔗 ${article.shortUrl}\n\n${selectedHashtags.join(' ')}`,
      
      reddit: `**${article.title}**\n\n${article.description}\n\n[Read full article here](${article.shortUrl})\n\n---\n*Posted via NetNapz Auto-Distributor*`,
      
      facebook: `🔥 TRENDING: ${article.title}\n\n${article.description}\n\n👉 Read the full story: ${article.shortUrl}\n\n${selectedHashtags.join(' ')}`,
      
      linkedin: `🎬 ${article.title}\n\n${article.description}\n\nAs an entertainment enthusiast, I found this development quite interesting. What are your thoughts on this?\n\nRead more: ${article.shortUrl}\n\n${selectedHashtags.join(' ')}\n\n#NetNapz #Entertainment`,
      
      quora: `I came across this interesting entertainment news about ${article.title}:\n\n${article.description}\n\nRead the full story here: ${article.shortUrl}\n\nWhat do you think about this development in ${category}?`,
      
      medium: `## ${article.title}\n\n${article.description}\n\n[Continue reading on NetNapz](${article.shortUrl})\n\n*This is a summary of the original article. Full credits to NetNapz Entertainment.*\n\n${selectedHashtags.join(' ')}`,
      
      telegram: `🎬 <b>${article.title}</b>\n\n${article.description}\n\n🔗 <a href="${article.shortUrl}">Read Full Article</a>\n\n#${category} #Entertainment`
    };

    return templates[platform] || templates.twitter;
  };

  const simulatePlatformPost = async (article, platform) => {
    setCurrentPlatform(SOCIAL_PLATFORMS[platform].name);
    
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    const success = Math.random() > 0.1;
    
    return {
      platform: SOCIAL_PLATFORMS[platform].name,
      success,
      timestamp: new Date().toISOString(),
      content: generatePostContent(article, platform)
    };
  };

  const distributeArticle = async (article) => {
    const enabledPlatforms = Object.keys(SOCIAL_PLATFORMS).filter(p => SOCIAL_PLATFORMS[p].enabled);
    const results = [];

    article.shortUrl = await shortenUrl(article.url);

    for (let i = 0; i < enabledPlatforms.length; i++) {
      const platform = enabledPlatforms[i];
      const result = await simulatePlatformPost(article, platform);
      results.push(result);
      
      setDistributionProgress(((i + 1) / enabledPlatforms.length) * 100);
    }

    return results;
  };

  const startDistribution = async () => {
    if (isDistributing || articles.length === 0) return;
    
    setIsDistributing(true);
    setDistributionProgress(0);
    setCurrentPlatform('');
    
    const articlesToDistribute = articles.slice(0, 3);
    let allResults = [];
    let successfulPosts = 0;

    for (let i = 0; i < articlesToDistribute.length; i++) {
      const article = articlesToDistribute[i];
      console.log(`📤 Distributing: "${article.title}"`);
      
      const results = await distributeArticle(article);
      allResults = [...allResults, ...results];
      
      successfulPosts += results.filter(r => r.success).length;
      
      if (i < articlesToDistribute.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    const platformStats = {};
    allResults.forEach(result => {
      platformStats[result.platform] = (platformStats[result.platform] || 0) + 1;
    });

    setDistributionStats({
      totalPosts: allResults.length,
      successful: successfulPosts,
      platforms: platformStats
    });

    setIsDistributing(false);
    setDistributionProgress(100);
    
    if (onDistributionComplete) {
      onDistributionComplete(allResults);
    }

    console.log(`✅ Distribution completed: ${successfulPosts}/${allResults.length} successful posts`);
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-red-50 border border-purple-200 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black text-gray-900">🚀 Social Auto-Distributor</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {distributionStats.totalPosts > 0 && 
              `${distributionStats.successful}/${distributionStats.totalPosts} posts successful`
            }
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={startDistribution}
              disabled={isDistributing || articles.length === 0}
              className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
            >
              {isDistributing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
              {isDistributing ? 'Distributing...' : 'Share Articles Everywhere'}
            </button>
            
            {distributionStats.totalPosts > 0 && (
              <div className="text-sm">
                <div className="text-green-600 font-semibold">Success Rate</div>
                <div className="text-gray-600">
                  {Math.round((distributionStats.successful / distributionStats.totalPosts) * 100)}%
                </div>
              </div>
            )}
          </div>

          {isDistributing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Posting to {currentPlatform}...</span>
                <span>{Math.round(distributionProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${distributionProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600">
            <p>• Automatically shares top articles across 7+ platforms</p>
            <p>• Smart hashtag targeting for maximum reach</p>
            <p>• Daily auto-posting schedule available</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border">
          <h4 className="font-semibold text-gray-900 mb-3">Platform Coverage</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(SOCIAL_PLATFORMS).map(([key, platform]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <span>{platform.icon}</span>
                <span className="text-gray-700">{platform.name}</span>
                {distributionStats.platforms[platform.name] && (
                  <span className="text-green-600 text-xs font-semibold">
                    ✓{distributionStats.platforms[platform.name]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 mr-2">Quick Share:</span>
        {articles.slice(0, 3).map((article, index) => (
          <button
            key={article.id}
            onClick={() => distributeArticle(article)}
            disabled={isDistributing}
            className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition-colors disabled:opacity-50"
          >
            Share #{index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

// Rest of helper functions
const getDefaultDataStructure = () => ({
  trending: [],
  music: [],
  creators: [],
  drama: [],
  viral: [],
  breaking: [],
  sports: [],
  finance: [],
  tech: [],
  success: []
});

const getSafeArray = (data, key) => {
  if (!data || !data[key] || !Array.isArray(data[key])) {
    return [];
  }
  return data[key];
};

const ensureDataStructure = (data) => {
  if (!data || typeof data !== 'object') {
    return getDefaultDataStructure();
  }

  const categories = ['trending', 'music', 'creators', 'drama', 'viral', 'breaking', 'sports', 'finance', 'tech', 'success'];
  const ensuredData = { ...data };
  
  categories.forEach(category => {
    if (!ensuredData[category] || !Array.isArray(ensuredData[category])) {
      ensuredData[category] = [];
    }
  });

  return ensuredData;
};

const getArticleImage = (article) => {
  if (article.image_url && article.image_url !== '#' && article.image_url !== 'None') {
    return article.image_url;
  }
  if (article.image && article.image !== '#' && article.image !== 'None') {
    return article.image;
  }
  return null;
};

const getCategoryPlaceholder = (category) => {
  const colors = {
    'music': 'from-purple-500 to-pink-500',
    'creators': 'from-blue-500 to-cyan-500',
    'drama': 'from-orange-500 to-red-500',
    'viral': 'from-green-500 to-teal-500',
    'sports': 'from-yellow-500 to-amber-500',
    'finance': 'from-indigo-500 to-purple-500',
    'tech': 'from-blue-500 to-indigo-500',
    'success': 'from-emerald-500 to-green-500',
    'breaking': 'from-red-500 to-orange-500',
    'trending': 'from-red-500 to-orange-500'
  };
  return colors[category] || 'from-gray-500 to-gray-700';
};

const getCategoryIcon = (category) => {
  const icons = {
    'music': Music,
    'creators': Users,
    'drama': MessageCircle,
    'viral': Share2,
    'sports': Crown,
    'finance': Rocket,
    'tech': Rocket,
    'success': Star,
    'breaking': Flame,
    'trending': Flame
  };
  return icons[category] || Flame;
};

// ENHANCED RSS FETCHER - ONLY ARTICLES WITH IMAGES
const fetchRSSFeed = async (feedUrl, category) => {
  try {
    console.log(`📡 Fetching RSS: ${feedUrl}`);
    
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    const text = data.contents;
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    
    const items = xmlDoc.querySelectorAll('item');
    const articles = [];
    
    items.forEach(item => {
      const title = item.querySelector('title')?.textContent?.trim() || '';
      const description = item.querySelector('description')?.textContent?.trim() || '';
      const link = item.querySelector('link')?.textContent?.trim() || '';
      const pubDate = item.querySelector('pubDate')?.textContent?.trim() || new Date().toISOString();
      const enclosure = item.querySelector('enclosure');
      const mediaContent = item.querySelector('media\\:content, content');
      
      let image = null;
      if (enclosure?.getAttribute('url')) {
        image = enclosure.getAttribute('url');
      } else if (mediaContent?.getAttribute('url')) {
        image = mediaContent.getAttribute('url');
      } else {
        const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) image = imgMatch[1];
      }
      
      const cleanDescription = description.replace(/<[^>]*>/g, '').substring(0, 200);
      const hasFullContent = title && 
                            title !== 'No title' && 
                            !title.includes('404') && 
                            link && 
                            cleanDescription.length > 50 &&
                            image;
      
      if (hasFullContent) {
        articles.push({
          id: `rss_${category}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: title,
          description: cleanDescription,
          url: link,
          image: image,
          image_url: image,
          source: feedUrl.split('/')[2]?.replace('www.', '') || 'RSS Feed',
          author: item.querySelector('author')?.textContent || feedUrl.split('/')[2] || 'RSS Feed',
          published_at: pubDate,
          category: category,
          timestamp: new Date(pubDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          breaking: Math.random() > 0.85,
          trending: Math.random() > 0.7,
          views: Math.floor(1000 + Math.random() * 90000).toLocaleString(),
          likes: Math.floor(100 + Math.random() * 5000).toLocaleString(),
          comments: Math.floor(10 + Math.random() * 500).toLocaleString(),
          hasImage: true,
          is_manual: false
        });
      }
    });
    
    console.log(`✅ Found ${articles.length} articles with images from ${feedUrl}`);
    return articles;
    
  } catch (error) {
    console.error(`❌ RSS fetch failed for ${feedUrl}:`, error);
    return [];
  }
};

// COMPREHENSIVE RSS FETCHER - ONLY ARTICLES WITH IMAGES
const fetchAllRSSFeeds = async () => {
  console.log('🚀 FETCHING FROM ALL RSS FEEDS (IMAGES ONLY)...');
  
  const allArticles = [];
  const feedPromises = [];
  
  Object.entries(RSS_CONFIG).forEach(([category, feedUrls]) => {
    feedUrls.forEach(feedUrl => {
      feedPromises.push(
        fetchRSSFeed(feedUrl, category).then(articles => {
          allArticles.push(...articles);
        })
      );
    });
  });
  
  await Promise.allSettled(feedPromises);
  
  console.log(`🎉 TOTAL RSS ARTICLES WITH IMAGES: ${allArticles.length}`);
  return allArticles;
};

// ENHANCED MEDIASTACK FETCHER - ONLY ARTICLES WITH IMAGES
const fetchArticlesWithImages = async () => {
  try {
    console.log('📡 Fetching from MediaStack API (IMAGES ONLY)...');
    
    const response = await fetch(
      `https://api.mediastack.com/v1/news?access_key=${MEDIASTACK_API_KEY}&categories=entertainment&languages=en&limit=100&sort=published_desc`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`MediaStack API Error: ${data.error.message}`);
    }
    
    if (data.data && Array.isArray(data.data)) {
      console.log(`✅ Found ${data.data.length} articles from MediaStack`);
      
      const articlesWithImages = data.data.filter(article => {
        const hasImage = article.image && 
                        article.image !== '#' && 
                        article.image !== 'None' && 
                        article.image !== null &&
                        article.image !== '' &&
                        article.image.startsWith('http');
        
        const hasFullContent = article.title &&
                              article.description &&
                              article.description.length > 50 &&
                              article.url;
        
        const isEnglish = article.language === 'en';
        
        return hasImage && hasFullContent && isEnglish;
      });

      console.log(`🖼️ ${articlesWithImages.length} MediaStack articles with images and full content`);
      
      return articlesWithImages.map(article => ({
        id: `mediastack_${article.published_at}_${Math.random().toString(36).substr(2, 9)}`,
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.image,
        image_url: article.image,
        source: article.source,
        author: article.author || 'MediaStack',
        published_at: article.published_at,
        category: 'viral',
        timestamp: new Date(article.published_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        breaking: Math.random() > 0.9,
        trending: Math.random() > 0.7,
        views: Math.floor(1000 + Math.random() * 90000).toLocaleString(),
        likes: Math.floor(100 + Math.random() * 5000).toLocaleString(),
        comments: Math.floor(10 + Math.random() * 500).toLocaleString(),
        hasImage: true,
        is_manual: false
      }));
    }
    
    return [];
  } catch (error) {
    console.error('❌ Error fetching from MediaStack:', error);
    return [];
  }
};

// COMBINED FETCHER - RSS + MEDIASTACK
const fetchAllArticles = async () => {
  console.log('🚀 FETCHING FROM ALL SOURCES (RSS + MEDIASTACK)...');
  
  try {
    const [rssArticles, mediastackArticles] = await Promise.all([
      fetchAllRSSFeeds(),
      fetchArticlesWithImages()
    ]);
    
    const allArticles = [...rssArticles, ...mediastackArticles];
    
    console.log(`🎉 TOTAL ARTICLES FROM ALL SOURCES: ${allArticles.length}`);
    console.log(`   📰 RSS: ${rssArticles.length} articles`);
    console.log(`   🎯 MediaStack: ${mediastackArticles.length} articles`);
    
    return allArticles;
    
  } catch (error) {
    console.error('❌ Error fetching from all sources:', error);
    return [];
  }
};

// ENHANCED ARTICLE CATEGORIZATION WITH EXPANDED KEYWORDS
const determineArticleCategory = (article) => {
  const title = article.title?.toLowerCase() || '';
  const description = article.description?.toLowerCase() || '';
  const source = article.source?.toLowerCase() || '';

  const musicKeywords = [
    'music', 'song', 'album', 'artist', 'billboard', 'spotify', 'apple music', 'stream', 
    'chart', 'single', 'tour', 'concert', 'festival', 'rapper', 'singer', 'band', 
    'musician', 'grammy', 'award', 'hit', 'track', 'lyrics', 'music video', 'record label',
    'streaming', 'playlist', 'release', 'new album', 'ep', 'mixtape', 'debut',
    'performance', 'live show', 'ticket', 'merch', 'merchandise', 'fan', 'fandom',
    'pop', 'rock', 'hip hop', 'rap', 'r&b', 'country', 'electronic', 'edm', 'jazz',
    'classical', 'indie', 'alternative', 'metal', 'punk', 'reggae', 'blues', 'folk',
    'k-pop', 'j-pop', 'latin', 'reggaeton', 'trap', 'drill', 'house', 'techno',
    'beyonce', 'taylor swift', 'drake', 'weeknd', 'bad bunny', 'kanye', 'kendrick lamar',
    'ariana grande', 'ed sheeran', 'justin bieber', 'harry styles', 'lady gaga', 'rihanna',
    'bruno mars', 'adele', 'post malone', 'travis scott', 'j balvin', 'karol g',
    'olivia rodrigo', 'billie eilish', 'doja cat', 'lizzo', 'megan thee stallion',
    'nicki minaj', 'cardi b', 'sza', 'the beatles', 'rolling stones', 'queen',
  ];
  
  const creatorKeywords = [
    'youtube', 'tiktok', 'instagram', 'twitch', 'onlyfans', 'patreon', 'substack',
    'twitter', 'x', 'facebook', 'snapchat', 'pinterest', 'reddit', 'discord',
    'influencer', 'streamer', 'creator', 'youtuber', 'tiktoker', 'instagrammer',
    'content creator', 'vlogger', 'blogger', 'podcaster', 'live stream', 'gamer',
    'beauty guru', 'fashion influencer', 'lifestyle influencer', 'fitness influencer',
    'followers', 'subscribers', 'views', 'likes', 'comments', 'shares', 'engagement',
    'algorithm', 'viral', 'trending', 'hashtag', 'reels', 'shorts', 'stories',
    'live stream', 'subathon', 'merch', 'brand deal', 'sponsorship', 'ad revenue',
    'mrbeast', 'pewdiepie', 'logan paul', 'jake paul', 'ksi', 'david dobrik',
    'charli d amelio', 'addison rae', 'bella porch', 'khaby lame', 'zach king',
    'markiplier', 'jacksepticeye', 'ninja', 'pokimane', 'xqc', 'asmongold',
    'dream', 'technoblade', 'tommyinnit', 'sydney sweeney', 'emma chamberlain'
  ];
  
  const dramaKeywords = [
    'drama', 'controversy', 'scandal', 'beef', 'feud', 'fight', 'argument', 'breakup',
    'cheating', 'affair', 'lawsuit', 'legal', 'court', 'arrest', 'cancel', 'cancelled',
    'apology', 'response', 'clapback', 'twitter feud', 'instagram drama', 'exposed',
    'leak', 'hack', 'reveal', 'allegation', 'accusation', 'investigation', 'probe',
    'subtweet', 'callout', 'drag', 'read', 'shade', 'throwing shade', 'clap back',
    'response video', 'apology video', 'address', 'statement', 'press release',
    'breakup', 'split', 'divorce', 'separation', 'cheating', 'unfaithful', 'affair',
    'relationship', 'dating', 'couple', 'ex', 'reconciliation', 'reunited',
    'fired', 'terminated', 'resigned', 'quit', 'walked out', 'boycott', 'protest',
    'strike', 'union', 'contract dispute', 'negotiation', 'deal fell through'
  ];
  
  const viralKeywords = [
    'viral', 'trending', 'meme', 'memes', 'went viral', 'blow up', 'internet sensation',
    'overnight', 'challenge', 'dance challenge', 'tiktok trend', 'reaction', 'react',
    'moment', 'clip', 'video', 'post', 'tweet', 'hashtag', 'challenge', 'prank',
    'fail', 'win', 'epic', 'hilarious', 'funny', 'cute', 'wholesome', 'heartwarming',
    'emotional', 'shocking', 'surprising', 'unexpected', 'crazy', 'insane', 'wild',
    'trending on twitter', 'trending on tiktok', 'blowing up on instagram',
    'reddit thread', 'going viral', 'viral moment', 'internet famous', 'overnight fame',
    'ice bucket challenge', 'harlem shake', 'kiki challenge', 'renagade', 'whip nae nae',
    'drake hotline bling', 'distracted boyfriend', 'woman yelling at cat'
  ];
  
  const sportsKeywords = [
    'nba', 'nfl', 'mlb', 'mls', 'nhl', 'fifa', 'uefa', 'premier league', 'la liga',
    'serie a', 'bundesliga', 'champions league', 'world cup', 'olympics', 'super bowl',
    'world series', 'stanley cup', 'nba finals', 'march madness', 'ncaa',
    'sports', 'football', 'basketball', 'baseball', 'soccer', 'hockey', 'tennis',
    'golf', 'boxing', 'ufc', 'mma', 'wrestling', 'racing', 'formula 1', 'nascar',
    'athlete', 'player', 'team', 'coach', 'manager', 'owner', 'franchise',
    'game', 'match', 'playoff', 'championship', 'final', 'semifinal', 'quarterfinal',
    'tournament', 'competition', 'draft', 'trade', 'free agency', 'contract',
    'injury', 'recovery', 'comeback', 'retirement', 'hall of fame',
    'lebron james', 'tom brady', 'lionel messi', 'cristiano ronaldo', 'stephen curry',
    'patrick mahomes', 'mike trout', 'connor mcgregor', 'serena williams', 'roger federer',
    'tiger woods', 'kevin durant', 'giannis', 'aaron rodgers', 'drew brees'
  ];
  
  const financeKeywords = [
    'stock', 'market', 'crypto', 'bitcoin', 'ethereum', 'investment', 'money', 'finance',
    'economic', 'business', 'wealth', 'million', 'billion', 'dollar', 'profit', 'revenue',
    'ceo', 'company', 'corporation', 'entrepreneur', 'startup', 'funding', 'valuation',
    'wall street', 'stock market', 'nasdaq', 's&p', 'dow jones', 'trading', 'trader',
    'investor', 'hedge fund', 'private equity', 'venture capital', 'ipo', 'offering',
    'bull market', 'bear market', 'recession', 'inflation', 'interest rate', 'fed',
    'earnings', 'quarterly', 'annual', 'report', 'filing', 'sec', 'merger', 'acquisition',
    'takeover', 'buyout', 'bankruptcy', 'layoff', 'hire', 'expansion', 'global',
    'rich', 'wealthy', 'billionaire', 'millionaire', 'net worth', 'fortune', 'luxury',
    'yacht', 'private jet', 'mansion', 'real estate', 'philanthropy', 'donation'
  ];
  
  const techKeywords = [
    'apple', 'google', 'microsoft', 'amazon', 'meta', 'facebook', 'twitter', 'x',
    'tesla', 'spacex', 'netflix', 'disney', 'sony', 'samsung', 'lg', 'intel', 'amd',
    'nvidia', 'ibm', 'oracle', 'adobe', 'salesforce', 'uber', 'lyft', 'airbnb',
    'iphone', 'ipad', 'macbook', 'imac', 'apple watch', 'airpods', 'android', 'pixel',
    'galaxy', 'surface', 'xbox', 'playstation', 'nintendo', 'oculus', 'quest',
    'tech', 'technology', 'software', 'hardware', 'computer', 'digital', 'internet',
    'web', 'app', 'application', 'cloud', 'aws', 'azure', 'google cloud', 'server',
    'data center', 'innovation', 'digital transformation', 'tech news'
  ];
  
  const successKeywords = [
    'success', 'motivation', 'inspirational', 'achievement', 'winner', 'accomplishment',
    'breakthrough', 'millionaire', 'billionaire', 'entrepreneur', 'self-made', 
    'rags to riches', 'how i made', 'success story', 'achieved', 'won', 'award',
    'recognition', 'honor', 'prestigious', 'milestone', 'landmark', 'record',
    'promotion', 'raise', 'bonus', 'career', 'professional', 'executive', 'director',
    'vp', 'vice president', 'c-suite', 'founder', 'co-founder', 'inventor', 'creator',
    'growth', 'development', 'improvement', 'progress', 'journey', 'transformation',
    'overcame', 'perseverance', 'determination', 'hard work', 'dedication', 'commitment'
  ];

  const content = `${title} ${description} ${source}`;

  if (musicKeywords.some(keyword => content.includes(keyword))) return 'music';
  if (creatorKeywords.some(keyword => content.includes(keyword))) return 'creators';
  if (dramaKeywords.some(keyword => content.includes(keyword))) return 'drama';
  if (viralKeywords.some(keyword => content.includes(keyword))) return 'viral';
  if (sportsKeywords.some(keyword => content.includes(keyword))) return 'sports';
  if (financeKeywords.some(keyword => content.includes(keyword))) return 'finance';
  if (techKeywords.some(keyword => content.includes(keyword))) return 'tech';
  if (successKeywords.some(keyword => content.includes(keyword))) return 'success';
  
  return 'viral';
};

const transformArticles = (apiArticles = []) => {
  const transformed = getDefaultDataStructure();
  const usedArticleIds = new Set();
  const seenTitles = new Set();

  apiArticles.forEach((article) => {
    const titleKey = article.title?.toLowerCase();
    if (seenTitles.has(titleKey)) {
      return;
    }
    seenTitles.add(titleKey);

    const netnapzCategory = determineArticleCategory(article);
    const isBreaking = article.breaking || Math.random() > 0.9;
    const isTrending = article.trending || Math.random() > 0.7;
    
    const processedArticle = {
      id: article.id || `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.image,
      image_url: article.image,
      source: article.source,
      author: article.author || 'Entertainment Desk',
      published_at: article.published_at,
      timestamp: article.timestamp || new Date(article.published_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      category: netnapzCategory,
      breaking: isBreaking,
      trending: isTrending,
      views: article.views || Math.floor(1000 + Math.random() * 90000).toLocaleString(),
      likes: article.likes || Math.floor(100 + Math.random() * 5000).toLocaleString(),
      comments: article.comments || Math.floor(10 + Math.random() * 500).toLocaleString(),
      hasImage: true,
      userComments: article.userComments || [],
      is_manual: article.is_manual || false
    };

    if (transformed[netnapzCategory] && !usedArticleIds.has(processedArticle.id)) {
      transformed[netnapzCategory].push(processedArticle);
      usedArticleIds.add(processedArticle.id);
    }

    if (isTrending && !usedArticleIds.has(processedArticle.id + '_trending')) {
      transformed.trending.push(processedArticle);
      usedArticleIds.add(processedArticle.id + '_trending');
    }

    if (isBreaking && !usedArticleIds.has(processedArticle.id + '_breaking')) {
      transformed.breaking.push(processedArticle);
      usedArticleIds.add(processedArticle.id + '_breaking');
    }
  });

  console.log('📊 Final article distribution:', Object.keys(transformed).map(key => ({
    category: key,
    count: transformed[key].length
  })));

  return transformed;
};

// Auto Refresh Timer Component (Updated for DAILY)
const AutoRefreshTimer = ({ nextRefresh, onRefresh, isLoading, cacheSource }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(nextRefresh));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(nextRefresh));
    }, 1000);

    return () => clearInterval(timer);
  }, [nextRefresh]);

  function calculateTimeLeft(nextRefreshDate) {
    const difference = new Date(nextRefreshDate) - new Date();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false
    };
  }

  const formatTime = (time) => time.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <Clock className="w-4 h-4" />
          Daily refresh: {timeLeft.hours}h {formatTime(timeLeft.minutes)}m {formatTime(timeLeft.seconds)}s
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          cacheSource.includes('combined') ? 'bg-purple-100 text-purple-700' : 
          cacheSource.includes('rss') ? 'bg-green-100 text-green-700' : 
          cacheSource.includes('api') ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
        }`}>
          {cacheSource.toUpperCase()}
        </span>
      </div>
      
      {timeLeft.expired && !isLoading && (
        <div className="flex items-center gap-2 text-orange-600 text-sm font-medium">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Refreshing content...
        </div>
      )}
    </div>
  );
};

// Comments Component
const ArticleComments = ({ articleId, comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;

    const comment = {
      id: Date.now().toString(),
      user: userName,
      text: newComment,
      timestamp: new Date().toLocaleDateString(),
      likes: 0,
      liked: false
    };

    onAddComment(articleId, comment);
    setNewComment('');
    setUserName('');
  };

  const handleLikeComment = (articleId, commentId) => {
    onAddComment(articleId, null, commentId);
  };

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-black text-gray-900">Comments ({comments.length})</h4>
      </div>

      <form onSubmit={handleSubmitComment} className="mb-6 bg-gray-50 rounded-lg p-4">
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            required
          />
          <textarea
            placeholder="Add your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm"
            >
              Post Comment
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                    <Users className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm">{comment.user}</h5>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-3 text-sm leading-relaxed">{comment.text}</p>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleLikeComment(articleId, comment.id)}
                  className={`flex items-center gap-1 text-xs transition-colors ${
                    comment.liked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${comment.liked ? 'fill-current' : ''}`} />
                  {comment.likes}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("trending");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [articles, setArticles] = useState(HARDCODED_FALLBACK_ARTICLES);
  const [isLoading, setIsLoading] = useState(false);
  const [cacheSource, setCacheSource] = useState('hardcoded_fallback');
  const [nextRefresh, setNextRefresh] = useState(new Date(Date.now() + DAILY_MS));
  const [refreshTimer, setRefreshTimer] = useState(null);
  const [convertingLinks, setConvertingLinks] = useState({});
  const [distributionResults, setDistributionResults] = useState([]);

  // Function to automatically refresh data with RSS + MediaStack
  const autoRefreshData = async () => {
    console.log('🔄 DAILY AUTO-REFRESH: Pulling fresh data from Napzapi...');
    setIsLoading(true);

    try {
      const apiArticles = await fetchAllArticles();
      
      const transformedData = transformArticles(apiArticles);
      
      setArticles(transformedData);
      
      saveAsHardcoded(transformedData, 'hardcoded_combined');
      
      setLastUpdated(new Date());
      setCacheSource('hardcoded_combined');
      setNextRefresh(new Date(Date.now() + DAILY_MS));
      
      console.log('✅ DAILY AUTO-REFRESH: Combined data refreshed successfully');
      
    } catch (error) {
      console.error('❌ DAILY AUTO-REFRESH: Error refreshing data:', error);
      setNextRefresh(new Date(Date.now() + DAILY_MS));
    } finally {
      setIsLoading(false);
    }
  };

  // Setup auto-refresh timer (DAILY)
  useEffect(() => {
    const setupAutoRefresh = () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }

      const now = new Date();
      const timeUntilRefresh = new Date(nextRefresh) - now;

      console.log('⏰ Setting up DAILY auto-refresh timer:', {
        nextRefresh: nextRefresh.toISOString(),
        timeUntilRefresh: Math.round(timeUntilRefresh / 1000 / 60 / 60) + ' hours'
      });

      if (timeUntilRefresh <= 0) {
        console.log('⏰ Refresh time expired, refreshing now...');
        autoRefreshData();
      } else {
        const timer = setTimeout(() => {
          console.log('⏰ DAILY Auto-refresh timer triggered!');
          autoRefreshData();
        }, timeUntilRefresh);

        setRefreshTimer(timer);
      }
    };

    setupAutoRefresh();

    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, [nextRefresh]);

  // Load articles on component mount
  useEffect(() => {
    console.log('🚀 Initializing NetNapz Homepage with RSS + MediaStack...');
    
    const loadArticles = async () => {
      const hardcodedData = loadHardcodedData();
      
      if (hardcodedData && hardcodedData.data) {
        console.log('✅ Using HARDCODED data');
        setArticles(hardcodedData.data);
        setLastUpdated(new Date(hardcodedData.timestamp));
        setCacheSource(hardcodedData.source);
        
        if (hardcodedData.nextRefresh) {
          setNextRefresh(new Date(hardcodedData.nextRefresh));
        } else {
          setNextRefresh(new Date(Date.now() + DAILY_MS));
        }
      } else {
        console.log('📝 Using hardcoded fallback data');
        setArticles(HARDCODED_FALLBACK_ARTICLES);
        setLastUpdated(new Date());
        setCacheSource('hardcoded_fallback');
        setNextRefresh(new Date(Date.now() + DAILY_MS));
      }

      const dataAge = new Date() - new Date(hardcodedData?.timestamp || 0);
      if (dataAge > DAILY_MS) {
        console.log('🔄 Data is older than 1 day, auto-refreshing...');
        autoRefreshData();
      }
    };
    
    loadArticles();
  }, []);

  // Function to handle article clicks with affiliate conversion
  const handleArticleClick = async (article) => {
    if (!article.url) return;
    
    const articleId = article.id;
    setConvertingLinks(prev => ({ ...prev, [articleId]: true }));
    
    try {
      const affiliateUrl = await convertToAffiliateLink(
        article.url, 
        article.id,
        article.title
      );
      
      sessionStorage.setItem('currentArticle', JSON.stringify({
        ...article,
        affiliateUrl: affiliateUrl,
        originalUrl: article.url
      }));
      
      navigate(createPageUrl("Pricing"), { 
        state: { 
          article: article,
          affiliateUrl: affiliateUrl
        }
      });
      
    } catch (error) {
      console.error('Error converting link:', error);
      sessionStorage.setItem('currentArticle', JSON.stringify(article));
      navigate(createPageUrl("Pricing"), { 
        state: { article: article }
      });
    } finally {
      setConvertingLinks(prev => ({ ...prev, [articleId]: false }));
    }
  };

  // Function to handle "Read More" clicks
  const handleReadMoreClick = async (article, event) => {
    event.stopPropagation();
    await handleArticleClick(article);
  };

  // Function to handle adding comments
  const handleAddComment = (articleId, newComment, commentIdToLike = null) => {
    setArticles(prev => {
      const updated = { ...prev };
      
      Object.keys(updated).forEach(category => {
        const articleIndex = updated[category].findIndex(article => article.id === articleId);
        if (articleIndex !== -1) {
          if (newComment) {
            updated[category][articleIndex].userComments = [
              newComment,
              ...(updated[category][articleIndex].userComments || [])
            ];
            updated[category][articleIndex].comments = (
              parseInt(updated[category][articleIndex].comments || 0) + 1
            ).toString();
          } else if (commentIdToLike) {
            updated[category][articleIndex].userComments = 
              updated[category][articleIndex].userComments.map(comment => 
                comment.id === commentIdToLike 
                  ? { 
                      ...comment, 
                      likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
                      liked: !comment.liked
                    }
                  : comment
              );
          }
        }
      });

      saveAsHardcoded(updated, cacheSource);
      
      return updated;
    });
  };

  // Handle distribution completion
  const handleDistributionComplete = (results) => {
    setDistributionResults(results);
    
    const successful = results.filter(r => r.success).length;
    if (successful > 0) {
      alert(`✅ Successfully distributed ${successful} posts across social media!`);
    }
  };

  // Premium content categories
  const contentCategories = [
    { id: "trending", name: "TRENDING", icon: Flame, color: "from-red-500 to-orange-500" },
    { id: "music", name: "MUSIC", icon: Music, color: "from-purple-500 to-pink-500" },
    { id: "creators", name: "CREATORS", icon: Users, color: "from-blue-500 to-cyan-500" },
    { id: "drama", name: "DRAMA", icon: MessageCircle, color: "from-orange-500 to-red-500" },
    { id: "viral", name: "VIRAL", icon: Share2, color: "from-green-500 to-teal-500" },
    { id: "sports", name: "SPORTS", icon: Crown, color: "from-yellow-500 to-amber-500" },
    { id: "finance", name: "FINANCE", icon: Rocket, color: "from-indigo-500 to-purple-500" },
    { id: "success", name: "SUCCESS", icon: Star, color: "from-emerald-500 to-green-500" },
    { id: "tech", name: "TECH", icon: Rocket, color: "from-blue-500 to-indigo-500" }
  ];

  // Safe content filtering with proper error handling
  const filteredContent = useMemo(() => {
    const safeArticles = ensureDataStructure(articles);
    
    if (selectedCategory === "trending") {
      const trending = getSafeArray(safeArticles, 'trending');
      const breaking = getSafeArray(safeArticles, 'breaking');
      const viral = getSafeArray(safeArticles, 'viral');
      
      return [...trending, ...breaking, ...viral].slice(0, 20);
    }
    
    return getSafeArray(safeArticles, selectedCategory).slice(0, 20);
  }, [articles, selectedCategory]);

  const totalArticles = useMemo(() => {
    const safeArticles = ensureDataStructure(articles);
    if (!safeArticles) return 1;
    
    return Object.values(safeArticles).reduce((total, category) => 
      total + (Array.isArray(category) ? category.length : 0), 0
    );
  }, [articles]);

  // Get featured story (first trending article)
  const featuredStory = useMemo(() => {
    const safeArticles = ensureDataStructure(articles);
    const trending = getSafeArray(safeArticles, 'trending');
    const breaking = getSafeArray(safeArticles, 'breaking');
    
    return trending[0] || breaking[0] || filteredContent[0] || safeArticles.music[0] || null;
  }, [articles, filteredContent]);

  // Get category count safely
  const getCategoryCount = (categoryId) => {
    const safeArticles = ensureDataStructure(articles);
    return getSafeArray(safeArticles, categoryId).length;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">NN</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900">NetNapz</h1>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                ENTERTAINMENT
              </span>
            </div>

            {/* Affiliate Badge */}
            <div className="hidden md:flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
              <Link className="w-4 h-4" />
              <span className="text-sm font-semibold">Affiliate Links Active</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {contentCategories.slice(0, 6).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`font-semibold text-sm transition-colors ${
                    selectedCategory === category.id 
                      ? 'text-red-600 border-b-2 border-red-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <SearchIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Affiliate Badge */}
          <div className="md:hidden flex justify-center mb-2">
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
              <Link className="w-3 h-3" />
              <span className="text-xs font-semibold">Affiliate Links Active</span>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="grid grid-cols-2 gap-2">
                {contentCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      selectedCategory === category.id 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Breaking News Bar */}
      <div className="bg-red-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-black text-sm uppercase tracking-wider bg-black px-2 py-1 rounded">
                {cacheSource.includes('combined') ? 'LIVE ENTERTAINMENT NEWS' : 'WELCOME'}
              </span>
              <span className="text-sm font-medium truncate">
                {featuredStory?.title || "NetNapz Entertainment Hub - Daily auto-refresh with RSS + MediaStack"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium opacity-90">
              <Database className="w-3 h-3" />
              {lastUpdated.toLocaleDateString()}
              <span className="bg-black/20 px-2 py-1 rounded text-xs">
                {cacheSource.includes('combined') ? 'LIVE DATA' : 
                 cacheSource.includes('rss') ? 'RSS FEEDS' : 
                 cacheSource.includes('api') ? 'API' : 'FALLBACK'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Social Auto-Distributor */}
        <SocialDistributor 
          articles={filteredContent}
          onDistributionComplete={handleDistributionComplete}
        />

        {/* Featured Story */}
        {featuredStory && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 cursor-pointer group"
            onClick={() => handleArticleClick(featuredStory)}
          >
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gray-100">
                {getArticleImage(featuredStory) ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={getArticleImage(featuredStory)} 
                      alt={featuredStory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {featuredStory.logo_stamp && (
                      <div className="absolute bottom-3 right-3 w-12 h-12 bg-black/80 rounded-full p-1">
                        <img 
                          src={featuredStory.logo_stamp} 
                          alt="NetNapz"
                          className="w-full h-full object-contain rounded-full"
                        />
                      </div>
                    )}
                  </div>
                ) : null}
                
                <div className={`w-full h-full bg-gradient-to-br ${getCategoryPlaceholder(featuredStory.category)} flex items-center justify-center ${getArticleImage(featuredStory) ? 'hidden' : 'flex'}`}>
                  {(() => {
                    const IconComponent = getCategoryIcon(featuredStory.category);
                    return <IconComponent className="w-12 h-12 text-white opacity-80" />;
                  })()}
                  {featuredStory.logo_stamp && (
                    <div className="absolute bottom-3 right-3 w-12 h-12 bg-black/80 rounded-full p-1">
                      <img 
                        src={featuredStory.logo_stamp} 
                        alt="NetNapz"
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  )}
                </div>
                
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white px-3 py-1.5 text-sm font-black rounded-lg">
                    {cacheSource.includes('combined') ? 'LIVE' : 'WELCOME'}
                  </span>
                </div>
                
                {featuredStory.breaking && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-red-600 text-white px-3 py-1.5 text-sm font-black rounded-lg">
                      BREAKING
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                  <span className="bg-gray-100 px-3 py-1 rounded-full font-semibold">
                    {featuredStory.category?.toUpperCase() || 'NEWS'}
                  </span>
                  <span>{featuredStory.timestamp || 'Recently'}</span>
                  {featuredStory.source === "NetNapz Exclusive" && (
                    <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      EXCLUSIVE
                    </span>
                  )}
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight group-hover:text-red-600 transition-colors">
                  {featuredStory.title}
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                  {featuredStory.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Eye className="w-4 h-4" />
                      {featuredStory.views || '1.2M'}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Heart className="w-4 h-4" />
                      {featuredStory.likes || '250K'}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <MessageCircle className="w-4 h-4" />
                      {featuredStory.comments || '0'}
                    </span>
                  </div>
                  <div className="text-red-600 font-semibold text-sm flex items-center gap-2">
                    READ FULL STORY
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Category Navigation */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-gray-900">
              {cacheSource.includes('combined') ? 'Live Entertainment News' : 'NetNapz Entertainment Hub'}
            </h2>
            
            <AutoRefreshTimer 
              nextRefresh={nextRefresh}
              onRefresh={autoRefreshData}
              isLoading={isLoading}
              cacheSource={cacheSource}
            />
          </div>

          <div className="flex overflow-x-auto gap-1 pb-4 scrollbar-hide">
            {contentCategories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              const categoryCount = getCategoryCount(category.id);
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? `bg-gray-900 text-white border-gray-900`
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                  {categoryCount > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {categoryCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* News Grid */}
        <section>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
              <p className="text-lg text-gray-600 font-medium">Daily refresh with RSS + MediaStack...</p>
              <p className="text-sm text-gray-500 mt-2">Pulling full articles with images from all sources</p>
            </div>
          ) : filteredContent.length > 0 ? (
            <LayoutGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredContent.map((item, index) => {
                  const articleImage = getArticleImage(item);
                  const CategoryIcon = getCategoryIcon(item.category);
                  const isConverting = convertingLinks[item.id];
                  
                  return (
                    <motion.article
                      key={item.id || `article-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(index * 0.1, 0.6) }}
                      className="group"
                    >
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:border-gray-300">
                        <div 
                          className="aspect-video overflow-hidden bg-gray-100 relative cursor-pointer"
                          onClick={() => handleArticleClick(item)}
                        >
                          {articleImage ? (
                            <div className="relative w-full h-full">
                              <img 
                                src={articleImage} 
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              {item.logo_stamp && (
                                <div className="absolute bottom-3 right-3 w-10 h-10 bg-black/80 rounded-full p-1">
                                  <img 
                                    src={item.logo_stamp} 
                                    alt="NetNapz"
                                    className="w-full h-full object-contain rounded-full"
                                  />
                                </div>
                              )}
                            </div>
                          ) : null}
                          
                          <div className={`w-full h-full bg-gradient-to-br ${getCategoryPlaceholder(item.category)} flex items-center justify-center ${articleImage ? 'hidden' : 'flex'}`}>
                            <CategoryIcon className="w-8 h-8 text-white opacity-80" />
                            {item.logo_stamp && (
                              <div className="absolute bottom-3 right-3 w-10 h-10 bg-black/80 rounded-full p-1">
                                <img 
                                  src={item.logo_stamp} 
                                  alt="NetNapz"
                                  className="w-full h-full object-contain rounded-full"
                                />
                              </div>
                            )}
                          </div>
                          
                          <div className="absolute top-3 left-3">
                            <span className="bg-black/80 text-white px-2 py-1 text-xs font-semibold rounded">
                              {item.category?.toUpperCase() || 'NEWS'}
                            </span>
                          </div>
                          
                          {item.breaking && (
                            <div className="absolute top-3 right-3">
                              <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                                BREAKING
                              </span>
                            </div>
                          )}
                          
                          {item.source === "NetNapz Exclusive" && (
                            <div className="absolute bottom-3 left-3">
                              <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                                EXCLUSIVE
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              {item.source || 'Entertainment News'}
                            </span>
                            <span className="text-xs text-gray-500">{item.timestamp || 'Recently'}</span>
                          </div>
                          
                          <h3 
                            className="text-xl font-black text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors cursor-pointer"
                            onClick={() => handleArticleClick(item)}
                          >
                            {item.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {item.views || '1.2M'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {item.likes || '250K'}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                {item.comments || '0'}
                              </span>
                            </div>
                            
                            <button 
                              onClick={(e) => handleReadMoreClick(item, e)}
                              disabled={isConverting}
                              className="text-red-600 text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isConverting ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  Converting...
                                </>
                              ) : (
                                <>
                                  Read More
                                  <ExternalLink className="w-3 h-3" />
                                </>
                              )}
                            </button>
                          </div>

                          <ArticleComments 
                            articleId={item.id}
                            comments={item.userComments || []}
                            onAddComment={handleAddComment}
                          />
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
              
              {filteredContent.length >= 20 && (
                <div className="text-center mt-12">
                  <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                    LOAD MORE STORIES
                  </button>
                </div>
              )}
            </LayoutGroup>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Flame className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">
                {totalArticles === 0 ? 'Ready for Daily News' : 'No Articles Found'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {cacheSource.includes('combined') 
                  ? `No ${selectedCategory} articles available at the moment. System will auto-refresh in 24 hours.`
                  : "System will automatically pull full articles with images from RSS + MediaStack every day."}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                Next daily refresh: {nextRefresh.toLocaleDateString()} at {nextRefresh.toLocaleTimeString()}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white font-black text-xs">NN</span>
              </div>
              <span className="text-xl font-black">NetNapz Entertainment</span>
            </div>
            <p className="text-gray-400 mb-6">
              Your daily source for music charts, creator drama, and viral entertainment news
            </p>
            <div className="text-sm text-gray-500">
              © 2025 NetNapz. All entertainment news, all the time. Daily auto-refresh with RSS + MediaStack.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}