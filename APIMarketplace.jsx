import React, { useState, useMemo, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, LayoutGroup } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  ExternalLink,
  TrendingUp,
  Code,
  Sparkles,
  Loader2,
  BookOpen,
  Zap,
  Shield,
  DollarSign,
  Users,
  Globe,
  Brain,
  Rocket,
  Crown,
  Award,
  Blocks,
  ShoppingCart,
  Grid3x3,
  Cpu,
  Image,
  Video,
  Terminal,
  AlertTriangle,
  Flame,
  Key,
  Newspaper,
  ThumbsUp,
  MessageSquare,
  Send,
  Check,
  X,
  Copy,
  CheckCircle,
  Link
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ToolsMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [pricingFilter, setPricingFilter] = useState("all");
  const [selectedTool, setSelectedTool] = useState(null);
  const [mobileTab, setMobileTab] = useState("tools");
  const [showFeeds, setShowFeeds] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const { data: tools = [], isLoading } = useQuery({
    queryKey: ["tools"],
    queryFn: () => base44.entities.Tool.list("-created_date"),
    initialData: [],
  });

  // Lazy load feeds after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeeds(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // DeepSeek Search Function
  const handleDeepSeekSearch = async (query) => {
    if (!query || !query.trim()) return;
    
    setSearchQuery(query);
    setAiQuery(query);
    setAiAnswer("");
    setIsAiLoading(true);

    try {
      // First, search our database for matching tools
      const searchTerms = query.toLowerCase();
      const matchingTools = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerms) ||
        tool.description.toLowerCase().includes(searchTerms) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(searchTerms)) ||
        tool.category?.toLowerCase().includes(searchTerms)
      );

      // Create HTML for matching tools with clickable links
      let toolsListHTML = '';
      if (matchingTools.length > 0) {
        toolsListHTML = `
          <div class="mb-8">
            <h4 class="text-xl font-black text-black mb-4 flex items-center gap-2">
              <Search class="w-5 h-5 text-green-600" />
              🔍 Matching Tools from Our Database
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${matchingTools.map(tool => `
                <div class="bg-white border-2 border-black rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer" onclick="window.open('${tool.custom_affiliate_link || tool.external_link}', '_blank')">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                      ${tool.logo_url ? `<img src="${tool.logo_url}" alt="${tool.name}" class="w-10 h-10 rounded-lg border border-gray-300" />` : '<div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center border border-gray-300"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg></div>'}
                      <div>
                        <h5 class="font-black text-black text-lg">${tool.name}</h5>
                        <div class="flex items-center gap-2 mt-1">
                          <span class="px-2 py-1 ${tool.pricing === 'free' ? 'bg-green-100 text-green-800' : tool.pricing === 'freemium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'} rounded text-xs font-bold">${tool.pricing}</span>
                          <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">${tool.category}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-red-600 font-bold text-sm flex items-center gap-1">
                      Visit
                      <ExternalLink class="w-4 h-4" />
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm mb-3">${tool.description}</p>
                  ${tool.tags && tool.tags.length > 0 ? `
                    <div class="flex flex-wrap gap-1">
                      ${tool.tags.slice(0, 3).map(tag => `
                        <span class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-medium text-gray-700">${tag}</span>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      // Get AI recommendations with DeepSeek search
      const { data } = await base44.functions.invoke('deepseekSearch', {
        prompt: `You are NetNapz AI, an expert assistant for helping people find the best no-code platforms, AI tools, MVP solutions, e-commerce tools, and tech resources.

User Question: "${query}"

CRITICAL FORMATTING REQUIREMENTS:
1. Provide a comprehensive, well-structured answer that recommends specific tools and platforms
2. FOR EVERY TOOL YOU MENTION, YOU MUST INCLUDE ITS OFFICIAL WEBSITE URL
3. Format your response in clean HTML with proper headings and lists
4. MAKE ALL URLs CLICKABLE using <a href="https://actual-url.com" target="_blank" class="tool-link">Tool Name</a> format
5. Organize tools by category when possible
6. Include brief descriptions and key features
7. Use proper HTML headings and lists for readability

EXAMPLE FORMAT - YOU MUST FOLLOW THIS:
<h3>🎯 No-Code Platforms</h3>
<ul>
<li><strong><a href="https://webflow.com" target="_blank" class="tool-link">Webflow</a></strong> - Design and develop responsive websites visually. Perfect for designers who want to build production-ready sites without code.</li>
<li><strong><a href="https://bubble.io" target="_blank" class="tool-link">Bubble</a></strong> - Build web applications without code. Great for startups and entrepreneurs to create complex web apps.</li>
</ul>

<h3>🤖 AI Tools</h3>
<ul>
<li><strong><a href="https://chatgpt.com" target="_blank" class="tool-link">ChatGPT</a></strong> - Advanced AI assistant for content creation, coding, and research.</li>
<li><strong><a href="https://midjourney.com" target="_blank" class="tool-link">Midjourney</a></strong> - AI image generation tool for creating stunning visuals and artwork.</li>
</ul>

IMPORTANT: Always include the actual https:// URLs and make them clickable!`
      });

      let finalAnswer = '';
      
      if (matchingTools.length > 0) {
        finalAnswer += toolsListHTML;
        finalAnswer += `<div class="mb-6"><h4 class="text-xl font-black text-black mb-4 flex items-center gap-2"><Brain class="w-5 h-5 text-purple-600" />🤖 AI Recommendations & Additional Tools</h4></div>`;
      } else {
        finalAnswer += `<div class="mb-6"><h4 class="text-xl font-black text-black mb-4 flex items-center gap-2"><Brain class="w-5 h-5 text-purple-600" />🤖 AI Recommendations</h4></div>`;
      }
      
      if (data.error) {
        finalAnswer += `<div class="bg-red-100 border-2 border-red-300 rounded-2xl p-4"><strong class="text-red-800">⚠️ Error:</strong> <span class="text-red-700">${data.error}</span></div>`;
      } else {
        // Process AI response to ensure URLs are properly formatted
        let processedResponse = data.response;
        
        // Enhance URL detection and formatting for common tools
        const commonTools = {
          'webflow': 'https://webflow.com',
          'bubble': 'https://bubble.io',
          'figma': 'https://figma.com',
          'airtable': 'https://airtable.com',
          'notion': 'https://notion.so',
          'zapier': 'https://zapier.com',
          'shopify': 'https://shopify.com',
          'stripe': 'https://stripe.com',
          'canva': 'https://canva.com',
          'adobe': 'https://adobe.com',
          'chatgpt': 'https://chat.openai.com',
          'midjourney': 'https://midjourney.com',
          'github': 'https://github.com',
          'vercel': 'https://vercel.com',
          'netlify': 'https://netlify.com',
          'spline': 'https://spline.design',
          'framer': 'https://framer.com',
          'wix': 'https://wix.com',
          'squarespace': 'https://squarespace.com',
          'wordpress': 'https://wordpress.com',
          'webflow': 'https://webflow.com',
          'bubble': 'https://bubble.io',
          'adalo': 'https://adalo.com',
          'glide': 'https://glideapps.com',
          'softr': 'https://softr.io',
          'carrd': 'https://carrd.co',
          'memberstack': 'https://memberstack.com',
          'make': 'https://make.com',
          'integromat': 'https://integromat.com',
          'n8n': 'https://n8n.io'
        };

        // Replace tool names with clickable links
        Object.entries(commonTools).forEach(([toolName, toolUrl]) => {
          const regex = new RegExp(`\\b${toolName}\\b`, 'gi');
          processedResponse = processedResponse.replace(
            regex, 
            `<a href="${toolUrl}" target="_blank" class="text-blue-600 hover:text-blue-800 underline font-medium">${toolName}</a>`
          );
        });

        // Ensure all URLs are properly formatted
        processedResponse = processedResponse.replace(
          /(https?:\/\/[^\s<>"]+)/g, 
          '<a href="$1" target="_blank" class="text-blue-600 hover:text-blue-800 underline font-medium">$1</a>'
        );

        // Add styling for better readability
        processedResponse = processedResponse
          .replace(/<h3>/g, '<h3 class="text-lg font-black text-black mt-6 mb-3">')
          .replace(/<h4>/g, '<h4 class="text-lg font-black text-black mt-6 mb-3">')
          .replace(/<ul>/g, '<ul class="list-disc list-inside space-y-2 mb-4">')
          .replace(/<li>/g, '<li class="text-gray-700">')
          .replace(/<strong>/g, '<strong class="font-semibold text-gray-900">');
        
        finalAnswer += processedResponse;
      }

      setAiAnswer(finalAnswer);

    } catch (error) {
      console.error('DeepSeek Search error:', error);
      setAiAnswer(`
        <div class="bg-red-100 border-2 border-red-300 rounded-2xl p-4">
          <strong class="text-red-800">⚠️ Error:</strong> 
          <span class="text-red-700">Sorry, I encountered an error. Please try again or rephrase your question.</span>
        </div>
      `);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Handle search input with Enter key
  const handleSearchInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleDeepSeekSearch(searchQuery);
    }
  };

  const categories = [
    { id: "all", name: "All Tools", icon: Grid3x3, color: "red" },
    { id: "no_code_builders", name: "No-Code Builders", icon: Blocks, color: "orange" },
    { id: "mvp_tools", name: "MVP Solutions", icon: Rocket, color: "yellow" },
    { id: "ai_tools", name: "AI Powered", icon: Brain, color: "red" },
    { id: "dropshipping", name: "E-Commerce", icon: ShoppingCart, color: "orange" },
    { id: "guides", name: "Resources", icon: BookOpen, color: "yellow" },
  ];

  const pricingOptions = [
    { id: "all", name: "All Pricing" },
    { id: "free", name: "Free" },
    { id: "freemium", name: "Freemium" },
    { id: "paid", name: "Paid" },
  ];

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        searchQuery === "" ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "all" || tool.category === selectedCategory;

      const matchesPricing =
        pricingFilter === "all" || tool.pricing === pricingFilter;

      return matchesSearch && matchesCategory && matchesPricing;
    });
  }, [tools, searchQuery, selectedCategory, pricingFilter]);

  const featuredTools = useMemo(() => {
    return tools.filter((tool) => tool.is_featured).slice(0, 6);
  }, [tools]);

  const stats = [
    { label: "Total Tools", value: tools.length, icon: Code },
    { label: "Free Tools", value: tools.filter(a => a.pricing === 'free').length, icon: Zap },
    { label: "Verified", value: tools.filter(a => a.is_verified).length, icon: Shield },
    { label: "Categories", value: new Set(tools.map(a => a.category)).size, icon: Filter },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background with your image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6907bbc1d9a3081c7edf7dd0/de7781c73_create-a-cool-grafity-logo-for-red-splat-handprint-with-the-text-netnapzpunk-style-high-quality.jpg"
          alt="NetNapz Punk Style Background"
          className="w-full h-full object-cover"
        />
        
        {/* White overlay for readability */}
        <div className="absolute inset-0 bg-white/90"></div>
        
        {/* White grid background overlay */}
        <div className="absolute inset-0 bg-[size:50px_50px] bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] opacity-50"></div>
        
        {/* Subtle animated blobs for depth */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-green-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* 🚨 SCROLLING BANNER - TOP */}
      <div className="bg-black text-white py-3 overflow-hidden border-b-2 border-red-500 relative z-20">
        <div className="animate-marquee whitespace-nowrap">
          <span className="mx-8 flex items-center gap-2 text-sm font-bold">
            <Rocket className="w-4 h-4 text-red-400" />
            <span className="text-red-400">NEW:</span> AI Search Now 100% FREE • 
            <span className="text-red-400 mx-4">|</span>
            <Shield className="w-4 h-4 text-red-400" />
            Enterprise-Grade Security • 
            <span className="text-red-400 mx-4">|</span>
            <Award className="w-4 h-4 text-red-400" />
            Unlimited Access to DeepSeek V3.1 • 
            <span className="text-red-400 mx-4">|</span>
            <Sparkles className="w-4 h-4 text-red-400" />
            Multi-AI Technology Stack Live •
            <span className="text-red-400 mx-4">|</span>
            <Rocket className="w-4 h-4 text-red-400" />
            <span className="text-red-400">NEW:</span> AI Search Now 100% FREE • 
            <span className="text-red-400 mx-4">|</span>
            <Shield className="w-4 h-4 text-red-400" />
            Enterprise-Grade Security • 
            <span className="text-red-400 mx-4">|</span>
            <Award className="w-4 h-4 text-red-400" />
            Unlimited Access to DeepSeek V3.1 • 
            <span className="text-red-400 mx-4">|</span>
            <Sparkles className="w-4 h-4 text-red-400" />
            Multi-AI Technology Stack Live
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          display: inline-flex;
        }
      `}</style>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-8 border-2 border-green-500/30 cartoon-border">
                <Sparkles className="w-4 h-4 text-green-600 animate-pulse" />
                <span className="text-sm font-bold text-green-600 uppercase tracking-wider">
                  🚀 Tools Marketplace - 100% Curated
                </span>
              </div>
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-8xl font-black mb-4 md:mb-6 leading-[1.1] tracking-tight">
                Build Anything.
                <span className="block mt-2 md:mt-3">
                  <span className="text-cartoon-orange">
                    Ship Faster.
                  </span>
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium"
              >
                Discover {tools.length}+ tools for your projects. <span className="text-red-600 font-semibold">No-Code Platforms</span>, <span className="text-yellow-600 font-semibold">AI Solutions</span>, and <span className="text-green-600 font-semibold">MVP Tools</span> all in one place.
              </motion.p>
            </motion.div>

            {/* Fixed Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative max-w-4xl mx-auto mb-6 md:mb-12"
            >
              <div className="relative group">
                {/* Search container */}
                <div className="relative bg-gray-100 rounded-xl border-2 border-gray-300 shadow-sm overflow-hidden transition-all duration-300 cartoon-border">
                  <div className="relative flex items-center">
                    {/* Icon */}
                    <div className="absolute left-5 md:left-7 flex items-center gap-3">
                      <Search className="w-6 h-6 md:w-7 md:h-7 text-gray-500" aria-hidden="true" />
                      <div className="hidden md:block h-8 w-px bg-gray-400"></div>
                    </div>
                    
                    {/* Input */}
                    <input
                      type="text"
                      id="tool-search"
                      name="tool-search"
                      autoComplete="off"
                      placeholder="Search tools, ask questions, get AI recommendations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleSearchInputKeyPress}
                      className="w-full pl-16 md:pl-24 pr-32 md:pr-48 py-5 md:py-7 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-base md:text-xl font-medium"
                      aria-label="Tool search input"
                    />
                    
                    {/* DeepSeek Search button */}
                    <button 
                      onClick={() => handleDeepSeekSearch(searchQuery)}
                      disabled={!searchQuery || !searchQuery.trim() || isAiLoading}
                      className="absolute right-2 md:right-3 flex items-center gap-2 px-6 md:px-10 py-3 md:py-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-sm md:text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow cartoon-btn"
                      aria-label="Ask AI about tools"
                    >
                      {isAiLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Brain className="w-5 h-5" />
                      )}
                      <span className="hidden md:inline">
                        {isAiLoading ? 'Searching...' : 'Ask AI'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Example queries */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="text-xs text-gray-500 font-semibold">Try:</span>
                {["Best Webflow alternatives", "Build MVP with no code", "Top AI image generators", "E-commerce tools for dropshipping"].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => handleDeepSeekSearch(example)}
                    className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-full text-xs font-medium text-gray-700 hover:bg-gray-200 transition-all cartoon-btn"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                    className="relative group"
                  >
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-4 md:p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cartoon-glass">
                      <Icon className={`w-6 h-6 md:w-8 md:h-8 text-red-500 mb-2 mx-auto`} />
                      <div className={`text-2xl md:text-4xl font-black text-red-500 mb-1`}>
                        {stat.value}
                      </div>
                      <div className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AI Search Results */}
      {aiAnswer && (
        <div className="container mx-auto max-w-6xl px-4 mb-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cartoon-glass rounded-3xl border-2 border-black p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-black flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                DeepSeek AI Recommendations
              </h3>
              <Button
                onClick={() => {
                  setAiAnswer("");
                  setAiQuery("");
                }}
                className="cartoon-btn bg-red-500 hover:bg-red-600 text-white border-2 border-black"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div 
              className="prose prose-lg max-w-none ai-recommendations"
              dangerouslySetInnerHTML={{ 
                __html: aiAnswer
              }}
            />
          </motion.div>
        </div>
      )}

      {/* Loading State for AI */}
      {isAiLoading && (
        <div className="container mx-auto max-w-4xl px-4 mb-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cartoon-glass rounded-3xl border-2 border-black p-6"
          >
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
              <span className="text-lg font-bold text-black">DeepSeek AI is searching for the best tools...</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Rest of your component remains the same */}
      {/* 4-Quadrant Layout */}
      <section className="pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Left: News Feed */}
            <div className="cartoon-glass rounded-3xl border-2 border-black p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center cartoon-border">
                  <Newspaper className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-black">Tool News</h2>
                  <p className="text-gray-600 font-bold">Latest tool updates & releases</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-yellow-100 border-2 border-black rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-red-500 text-white">New</Badge>
                    <span className="text-sm font-bold text-black">Webflow 2.0 Released</span>
                  </div>
                  <p className="text-sm text-gray-700">New components and enhanced performance.</p>
                </div>
                <div className="bg-green-100 border-2 border-black rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-orange-500 text-white">Update</Badge>
                    <span className="text-sm font-bold text-black">Figma AI Features</span>
                  </div>
                  <p className="text-sm text-gray-700">New AI-powered design tools available.</p>
                </div>
                <div className="bg-blue-100 border-2 border-black rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-yellow-500 text-black">Tip</Badge>
                    <span className="text-sm font-bold text-black">No-Code Best Practices</span>
                  </div>
                  <p className="text-sm text-gray-700">Learn how to optimize your no-code workflows.</p>
                </div>
              </div>
            </div>

            {/* Top Right: Featured Tools */}
            <div className="cartoon-glass rounded-3xl border-2 border-black p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center cartoon-border">
                  <Star className="w-6 h-6 text-white fill-current" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-black">Featured Tools</h2>
                  <p className="text-gray-600 font-bold">Most popular platforms</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredTools.slice(0, 4).map((tool, index) => (
                  <ToolCard key={tool.id} tool={tool} index={index} onSelect={() => setSelectedTool(tool)} />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bottom Left: AI Models Showcase */}
            <div className="cartoon-glass rounded-3xl border-2 border-black p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center cartoon-border">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-black">AI Models</h2>
                  <p className="text-gray-600 font-bold">Powered by multiple AI systems</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-yellow-100 border-2 border-black rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Code className="w-5 h-5 text-cyan-600" />
                    <span className="font-bold text-black">DeepSeek V3.1</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    Enterprise-grade reasoning for code generation & AI search
                  </p>
                  <Badge className="bg-green-500 text-white">Free</Badge>
                </div>
                
                <div className="bg-blue-100 border-2 border-black rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Image className="w-5 h-5 text-purple-600" />
                    <span className="font-bold text-black">Flux AI</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    State-of-the-art image generation with photorealistic quality
                  </p>
                  <Badge className="bg-purple-500 text-white">Premium</Badge>
                </div>
              </div>
            </div>

            {/* Bottom Right: Trending Tools */}
            <div className="cartoon-glass rounded-3xl border-2 border-black p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center cartoon-border">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-black">Trending Tools</h2>
                  <p className="text-gray-600 font-bold">What builders are using</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {tools.slice(0, 3).map((tool, index) => (
                  <div key={tool.id} className="bg-white border-2 border-black rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedTool(tool)}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {tool.logo_url ? (
                          <img src={tool.logo_url} alt={tool.name} className="w-8 h-8 rounded-lg" />
                        ) : (
                          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                            <Code className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <span className="font-bold text-black">{tool.name}</span>
                      </div>
                      <Badge className={`${
                        tool.pricing === 'free' ? 'bg-green-500' :
                        tool.pricing === 'freemium' ? 'bg-yellow-500' : 'bg-red-500'
                      } text-white`}>
                        {tool.pricing}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{tool.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tools Grid */}
      <section className="pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="cartoon-glass rounded-3xl border-2 border-black p-6 mb-8">
            {/* Filters */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cartoon-btn ${
                        selectedCategory === cat.id
                          ? "bg-red-500 text-white"
                          : "bg-white text-black hover:bg-yellow-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pricing Filter */}
            <div>
              <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Pricing
              </h3>
              <div className="flex flex-wrap gap-2">
                {pricingOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPricingFilter(opt.id)}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all cartoon-btn ${
                      pricingFilter === opt.id
                        ? "bg-green-500 text-white"
                        : "bg-white text-black hover:bg-green-200"
                    }`}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-black text-black mb-2">
              {selectedCategory === "all" ? "All Tools" : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-gray-600 font-bold">
              {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"} found
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
            </div>
          ) : filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool, index) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  index={index}
                  onSelect={() => setSelectedTool(tool)}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 cartoon-border">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-black mb-3">
                No Tools Found
              </h3>
              <p className="text-lg text-gray-600 max-w-md mx-auto mb-6">
                Try adjusting your filters or search terms
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setPricingFilter("all");
                }}
                className="cartoon-btn bg-red-500 hover:bg-red-600 text-white border-2 border-black"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedTool && (
        <ToolDetailModal
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}

      {/* Add custom styles for AI recommendations */}
      <style jsx>{`
        .ai-recommendations :global(a) {
          color: #2563eb;
          text-decoration: underline;
          font-weight: 500;
        }
        .ai-recommendations :global(a:hover) {
          color: #1e40af;
        }
        .ai-recommendations :global(.tool-link) {
          color: #dc2626;
          font-weight: 600;
        }
        .ai-recommendations :global(.tool-link:hover) {
          color: #b91c1c;
        }
      `}</style>
    </div>
  );
}

