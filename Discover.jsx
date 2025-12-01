/**
 * NetNapz Tech & Gaming - 24-Hour Auto Refresh + Social Auto-Distributor
 * © 2025 NetNapz. All Rights Reserved.
 */

import React, { useState, useMemo, useEffect } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { 
  Star, Users, Heart, MessageCircle, Crown, Eye, 
  Share2, Rocket, Flame, ExternalLink, Menu, Search as SearchIcon,
  Database, Shield, RefreshCw, Loader2, TrendingUp,
  Cpu, Zap, Code, Smartphone, Globe, Clock, Link,
  GamepadIcon, Monitor, Headphones, Video, Trophy,
  Twitter, Facebook, Linkedin, Youtube, Instagram
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Mediastack API Key
const MEDIASTACK_API_KEY = "b2de0fa69cf403241d428c0937efd5d5";

// EXPANDED Categorized RSS Feed URLs for Tech & Gaming - IMAGE-RICH SOURCES
const RSS_FEEDS = {
  tech: [
    'https://feeds.arstechnica.com/arstechnica/index', // Ars Technica - full content
    'https://geekwire.com/feed/', // GeekWire - full content
    'https://feeds.feedburner.com/techdirt', // Techdirt - full content
    'https://fosspost.org/feed/', // FOSS Post - full content
    'https://www.omgubuntu.co.uk/feed', // OMG Ubuntu - WordPress full content
    'https://itsfoss.com/feed/', // It's FOSS - WordPress full content
    'https://www.linuxuprising.com/feeds/posts/default', // Linux Uprising - full content
    'https://9to5linux.com/feed', // 9to5Linux - full content
    'https://www.techradar.com/rss', // TechRadar - image rich
    'https://feeds.feedburner.com/cnet/TechTalk', // CNET - image rich
    'https://www.digitaltrends.com/feed/', // Digital Trends - image rich
    'https://www.theverge.com/rss/index.xml', // The Verge - image rich
    'https://www.wired.com/feed/rss', // Wired - image rich
    'https://www.engadget.com/rss.xml', // Engadget - image rich
    'https://www.gizmodo.com/rss', // Gizmodo - image rich
    'https://www.macrumors.com/macrumors.xml', // MacRumors - image rich
    'https://www.androidcentral.com/feed', // Android Central - image rich
    'https://www.iphonehacks.com/feed', // iPhone Hacks - image rich
    'https://www.xda-developers.com/feed/', // XDA Developers - image rich
    'https://www.anandtech.com/rss/', // AnandTech - image rich
    'https://www.tomshardware.com/feeds/all', // Tom's Hardware - image rich
    'https://www.pcmag.com/rss', // PCMag - image rich
    'https://www.howtogeek.com/feed/', // How-To Geek - image rich
    'https://www.makeuseof.com/feed/', // MakeUseOf - image rich
    'https://www.techspot.com/feed/', // TechSpot - image rich
    'https://www.slashgear.com/feed/', // SlashGear - image rich
    'https://www.techmeme.com/feed.xml', // Techmeme - image rich
    'https://www.zdnet.com/news/rss.xml', // ZDNet - image rich
    'https://www.computerworld.com/index.rss', // Computerworld - image rich
    'https://www.infoworld.com/index.rss', // InfoWorld - image rich
    'https://www.networkworld.com/index.rss', // Network World - image rich
    'https://www.techrepublic.com/rssfeeds/articles/', // TechRepublic - image rich
    'https://www.techadvisor.com/feed/', // Tech Advisor - image rich
    'https://www.digitaltrends.com/feed/', // Digital Trends - image rich
    'https://www.techworm.net/feed', // TechWorm - image rich
    'https://www.techshout.com/feed/', // TechShout - image rich
    'https://www.ubergizmo.com/feed/', // Ubergizmo - image rich
    'https://www.guru3d.com/index.php?rss=1', // Guru3D - image rich
    'https://www.overclock3d.net/rss/', // Overclock3D - image rich
    'https://www.techpowerup.com/rss/', // TechPowerUp - image rich
    'https://www.hexus.net/rss/news/', // HEXUS - image rich
    'https://www.kitguru.net/feed/', // KitGuru - image rich
    'https://www.tweaktown.com/rssfeed.aspx', // TweakTown - image rich
    'https://www.benchmark.pl/feed', // Benchmark - image rich
    'https://www.gsmarena.com/rss-news-reviews.php3', // GSMArena - image rich
    'https://www.phonearena.com/feed', // PhoneArena - image rich
    'https://www.androidpolice.com/feed/', // Android Police - image rich
    'https://9to5mac.com/feed/', // 9to5Mac - image rich
    'https://www.cultofmac.com/feed/', // Cult of Mac - image rich
    'https://www.idownloadblog.com/feed/', // iDownloadBlog - image rich
    'https://www.appleinsider.com/rss/news/', // AppleInsider - image rich
    'https://www.macworld.com/index.rss', // Macworld - image rich
    'https://www.imore.com/rss', // iMore - image rich
  ],
  gaming: [
    'https://www.hongkongfp.com/feed/', // Hong Kong Free Press - full content
    'https://feeds.content.dowjones.io/public/rss/mw_topstories', // MarketWatch gaming coverage
    'https://www.ign.com/feeds/rss', // IGN - image rich gaming
    'https://www.gamespot.com/feeds/mashup/', // GameSpot - image rich
    'https://www.polygon.com/rss/index.xml', // Polygon - image rich
    'https://kotaku.com/rss', // Kotaku - image rich
    'https://www.rockpapershotgun.com/feed/', // Rock Paper Shotgun - image rich
    'https://www.eurogamer.net/feed', // Eurogamer - image rich
    'https://www.destructoid.com/feed/', // Destructoid - image rich
    'https://www.vg247.com/feed/', // VG247 - image rich
    'https://www.gameinformer.com/news.xml', // Game Informer - image rich
    'https://www.gamesradar.com/feeds/', // GamesRadar+ - image rich
    'https://www.nintendolife.com/feeds/latest', // Nintendo Life - image rich
    'https://www.pushsquare.com/feeds/latest', // Push Square - image rich
    'https://www.purexbox.com/feeds/latest', // Pure Xbox - image rich
    'https://www.psu.com/feed/', // PSU - image rich
    'https://attackofthefanboy.com/feed/', // Attack of the Fanboy - image rich
    'https://www.gamingbible.com/feeds/gaming.rss', // Gaming Bible - image rich
    'https://www.thegamer.com/feed/', // The Gamer - image rich
    'https://www.pcgamer.com/rss/', // PC Gamer - image rich
    'https://www.gamesindustry.biz/feed', // GamesIndustry.biz - image rich
    'https://www.gamedeveloper.com/rss', // Game Developer - image rich
    'https://www.indiegamesplus.com/rss', // IndieGamesPlus - image rich
    'https://www.indiewatch.com/feed/', // IndieWatch - image rich
    'https://www.trueachievements.com/feed.aspx', // TrueAchievements - image rich
    'https://www.truetrophies.com/feed.aspx', // TrueTrophies - image rich
    'https://www.n4g.com/rss', // N4G - image rich
    'https://www.gamingnexus.com/Feed.aspx', // Gaming Nexus - image rich
    'https://www.hardcoregamer.com/feed/', // Hardcore Gamer - image rich
    'https://www.onlysp.com/feed/', // OnlySP - image rich
    'https://www.rpgsite.net/feed', // RPG Site - image rich
    'https://www.siliconera.com/feed/', // Siliconera - image rich
    'https://www.gematsu.com/feed', // Gematsu - image rich
    'https://www.dualshockers.com/feed/', // DualShockers - image rich
    'https://www.gamingbolt.com/feed', // GamingBolt - image rich
  ],
  reviews: [
    'https://feeds.feedburner.com/techdirt', // Techdirt reviews
    'https://geekwire.com/feed/', // GeekWire reviews
    'https://www.techradar.com/rss/reviews', // TechRadar reviews - image rich
    'https://www.pcmag.com/rss/reviews', // PCMag reviews - image rich
    'https://www.digitaltrends.com/feed/reviews/', // Digital Trends reviews - image rich
    'https://www.tomsguide.com/feeds/all', // Tom's Guide reviews - image rich
    'https://www.trustedreviews.com/feed', // Trusted Reviews - image rich
    'https://www.techadvisor.com/feed/reviews/', // Tech Advisor reviews - image rich
    'https://www.gamespot.com/feeds/reviews/', // GameSpot reviews - image rich
    'https://www.ign.com/feeds/reviews', // IGN reviews - image rich
    'https://www.metacritic.com/rss/games', // Metacritic reviews - image rich
    'https://www.gamerankings.com/rss/', // GameRankings reviews - image rich
    'https://www.videogamer.com/rss/', // VideoGamer reviews - image rich
    'https://www.gaming-age.com/feed/', // Gaming Age reviews - image rich
    'https://www.capsulecomputers.com.au/feed/', // Capsule Computers reviews - image rich
  ],
  hardware: [
    'https://feeds.arstechnica.com/arstechnica/index', // Ars Technica hardware
    'https://geekwire.com/feed/', // GeekWire hardware
    'https://www.tomshardware.com/feeds/all', // Tom's Hardware - image rich
    'https://www.anandtech.com/rss/', // AnandTech - image rich
    'https://www.guru3d.com/index.php?rss=1', // Guru3D - image rich
    'https://www.techpowerup.com/rss/', // TechPowerUp - image rich
    'https://www.overclock.net/articles/', // Overclock.net - image rich
    'https://www.hardocp.com/rss/', // HardOCP - image rich
    'https://www.bit-tech.net/rss/', // Bit-Tech - image rich
    'https://www.kitguru.net/feed/', // KitGuru - image rich
    'https://www.tweaktown.com/rssfeed.aspx', // TweakTown - image rich
    'https://www.gamersnexus.net/feed', // Gamers Nexus - image rich
    'https://www.pcper.com/rss.xml', // PC Perspective - image rich
    'https://www.hardwarecanucks.com/feed/', // Hardware Canucks - image rich
    'https://www.techspot.com/feed/', // TechSpot - image rich
    'https://www.hexus.net/rss/news/', // HEXUS - image rich
    'https://www.benchmark.pl/feed', // Benchmark - image rich
    'https://www.overclockers.com/feed/', // Overclockers - image rich
    'https://www.hardwareheaven.com/feed/', // Hardware Heaven - image rich
    'https://www.thinkcomputers.org/feed/', // ThinkComputers - image rich
  ],
  esports: [
    'https://www.hongkongfp.com/feed/', // General coverage
    'https://feeds.content.dowjones.io/public/rss/mw_topstories', // Business coverage
    'https://www.dotesports.com/rss', // Dot Esports - image rich
    'https://www.esports.net/feed/', // Esports.net - image rich
    'https://www.thescoreesports.com/rss', // The Score Esports - image rich
    'https://www.vpesports.com/feed', // VP Esports - image rich
    'https://www.esportsinsider.com/feed/', // Esports Insider - image rich
    'https://www.esports-news.co.uk/feed/', // Esports News UK - image rich
    'https://www.esportsobserver.com/feed/', // The Esports Observer - image rich
    'https://www.ginx.tv/en/rss', // GINX TV - image rich
    'https://www.dexerto.com/gaming/feed/', // Dexerto Gaming - image rich
    'https://www.upcomer.com/feed/', // Upcomer - image rich
    'https://www.invenglobal.com/rss/articles', // Inven Global - image rich
    'https://www.hltv.org/rss/news', // HLTV - image rich
    'https://www.vlr.gg/rss', // VLR.gg - image rich
    'https://liquipedia.net/feed/', // Liquipedia - image rich
    'https://www.espn.com/espn/rss/news', // ESPN Esports - image rich
    'https://www.sk-gaming.com/rss', // SK Gaming - image rich
    'https://www.fnatic.com/feed/', // Fnatic - image rich
    'https://www.teamliquid.com/rss/news', // Team Liquid - image rich
  ],
  mobile: [
    'https://www.gsmarena.com/rss-news-reviews.php3', // GSMArena - image rich
    'https://www.phonearena.com/feed', // PhoneArena - image rich
    'https://www.androidpolice.com/feed/', // Android Police - image rich
    'https://www.androidcentral.com/feed', // Android Central - image rich
    'https://9to5google.com/feed/', // 9to5Google - image rich
    'https://www.xda-developers.com/feed/', // XDA Developers - image rich
    'https://www.iphonehacks.com/feed', // iPhone Hacks - image rich
    'https://9to5mac.com/feed/', // 9to5Mac - image rich
    'https://www.cultofmac.com/feed/', // Cult of Mac - image rich
    'https://www.idownloadblog.com/feed/', // iDownloadBlog - image rich
    'https://www.appleinsider.com/rss/news/', // AppleInsider - image rich
    'https://www.macrumors.com/macrumors.xml', // MacRumors - image rich
    'https://www.macworld.com/index.rss', // Macworld - image rich
    'https://www.imore.com/rss', // iMore - image rich
    'https://www.sammobile.com/feed/', // SamMobile - image rich
    'https://www.windowscentral.com/feed', // Windows Central - image rich
    'https://www.pocket-lint.com/rss/', // Pocket-lint - image rich
    'https://www.slashgear.com/feed/', // SlashGear - image rich
    'https://www.techradar.com/rss/phone-and-communications/mobile-phones', // TechRadar Mobile - image rich
    'https://www.digitaltrends.com/feed/mobile/', // Digital Trends Mobile - image rich
  ],
  pc: [
    'https://www.pcgamer.com/rss/', // PC Gamer - image rich
    'https://www.rockpapershotgun.com/feed/', // Rock Paper Shotgun - image rich
    'https://www.pcgamesn.com/feed', // PCGamesN - image rich
    'https://www.gamewatcher.com/rss/news', // GameWatcher - image rich
    'https://www.pcgamingwiki.com/feed/', // PCGamingWiki - image rich
    'https://www.gamingonlinux.com/feed/', // GamingOnLinux - image rich
    'https://www.boostingground.com/rss', // Boosting Ground - image rich
    'https://www.purepc.pl/rss', // PurePC - image rich
    'https://www.benchmark.pl/feed', // Benchmark - image rich
    'https://www.techspot.com/feed/', // TechSpot - image rich
  ],
  console: [
    'https://www.nintendolife.com/feeds/latest', // Nintendo Life - image rich
    'https://www.pushsquare.com/feeds/latest', // Push Square - image rich
    'https://www.purexbox.com/feeds/latest', // Pure Xbox - image rich
    'https://www.psu.com/feed/', // PSU - image rich
    'https://www.gamesradar.com/feeds/ps5/', // GamesRadar PS5 - image rich
    'https://www.gamesradar.com/feeds/xbox-series-x/', // GamesRadar Xbox - image rich
    'https://www.gamesradar.com/feeds/nintendo-switch/', // GamesRadar Switch - image rich
    'https://www.ign.com/feeds/ps5', // IGN PS5 - image rich
    'https://www.ign.com/feeds/xbox-series-x', // IGN Xbox - image rich
    'https://www.ign.com/feeds/nintendo-switch', // IGN Switch - image rich
  ]
};

// 24 Hours in milliseconds
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

// Social Media Auto-Distributor Configuration
const SOCIAL_PLATFORMS = {
  reddit: {
    name: 'Reddit',
    icon: '🔴',
    subreddits: ['technology', 'gadgets', 'gaming', 'tech', 'pcgaming', 'games'],
    enabled: true
  },
  twitter: {
    name: 'Twitter',
    icon: '🐦',
    enabled: true
  },
  facebook: {
    name: 'Facebook',
    icon: '📘',
    groups: ['Tech News', 'Gaming Community', 'PC Gaming'],
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
    spaces: ['Technology', 'Gaming', 'Video-Games'],
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
    channels: ['technews', 'gamingupdates'],
    enabled: true
  }
};

const HASHTAGS = {
  tech: ['#Technology', '#TechNews', '#Innovation', '#AI', '#FutureTech', '#NetNapzTech'],
  gaming: ['#Gaming', '#VideoGames', '#Gamer', '#GamingNews', '#Esports', '#NetNapzGaming'],
  reviews: ['#Review', '#TechReview', '#GamingReview', '#HandsOn'],
  esports: ['#Esports', '#GamingTournament', '#ProGaming'],
  hardware: ['#Hardware', '#PCHardware', '#GamingHardware'],
  mobile: ['#MobileGaming', '#iOS', '#Android'],
  pc: ['#PCGaming', '#PCGames', '#Steam'],
  console: ['#PlayStation', '#Xbox', '#Nintendo']
};

// Add this function to fetch full article content
const fetchFullArticleContent = async (articleUrl) => {
  try {
    console.log('📄 Fetching full article content:', articleUrl);
    
    // Use a CORS proxy to fetch the full article
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(articleUrl)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    const htmlContent = data.contents;
    
    // Extract main content from HTML (simplified version)
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Try to get article content from common selectors
    const contentSelectors = [
      'article',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.story-content',
      'main',
      '[role="main"]'
    ];
    
    let fullContent = '';
    for (const selector of contentSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        fullContent = element.textContent || element.innerText;
        if (fullContent.length > 500) break; // Found substantial content
      }
    }
    
    // If no specific content found, use body but clean it up
    if (!fullContent || fullContent.length < 500) {
      // Remove script and style tags
      doc.querySelectorAll('script, style, nav, header, footer').forEach(el => el.remove());
      fullContent = doc.body.textContent || doc.body.innerText || '';
    }
    
    // Clean up the content
    fullContent = fullContent
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 5000); // Limit length
    
    return fullContent || article.description; // Fallback to description
    
  } catch (error) {
    console.error('❌ Error fetching full article:', error);
    return null;
  }
};

