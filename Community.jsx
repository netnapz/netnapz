import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, Terminal, Sparkles, ChevronDown, Crown, MessageCircle, Settings, User, LogOut, TrendingUp, Archive, Home, Globe, Code, Image, Video, Coins, ShoppingCart, Monitor, Keyboard, Power, Send, Heart, Users, Star, Trash2, Loader2, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
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
import { SheetTrigger } from "@/components/ui/sheet";

function LayoutContent({ children, currentPageName }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const queryClient = useQueryClient();

  // Community-specific state
  const [messageContent, setMessageContent] = useState("");
  const [ageVerified, setAgeVerified] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(true);
  
  // Legal compliance state
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Check mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Force cartoon theme always
  useEffect(() => {
    document.documentElement.classList.add("cartoon-theme");
  }, []);

  // Load user
  useEffect(() => {
    loadUser();
  }, []);

  // Check if user already verified this session
  useEffect(() => {
    const verified = sessionStorage.getItem('chat_18plus_verified');
    const legalAccepted = localStorage.getItem('legal_terms_accepted');
    if (verified === 'true') {
      setAgeVerified(true);
      setShowAgeGate(false);
    }
    if (legalAccepted === 'true') {
      setLegalAccepted(true);
    }
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

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

  // Legal Compliance Functions
  const LegalComplianceGate = () => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border-4 border-red-500">
        <div className="text-center mb-4">
          <Crown className="w-8 h-8 md:w-12 md:h-12 text-red-500 mx-auto mb-2" />
          <h2 className="text-xl md:text-2xl font-black text-gray-900">LEGAL REQUIREMENTS</h2>
          <p className="text-red-600 font-bold mt-2 text-sm md:text-base">UK Online Safety Act 2023 & GDPR Compliance</p>
        </div>

        <div className="space-y-3 md:space-y-4 text-xs md:text-sm mb-4 md:mb-6">
          <div className="bg-red-50 p-3 md:p-4 rounded-lg border-2 border-red-300">
            <h3 className="font-black text-red-800 mb-2 text-sm">⚠️ LEGAL OBLIGATIONS</h3>
            <ul className="list-disc list-inside space-y-1 text-red-700">
              <li>We remove illegal content when identified (Online Safety Act 2023)</li>
              <li>All chats are logged for safety and legal compliance</li>
              <li>We cooperate with law enforcement requests</li>
              <li>Users must report illegal content via reporting mechanisms</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-3 md:p-4 rounded-lg border-2 border-blue-300">
            <h3 className="font-black text-blue-800 mb-2 text-sm">🔐 DATA PROTECTION (UK GDPR)</h3>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>We collect: email, messages, IP addresses for service operation</li>
              <li>Data stored securely with encryption</li>
              <li>Right to access and delete your data</li>
              <li>Age verification implemented for 18+ communities</li>
            </ul>
          </div>

          <div className="bg-green-50 p-3 md:p-4 rounded-lg border-2 border-green-300">
            <h3 className="font-black text-green-800 mb-2 text-sm">📋 TERMS OF SERVICE</h3>
            <ul className="list-disc list-inside space-y-1 text-green-700">
              <li>Professional conduct standards required</li>
              <li>No illegal, defamatory, or harmful content (Defamation Act 2013)</li>
              <li>Respect intellectual property rights</li>
              <li>Content moderation and reporting procedures apply</li>
            </ul>
          </div>
        </div>

        <div className="space-y-2 md:space-y-3">
          <Button
            onClick={() => {
              setLegalAccepted(true);
              localStorage.setItem('legal_terms_accepted', 'true');
              console.log('Legal terms accepted by user:', user?.email || 'unknown');
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-3 text-sm md:text-lg rounded-xl border-4 border-white shadow-lg cartoon-btn"
          >
            ✅ I ACCEPT ALL LEGAL TERMS & CONDITIONS
          </Button>
          
          <Button
            onClick={() => window.location.href = createPageUrl("Home")}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl border-4 border-white shadow-lg cartoon-btn"
          >
            🚫 DECLINE & EXIT SERVICE
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Required by UK Online Safety Act 2023, GDPR, Defamation Act 2013<br />
          Contact: support@netnapz.com for data requests or legal inquiries
        </p>
      </div>
    </div>
  );

  // Age Verification Functions
  const verifyAge = () => {
    const birthYear = prompt(`🎯 PROFESSIONAL COMMUNITY ACCESS

NETNAPZ PROFESSIONAL CHAT ZONE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This community contains discussions about:
• Tech industry insights & trends
• Entertainment business strategies  
• Creator economy developments
• Professional networking
• Market analysis & predictions

⚠️  STRICT 18+ REQUIREMENT:
This community discusses mature business topics,
industry controversies, and professional content
that requires adult perspective and judgment.

By entering your birth year, you confirm:
✅ You are 18+ years old
✅ You understand this is a professional community
✅ You agree to professional conduct standards
✅ You accept our Legal Terms & Privacy Policy

ENTER YOUR BIRTH YEAR (YYYY):`);
    
    if (!birthYear) {
      alert("🔒 Age verification required to access professional community features.");
      return;
    }

    const age = new Date().getFullYear() - parseInt(birthYear);
    
    if (isNaN(age) || age < 18) {
      alert(`🎓 ACCESS RESTRICTED

This professional community is exclusively for 
adults 18 years and older.

You've been redirected to our general community 
features appropriate for all ages.

We welcome you to explore our other amazing 
NetNapz features! 🚀`);
      
      // Log the attempt for documentation
      console.log('Under-18 access attempt redirected to homepage');
      window.location.href = createPageUrl("Home");
      return;
    }

    // Additional verification for extreme ages
    if (age >= 100 || (age >= 18 && age <= 20)) {
      const verification = confirm(`🔍 ADDITIONAL VERIFICATION

You entered birth year: ${birthYear} (Age: ${age})

Please confirm this is accurate and you understand:
• This is a professional 18+ community
• Discussions may include mature business topics
• Professional conduct is required
• Legal terms and privacy policy apply

Confirm you meet the 18+ requirement?`);
      
      if (!verification) {
        window.location.href = createPageUrl("Home");
        return;
      }
    }

    // Age verified - log for documentation
    console.log(`Age verification passed: User ${user?.email || 'unknown'}, Age: ${age}`);
    setAgeVerified(true);
    setShowAgeGate(false);
    sessionStorage.setItem('chat_18plus_verified', 'true');
  };

  const declineAgeGate = () => {
    alert(`🌟 THANK YOU FOR YOUR HONESTY!

We appreciate you respecting our professional 
community guidelines.

Feel free to explore all the other amazing 
NetNapz features we offer for all ages! 🎨

Check out our:
• Entertainment News Hub
• Creator Tools Marketplace  
• Tech Innovation Updates
• And much more!`);
    window.location.href = createPageUrl("Home");
  };

  // Community Queries
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: () => base44.entities.Message.list("-created_date", isMobile ? 50 : 100),
    refetchInterval: 30000,
  });

  const { data: allReviews = [] } = useQuery({
    queryKey: ["allReviews"],
    queryFn: () => base44.entities.Review.list("-created_date", isMobile ? 100 : 200),
  });

  const { data: tools = [] } = useQuery({
    queryKey: ["toolsForCommunity"],
    queryFn: () => base44.entities.Tool.list(),
  });

  // Community Mutations
  const postMessageMutation = useMutation({
    mutationFn: (data) => base44.entities.Message.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      setMessageContent("");
      toast.success("Message posted!");
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: ({ messageId, liked_by }) =>
      base44.entities.Message.update(messageId, {
        liked_by,
        likes: liked_by.length
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (messageId) => base44.entities.Message.delete(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Message deleted");
    },
  });

  // Reporting Mutation
  const reportMessageMutation = useMutation({
    mutationFn: (reportData) => base44.entities.Report.create(reportData),
    onSuccess: () => {
      toast.success("Report submitted! We'll review within 24 hours as required by law.");
      setReportModalOpen(false);
    },
  });

  const handleLogout = () => {
    base44.auth.logout();
  };

  const handleLogin = () => {
    window.location.href = createPageUrl("Login") + "?next=" + encodeURIComponent(window.location.pathname);
  };

  // Community Functions
  const handlePostMessage = () => {
    if (!user) {
      toast.error("Please login to post messages");
      handleLogin();
      return;
    }

    if (!messageContent.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    postMessageMutation.mutate({
      content: messageContent,
      user_name: user.full_name || "Anonymous",
      user_email: user.email,
      liked_by: []
    });
  };

  const handleToggleLike = (message) => {
    if (!user) {
      toast.error("Please login to like messages");
      return;
    }

    const liked_by = message.liked_by || [];
    const hasLiked = liked_by.includes(user.email);

    const newLikedBy = hasLiked
      ? liked_by.filter(email => email !== user.email)
      : [...liked_by, user.email];

    toggleLikeMutation.mutate({
      messageId: message.id,
      liked_by: newLikedBy
    });
  };

  const handleDeleteMessage = (messageId) => {
    if (!user) return;
    
    if (confirm("Delete this message? This cannot be undone.")) {
      deleteMessageMutation.mutate(messageId);
    }
  };

  // Reporting Functions
  const handleReportMessage = (message) => {
    if (!user) {
      toast.error("Please login to report messages");
      handleLogin();
      return;
    }

    setSelectedMessage(message);
    setReportModalOpen(true);
  };

  const submitReport = (reason) => {
    reportMessageMutation.mutate({
      message_id: selectedMessage.id,
      reporter_email: user?.email,
      reason: reason,
      reported_content: selectedMessage.content,
      status: 'pending',
      created_date: new Date().toISOString()
    });
  };

  const ReportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-4 md:p-6 w-full max-w-md border-4 border-red-400 shadow-2xl">
        <h3 className="text-lg md:text-xl font-black text-red-600 mb-2">⚠️ REPORT CONTENT</h3>
        <p className="text-gray-700 mb-4 text-xs md:text-sm">Required by UK Online Safety Act 2023</p>
        
        <div className="space-y-2 mb-4">
          {[
            "Illegal content", 
            "Harassment or bullying", 
            "Hate speech", 
            "Spam", 
            "Personal information", 
            "Other"
          ].map(reason => (
            <Button
              key={reason}
              onClick={() => submitReport(reason)}
              className="w-full bg-red-100 hover:bg-red-200 text-red-700 border-2 border-red-300 text-xs md:text-sm font-bold cartoon-btn py-2"
            >
              {reason}
            </Button>
          ))}
        </div>
        
        <Button
          onClick={() => setReportModalOpen(false)}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold cartoon-btn py-2"
        >
          Cancel
        </Button>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          Reports are reviewed within 24 hours<br />
          Contact: support@netnapz.com
        </p>
      </div>
    </div>
  );

  const getToolRatings = () => {
    const toolRatings = {};

    allReviews.forEach(review => {
      if (!toolRatings[review.tool_id]) {
        toolRatings[review.tool_id] = {
          totalRating: 0,
          count: 0,
          tool_name: review.tool_name
        };
      }
      toolRatings[review.tool_id].totalRating += review.rating;
      toolRatings[review.tool_id].count += 1;
    });

    return Object.entries(toolRatings)
      .map(([tool_id, data]) => ({
        tool_id,
        tool_name: data.tool_name,
        avgRating: data.totalRating / data.count,
        reviewCount: data.count
      }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, isMobile ? 3 : 5);
  };

  const topRatedTools = getToolRatings();

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handlePostMessage();
    }
  };

  // Community Component to render when on Community page
  const CommunityContent = () => {
    // 🎯 PROFESSIONAL AGE GATE COMPONENT
    if (showAgeGate) {
      return (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4 overflow-auto">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md border-4 border-blue-400 shadow-2xl text-center mx-auto my-auto">
            {/* Professional Icon */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            
            <h1 className="text-xl md:text-3xl font-black text-gray-900 mb-4">
              Professional Community
            </h1>
            
            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <p className="text-gray-700 font-bold text-base md:text-lg">
                🎯 This community discusses <span className="text-blue-600 font-black">professional topics</span> for adults 18+
              </p>
              
              <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-3 md:p-4">
                <p className="text-xs md:text-sm text-blue-800 font-bold">
                  💼 Contains professional discussions about:
                </p>
                <div className="text-xs text-blue-700 mt-2 space-y-1">
                  <p>• Tech industry insights & analysis</p>
                  <p>• Entertainment business strategies</p>
                  <p>• Creator economy developments</p>
                  <p>• Professional networking topics</p>
                </div>
              </div>

              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-2 md:p-3">
                <p className="text-xs md:text-sm text-yellow-800 font-bold">
                  🔒 Strictly 18+ community for professional discussions requiring adult perspective
                </p>
              </div>

              <div className="bg-green-100 border-2 border-green-400 rounded-lg p-2 md:p-3">
                <p className="text-xs md:text-sm text-green-800 font-bold">
                  ⚖️ UK Legal Compliance: Online Safety Act 2023, GDPR, Defamation Act 2013
                </p>
              </div>
            </div>

            <div className="space-y-2 md:space-y-3">
              <Button
                onClick={verifyAge}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-3 text-sm md:text-lg rounded-xl border-4 border-white shadow-lg cartoon-btn"
              >
                ✅ I AM 18+ - ENTER PROFESSIONAL COMMUNITY
              </Button>
              
              <Button
                onClick={declineAgeGate}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-xl border-4 border-white shadow-lg cartoon-btn"
              >
                🎓 EXPLORE OTHER FEATURES
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-4 font-bold">
              Professional conduct required. All discussions are logged and moderated.<br />
              Legal contact: support@netnapz.com
            </p>
          </div>
        </div>
      );
    }

    // ORIGINAL CHAT CONTENT (only shown after age verification)
    return (
      <div className="h-full flex flex-col">
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-500 border-b-4 border-blue-400 p-3 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center border-4 border-blue-400 shadow-lg animate-bounce">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-1">
                  <h1 className="text-lg md:text-xl font-black text-white drop-shadow-md">
                    Professional Community
                  </h1>
                  <span className="bg-blue-500 text-white text-xs font-black px-1 md:px-2 py-1 rounded-full border-2 border-white">
                    18+ PROFESSIONAL
                  </span>
                  <span className="bg-green-500 text-white text-xs font-black px-1 md:px-2 py-1 rounded-full border-2 border-white">
                    UK LEGAL COMPLIANT
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  <span className="text-white text-xs font-bold">
                    {user ? `${user.full_name || 'User'} - ONLINE!` : 'Not signed in'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {user ? (
                <Button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs font-black px-3 py-1 rounded-lg border-2 border-white shadow-lg cartoon-btn"
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  Sign Out
                </Button>
              ) : (
                <Button
                  onClick={handleLogin}
                  className="bg-green-500 hover:bg-green-600 text-white text-xs font-black px-3 py-1 rounded-lg border-2 border-white shadow-lg cartoon-btn"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex">
          {/* Left Sidebar - Desktop Only */}
          {!isMobile && (
            <div className="w-1/4 bg-gradient-to-b from-blue-400 to-purple-500 border-r-4 border-green-400 p-3">
              <h3 className="text-white font-black text-sm mb-3">Community Stats</h3>
              <div className="space-y-3 mb-4">
                <div className="bg-white/20 rounded-lg p-2 border-2 border-blue-400">
                  <div className="text-white text-xs font-bold">Professional Members</div>
                  <div className="text-yellow-300 text-sm font-black">
                    {new Set(messages.map(m => m.user_email)).size}
                  </div>
                </div>
                <div className="bg-white/20 rounded-lg p-2 border-2 border-purple-400">
                  <div className="text-white text-xs font-bold">Industry Discussions</div>
                  <div className="text-yellow-300 text-sm font-black">{messages.length}</div>
                </div>
                <div className="bg-white/20 rounded-lg p-2 border-2 border-red-400">
                  <div className="text-white text-xs font-bold">Legal Compliance</div>
                  <div className="text-yellow-300 text-sm font-black">ACTIVE</div>
                </div>
              </div>

              <h3 className="text-white font-black text-sm mb-3">Top Tools 🎯</h3>
              <div className="space-y-2">
                {topRatedTools.slice(0, 3).map((tool, index) => (
                  <div key={tool.tool_id} className="bg-white/20 rounded-lg p-2 border-2 border-pink-400">
                    <div className="text-white text-xs font-black truncate">
                      {index + 1}. {tool.tool_name}
                    </div>
                    <div className="text-yellow-300 text-xs">
                      ⭐ {tool.avgRating.toFixed(1)} ({tool.reviewCount})
                    </div>
                  </div>
                ))}
              </div>

              {/* Legal Info Section */}
              <div className="mt-4 p-2 bg-white/10 rounded-lg border-2 border-yellow-400">
                <h3 className="text-white text-xs font-black mb-1">⚖️ LEGAL INFO</h3>
                <p className="text-white text-xs">
                  UK Online Safety Act 2023 Compliant<br />
                  Report inappropriate content<br />
                  Contact: support@netnapz.com
                </p>
              </div>
            </div>
          )}

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-2 bg-gradient-to-b from-blue-50 to-purple-50">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-blue-600 text-sm font-bold">Loading professional discussions...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Users className="w-8 h-8 md:w-12 md:h-12 text-blue-300 mb-2" />
                  <h3 className="text-base md:text-lg font-black text-gray-700 mb-1">
                    No discussions yet!
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm font-bold">
                    Start the first professional conversation! 🚀
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`bg-white rounded-xl p-3 border-4 ${
                      msg.user_email === user?.email 
                        ? 'border-green-500 bg-gradient-to-r from-green-100 to-blue-100' 
                        : 'border-blue-400 bg-gradient-to-r from-blue-100 to-purple-100'
                    } shadow-lg hover:shadow-xl transition-all`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-xs font-black border-2 border-white ${
                        msg.user_email === user?.email 
                          ? 'bg-gradient-to-br from-green-500 to-blue-500' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-500'
                      }`}>
                        {msg.user_name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-1">
                          <span className="font-black text-blue-700 text-sm">
                            {msg.user_name}
                          </span>
                          <span className="text-xs text-gray-600">
                            {formatDistanceToNow(new Date(msg.created_date), { addSuffix: true })}
                          </span>
                          {msg.user_email === user?.email && (
                            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-bold border border-white">
                              YOU!
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-800 text-sm whitespace-pre-wrap break-words mb-1 font-medium">
                          {msg.content}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-1 md:gap-2">
                          <button
                            onClick={() => handleToggleLike(msg)}
                            className={`flex items-center space-x-1 px-2 md:px-3 py-1 rounded-full text-xs font-black transition-all cartoon-btn ${
                              msg.liked_by?.includes(user?.email)
                                ? 'bg-blue-500 text-white border-2 border-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-blue-100 border-2 border-gray-300'
                            }`}
                          >
                            <Heart
                              className={`w-3 h-3 ${
                                msg.liked_by?.includes(user?.email) ? 'fill-current' : ''
                              }`}
                            />
                            <span>{msg.likes || 0}</span>
                          </button>

                          {/* Report Button - Available to all users */}
                          <button
                            onClick={() => handleReportMessage(msg)}
                            className="flex items-center space-x-1 px-2 md:px-3 py-1 rounded-full text-xs bg-yellow-200 text-yellow-700 hover:bg-yellow-300 border-2 border-yellow-400 cartoon-btn"
                            title="Report content - Required by Online Safety Act 2023"
                          >
                            <Flag className="w-3 h-3" />
                            Report
                          </button>

                          {user && msg.user_email === user.email && (
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="flex items-center space-x-1 px-2 md:px-3 py-1 rounded-full text-xs bg-gray-200 text-gray-700 hover:bg-red-200 hover:text-red-700 transition-all cartoon-btn border-2 border-gray-300"
                              title="Delete message"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Message Input Area */}
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-2 md:p-3 border-t-4 border-green-400">
              {user ? (
                <div className="space-y-2">
                  <Textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Share your professional insights... (Ctrl+Enter to send) 💼"
                    className="min-h-[60px] rounded-xl border-4 border-blue-400 focus:border-purple-500 resize-none bg-white text-gray-800 text-sm font-medium shadow-lg"
                  />
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <span className="text-xs text-gray-600 font-bold">
                      {messageContent.length} characters • UK Legal Compliant
                    </span>
                    <Button
                      onClick={handlePostMessage}
                      disabled={!messageContent.trim() || postMessageMutation.isPending}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs font-black px-4 py-2 rounded-lg border-2 border-white shadow-lg cartoon-btn w-full md:w-auto"
                    >
                      {postMessageMutation.isPending ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3 mr-1" />
                          Share Insight 🚀
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2 md:py-4">
                  <Button
                    onClick={handleLogin}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-black px-4 md:px-6 py-2 md:py-3 rounded-lg border-2 border-white shadow-lg cartoon-btn w-full md:w-auto"
                  >
                    Sign In to Join Discussion! 💼
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Report Modal */}
        {reportModalOpen && <ReportModal />}
      </div>
    );
  };

  // Legal Links for Footer
  const legalLinks = [
    { name: 'Privacy Policy', url: createPageUrl("PrivacyPolicy") },
    { name: 'Terms of Service', url: createPageUrl("TermsOfService") },
    { name: 'Community Guidelines', url: createPageUrl("CommunityGuidelines") },
  ];

  return (
    <div className="min-h-screen bg-white transition-colors duration-300 relative overflow-hidden">
      <style>{`
        .cartoon-theme {
          background: white;
        }
        
        * {
          font-family: 'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif;
        }
        
        .cartoon-glass {
          background: rgba(255, 255, 255, 0.9);
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

        .computer-frame {
          background: linear-gradient(145deg, #d1d5db, #9ca3af, #6b7280);
          border: 4px solid #000;
          border-radius: 15px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        }

        @media (min-width: 768px) {
          .computer-frame {
            border: 8px solid #000;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          }
        }

        .computer-screen {
          background: linear-gradient(135deg, #FFE4B5, #FFFACD);
          border: 3px solid #d1d5db;
          border-radius: 10px;
          position: relative;
          overflow: hidden;
          height: 500px;
        }

        @media (min-width: 768px) {
          .computer-screen {
            border: 6px solid #d1d5db;
            border-radius: 15px;
            height: 600px;
          }
        }

        .keyboard-key {
          background: linear-gradient(145deg, #d1d5db, #9ca3af);
          border: 2px solid #000;
          border-radius: 6px;
          color: #000;
          font-family: 'Comic Sans MS', sans-serif;
          font-weight: bold;
          transition: all 0.2s ease;
          font-size: 0.75rem;
        }

        @media (min-width: 768px) {
          .keyboard-key {
            border: 3px solid #000;
            border-radius: 8px;
            font-size: 1rem;
          }
        }

        .keyboard-key:hover {
          background: linear-gradient(145deg, #e5e7eb, #d1d5db);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(156, 163, 175, 0.4);
        }

        .keyboard-key:active {
          transform: translateY(2px);
          box-shadow: 0 2px 4px rgba(156, 163, 175, 0.3);
        }

        /* Mobile optimizations */
        @media (max-width: 767px) {
          .keyboard-grid {
            gap: 2px;
          }
          
          .keyboard-row {
            gap: 2px;
          }
        }
      `}</style>

      {/* Legal Compliance Gate */}
      {!legalAccepted && location.pathname === createPageUrl("Community") && <LegalComplianceGate />}

      {/* Computer Monitor Frame */}
      <div className="relative z-10 max-w-7xl mx-auto p-3 md:p-6">
        <div className="computer-frame p-3 md:p-6 mb-4 md:mb-8">
          <div className="computer-screen overflow-auto">
            {/* Show Community content when on Community page, otherwise normal header */}
            {location.pathname === createPageUrl("Community") ? (
              <CommunityContent />
            ) : (
              <>
                {/* Main Content Area */}
                <main className="h-full pt-2 md:pt-4 pb-4 md:pb-8 relative z-10 overflow-auto">
                  {children}
                </main>
              </>
            )}
          </div>
        </div>

        {/* Monitor Stand */}
        <div className="flex justify-center mb-4 md:mb-8">
          <div className="w-32 md:w-48 h-4 md:h-6 bg-gradient-to-b from-gray-500 to-gray-700 rounded-t-none rounded-b-lg border-2 border-black"></div>
        </div>

        {/* Simplified Keyboard for Mobile, Full for Desktop */}
        {!isMobile ? (
          /* Desktop Keyboard */
          <div className="bg-gray-500 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-2xl border-4 border-black">
            <div className="bg-gray-400 rounded-lg md:rounded-xl p-3 md:p-6 border-4 border-black">
              {/* Function Keys Row */}
              <div className="flex justify-between mb-3 md:mb-4 px-2 md:px-4">
                {['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].map((key) => (
                  <div key={key} className="keyboard-key w-8 h-6 md:w-10 md:h-8 flex items-center justify-center text-xs font-black cursor-pointer">
                    {key}
                  </div>
                ))}
              </div>

              {/* Main Keyboard Area */}
              <div className="space-y-1 md:space-y-2">
                {/* Number Row */}
                <div className="flex justify-center space-x-1">
                  {'`1234567890-='.split('').map((key) => (
                    <div key={key} className="keyboard-key w-8 h-8 md:w-12 md:h-12 flex items-center justify-center text-sm md:text-lg font-black cursor-pointer">
                      {key}
                    </div>
                  ))}
                  <div className="keyboard-key w-16 md:w-24 h-8 md:h-12 flex items-center justify-center text-xs md:text-sm font-black cursor-pointer">
                    Backspace
                  </div>
                </div>

                {/* QWERTY Row */}
                <div className="flex justify-center space-x-1">
                  <div className="keyboard-key w-12 md:w-16 h-8 md:h-12 flex items-center justify-center text-xs md:text-sm font-black cursor-pointer">
                    Tab
                  </div>
                  {'QWERTYUIOP[]\\'.split('').map((key) => (
                    <div key={key} className="keyboard-key w-8 h-8 md:w-12 md:h-12 flex items-center justify-center text-sm md:text-lg font-black cursor-pointer">
                      {key}
                    </div>
                  ))}
                </div>

                {/* ASDF Row */}
                <div className="flex justify-center space-x-1">
                  <div className="keyboard-key w-14 md:w-20 h-8 md:h-12 flex items-center justify-center text-xs md:text-sm font-black cursor-pointer">
                    Caps
                  </div>
                  {'ASDFGHJKL;\''.split('').map((key) => (
                    <div key={key} className="keyboard-key w-8 h-8 md:w-12 md:h-12 flex items-center justify-center text-sm md:text-lg font-black cursor-pointer">
                      {key}
                    </div>
                  ))}
                  <div className="keyboard-key w-14 md:w-20 h-8 md:h-12 flex items-center justify-center text-xs md:text-sm font-black cursor-pointer">
                    Enter
                  </div>
                </div>

                {/* ZXCV Row */}
                <div className="flex justify-center space-x-1">
                  <div className="keyboard-key w-16 md:w-24 h-8 md:h-12 flex items-center justify-center text-xs md:text-sm font-black cursor-pointer">
                    Shift
                  </div>
                  {'ZXCVBNM,./'.split('').map((key) => (
                    <div key={key} className="keyboard-key w-8 h-8 md:w-12 md:h-12 flex items-center justify-center text-sm md:text-lg font-black cursor-pointer">
                      {key}
                    </div>
                  ))}
                  <div className="keyboard-key w-20 md:w-28 h-8 md:h-12 flex items-center justify-center text-xs md:text-sm font-black cursor-pointer">
                    Shift
                  </div>
                </div>

                {/* Space Bar Row */}
                <div className="flex justify-center space-x-1">
                  <div className="keyboard-key w-12 md:w-16 h-8 md:h-12 flex items-center justify-center text-xs md:text-sm font-black cursor-pointer">
                    Ctrl
                  </div>
                  <div className="keyboard-key w-12 md:w-16 h-8 md:h-12 flex items-center justify-center text-xs md:text-sm font-black cursor-pointer">
                    Win
                  </div>
                  <div className="keyboard-key w-12 md:w-16 h-8 md:h-12 flex items-center justify-center text-xs md:text-sm font-black cursor-pointer">
                    Alt
                  </div>
                  <div className="keyboard-key w-48 md:w-96 h-8 md:h-12 flex items-center justify-center text-xs md:text-sm font-black cursor-pointer bg-green-500 border-4 border-black">
                    SPACE BAR
                  </div>
                  <div className="keyboard-key w-12 md:w-16 h-8 md:h-12 flex items-center justify-center text-xs md:text-sm font-black cursor-pointer">
                    Alt
                  </div>
                  <div className="keyboard-key w-12 md:w-16 h-8 md:h-12 flex items-center justify-center text-xs md:text-sm font-black cursor-pointer">
                    Win
                  </div>
                  <div className="keyboard-key w-12 md:w-16 h-8 md:h-12 flex items-center justify-center text-xs md:text-sm font-black cursor-pointer">
                    Menu
                  </div>
                  <div className="keyboard-key w-12 md:w-16 h-8 md:h-12 flex items-center justify-center text-xs md:text-sm font-black cursor-pointer">
                    Ctrl
                  </div>
                </div>
              </div>

              {/* Keyboard Branding */}
              <div className="text-center mt-4 md:mt-6">
                <div className="text-gray-600 text-lg md:text-xl font-black tracking-wider">NETNAPZ AI TERMINAL</div>
                <div className="text-gray-500 text-xs md:text-sm mt-1">UK Legal Compliant • support@netnapz.com</div>
              </div>
            </div>
          </div>
        ) : (
          /* Mobile Keyboard - Simplified */
          <div className="bg-gray-500 rounded-xl p-3 shadow-2xl border-4 border-black">
            <div className="bg-gray-400 rounded-lg p-3 border-4 border-black">
              <div className="space-y-1">
                {/* Number Row */}
                <div className="flex justify-center space-x-1">
                  {'1234567890'.split('').map((key) => (
                    <div key={key} className="keyboard-key w-6 h-8 flex items-center justify-center text-sm font-black cursor-pointer">
                      {key}
                    </div>
                  ))}
                </div>

                {/* QWERTY Row */}
                <div className="flex justify-center space-x-1">
                  {'QWERTYUIOP'.split('').map((key) => (
                    <div key={key} className="keyboard-key w-6 h-8 flex items-center justify-center text-sm font-black cursor-pointer">
                      {key}
                    </div>
                  ))}
                </div>

                {/* ASDF Row */}
                <div className="flex justify-center space-x-1">
                  {'ASDFGHJKL'.split('').map((key) => (
                    <div key={key} className="keyboard-key w-6 h-8 flex items-center justify-center text-sm font-black cursor-pointer">
                      {key}
                    </div>
                  ))}
                </div>

                {/* ZXCV Row */}
                <div className="flex justify-center space-x-1">
                  {'ZXCVBNM'.split('').map((key) => (
                    <div key={key} className="keyboard-key w-6 h-8 flex items-center justify-center text-sm font-black cursor-pointer">
                      {key}
                    </div>
                  ))}
                </div>

                {/* Space Bar Row */}
                <div className="flex justify-center">
                  <div className="keyboard-key w-48 h-8 flex items-center justify-center text-sm font-black cursor-pointer bg-green-500 border-4 border-black">
                    SPACE
                  </div>
                </div>
              </div>

              {/* Mobile Branding */}
              <div className="text-center mt-3">
                <div className="text-gray-600 text-base font-black">NETNAPZ MOBILE</div>
                <div className="text-gray-500 text-xs mt-1">UK Legal Compliant</div>
              </div>
            </div>
          </div>
        )}

        {/* Power Button */}
        <div className="flex justify-center mt-4 md:mt-6">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center cursor-pointer hover:from-red-600 hover:to-red-800 transition-all shadow-2xl border-4 border-black cartoon-btn">
            <Power className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
        </div>

        {/* Legal Footer */}
        <div className="text-center mt-6 md:mt-8 flex flex-wrap justify-center gap-3 md:gap-6">
          {legalLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.url}
              className="text-blue-600 hover:text-blue-800 text-xs md:text-sm font-bold underline"
            >
              {link.name}
            </Link>
          ))}
          <a 
            href="mailto:support@netnapz.com" 
            className="text-green-600 hover:text-green-800 text-xs md:text-sm font-bold underline"
          >
            Contact Support
          </a>
        </div>
        <div className="text-center mt-2">
          <p className="text-gray-600 text-xs font-bold">
            © 2024 NetNapz • UK Online Safety Act 2023 Compliant • GDPR Compliant
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <LayoutContent children={children} currentPageName={currentPageName} />
  );
}