// ToolCard Component (keep the same as before)
function ToolCard({ tool, index, onSelect }) {
  const pricingColors = {
    free: "bg-green-500 text-white",
    freemium: "bg-yellow-500 text-black",
    paid: "bg-red-500 text-white",
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
    
    // Open in new tab
    window.open(linkToOpen, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onSelect}
      className="group glass rounded-3xl border-2 border-black p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 relative overflow-hidden cartoon-glass"
    >
      {/* Featured Badge */}
      {tool.is_featured && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-yellow-500 text-black border-2 border-black">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Featured
          </Badge>
        </div>
      )}

      {/* Verified Badge */}
      {tool.is_verified && (
        <div className="absolute top-4 left-4">
          <Shield className="w-5 h-5 text-blue-500" />
        </div>
      )}

      {/* Tool Logo/Icon */}
      <div className="flex items-center gap-4 mb-4">
        {tool.logo_url ? (
          <img 
            src={tool.logo_url} 
            alt={tool.name}
            className="w-12 h-12 rounded-xl border-2 border-black"
          />
        ) : (
          <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center border-2 border-black">
            <Code className="w-6 h-6 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-lg text-black truncate">{tool.name}</h3>
          <Badge className={`${pricingColors[tool.pricing] || 'bg-gray-500'} border-2 border-black text-xs`}>
            {tool.pricing}
          </Badge>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {tool.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {tool.tags?.slice(0, 3).map((tag, i) => (
          <span 
            key={i}
            className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-lg text-xs font-medium text-gray-700"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-bold text-black">
            {tool.rating || 0}
          </span>
        </div>
        <Button 
          onClick={handleVisitClick}
          size="sm" 
          className="cartoon-btn bg-red-500 hover:bg-red-600 text-white border-2 border-black"
        >
          Visit
        </Button>
      </div>
    </motion.div>
  );
}

// ToolDetailModal Component (keep the same as before)
function ToolDetailModal({ tool, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  const pricingColors = {
    free: "bg-green-500",
    freemium: "bg-blue-500",
    paid: "bg-orange-500",
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "features", label: "Features", icon: Zap },
    { id: "pricing", label: "Pricing", icon: DollarSign },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVisitClick = async () => {
    try {
      await base44.functions.invoke('trackToolClick', {
        tool_id: tool.id,
        tool_name: tool.name,
        click_type: 'modal_visit',
        referrer: window.location.pathname
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }

    let linkToOpen = tool.external_link;
    if (tool.custom_affiliate_link) {
      linkToOpen = tool.custom_affiliate_link;
    }
    
    window.open(linkToOpen, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="cartoon-glass rounded-3xl border-2 border-black p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {tool.logo_url ? (
              <img 
                src={tool.logo_url} 
                alt={tool.name}
                className="w-16 h-16 rounded-2xl border-2 border-black"
              />
            ) : (
              <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center border-2 border-black">
                <Code className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <h2 className="text-3xl font-black text-black">{tool.name}</h2>
              <p className="text-gray-600 font-bold">{tool.category}</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            className="cartoon-btn bg-gray-500 hover:bg-gray-600 text-white border-2 border-black"
            size="sm"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-black text-black mb-2">Description</h3>
            <p className="text-gray-700">{tool.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-100 border-2 border-black rounded-2xl p-4">
              <h4 className="font-bold text-black mb-1">Pricing</h4>
              <Badge className={`${pricingColors[tool.pricing]} text-white border-2 border-black`}>
                {tool.pricing}
              </Badge>
            </div>
            <div className="bg-green-100 border-2 border-black rounded-2xl p-4">
              <h4 className="font-bold text-black mb-1">Rating</h4>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-bold text-black">{tool.rating || 0}</span>
              </div>
            </div>
          </div>

          {/* Website Link */}
          <div className="bg-blue-100 border-2 border-black rounded-2xl p-4">
            <h4 className="font-bold text-black mb-2">Website</h4>
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-blue-600" />
              <a 
                href={tool.custom_affiliate_link || tool.external_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium break-all"
              >
                {tool.custom_affiliate_link || tool.external_link}
              </a>
              <Button
                onClick={() => copyToClipboard(tool.custom_affiliate_link || tool.external_link)}
                className="cartoon-btn bg-gray-500 hover:bg-gray-600 text-white border-2 border-black"
                size="sm"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Tags */}
          {tool.tags && tool.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-black text-black mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map((tag, i) => (
                  <Badge key={i} className="bg-white border-2 border-black text-black">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              onClick={handleVisitClick}
              className="flex-1 cartoon-btn bg-red-500 hover:bg-red-600 text-white border-2 border-black"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Website
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}