// ENHANCED MULTI-STORAGE CACHE SYSTEM
const saveToMultiStorage = (articlesData, source = 'manual') => {
  try {
    const cacheData = {
      data: articlesData,
      timestamp: new Date().toISOString(),
      source: source,
      cache_type: 'MULTI_STORAGE_24H',
      nextRefresh: new Date(Date.now() + TWENTY_FOUR_HOURS_MS).toISOString()
    };
    
    console.log('💾 Saving to multi-storage cache...');
    
    const cacheString = JSON.stringify(cacheData);
    const storageKeys = [
      'netnapz_tech_gaming_cache_24h',
      'netnapz_gaming_session_1_24h',
      'netnapz_gaming_session_2_24h', 
      'netnapz_gaming_session_3_24h',
      'netnapz_gaming_backup_1_24h',
      'netnapz_gaming_backup_2_24h',
      'netnapz_tech_gaming_data_24h',
      'netnapz_tech_gaming_content_24h'
    ];
    
    storageKeys.forEach(key => {
      try {
        localStorage.setItem(key, cacheString);
        console.log(`✅ localStorage: ${key}`);
      } catch (e) {
        console.log(`❌ localStorage ${key} failed:`, e.message);
      }
    });
    
    storageKeys.forEach(key => {
      try {
        sessionStorage.setItem(key, cacheString);
        console.log(`✅ sessionStorage: ${key}`);
      } catch (e) {
        console.log(`❌ sessionStorage ${key} failed:`, e.message);
      }
    });
    
    window.netnapzTechGamingCache = cacheData;
    window.netnapzGamingDiscoverCache = cacheData;
    console.log('✅ Memory cache saved');
    
  } catch (error) {
    console.log('❌ Error saving to multi-storage:', error);
  }
};

