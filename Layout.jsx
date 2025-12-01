
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, Terminal, Sparkles, ChevronDown, Crown, MessageCircle, Settings, User, LogOut, TrendingUp, Archive, Home, Globe, Code, Image, Video, Coins, ShoppingCart, X, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageProvider, useLanguage } from "./components/LanguageContext";
import LanguageSwitcher from "./components/LanguageSwitcher";
import NotificationBell from "./components/NotificationBell";
import { UserProvider, useUser } from "./components/UserContext";
import { SheetTrigger } from "@/components/ui/sheet";

function LayoutContent({ children, currentPageName }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useUser();
  const location = useLocation();
  const { t } = useLanguage();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Force cartoon style always
  useEffect(() => {
    document.documentElement.classList.add("cartoon-theme");
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    base44.auth.logout();
  };

  const navLinks = [
    { name: t('nav_home'), url: createPageUrl("Home"), icon: Home },
    { name: "Tech Scoop", url: createPageUrl("Discover"), icon: TrendingUp },
    { name: "Tools Depot", url: createPageUrl("APIMarketplace"), icon: Sparkles },
    { name: "Community", url: createPageUrl("Community"), icon: MessageCircle },
    { name: "Contact", url: createPageUrl("Contact"), icon: MessageCircle },
  ];

  // 🔥 MOBILE LAYOUT
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Background Image - Same as desktop */}
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

        <style>{`
          :root {
            --primary: #FF6BFF;
            --primary-dark: #E500E5;
            --accent: #00E5FF;
            --orange: #FF6B00;
            --green: #00E500;
            --purple: #8B00FF;
            --yellow: #FFD700;
          }
          
          .cartoon-theme {
            background: white;
          }
          
          * {
            font-family: 'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          html {
            scroll-behavior: auto !important;
          }
          
          .cartoon-glass {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 3px solid #000;
            border-radius: 25px;
            box-shadow: 8px 8px 0px #000;
          }
          
          .cartoon-btn {
            border: 3px solid #000;
            border-radius: 20px;
            box-shadow: 4px 4px 0px #000;
            transition: all 0.2s ease;
            transform: translate(0, 0);
          }
          
          .cartoon-btn:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px #000;
          }
          
          .cartoon-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px #000;
          }
          
          .glow-orange {
            box-shadow: 0 0 20px rgba(255, 107, 0, 0.4), 0 0 40px rgba(255, 107, 0, 0.2);
          }

          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(40px, -60px) scale(1.15); }
            66% { transform: translate(-30px, 30px) scale(0.95); }
          }
          
          .animate-blob {
            animation: blob 8s infinite ease-in-out;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          .animate-bounce {
            animation: bounce 2s ease-in-out infinite;
          }

          @keyframes wiggle {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
          }

          .animate-wiggle {
            animation: wiggle 0.5s ease-in-out infinite;
          }

          /* Mobile specific styles */
          .mobile-app-container {
            min-height: 100vh;
            position: relative;
            z-index: 10;
          }
          
          .mobile-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            padding: 12px 16px;
          }
          
          .mobile-content {
            margin-top: 80px;
            padding: 16px;
            padding-bottom: 100px;
          }

          .mobile-menu-sheet {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border-left: 3px solid #000;
          }
          
          .profile-section {
            background: linear-gradient(135deg, #FF6B00, #00E500);
            padding: 20px;
            border-radius: 20px;
            border: 3px solid #000;
            margin-bottom: 20px;
            color: white;
          }

          /* Ripple effect for mobile */
          .ripple {
            position: relative;
            overflow: hidden;
          }
          
          .ripple:active:after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 5px;
            height: 5px;
            background: rgba(0, 0, 0, 0.3);
            opacity: 0;
            border-radius: 100%;
            transform: scale(1, 1) translate(-50%);
            transform-origin: 50% 50%;
            animation: ripple 1s ease-out;
          }
          
          @keyframes ripple {
            0% {
              transform: scale(0, 0);
              opacity: 0.5;
            }
            100% {
              transform: scale(20, 20);
              opacity: 0;
            }
          }
        `}</style>

        <div className="mobile-app-container">
          {/* Mobile Header */}
          <header className={`mobile-header transition-all duration-500 ${
            isScrolled 
              ? "cartoon-glass glow-orange py-2" 
              : "bg-transparent py-3"
          }`}>
            <div className="flex items-center justify-between">
              <Link
                to={createPageUrl("Home")}
                className="flex items-center gap-2 group"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity animate-bounce"></div>
                  <div className="relative w-10 h-10 bg-red-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl border-2 border-yellow-400 animate-wiggle">
                    <div className="relative">
                      <span className="text-2xl font-black text-white stroke-text">N</span>
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-bounce border border-black"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-bounce animation-delay-2000 border border-black"></div>
                    </div>
                  </div>
                </div>
                <span className="text-lg font-black text-black">NetNapz</span>
              </Link>

              <div className="flex items-center gap-2">
                {user && <NotificationBell user={user} />}
                
                {user ? (
                  <Link to={createPageUrl("Profile")} className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-green-400 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 border-black">
                      {user.profile_picture ? (
                        <img src={user.profile_picture} alt={user.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-sm">
                          {user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </Link>
                ) : (
                  <Link to={createPageUrl("Settings")}>
                    <Button
                      size="sm"
                      className="cartoon-btn bg-gradient-to-r from-orange-400 to-green-400 hover:from-orange-500 hover:to-green-500 text-white font-bold border-2 border-black px-3 h-9"
                    >
                      <User className="w-4 h-4 mr-1" />
                      Login
                    </Button>
                  </Link>
                )}
                
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="cartoon-btn bg-white rounded-xl border-2 border-black">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="mobile-menu-sheet w-80 overflow-y-auto">
                    <div className="flex flex-col gap-6 mt-12">
                      {user && (
                        <div className="profile-section">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-green-400 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 border-black">
                              {user.profile_picture ? (
                                <img src={user.profile_picture} alt={user.full_name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-white font-bold">
                                  {user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-white truncate">
                                {user.full_name || "User"}
                              </p>
                              <p className="text-xs text-white/80 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          {user.subscription_tier === "premium" && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border border-black">
                              <Crown className="w-3 h-3 text-yellow-400" />
                              <span className="text-xs font-bold text-white">Premium Member</span>
                            </div>
                          )}
                          {user.role === "admin" && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mt-2 border border-black">
                              <Crown className="w-3 h-3 text-white" />
                              <span className="text-xs font-bold text-white">👑 Admin - Unlimited</span>
                            </div>
                          )}
                        </div>
                      )}

                      {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.url;
                        return (
                          <Link
                            key={link.name}
                            to={link.url}
                            onClick={(e) => e.stopPropagation()}
                            className={`text-lg font-bold transition-colors flex items-center gap-2 p-3 rounded-xl cartoon-btn ${
                              isActive
                                ? "bg-green-400 text-white"
                                : "bg-white text-black hover:bg-yellow-200"
                            }`}
                          >
                            {Icon && <Icon className="w-5 h-5" />}
                            {link.name}
                          </Link>
                        );
                      })}
                      
                      <div className="border-t-2 border-black pt-6 mt-2">
                        <p className="text-xs font-bold text-black uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Sparkles className="w-3 h-3" />
                          CREATE
                        </p>
                        
                        <Link
                          to={createPageUrl("NapzTerminal")}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-3 p-4 rounded-xl cartoon-btn bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-black hover:from-purple-500 hover:to-pink-500 transition-colors"
                        >
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-black">
                            <Terminal className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-white text-base">
                              Create
                            </div>
                            <div className="text-xs text-white mt-1">Code • Images • Videos • Websites</div>
                          </div>
                        </Link>
                      </div>

                      {user ? (
                        <div className="border-t-2 border-black pt-6">
                          {user.role !== 'admin' && (
                            <Link
                              to={createPageUrl("Pricing")}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-3 p-3 rounded-xl cartoon-btn bg-white hover:bg-green-200 transition-colors mb-3 text-black"
                            >
                              <ShoppingCart className="w-5 h-5 mr-1 text-purple-600" />
                              <span className="font-bold">Buy Credits</span>
                            </Link>
                          )}
                          <Link
                            to={createPageUrl("MyCreations")}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-3 p-3 rounded-xl cartoon-btn bg-white hover:bg-purple-200 transition-colors mb-3 text-black"
                          >
                            <Archive className="w-5 h-5 text-purple-600" />
                            <span className="font-bold">My Creations</span>
                          </Link>
                          <Link
                            to={createPageUrl("Profile")}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-3 p-3 rounded-xl cartoon-btn bg-white hover:bg-orange-200 transition-colors mb-3 text-black"
                          >
                            <User className="w-5 h-5" />
                            <span className="font-bold">My Profile</span>
                          </Link>
                          <Link
                            to={createPageUrl("Settings")}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-3 p-3 rounded-xl cartoon-btn bg-white hover:bg-blue-200 transition-colors mb-3 text-black"
                          >
                            <Settings className="w-5 h-5" />
                            <span className="font-bold">Settings</span>
                          </Link>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLogout();
                            }}
                            className="w-full cartoon-btn bg-white border-2 border-red-500 text-red-600 hover:bg-red-200 font-bold"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </Button>
                        </div>
                      ) : (
                        <div className="border-t-2 border-black pt-6">
                          <Link to={createPageUrl("Settings")}>
                            <Button className="w-full cartoon-btn bg-gradient-to-r from-orange-400 to-green-400 hover:from-orange-500 hover:to-green-500 text-white font-bold h-12 border-2 border-black">
                              <User className="w-5 h-5 mr-2" />
                              Login / Sign Up
                            </Button>
                          </Link>
                          <p className="text-xs text-gray-600 mt-3 text-center font-bold">
                            Get unlimited AI tools! 🎨
                          </p>
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </header>

          {/* Mobile Content */}
          <main className="mobile-content relative z-10">
            <div className="grid grid-cols-1 gap-6">
              {children}
            </div>
          </main>

          {/* 📱 MOBILE BOTTOM NAVIGATION - PERFECTLY MATCHES DESKTOP */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 cartoon-glass border-t-2 border-black backdrop-blur-2xl">
            <div className="grid grid-cols-5 gap-1 px-1 py-2">
              {/* Home */}
              <Link
                to={createPageUrl("Home")}
                onClick={(e) => e.stopPropagation()}
                className={`flex flex-col items-center justify-center gap-0 py-2 rounded-xl transition-all cartoon-btn ${
                  location.pathname === createPageUrl("Home")
                    ? "bg-green-400 text-white border-2 border-black"
                    : "bg-white text-black border-2 border-black active:bg-yellow-200"
                }`}
              >
                <div className="relative">
                  <Home className="w-5 h-5" />
                  {location.pathname === createPageUrl("Home") && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full border border-black"></div>
                  )}
                </div>
                <span className="text-[10px] font-bold mt-0.5">Home</span>
              </Link>

              {/* Tech Scoop */}
              <Link
                to={createPageUrl("Discover")}
                onClick={(e) => e.stopPropagation()}
                className={`flex flex-col items-center justify-center gap-0 py-2 rounded-xl transition-all cartoon-btn ${
                  location.pathname === createPageUrl("Discover")
                    ? "bg-green-400 text-white border-2 border-black"
                    : "bg-white text-black border-2 border-black active:bg-yellow-200"
                }`}
              >
                <div className="relative">
                  <TrendingUp className="w-5 h-5" />
                  {location.pathname === createPageUrl("Discover") && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full border border-black"></div>
                  )}
                </div>
                <span className="text-[10px] font-bold mt-0.5">Tech</span>
              </Link>

              {/* 🔥 CENTER CREATE BUTTON - PROMINENT */}
              <Link
                to={createPageUrl("NapzTerminal")}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col items-center justify-center gap-0 py-2 rounded-xl transition-all cartoon-btn bg-gradient-to-r from-purple-400 to-pink-400 text-white border-2 border-black active:bg-purple-500 relative"
              >
                <div className="relative -mt-4 mb-1">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl border-2 border-black animate-bounce">
                    <Terminal className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <span className="text-[10px] font-bold -mt-3">Create</span>
              </Link>

              {/* Community */}
              <Link
                to={createPageUrl("Community")}
                onClick={(e) => e.stopPropagation()}
                className={`flex flex-col items-center justify-center gap-0 py-2 rounded-xl transition-all cartoon-btn ${
                  location.pathname === createPageUrl("Community")
                    ? "bg-green-400 text-white border-2 border-black"
                    : "bg-white text-black border-2 border-black active:bg-yellow-200"
                }`}
              >
                <div className="relative">
                  <MessageCircle className="w-5 h-5" />
                  {location.pathname === createPageUrl("Community") && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full border border-black"></div>
                  )}
                </div>
                <span className="text-[10px] font-bold mt-0.5">Chat</span>
              </Link>

              {/* Tools Depot */}
              <Link
                to={createPageUrl("APIMarketplace")}
                onClick={(e) => e.stopPropagation()}
                className={`flex flex-col items-center justify-center gap-0 py-2 rounded-xl transition-all cartoon-btn ${
                  location.pathname === createPageUrl("APIMarketplace")
                    ? "bg-green-400 text-white border-2 border-black"
                    : "bg-white text-black border-2 border-black active:bg-yellow-200"
                }`}
              >
                <div className="relative">
                  <Sparkles className="w-5 h-5" />
                  {location.pathname === createPageUrl("APIMarketplace") && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full border border-black"></div>
                  )}
                </div>
                <span className="text-[10px] font-bold mt-0.5">Tools</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    );
  }

  // 🔥 DESKTOP LAYOUT
  return (
    <div className="min-h-screen bg-white transition-colors duration-300 relative overflow-hidden">
      {/* Your image as full background for all pages */}
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

      <style>{`
        :root {
          --primary: #FF6BFF;
          --primary-dark: #E500E5;
          --accent: #00E5FF;
          --orange: #FF6B00;
          --green: #00E500;
          --purple: #8B00FF;
          --yellow: #FFD700;
        }
        
        .cartoon-theme {
          background: white;
        }
        
        * {
          font-family: 'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        html {
          scroll-behavior: auto !important;
        }
        
        .cartoon-glass {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 3px solid #000;
          border-radius: 25px;
          box-shadow: 8px 8px 0px #000;
        }
        
        .cartoon-btn {
          border: 3px solid #000;
          border-radius: 20px;
          box-shadow: 4px 4px 0px #000;
          transition: all 0.2s ease;
          transform: translate(0, 0);
        }
        
        .cartoon-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px #000;
        }
        
        .cartoon-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px #000;
        }
        
        .glow-orange {
          box-shadow: 0 0 20px rgba(255, 107, 0, 0.4), 0 0 40px rgba(255, 107, 0, 0.2);
        }

        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.15); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
        }
        
        .animate-blob {
          animation: blob 8s infinite ease-in-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }

        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out infinite;
        }
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "cartoon-glass glow-orange md:py-3 py-2" 
            : "bg-transparent md:py-5 py-3"
        }`}
      >
        <nav className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link
            to={createPageUrl("Home")}
            className="flex items-center gap-2 md:gap-3 group"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity animate-bounce"></div>
              <div className="relative w-12 h-12 md:w-14 md:h-14 bg-red-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl border-3 border-yellow-400 animate-wiggle">
                <div className="relative">
                  <span className="text-3xl md:text-4xl font-black text-white stroke-text">N</span>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-bounce border border-black"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-bounce animation-delay-2000 border border-black"></div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block">
              <span className="text-3xl font-black text-black tracking-tight">
                NetNapz
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.url;
              return (
                <Link
                  key={link.name}
                  to={link.url}
                  onClick={(e) => e.stopPropagation()}
                  className={`text-sm font-bold transition-all duration-300 px-4 py-2 rounded-xl cartoon-btn ${
                    isActive
                      ? "text-white bg-green-400 border-2 border-black"
                      : "text-black bg-white hover:bg-yellow-200"
                  } ${Icon ? "flex items-center gap-2" : ""}`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {link.name}
                </Link>
              );
            })}

            {/* 🔥 SINGLE CREATE LINK */}
            <Link to={createPageUrl("NapzTerminal")} onClick={(e) => e.stopPropagation()}>
              <Button
                className={`flex items-center gap-2 text-sm font-bold rounded-xl cartoon-btn border-2 border-black transition-all ${
                  location.pathname === createPageUrl("NapzTerminal")
                    ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white"
                    : "bg-gradient-to-r from-green-400 to-blue-400 text-white hover:from-green-500 hover:to-blue-500"
                }`}
              >
                <Terminal className="w-4 h-4" />
                Create
              </Button>
            </Link>

            {user && <NotificationBell user={user} />}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity cartoon-btn bg-white" onClick={(e) => e.stopPropagation()}>
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-green-400 rounded-full flex items-center justify-center shadow-lg glow-orange overflow-hidden border-2 border-black">
                      {user.profile_picture ? (
                        <img src={user.profile_picture} alt={user.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-sm">
                          {user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {user.role !== 'admin' && (
                      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-purple-400 border-2 border-black rounded-lg">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-bold text-white">{user.credits || 0}</span>
                      </div>
                    )}
                    <ChevronDown className="w-4 h-4 text-black" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-64 cartoon-glass border-2 border-black shadow-2xl rounded-2xl p-2"
                >
                  <div className="p-4 border-b-2 border-black">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-green-400 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 border-black">
                        {user.profile_picture ? (
                          <img src={user.profile_picture} alt={user.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-bold text-lg">
                            {user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-black truncate">
                          {user.full_name || "User"}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    
                    {user.role !== 'admin' && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-black rounded-xl mb-2">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <div className="flex-1">
                          <p className="text-xs text-white font-semibold">Credit Balance</p>
                          <p className="text-sm font-bold text-white">{user.credits || 0} Credits</p>
                        </div>
                      </div>
                    )}
                    
                    {user.subscription_tier === "premium" && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border border-black">
                        <Crown className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs font-bold text-white">Premium Member</span>
                      </div>
                    )}
                    {user.role === "admin" && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full border border-black">
                        <Crown className="w-3 h-3 text-white" />
                        <span className="text-xs font-bold text-white">👑 Admin - Unlimited</span>
                      </div>
                    )}
                  </div>

                  <DropdownMenuSeparator className="bg-black h-0.5" />

                  {user.role !== 'admin' && (
                    <Link to={createPageUrl("Pricing")} onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuItem className="cursor-pointer rounded-xl p-3 focus:bg-green-200 hover:bg-green-200 border border-transparent hover:border-black">
                        <ShoppingCart className="w-4 h-4 mr-3 text-purple-600" />
                        <span className="text-black font-bold">Buy Credits</span>
                      </DropdownMenuItem>
                    </Link>
                  )}

                  <Link to={createPageUrl("MyCreations")} onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem className="cursor-pointer rounded-xl p-3 focus:bg-purple-200 hover:bg-purple-200 border border-transparent hover:border-black">
                      <Archive className="w-4 h-4 mr-3 text-purple-600" />
                      <span className="text-black font-bold">My Creations</span>
                    </DropdownMenuItem>
                  </Link>

                  <Link to={createPageUrl("Profile")} onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem className="cursor-pointer rounded-xl p-3 focus:bg-orange-200 hover:bg-orange-200 border border-transparent hover:border-black">
                      <User className="w-4 h-4 mr-3 text-black" />
                      <span className="text-black font-bold">My Profile</span>
                    </DropdownMenuItem>
                  </Link>

                  <Link to={createPageUrl("Settings")} onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem className="cursor-pointer rounded-xl p-3 focus:bg-blue-200 hover:bg-blue-200 border border-transparent hover:border-black">
                      <Settings className="w-4 h-4 mr-3 text-black" />
                      <span className="text-black font-bold">Settings</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="bg-black h-0.5" />

                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }}
                    className="cursor-pointer rounded-xl p-3 focus:bg-red-200 hover:bg-red-200 border border-transparent hover:border-black text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    <span className="font-bold">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to={createPageUrl("Settings")}>
                <Button className="cartoon-btn bg-gradient-to-r from-orange-400 to-green-400 hover:from-orange-500 hover:to-green-500 text-white font-bold border-2 border-black">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}

            <LanguageSwitcher />
          </div>

          {/* 🔥 MOBILE HEADER */}
          <div className="flex md:hidden items-center gap-2">
            {user && <NotificationBell user={user} />}
            
            {user ? (
              <Link to={createPageUrl("Profile")} className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-green-400 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 border-black">
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt={user.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </Link>
            ) : (
              <Link to={createPageUrl("Settings")}>
                <Button
                  size="sm"
                  className="cartoon-btn bg-gradient-to-r from-orange-400 to-green-400 hover:from-orange-500 hover:to-green-500 text-white font-bold border-2 border-black px-3 h-9"
                >
                  <User className="w-4 h-4 mr-1" />
                  Login
                </Button>
              </Link>
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="cartoon-btn bg-white rounded-xl">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="cartoon-glass border-l-2 border-black w-80 overflow-y-auto">
                <div className="flex flex-col gap-6 mt-12">
                  {user && (
                    <div className="p-4 bg-yellow-100 rounded-2xl mb-4 border-2 border-black">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-green-400 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 border-black">
                          {user.profile_picture ? (
                            <img src={user.profile_picture} alt={user.full_name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white font-bold">
                              {user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-black truncate">
                            {user.full_name || "User"}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      {user.subscription_tier === "premium" && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border border-black">
                          <Crown className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs font-bold text-white">Premium Member</span>
                        </div>
                      )}
                      {user.role === "admin" && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mt-2 border border-black">
                          <Crown className="w-3 h-3 text-white" />
                          <span className="text-xs font-bold text-white">👑 Admin - Unlimited</span>
                        </div>
                      )}
                    </div>
                  )}

                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.url;
                    return (
                      <Link
                        key={link.name}
                        to={link.url}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-lg font-bold transition-colors flex items-center gap-2 p-3 rounded-xl cartoon-btn ${
                          isActive
                            ? "bg-green-400 text-white"
                            : "bg-white text-black hover:bg-yellow-200"
                        }`}
                      >
                        {Icon && <Icon className="w-5 h-5" />}
                        {link.name}
                      </Link>
                    );
                  })}
                  
                  <div className="border-t-2 border-black pt-6 mt-2">
                    <p className="text-xs font-bold text-black uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      CREATE
                    </p>
                    
                    <Link
                      to={createPageUrl("NapzTerminal")}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-3 p-4 rounded-xl cartoon-btn bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-black hover:from-purple-500 hover:to-pink-500 transition-colors"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-black">
                        <Terminal className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-white text-base">
                          Create
                        </div>
                        <div className="text-xs text-white mt-1">Code • Images • Videos • Websites</div>
                      </div>
                    </Link>
                  </div>

                  {user ? (
                    <div className="border-t-2 border-black pt-6">
                      {user.role !== 'admin' && (
                        <Link
                          to={createPageUrl("Pricing")}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-3 p-3 rounded-xl cartoon-btn bg-white hover:bg-green-200 transition-colors mb-3 text-black"
                        >
                          <ShoppingCart className="w-5 h-5 mr-1 text-purple-600" />
                          <span className="font-bold">Buy Credits</span>
                        </Link>
                      )}
                      <Link
                        to={createPageUrl("MyCreations")}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-3 p-3 rounded-xl cartoon-btn bg-white hover:bg-purple-200 transition-colors mb-3 text-black"
                        >
                        <Archive className="w-5 h-5 text-purple-600" />
                        <span className="font-bold">My Creations</span>
                      </Link>
                      <Link
                        to={createPageUrl("Profile")}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-3 p-3 rounded-xl cartoon-btn bg-white hover:bg-orange-200 transition-colors mb-3 text-black"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-bold">My Profile</span>
                      </Link>
                      <Link
                        to={createPageUrl("Settings")}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-3 p-3 rounded-xl cartoon-btn bg-white hover:bg-blue-200 transition-colors mb-3 text-black"
                      >
                        <Settings className="w-5 h-5" />
                        <span className="font-bold">Settings</span>
                      </Link>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLogout();
                        }}
                        className="w-full cartoon-btn bg-white border-2 border-red-500 text-red-600 hover:bg-red-200 font-bold"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="border-t-2 border-black pt-6">
                      <Link to={createPageUrl("Settings")}>
                        <Button className="w-full cartoon-btn bg-gradient-to-r from-orange-400 to-green-400 hover:from-orange-500 hover:to-green-500 text-white font-bold h-12 border-2 border-black">
                          <User className="w-5 h-5 mr-2" />
                          Login / Sign Up
                        </Button>
                      </Link>
                      <p className="text-xs text-gray-600 mt-3 text-center font-bold">
                        Get unlimited AI tools! 🎨
                      </p>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      <main className="pt-16 md:pt-24 pb-20 md:pb-0 relative z-10">
        <div className="grid grid-cols-1 gap-8 container mx-auto px-4">
          {children}
        </div>
      </main>

      {/* 📱 MOBILE BOTTOM NAVIGATION - PERFECTLY MATCHES DESKTOP */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 cartoon-glass border-t-2 border-black backdrop-blur-2xl">
        <div className="grid grid-cols-5 gap-1 px-1 py-2">
          {/* Home */}
          <Link
            to={createPageUrl("Home")}
            onClick={(e) => e.stopPropagation()}
            className={`flex flex-col items-center justify-center gap-0 py-2 rounded-xl transition-all cartoon-btn ${
              location.pathname === createPageUrl("Home")
                ? "bg-green-400 text-white border-2 border-black"
                : "bg-white text-black border-2 border-black active:bg-yellow-200"
            }`}
          >
            <div className="relative">
              <Home className="w-5 h-5" />
              {location.pathname === createPageUrl("Home") && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full border border-black"></div>
              )}
            </div>
            <span className="text-[10px] font-bold mt-0.5">Home</span>
          </Link>

          {/* Tech Scoop */}
          <Link
            to={createPageUrl("Discover")}
            onClick={(e) => e.stopPropagation()}
            className={`flex flex-col items-center justify-center gap-0 py-2 rounded-xl transition-all cartoon-btn ${
              location.pathname === createPageUrl("Discover")
                ? "bg-green-400 text-white border-2 border-black"
                : "bg-white text-black border-2 border-black active:bg-yellow-200"
            }`}
          >
            <div className="relative">
              <TrendingUp className="w-5 h-5" />
              {location.pathname === createPageUrl("Discover") && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full border border-black"></div>
              )}
            </div>
            <span className="text-[10px] font-bold mt-0.5">Tech</span>
          </Link>

          {/* 🔥 CENTER CREATE BUTTON - PROMINENT */}
          <Link
            to={createPageUrl("NapzTerminal")}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center justify-center gap-0 py-2 rounded-xl transition-all cartoon-btn bg-gradient-to-r from-purple-400 to-pink-400 text-white border-2 border-black active:bg-purple-500 relative"
          >
            <div className="relative -mt-4 mb-1">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl border-2 border-black animate-bounce">
                <Terminal className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <span className="text-[10px] font-bold -mt-3">Create</span>
          </Link>

          {/* Community */}
          <Link
            to={createPageUrl("Community")}
            onClick={(e) => e.stopPropagation()}
            className={`flex flex-col items-center justify-center gap-0 py-2 rounded-xl transition-all cartoon-btn ${
              location.pathname === createPageUrl("Community")
                ? "bg-green-400 text-white border-2 border-black"
                : "bg-white text-black border-2 border-black active:bg-yellow-200"
            }`}
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5" />
              {location.pathname === createPageUrl("Community") && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full border border-black"></div>
              )}
            </div>
            <span className="text-[10px] font-bold mt-0.5">Chat</span>
          </Link>

          {/* Tools Depot */}
          <Link
            to={createPageUrl("APIMarketplace")}
            onClick={(e) => e.stopPropagation()}
            className={`flex flex-col items-center justify-center gap-0 py-2 rounded-xl transition-all cartoon-btn ${
              location.pathname === createPageUrl("APIMarketplace")
                ? "bg-green-400 text-white border-2 border-black"
                : "bg-white text-black border-2 border-black active:bg-yellow-200"
            }`}
          >
            <div className="relative">
              <Sparkles className="w-5 h-5" />
              {location.pathname === createPageUrl("APIMarketplace") && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full border border-black"></div>
              )}
            </div>
            <span className="text-[10px] font-bold mt-0.5">Tools</span>
          </Link>
        </div>
      </nav>

      <footer className="hidden md:block relative bg-white/95 border-t-2 border-black py-16 mt-24 overflow-hidden z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-400/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-400/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative">
          {/* 🤖 NEW: Powered By Section */}
          <div className="mb-12 pb-12 border-b-2 border-black">
            <h3 className="text-center text-sm font-bold text-black uppercase tracking-wider mb-6">
              Powered By Super AI Friends!
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="cartoon-glass rounded-xl border-2 border-black p-4 text-center hover:border-orange-400 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-3 border-2 border-black">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-bold text-black mb-1">DeepSeek V3.1</p>
                <p className="text-xs text-gray-600">Code & Search</p>
              </div>
              
              <div className="cartoon-glass rounded-xl border-2 border-black p-4 text-center hover:border-purple-400 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mx-auto mb-3 border-2 border-black">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-bold text-black mb-1">Flux AI</p>
                <p className="text-xs text-gray-600">Images</p>
              </div>
              
              <div className="cartoon-glass rounded-xl border-2 border-black p-4 text-center hover:border-pink-400 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-400 rounded-lg flex items-center justify-center mx-auto mb-3 border-2 border-black">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-bold text-black mb-1">Google Veo 3.1</p>
                <p className="text-xs text-gray-600">Videos</p>
              </div>
              
              <div className="cartoon-glass rounded-xl border-2 border-black p-4 text-center hover:border-blue-400 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg flex items-center justify-center mx-auto mb-3 border-2 border-black">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-bold text-black mb-1">DeepSeek V3.1</p>
                <p className="text-xs text-gray-600">Websites</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg border-2 border-yellow-400 animate-wiggle">
                  <span className="text-2xl font-black text-white">N</span>
                </div>
                <div>
                  <span className="text-xl font-black text-black">
                    NetNapz
                  </span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4 font-bold">
                {t('footer_tagline')}
              </p>
              <div className="bg-yellow-100 border-2 border-black rounded-xl p-4">
                <p className="text-xs text-gray-700 leading-relaxed font-bold">
                  <span className="text-orange-400">© {new Date().getFullYear()} NetNapz.</span> All rights reserved.
                  <br />
                  Unauthorized use, reproduction, or distribution of this platform, its design, code, content, or branding is strictly prohibited and may result in legal action.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-black mb-6 text-lg border-b-2 border-black pb-2">
                {t('footer_quick_links')}
              </h3>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.url}
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-700 hover:text-orange-400 transition-colors font-bold hover:underline"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-black mb-6 text-lg border-b-2 border-black pb-2">
                {t('footer_legal')}
              </h3>
              <div className="flex flex-col gap-4">
                <a
                  href="#"
                  onClick={(e) => e.stopPropagation()}
                  className="text-gray-700 hover:text-orange-400 transition-colors font-bold hover:underline"
                >
                  {t('footer_privacy')}
                </a>
                <a
                  href="#"
                  onClick={(e) => e.stopPropagation()}
                  className="text-gray-700 hover:text-orange-400 transition-colors font-bold hover:underline"
                >
                  {t('footer_terms')}
                </a>
                <div className="mt-2 p-3 bg-red-200 border-2 border-red-500 rounded-lg">
                  <p className="text-xs text-red-600 font-bold">
                    ⚠️ PROTECTED INTELLECTUAL PROPERTY
                  </p>
                  <p className="text-xs text-gray-700 mt-1 font-bold">
                    This platform and all its assets are copyrighted. Copying, cloning, or stealing any part is illegal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-black pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-700 font-bold mb-1">
                  © {new Date().getFullYear()} NetNapz. All Rights Reserved.
                </p>
                <p className="text-xs text-gray-600 font-bold">
                  Protected by international copyright laws. NetNapz™ is a registered trademark.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce shadow-lg border border-black"></div>
                <span className="text-sm text-gray-700 font-bold">
                  {t('footer_updated')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <UserProvider>
      <LanguageProvider>
        <LayoutContent children={children} currentPageName={currentPageName} />
      </LanguageProvider>
    </UserProvider>
  );
} 