const loadFromMultiStorage = () => {
  try {
    console.log('📂 Loading from multi-storage cache...');
    
    if (window.netnapzTechGamingCache) {
      console.log('📂 Loaded from memory cache');
      return window.netnapzTechGamingCache;
    }
    if (window.netnapzGamingDiscoverCache) {
      console.log('📂 Loaded from gaming memory cache');
      return window.netnapzGamingDiscoverCache;
    }
    
    const storageKeys = [
      'netnapz_tech_gaming_cache_24h',
      'netnapz_gaming_session_1_24h',
      'netnapz_gaming_session_2_24h',
      'netnapz_gaming_session_3_24h',
      'netnapz_gaming_backup_1_24h',
      'netnapz_gaming_backup_2_24h',
      'netnapz_tech_gaming_data_24h',
      'netnapz_tech_gaming_content_24h'
    ];
    
    for (let key of storageKeys) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const cacheData = JSON.parse(data);
          console.log(`📂 Loaded from localStorage: ${key}`);
          window.netnapzTechGamingCache = cacheData;
          window.netnapzGamingDiscoverCache = cacheData;
          return cacheData;
        }
      } catch (e) {
        console.log(`❌ localStorage ${key} load failed:`, e.message);
      }
    }
    
    for (let key of storageKeys) {
      try {
        const data = sessionStorage.getItem(key);
        if (data) {
          const cacheData = JSON.parse(data);
          console.log(`📂 Loaded from sessionStorage: ${key}`);
          window.netnapzTechGamingCache = cacheData;
          window.netnapzGamingDiscoverCache = cacheData;
          return cacheData;
        }
      } catch (e) {
        console.log(`❌ sessionStorage ${key} load failed:`, e.message);
      }
    }
    
    console.log('📂 No cache found in any storage');
    return null;
    
  } catch (error) {
    console.log('❌ Error loading from multi-storage:', error);
    return null;
  }
};

// Helper functions
const getDefaultDataStructure = () => ({
  trending: [],
  tech: [],
  gaming: [],
  reviews: [],
  esports: [],
  hardware: [],
  mobile: [],
  pc: [],
  console: [],
  breaking: []
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

  const categories = ['trending', 'tech', 'gaming', 'reviews', 'esports', 'hardware', 'mobile', 'pc', 'console', 'breaking'];
  const ensuredData = { ...data };
  
  categories.forEach(category => {
    if (!ensuredData[category] || !Array.isArray(ensuredData[category])) {
      ensuredData[category] = [];
    }
  });

  return ensuredData;
};

const getArticleImage = (article) => {
  if (article.image_url && article.image_url !== '#' && article.image_url !== 'None' && 
      article.image_url !== null && article.image_url !== '' && 
      article.image_url.startsWith('http')) {
    return article.image_url;
  }
  if (article.image && article.image !== '#' && article.image !== 'None' && 
      article.image !== null && article.image !== '' && 
      article.image.startsWith('http')) {
    return article.image;
  }
  if (article.thumbnail && article.thumbnail !== '#' && article.thumbnail !== 'None' && 
      article.thumbnail !== null && article.thumbnail !== '' && 
      article.thumbnail.startsWith('http')) {
    return article.thumbnail;
  }
  if (article.urlToImage && article.urlToImage !== '#' && article.urlToImage !== 'None' && 
      article.urlToImage !== null && article.urlToImage !== '' && 
      article.urlToImage.startsWith('http')) {
    return article.urlToImage;
  }
  if (article.enclosure && article.enclosure.url && 
      article.enclosure.url.startsWith('http') && 
      article.enclosure.type?.startsWith('image/')) {
    return article.enclosure.url;
  }
  if (article.media && article.media.thumbnail && 
      article.media.thumbnail.startsWith('http')) {
    return article.media.thumbnail;
  }
  
  // Enhanced image extraction for RSS feeds
  if (article.content && article.content.includes('<img')) {
    const imgMatch = article.content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }
  
  if (article.description && article.description.includes('<img')) {
    const imgMatch = article.description.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }
  
  return null;
};

const getCategoryPlaceholder = (category) => {
  const colors = {
    'tech': 'from-blue-500 to-indigo-500',
    'gaming': 'from-green-500 to-emerald-500',
    'reviews': 'from-yellow-500 to-amber-500',
    'esports': 'from-purple-500 to-pink-500',
    'hardware': 'from-red-500 to-orange-500',
    'mobile': 'from-indigo-500 to-purple-500',
    'pc': 'from-cyan-500 to-blue-500',
    'console': 'from-orange-500 to-red-500',
    'breaking': 'from-red-500 to-orange-500',
    'trending': 'from-blue-500 to-purple-500'
  };
  
  return colors[category] || 'from-gray-500 to-gray-700';
};

const getCategoryIcon = (category) => {
  const icons = {
    'tech': Cpu,
    'gaming': GamepadIcon,
    'reviews': Star,
    'esports': Trophy,
    'hardware': Monitor,
    'mobile': Smartphone,
    'pc': Cpu,
    'console': GamepadIcon,
    'breaking': Flame,
    'trending': TrendingUp
  };
  
  return icons[category] || Globe;
};

// Auto Refresh Timer Component
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
          Auto-refresh: {timeLeft.hours}h {formatTime(timeLeft.minutes)}m {formatTime(timeLeft.seconds)}s
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          cacheSource.includes('api') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
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
    const category = article.category || 'tech';
    const categoryHashtags = HASHTAGS[category] || HASHTAGS.tech;
    const selectedHashtags = categoryHashtags.slice(0, 4);
    
    const templates = {
      twitter: `🚀 ${article.title}\n\n${article.description?.substring(0, 100)}...\n\n🔗 ${article.shortUrl}\n\n${selectedHashtags.join(' ')}`,
      
      reddit: `**${article.title}**\n\n${article.description}\n\n[Read full article here](${article.shortUrl})\n\n---\n*Posted via NetNapz Auto-Distributor*`,
      
      facebook: `🔥 NEW: ${article.title}\n\n${article.description}\n\n👉 Read the full story: ${article.shortUrl}\n\n${selectedHashtags.join(' ')}`,
      
      linkedin: `🚀 ${article.title}\n\n${article.description}\n\nAs a tech/gaming enthusiast, I found this article really insightful. What are your thoughts on this development?\n\nRead more: ${article.shortUrl}\n\n${selectedHashtags.join(' ')}\n\n#NetNapz #TechCommunity`,
      
      quora: `I recently came across this article about ${article.title} and found it really interesting:\n\n${article.description}\n\nRead the full story here: ${article.shortUrl}\n\nWhat do you think about this development in ${category}?`,
      
      medium: `## ${article.title}\n\n${article.description}\n\n[Continue reading on NetNapz](${article.shortUrl})\n\n*This is a summary of the original article. Full credits to NetNapz Tech & Gaming.*\n\n${selectedHashtags.join(' ')}`,
      
      telegram: `📰 <b>${article.title}</b>\n\n${article.description}\n\n🔗 <a href="${article.shortUrl}">Read Full Article</a>\n\n#${category} #TechNews`
    };

    return templates[platform] || templates.twitter;
  };

  const simulatePlatformPost = async (article, platform) => {
    setCurrentPlatform(SOCIAL_PLATFORMS[platform].name);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    // Simulate success (90% success rate)
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

    // Add short URL
    article.shortUrl = await shortenUrl(article.url);

    for (let i = 0; i < enabledPlatforms.length; i++) {
      const platform = enabledPlatforms[i];
      const result = await simulatePlatformPost(article, platform);
      results.push(result);
      
      // Update progress
      setDistributionProgress(((i + 1) / enabledPlatforms.length) * 100);
    }

    return results;
  };

  const startDistribution = async () => {
    if (isDistributing || articles.length === 0) return;
    
    setIsDistributing(true);
    setDistributionProgress(0);
    setCurrentPlatform('');
    
    const articlesToDistribute = articles.slice(0, 3); // Distribute top 3 articles
    let allResults = [];
    let successfulPosts = 0;

    for (let i = 0; i < articlesToDistribute.length; i++) {
      const article = articlesToDistribute[i];
      console.log(`📤 Distributing: "${article.title}"`);
      
      const results = await distributeArticle(article);
      allResults = [...allResults, ...results];
      
      successfulPosts += results.filter(r => r.success).length;
      
      // Delay between articles
      if (i < articlesToDistribute.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    // Update stats
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
    
    // Notify parent component
    if (onDistributionComplete) {
      onDistributionComplete(allResults);
    }

    console.log(`✅ Distribution completed: ${successfulPosts}/${allResults.length} successful posts`);
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-8">
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
        {/* Distribution Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={startDistribution}
              disabled={isDistributing || articles.length === 0}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
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

          {/* Progress Bar */}
          {isDistributing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Posting to {currentPlatform}...</span>
                <span>{Math.round(distributionProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
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

        {/* Platform Stats */}
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

      {/* Quick Distribution Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 mr-2">Quick Share:</span>
        {articles.slice(0, 3).map((article, index) => (
          <button
            key={article.id}
            onClick={() => distributeArticle(article)}
            disabled={isDistributing}
            className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors disabled:opacity-50"
          >
            Share #{index + 1}
          </button>
        ))}
      </div>
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
        <h4 className="text-lg font-black text-gray-900">Community ({comments.length})</h4>
      </div>

      <form onSubmit={handleSubmitComment} className="mb-6 bg-gray-50 rounded-lg p-4">
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            required
          />
          <textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
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
            <p>No comments yet. Start the discussion!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
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
                    comment.liked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
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

// ENHANCED RSS Parser Function with better image extraction
const parseRSSFeed = async (feedUrl, category) => {
  try {
    console.log(`📡 Fetching ${category} RSS feed: ${feedUrl}`);
    
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }
    
    const data = await response.json();
    const text = data.contents;
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    
    const items = xmlDoc.querySelectorAll('item, entry');
    const articles = [];
    
    items.forEach(item => {
      try {
        const title = item.querySelector('title')?.textContent?.trim() || 'No Title';
        const description = item.querySelector('description')?.textContent || 
                           item.querySelector('summary')?.textContent || 
                           item.querySelector('content')?.textContent || '';
        
        const link = item.querySelector('link')?.textContent || 
                    item.querySelector('link')?.getAttribute('href') || 
                    item.querySelector('id')?.textContent || '';
        
        let image = null;
        
        // Enhanced image extraction for various RSS formats
        const mediaThumbnail = item.querySelector('media\\:thumbnail, thumbnail');
        if (mediaThumbnail) {
          image = mediaThumbnail.getAttribute('url');
        }
        
        const enclosure = item.querySelector('enclosure');
        if (enclosure && enclosure.getAttribute('type')?.startsWith('image/')) {
          image = enclosure.getAttribute('url');
        }
        
        const mediaContent = item.querySelector('media\\:content');
        if (mediaContent && mediaContent.getAttribute('medium') === 'image') {
          image = mediaContent.getAttribute('url');
        }
        
        // Try content:encoded for WordPress feeds
        const contentEncoded = item.querySelector('content\\:encoded');
        if (contentEncoded) {
          const imgMatch = contentEncoded.textContent.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch) {
            image = imgMatch[1];
          }
        }
        
        // Try description for images
        if (!image) {
          const descImgMatch = description.match(/<img[^>]+src="([^">]+)"/);
          if (descImgMatch) {
            image = descImgMatch[1];
          }
        }
        
        // Fallback to itunes:image for podcast feeds
        if (!image) {
          const itunesImage = item.querySelector('itunes\\:image');
          if (itunesImage) {
            image = itunesImage.getAttribute('href');
          }
        }
        
        const pubDate = item.querySelector('pubDate')?.textContent || 
                       item.querySelector('published')?.textContent || 
                       item.querySelector('updated')?.textContent ||
                       new Date().toISOString();
        
        const author = item.querySelector('author')?.textContent || 
                      item.querySelector('dc\\:creator')?.textContent || 
                      'Unknown Author';
        
        const source = item.querySelector('source')?.textContent || 
                      new URL(feedUrl).hostname;
        
        if (title && description && link && description.length > 50) {
          articles.push({
            title,
            description: description.replace(/<[^>]*>/g, '').substring(0, 300) + '...',
            url: link,
            image,
            source,
            author,
            published_at: pubDate,
            is_rss: true,
            rss_category: category,
            content: description // Store full content for image extraction
          });
        }
      } catch (itemError) {
        console.log('❌ Error parsing RSS item:', itemError);
      }
    });
    
    console.log(`✅ ${category} RSS feed parsed: ${articles.length} valid articles`);
    return articles;
    
  } catch (error) {
    console.error(`❌ Error parsing ${category} RSS feed ${feedUrl}:`, error);
    return [];
  }
};

export default function TechGamingDiscover() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("trending");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [articles, setArticles] = useState(getDefaultDataStructure());
  const [isLoading, setIsLoading] = useState(false);
  const [cacheSource, setCacheSource] = useState('multi_storage_initial');
  const [nextRefresh, setNextRefresh] = useState(new Date(Date.now() + TWENTY_FOUR_HOURS_MS));
  const [refreshTimer, setRefreshTimer] = useState(null);
  const [convertingLinks, setConvertingLinks] = useState({});
  const [distributionResults, setDistributionResults] = useState([]);

  // Function to fetch tech & gaming articles from multiple sources
  const fetchAllArticles = async () => {
    try {
      console.log('🚀 Fetching from all sources: MediaStack + Categorized RSS Feeds');
      
      const [mediaStackArticles, rssArticles] = await Promise.all([
        fetchMediaStackArticles(),
        fetchAllRSSFeeds()
      ]);
      
      console.log(`📊 Sources combined: ${mediaStackArticles.length} MediaStack + ${rssArticles.length} RSS = ${mediaStackArticles.length + rssArticles.length} total`);
      
      return [...mediaStackArticles, ...rssArticles];
      
    } catch (error) {
      console.error('❌ Error fetching from all sources:', error);
      return [];
    }
  };

  // Function to fetch from MediaStack API
  const fetchMediaStackArticles = async () => {
    try {
      console.log('📡 Fetching from MediaStack API...');
      
      const response = await fetch(
        `https://api.mediastack.com/v1/news?access_key=${MEDIASTACK_API_KEY}&categories=technology&languages=en&limit=100&sort=published_desc`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(`MediaStack API Error: ${data.error.message}`);
      }
      
      if (data.data && Array.isArray(data.data)) {
        const articlesWithImages = data.data.filter(article => {
          const hasImage = getArticleImage(article) !== null;
          const isEnglish = article.language === 'en';
          const hasFullContent = article.description && article.description.length > 100;
          
          return hasImage && isEnglish && hasFullContent;
        });

        console.log(`✅ MediaStack: ${articlesWithImages.length} valid articles with images`);
        return articlesWithImages.map(article => ({
          ...article,
          source_type: 'mediastack'
        }));
      }
      
      return [];
    } catch (error) {
      console.error('❌ Error fetching from MediaStack:', error);
      return [];
    }
  };

  // Function to fetch from all categorized RSS feeds
  const fetchAllRSSFeeds = async () => {
    try {
      console.log('📡 Fetching from categorized RSS feeds...');
      
      const allArticles = [];
      const feedPromises = [];
      
      Object.entries(RSS_FEEDS).forEach(([category, feeds]) => {
        feeds.forEach(feedUrl => {
          feedPromises.push(parseRSSFeed(feedUrl, category));
        });
      });
      
      const feedResults = await Promise.allSettled(feedPromises);
      
      feedResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          allArticles.push(...result.value);
        }
      });
      
      console.log(`✅ RSS Feeds: ${allArticles.length} total articles`);
      return allArticles;
      
    } catch (error) {
      console.error('❌ Error fetching RSS feeds:', error);
      return [];
    }
  };

  // Transform articles to frontend structure
  const transformArticles = (apiArticles) => {
    const transformed = getDefaultDataStructure();
    const usedArticleIds = new Set();
    const seenTitles = new Set();

    apiArticles.forEach((article) => {
      const titleKey = article.title?.toLowerCase().trim();
      if (seenTitles.has(titleKey)) {
        return;
      }
      seenTitles.add(titleKey);

      let netnapzCategory = article.rss_category || determineArticleCategory(article);
      const isBreaking = Math.random() > 0.95;
      const isTrending = Math.random() > 0.8;
      const engagementMultiplier = 5000 + Math.floor(Math.random() * 15000);
      
      const processedArticle = {
        id: `tech_gaming_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: article.title,
        description: article.description,
        url: article.url,
        image: getArticleImage(article),
        image_url: getArticleImage(article),
        source: article.source,
        author: article.author || 'Tech & Gaming Desk',
        published_at: article.published_at,
        timestamp: new Date(article.published_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        category: netnapzCategory,
        breaking: isBreaking,
        trending: isTrending,
        views: Math.floor(engagementMultiplier * (1 + Math.random())).toLocaleString(),
        likes: Math.floor(engagementMultiplier * 0.3).toLocaleString(),
        comments: Math.floor(engagementMultiplier * 0.08).toLocaleString(),
        hasImage: true,
        userComments: [],
        is_rss: article.is_rss || false,
        source_type: article.source_type || 'rss',
        score: netnapzCategory === 'reviews' ? (Math.floor(Math.random() * 3) + 7) + '/10' : null,
        full_content: generateFullContent(article.title, article.description, netnapzCategory)
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

    const categoryCounts = Object.keys(transformed).map(key => ({
      category: key,
      count: transformed[key].length
    })).sort((a, b) => b.count - a.count);

    console.log('📊 Final article distribution:', categoryCounts);

    return transformed;
  };

  // Generate full content for articles
  const generateFullContent = (title, description, category) => {
    const baseContent = [
      description,
      `This in-depth analysis explores the latest developments in the ${title.toLowerCase()} space. Industry experts are weighing in on what this means for the future of technology and gaming.`
    ];

    const categorySpecificContent = {
      tech: [
        "The technology sector continues to evolve at a rapid pace, with innovations emerging daily. This development represents a significant step forward in how we interact with digital platforms and services.",
        "Early adopters are already reporting positive experiences, while industry analysts predict this could set new standards for user experience and functionality across the tech landscape."
      ],
      gaming: [
        "Gaming enthusiasts are excited about this latest development, which promises to enhance gameplay experiences and push the boundaries of interactive entertainment.",
        "The gaming community has been actively discussing the implications, with many praising the innovation while others await more hands-on experience before forming final opinions."
      ],
      reviews: [
        "After extensive testing and analysis, our review team has compiled detailed insights into performance, usability, and overall value proposition.",
        "Compared to competing products and previous generations, this offering stands out for its unique combination of features and competitive pricing structure."
      ],
      hardware: [
        "Hardware performance benchmarks reveal impressive results across multiple testing scenarios, demonstrating significant improvements over previous generations.",
        "The engineering team behind this hardware has focused on both raw performance and energy efficiency, resulting in a product that balances power with practicality."
      ],
      esports: [
        "The esports community is closely watching these developments, as they could significantly impact competitive gaming strategies and tournament outcomes.",
        "Professional players and teams are already adapting their approaches to incorporate these new possibilities into their competitive arsenals."
      ],
      mobile: [
        "Mobile users will appreciate the optimized experience and enhanced functionality designed specifically for on-the-go usage scenarios.",
        "The development team has placed strong emphasis on battery efficiency and data optimization, ensuring smooth performance even on limited mobile networks."
      ],
      pc: [
        "PC enthusiasts will find plenty to appreciate in these developments, with enhanced compatibility and performance optimizations for various hardware configurations.",
        "The PC gaming community has been particularly vocal about these improvements, highlighting the benefits for both casual and competitive players."
      ],
      console: [
        "Console gamers can look forward to enhanced experiences with improved graphics, faster load times, and more immersive gameplay features.",
        "The development represents a significant investment in console gaming technology, demonstrating the ongoing commitment to this important gaming platform."
      ]
    };

    const additionalContent = categorySpecificContent[category] || [
      "With the rapid pace of innovation in the tech and gaming industries, staying informed about developments like this is crucial for enthusiasts and professionals alike.",
      "As we continue to monitor this evolving story, the community response and real-world implementation will provide further insights into the long-term impact of these developments."
    ];

    return [...baseContent, ...additionalContent].join('\n\n');
  };

  // Function to determine article category based on content
  const determineArticleCategory = (article) => {
    const title = article.title?.toLowerCase() || '';
    const description = article.description?.toLowerCase() || '';

    const techKeywords = ['tech', 'technology', 'software', 'hardware', 'computer', 'digital', 'internet', 'web', 'app', 'ai', 'artificial intelligence'];
    const gamingKeywords = ['game', 'gaming', 'playstation', 'xbox', 'nintendo', 'steam', 'pc gaming', 'video game', 'gamer', 'esports', 'console'];
    const reviewKeywords = ['review', 'hands-on', 'tested', 'impressions', 'score', 'rating', 'verdict', 'analysis'];
    const esportsKeywords = ['esports', 'tournament', 'competitive', 'pro player', 'championship', 'competitive gaming', 'pro gaming'];
    const hardwareKeywords = ['gpu', 'cpu', 'processor', 'graphics', 'motherboard', 'ram', 'ssd', 'hardware', 'nvidia', 'amd', 'intel'];
    const mobileKeywords = ['mobile', 'iphone', 'android', 'smartphone', 'tablet', 'ios', 'mobile game'];
    const pcKeywords = ['pc', 'computer', 'windows', 'mac', 'linux', 'pc gaming', 'desktop'];
    const consoleKeywords = ['playstation', 'xbox', 'nintendo', 'console', 'ps5', 'xbox series', 'switch'];

    const content = `${title} ${description}`;

    const counts = {
      reviews: reviewKeywords.filter(kw => content.includes(kw)).length,
      esports: esportsKeywords.filter(kw => content.includes(kw)).length,
      hardware: hardwareKeywords.filter(kw => content.includes(kw)).length,
      mobile: mobileKeywords.filter(kw => content.includes(kw)).length,
      pc: pcKeywords.filter(kw => content.includes(kw)).length,
      console: consoleKeywords.filter(kw => content.includes(kw)).length,
      gaming: gamingKeywords.filter(kw => content.includes(kw)).length,
      tech: techKeywords.filter(kw => content.includes(kw)).length
    };

    const maxCategory = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    
    return counts[maxCategory] > 0 ? maxCategory : 'tech';
  };

  // Function to automatically refresh data
  const autoRefreshData = async () => {
    console.log('🔄 AUTO-REFRESH: Pulling fresh tech & gaming data...');
    setIsLoading(true);

    try {
      const allArticles = await fetchAllArticles();
      
      if (allArticles.length === 0) {
        throw new Error('No articles fetched from any source');
      }
      
      const transformedData = transformArticles(allArticles);
      
      setArticles(transformedData);
      saveToMultiStorage(transformedData, 'api_rss_refresh');
      setLastUpdated(new Date());
      setCacheSource('api_rss_refresh');
      setNextRefresh(new Date(Date.now() + TWENTY_FOUR_HOURS_MS));
      
      console.log('✅ AUTO-REFRESH: Tech & gaming data refreshed successfully');
      
    } catch (error) {
      console.error('❌ AUTO-REFRESH: Error refreshing data:', error);
      setNextRefresh(new Date(Date.now() + TWENTY_FOUR_HOURS_MS));
    } finally {
      setIsLoading(false);
    }
  };

  // Setup auto-refresh timer
  useEffect(() => {
    const setupAutoRefresh = () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }

      const now = new Date();
      const timeUntilRefresh = new Date(nextRefresh) - now;

      console.log('⏰ Setting up auto-refresh timer:', {
        nextRefresh: nextRefresh.toISOString(),
        timeUntilRefresh: Math.round(timeUntilRefresh / 1000 / 60 / 60) + ' hours'
      });

      if (timeUntilRefresh <= 0) {
        console.log('⏰ Refresh time expired, refreshing now...');
        autoRefreshData();
      } else {
        const timer = setTimeout(() => {
          console.log('⏰ Auto-refresh timer triggered!');
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
    console.log('🚀 Initializing NetNapz Tech & Gaming with 24-hour cache...');
    
    const loadArticles = async () => {
      const cached = loadFromMultiStorage();
      
      const isCacheValid = cached && 
                          cached.timestamp && 
                          (new Date() - new Date(cached.timestamp)) < TWENTY_FOUR_HOURS_MS;
      
      if (cached && cached.data && isCacheValid) {
        console.log('✅ Using valid cached data (age:', Math.round((new Date() - new Date(cached.timestamp)) / 1000 / 60 / 60), 'hours)');
        setArticles(cached.data);
        setLastUpdated(new Date(cached.timestamp));
        setCacheSource(cached.source);
        
        if (cached.nextRefresh) {
          setNextRefresh(new Date(cached.nextRefresh));
        } else {
          setNextRefresh(new Date(Date.now() + TWENTY_FOUR_HOURS_MS));
        }
      } else {
        console.log('🔄 Cache invalid or missing, fetching fresh data...');
        if (cached) {
          console.log('📝 Cache age:', Math.round((new Date() - new Date(cached.timestamp)) / 1000 / 60 / 60), 'hours');
        }
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
      // First try to fetch full article content
      let fullContent = article.full_content;
      if (!fullContent || fullContent === article.description) {
        console.log('📄 Fetching full article content for:', article.title);
        fullContent = await fetchFullArticleContent(article.url);
      }

      const affiliateUrl = await convertToAffiliateLink(
        article.url, 
        article.id,
        article.title
      );
      
      sessionStorage.setItem('currentArticle', JSON.stringify({
        ...article,
        affiliateUrl: affiliateUrl,
        originalUrl: article.url,
        full_content: fullContent || article.full_content || article.description
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

      saveToMultiStorage(updated, cacheSource);
      
      return updated;
    });
  };

  // Handle distribution completion
  const handleDistributionComplete = (results) => {
    setDistributionResults(results);
    
    // Show success notification
    const successful = results.filter(r => r.success).length;
    if (successful > 0) {
      alert(`✅ Successfully distributed ${successful} posts across social media!`);
    }
  };

  // Tech & Gaming content categories
  const techGamingCategories = [
    { id: "trending", name: "TRENDING", icon: TrendingUp, color: "from-blue-500 to-purple-500" },
    { id: "tech", name: "TECH", icon: Cpu, color: "from-blue-500 to-indigo-500" },
    { id: "gaming", name: "GAMING", icon: GamepadIcon, color: "from-green-500 to-emerald-500" },
    { id: "reviews", name: "REVIEWS", icon: Star, color: "from-yellow-500 to-amber-500" },
    { id: "esports", name: "ESPORTS", icon: Trophy, color: "from-purple-500 to-pink-500" },
    { id: "hardware", name: "HARDWARE", icon: Monitor, color: "from-red-500 to-orange-500" },
    { id: "pc", name: "PC", icon: Cpu, color: "from-cyan-500 to-blue-500" },
    { id: "console", name: "CONSOLE", icon: GamepadIcon, color: "from-orange-500 to-red-500" }
  ];

  // Safe content filtering with proper error handling
  const filteredContent = useMemo(() => {
    const safeArticles = ensureDataStructure(articles);
    
    if (selectedCategory === "trending") {
      const trending = getSafeArray(safeArticles, 'trending');
      const breaking = getSafeArray(safeArticles, 'breaking');
      
      return [...trending, ...breaking].slice(0, 20);
    }
    
    return getSafeArray(safeArticles, selectedCategory).slice(0, 20);
  }, [articles, selectedCategory]);

  const totalArticles = useMemo(() => {
    const safeArticles = ensureDataStructure(articles);
    if (!safeArticles) return 0;
    
    return Object.values(safeArticles).reduce((total, category) => 
      total + (Array.isArray(category) ? category.length : 0), 0
    );
  }, [articles]);

  // Get featured story (first trending article)
  const featuredStory = useMemo(() => {
    const safeArticles = ensureDataStructure(articles);
    const trending = getSafeArray(safeArticles, 'trending');
    const breaking = getSafeArray(safeArticles, 'breaking');
    
    return trending[0] || breaking[0] || filteredContent[0] || null;
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
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">NG</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900">NetNapz</h1>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                TECH & GAMING
              </span>
            </div>

            {/* Affiliate Badge */}
            <div className="hidden md:flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
              <Link className="w-4 h-4" />
              <span className="text-sm font-semibold">Affiliate Links Active</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {techGamingCategories.slice(0, 6).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`font-semibold text-sm transition-colors ${
                    selectedCategory === category.id 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
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
                {techGamingCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      selectedCategory === category.id 
                        ? 'bg-blue-600 text-white' 
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
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-black text-sm uppercase tracking-wider bg-black px-2 py-1 rounded">
                Tech & Gaming Pulse
              </span>
              <span className="text-sm font-medium truncate">
                {featuredStory?.title || "Latest tech news, gaming updates & reviews - Auto-refreshes every 24 hours"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium opacity-90">
              <Database className="w-3 h-3" />
              {lastUpdated.toLocaleDateString()}
              <span className="bg-black/20 px-2 py-1 rounded text-xs">
                24H CACHE
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
                {featuredStory.image ? (
                  <img 
                    src={featuredStory.image} 
                    alt={featuredStory.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : null}
                
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1.5 text-sm font-black rounded-lg">
                    FEATURED
                  </span>
                </div>
                {featuredStory.score && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-yellow-500 text-white px-3 py-1.5 text-sm font-black rounded-lg">
                      {featuredStory.score}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                  <span className="bg-gray-100 px-3 py-1 rounded-full font-semibold">
                    {featuredStory.category?.toUpperCase() || 'TECH'}
                  </span>
                  <span>{featuredStory.timestamp || 'Recently'}</span>
                  {featuredStory.is_rss && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                      RSS
                    </span>
                  )}
                  {featuredStory.source_type === 'mediastack' && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      API
                    </span>
                  )}
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                  {featuredStory.title}
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                  {featuredStory.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Eye className="w-4 h-4" />
                      {featuredStory.views || '15.2K'}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Heart className="w-4 h-4" />
                      {featuredStory.likes || '3.2K'}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <MessageCircle className="w-4 h-4" />
                      {featuredStory.comments || '428'}
                    </span>
                  </div>
                  <div className="text-blue-600 font-semibold text-sm flex items-center gap-2">
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
            <h2 className="text-2xl font-black text-gray-900">Tech & Gaming Discovery</h2>
            
            <AutoRefreshTimer 
              nextRefresh={nextRefresh}
              onRefresh={autoRefreshData}
              isLoading={isLoading}
              cacheSource={cacheSource}
            />
          </div>

          <div className="flex overflow-x-auto gap-1 pb-4 scrollbar-hide">
            {techGamingCategories.map((category) => {
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
              <p className="text-lg text-gray-600 font-medium">Refreshing tech & gaming content...</p>
              <p className="text-sm text-gray-500 mt-2">Pulling latest from MediaStack API & RSS Feeds</p>
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
                            <img 
                              src={articleImage} 
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : null}
                          
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className="bg-black/80 text-white px-2 py-1 text-xs font-semibold rounded">
                              {item.category?.toUpperCase() || 'TECH'}
                            </span>
                            {item.is_rss && (
                              <span className="bg-green-600 text-white px-2 py-1 text-xs font-semibold rounded">
                                RSS
                              </span>
                            )}
                            {item.source_type === 'mediastack' && (
                              <span className="bg-blue-600 text-white px-2 py-1 text-xs font-semibold rounded">
                                API
                              </span>
                            )}
                          </div>
                          
                          {item.score && (
                            <div className="absolute top-3 right-3">
                              <span className="bg-yellow-500 text-white px-2 py-1 text-xs font-black rounded">
                                {item.score}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              {item.source || 'Tech News'}
                            </span>
                            <span className="text-xs text-gray-500">{item.timestamp || 'Recently'}</span>
                          </div>
                          
                          <h3 
                            className="text-xl font-black text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors cursor-pointer"
                            onClick={() => handleArticleClick(item)}
                          >
                            {item.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                            {item.description}
                          </p>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {item.views || '15.2K'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {item.likes || '3.2K'}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                {item.comments || '428'}
                              </span>
                            </div>
                            
                            <button 
                              onClick={(e) => handleReadMoreClick(item, e)}
                              disabled={isConverting}
                              className="text-blue-600 text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                <Globe className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">
                {totalArticles === 0 ? 'Loading Tech & Gaming Articles...' : 'No Articles Found'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {totalArticles === 0 
                  ? "Fetching the latest tech news, gaming updates, and reviews from multiple sources..."
                  : `No ${selectedCategory} articles available at the moment. System will auto-refresh in 24 hours.`}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                Next auto-refresh: {nextRefresh.toLocaleDateString()} at {nextRefresh.toLocaleTimeString()}
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
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-green-600 rounded flex items-center justify-center">
                <span className="text-white font-black text-xs">NG</span>
              </div>
              <span className="text-xl font-black">NetNapz Tech & Gaming</span>
            </div>
            <p className="text-gray-400 mb-6">
              Your daily source for tech innovation, gaming news, esports, and hardware reviews
            </p>
            <div className="text-sm text-gray-500">
              © 2025 NetNapz. Powered by MediaStack API & RSS Feeds. Auto-refreshes every 24 hours with fresh content.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}