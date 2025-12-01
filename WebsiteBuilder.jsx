import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wand2, 
  Download, 
  Eye, 
  Code, 
  Loader2, 
  Sparkles,
  Monitor,
  Smartphone,
  Edit3,
  Check,
  X,
  Globe,
  Palette,
  Layout,
  Zap,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Settings,
  ChevronDown,
  ChevronUp,
  Rocket,
  FileText,
  Archive,
  ExternalLink,
  BookOpen,
  Clock,
  FileCode,
  Award,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import UsageBanner from "../components/UsageBanner";
import DeploymentGuideModal from "../components/DeploymentGuideModal";
import { Progress } from "@/components/ui/progress";
import { useUser } from "../components/UserContext";

export default function WebsiteBuilder() {
  const [description, setDescription] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("modern");
  const [selectedTemplate, setSelectedTemplate] = useState("landing");
  const [customColors, setCustomColors] = useState({
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    accent: "#EC4899",
    background: "#FFFFFF",
    text: "#1F2937"
  });
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [generationStage, setGenerationStage] = useState("");
  const [viewMode, setViewMode] = useState("desktop");
  const [isEditing, setIsEditing] = useState(false);
  const [usageStatus, setUsageStatus] = useState(null);
  const { user } = useUser();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showDeployMenu, setShowDeployMenu] = useState(false);
  const [showDeployGuide, setShowDeployGuide] = useState(false);
  const iframeRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    checkForImportedCode();
  }, []);

  useEffect(() => {
    // Cleanup progress interval on unmount
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // 🆕 Check for imported code from Terminal
  const checkForImportedCode = () => {
    try {
      const importedCode = localStorage.getItem('napz_import_code');
      const importTimestamp = localStorage.getItem('napz_import_timestamp');
      
      // Only import if it's recent (within last 5 minutes)
      if (importedCode && importTimestamp) {
        const timeDiff = Date.now() - parseInt(importTimestamp);
        if (timeDiff < 5 * 60 * 1000) { // 5 minutes
          setGeneratedHTML(importedCode);
          setViewMode("desktop");
          toast.success("✅ Code imported from Terminal!");
          
          // Clear localStorage after importing
          localStorage.removeItem('napz_import_code');
          localStorage.removeItem('napz_import_timestamp');
        }
      }
    } catch (error) {
      console.error("Import error:", error);
    }
  };

  const styles = [
    { id: "modern", name: "Modern", icon: Sparkles, color: "from-blue-500 to-cyan-500" },
    { id: "minimal", name: "Minimal", icon: Layout, color: "from-gray-500 to-gray-700" },
    { id: "colorful", name: "Colorful", icon: Palette, color: "from-pink-500 to-orange-500" },
    { id: "dark", name: "Dark", icon: Monitor, color: "from-gray-800 to-black" },
    { id: "professional", name: "Professional", icon: Globe, color: "from-blue-700 to-indigo-900" },
    { id: "gradient", name: "Gradient", icon: Palette, color: "from-cyan-500 via-blue-500 to-indigo-500" },
    { id: "neon", name: "Neon", icon: Zap, color: "from-cyan-500 to-blue-500" },
    { id: "elegant", name: "Elegant", icon: Sparkles, color: "from-gray-700 to-blue-700" }
  ];

  const templates = [
    { id: "landing", name: "Landing Page", desc: "Single page with hero, features, CTA", icon: "🚀" },
    { id: "portfolio", name: "Portfolio", desc: "Showcase work and projects", icon: "🎨" },
    { id: "business", name: "Business", desc: "Professional company website", icon: "💼" },
    { id: "saas", name: "SaaS", desc: "Product landing with pricing", icon: "⚡" },
    { id: "blog", name: "Blog", desc: "Content-focused website", icon: "📝" },
    { id: "ecommerce", name: "E-Commerce", desc: "Online store with products", icon: "🛒" },
    { id: "restaurant", name: "Restaurant", desc: "Menu, reservations, gallery", icon: "🍽️" },
    { id: "agency", name: "Creative Agency", desc: "Services, team, case studies", icon: "🎯" },
    { id: "fitness", name: "Fitness/Gym", desc: "Classes, trainers, memberships", icon: "💪" },
    { id: "education", name: "Education", desc: "Courses, instructors, enrollment", icon: "📚" },
    { id: "medical", name: "Medical/Healthcare", desc: "Services, doctors, appointments", icon: "⚕️" },
    { id: "realestate", name: "Real Estate", desc: "Property listings, agents", icon: "🏠" }
  ];

  const sections = [
    { id: "hero", name: "Hero Section", desc: "Main banner with headline & CTA" },
    { id: "features", name: "Features", desc: "Key features or services grid" },
    { id: "about", name: "About", desc: "Company or personal story" },
    { id: "testimonials", name: "Testimonials", desc: "Customer reviews & ratings" },
    { id: "pricing", name: "Pricing", desc: "Pricing tables or plans" },
    { id: "gallery", name: "Gallery", desc: "Photo/project showcase" },
    { id: "team", name: "Team", desc: "Team member profiles" },
    { id: "contact", name: "Contact", desc: "Contact form & info" },
    { id: "faq", name: "FAQ", desc: "Frequently asked questions" },
    { id: "cta", name: "Call-to-Action", desc: "Final conversion push" }
  ];

  const [selectedSections, setSelectedSections] = useState(["hero", "features", "testimonials", "contact"]);

  const examplePrompts = [
    "A modern fitness gym website with class schedules, trainer profiles, and membership pricing",
    "An elegant restaurant website with menu, reservations, and photo gallery",
    "A tech startup SaaS landing page with product features, pricing plans, and testimonials",
    "A creative portfolio website for a photographer with gallery and contact form",
    "A professional law firm website with practice areas, attorney bios, and consultation booking",
    "An e-commerce store for handmade jewelry with product catalog and shopping cart",
    "A real estate agency website with property listings, agent profiles, and search filters",
    "A medical clinic website with services, doctor bios, and appointment booking"
  ];

  // Simulate realistic progress during generation
  const startProgressSimulation = () => {
    setGenerationProgress(0);
    setEstimatedTime(25); // Estimated 25 seconds
    
    const stages = [
      { progress: 15, stage: "🤖 Analyzing your requirements...", time: 3 },
      { progress: 30, stage: "🎨 Designing layout & structure...", time: 5 },
      { progress: 50, stage: "⚡ Generating HTML & CSS...", time: 8 },
      { progress: 70, stage: "✨ Adding interactivity & animations...", time: 6 },
      { progress: 85, stage: "🖼️ Optimizing images & assets...", time: 2 },
      { progress: 95, stage: "✅ Finalizing your website...", time: 1 }
    ];
    
    let currentStageIndex = 0;
    let progressValue = 0;
    
    progressIntervalRef.current = setInterval(() => {
      if (currentStageIndex < stages.length) {
        const currentStage = stages[currentStageIndex];
        const targetProgress = currentStage.progress;
        
        // Increment progress smoothly
        if (progressValue < targetProgress) {
          progressValue += 1;
          setGenerationProgress(progressValue);
          setEstimatedTime(Math.max(0, 25 - Math.floor(progressValue / 4)));
        } else {
          // Move to next stage
          setGenerationStage(currentStage.stage);
          currentStageIndex++;
        }
      } else if (progressValue < 100) {
        // Fill to 100% when done
        progressValue += 2;
        setGenerationProgress(Math.min(progressValue, 100));
        setEstimatedTime(0);
      }
    }, 300);
  };

  const stopProgressSimulation = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setGenerationProgress(100);
    setEstimatedTime(0);
    setGenerationStage("✅ Complete!");
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please describe your website");
      return;
    }

    try {
      const { data: usage } = await base44.functions.invoke('checkUsageLimit', {
        feature: 'websites_generated'
      });

      setUsageStatus(usage);

      if (!usage.allowed) {
        if (usage.needsAuth) {
          toast.error("Please login to build websites - Get 2 free websites per day!");
          return;
        }
        toast.error(usage.error);
        return;
      }

      setIsGenerating(true);
      setGeneratedHTML("");
      startProgressSimulation();

      console.log('🚀 Starting website generation...');

      const response = await base44.functions.invoke('aiWebsiteBuilder', {
        description,
        style: selectedStyle,
        template: selectedTemplate,
        customColors: customColors,
        sections: selectedSections
      });

      console.log('✅ Generation complete!');

      if (response.data?.error) {
        console.error('❌ Error from backend:', response.data);
        stopProgressSimulation();
        toast.error(response.data.error + (response.data.details ? '\n' + response.data.details : ''));
        return;
      }

      if (!response.data?.html) {
        console.error('❌ No HTML in response:', response.data);
        stopProgressSimulation();
        toast.error('No website generated. Please try again.');
        return;
      }

      stopProgressSimulation();
      const htmlCode = response.data.html;
      setGeneratedHTML(htmlCode);
      
      // 💾 AUTO-SAVE to UserContent
      if (user) {
        try {
          await base44.entities.UserContent.create({
            user_email: user.email,
            content_type: "website",
            title: description.substring(0, 100) || "Untitled Website",
            description: description,
            content_data: {
              html: htmlCode
            },
            metadata: {
              style: selectedStyle,
              template: selectedTemplate,
              colors: customColors,
              sections: selectedSections,
              model_used: "deepseek-chat"
            },
            file_size: new Blob([htmlCode]).size,
            tags: [selectedStyle, selectedTemplate]
          });
          console.log('✅ Website saved to profile');
        } catch (saveError) {
          console.error('Failed to save website:', saveError);
          // Don't show error to user - generation succeeded
        }
      }
      
      toast.success(`🎉 Website generated & saved! (${usage.currentUsage}/${usage.limit} used today)`);
      
    } catch (error) {
      console.error("💥 Generation error:", error);
      stopProgressSimulation();
      toast.error("Failed to generate website: " + (error.message || "Unknown error"));
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setGenerationProgress(0);
        setGenerationStage("");
      }, 2000);
    }
  };

  const handleDownload = (format = "html") => {
    if (!generatedHTML) return;

    if (format === "html") {
      const blob = new Blob([generatedHTML], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `netnapz-website-${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Website downloaded as HTML!");
    } else if (format === "split") {
      handleSplitDownload();
    } else if (format === "zip") {
      handleZipDownload();
    }
    
    setShowDeployMenu(false);
  };

  const handleSplitDownload = () => {
    // Extract CSS
    const cssMatch = generatedHTML.match(/<style[^>]*>([\s\S]*?)<\/style>/);
    const css = cssMatch ? cssMatch[1] : '';
    
    // Extract JS
    const jsMatch = generatedHTML.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    const js = jsMatch ? jsMatch[1] : '';
    
    // Create HTML without embedded CSS/JS
    let html = generatedHTML
      .replace(/<style[^>]*>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="styles.css">')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/, '<script src="script.js"></script>');
    
    // Download all three files
    downloadFile(html, `index.html`, 'text/html');
    downloadFile(css, `styles.css`, 'text/css');
    downloadFile(js, `script.js`, 'text/javascript');
    
    toast.success("Website downloaded as separate files!");
  };

  const handleZipDownload = async () => {
    try {
      const response = await base44.functions.invoke('createWebsiteZip', {
        html: generatedHTML
      });

      if (response.data?.error) {
        toast.error(response.data.error);
        return;
      }

      // Download the ZIP file
      const zipData = response.data.zipBase64;
      const blob = base64ToBlob(zipData, 'application/zip');
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `netnapz-website-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Website downloaded as ZIP!");
    } catch (error) {
      console.error("ZIP error:", error);
      toast.error("Failed to create ZIP file");
    }
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const base64ToBlob = (base64, type) => {
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedHTML);
    toast.success("Code copied to clipboard!");
  };

  const enableEditing = () => {
    if (!iframeRef.current) return;
    
    const iframeDoc = iframeRef.current.contentDocument;
    if (!iframeDoc) return;

    if (!isEditing) {
      const elements = iframeDoc.querySelectorAll('h1, h2, h3, p, span, a, button');
      elements.forEach(el => {
        el.contentEditable = true;
        el.style.outline = '2px dashed #3B82F6';
        el.style.outlineOffset = '4px';
      });
      setIsEditing(true);
      toast.success("Edit mode enabled! Click any text to edit");
    } else {
      const elements = iframeDoc.querySelectorAll('[contenteditable="true"]');
      elements.forEach(el => {
        el.contentEditable = false;
        el.style.outline = 'none';
      });
      
      const updatedHTML = iframeDoc.documentElement.outerHTML;
      setGeneratedHTML(updatedHTML);
      setIsEditing(false);
      toast.success("Changes saved!");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload a valid image file");
      return;
    }

    try {
      setUploadingImage(true);
      toast.info("Uploading & optimizing image...");
      
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await base44.functions.invoke('imagekitUpload', {
        file: file
      });

      if (data.error) {
        toast.error(data.error);
        return;
      }

      const imageUrl = data.file_url;
      
      if (iframeRef.current) {
        const iframeDoc = iframeRef.current.contentDocument;
        const images = iframeDoc.querySelectorAll('img');
        
        images.forEach(img => {
          img.style.cursor = 'pointer';
          img.style.border = '2px solid #3B82F6';
          img.onclick = () => {
            img.src = imageUrl;
            toast.success("Image replaced! ✨");
            
            const updatedHTML = iframeDoc.documentElement.outerHTML;
            setGeneratedHTML(updatedHTML);
          };
        });
        
        toast.success("✅ Image uploaded! Click any image in preview to replace it");
      }
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image: " + (error.message || "Unknown error"));
    } finally {
      setUploadingImage(false);
    }
  };

  const toggleSection = (sectionId) => {
    if (selectedSections.includes(sectionId)) {
      setSelectedSections(selectedSections.filter(s => s !== sectionId));
    } else {
      setSelectedSections([...selectedSections, sectionId]);
    }
  };

  const deployToNetlify = () => {
    toast.success("Opening Netlify Drop... Drag your downloaded index.html file there!");
    window.open("https://app.netlify.com/drop", "_blank");
    handleDownload("html");
  };

  const deployToVercel = () => {
    toast.success("Opening Vercel... Choose 'Import Git Repository' or 'Deploy a Project' to upload files.");
    window.open("https://vercel.com/new", "_blank");
    handleDownload("zip");
  };

  const deployToGitHub = () => {
    setShowDeployGuide(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-cyan-950 text-gray-100">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d410_1px,transparent_1px),linear-gradient(to_bottom,#06b6d410_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-indigo-500/5"></div>
      </div>

      {/* PREMIUM Header - Design Studio Style */}
      <div className="relative z-10 border-b border-cyan-800/30 bg-black/80 backdrop-blur-2xl shadow-2xl">
        <div className="container mx-auto px-3 md:px-6 py-3 md:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-5">
              {/* Premium Robot Avatar with Design Elements */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity animate-pulse"></div>
                <div className="relative w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-white to-cyan-100 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-cyan-400/50">
                  <div className="relative w-10 h-10 md:w-14 md:h-14">
                    {/* Design studio icon */}
                    <Globe className="w-full h-full text-cyan-600" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-blue-500 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-2 border-gray-900 animate-pulse shadow-lg shadow-green-500/50 flex items-center justify-center">
                  <Zap className="w-2 h-2 text-white" />
                </div>
              </div>
              
              <div>
                <h1 className="text-lg md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-400">
                  NAPZ WEB STUDIO
                </h1>
                <p className="hidden md:block text-xs md:text-sm text-cyan-300/80 font-mono flex items-center gap-2">
                  <Layout className="w-3 h-3" />
                  Professional Website Design Platform
                </p>
              </div>
            </div>

            {/* FREE Badge */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-sm font-bold text-green-400">100% FREE</span>
            </div>
          </div>
          
          <div className="mt-2 md:mt-3 flex flex-wrap items-center justify-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-green-400 animate-pulse" />
            <span className="text-xs text-green-300 font-bold">
              🤖 Powered by DeepSeek V3.1
            </span>
            <span className="hidden md:inline text-xs text-green-300 font-bold">
              - Agency-Grade Website Creation
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-3 md:px-6 py-6 md:py-12 max-w-7xl">
        <UsageBanner usage={usageStatus} feature="websites_generated" />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - Configuration */}
          <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
            
            {/* Hero Section - AGENCY STYLE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center lg:text-left mb-8"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mb-4 border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                <Globe className="w-5 h-5 text-cyan-300 animate-pulse" />
                <span className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                  Agency-Grade Web Design
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                Design Stunning
                <span className="block mt-2">
                  <span className="relative inline-block">
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 blur-2xl opacity-50"></span>
                    <span className="relative bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Websites
                    </span>
                  </span>
                </span>
              </h2>
              <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                Professional templates, custom design, <span className="text-cyan-400 font-bold">one-click deployment</span>. Build like a pro agency in minutes.
              </p>
            </motion.div>

            {/* Progress Bar */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-cyan-900/80 to-blue-900/80 backdrop-blur-xl rounded-3xl border-2 border-cyan-500/50 p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Generating Your Website</h3>
                      <p className="text-sm text-cyan-300">{generationStage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-bold">~{estimatedTime}s</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Progress 
                    value={generationProgress} 
                    className="h-4 bg-gray-900/50"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-cyan-300 font-bold">{generationProgress}% Complete</span>
                    <span className="text-gray-400">
                      {generationProgress === 100 ? "✅ Done!" : "Processing..."}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Description - PROFESSIONAL AGENCY BRIEF */}
            <div className="glass rounded-3xl border-2 border-cyan-800/30 p-8 shadow-2xl bg-gradient-to-br from-gray-900/80 to-cyan-950/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Project Brief</h2>
                  <p className="text-xs text-cyan-400">Describe your website vision</p>
                </div>
              </div>

              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your professional website...&#10;&#10;Example: 'A modern fitness gym website with class schedules, trainer profiles, membership pricing tiers, testimonials carousel, and contact form with location map'"
                className="w-full bg-black/50 border-cyan-500/30 text-white placeholder-gray-500 text-base leading-relaxed rounded-2xl min-h-[140px] resize-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 p-4"
                disabled={isGenerating}
              />
              
              <div className="flex items-start gap-2 mt-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-cyan-300 leading-relaxed">
                  <span className="font-bold">Agency Tip:</span> Include target audience, key sections (hero, features, testimonials), design style, and call-to-actions for professional results!
                </p>
              </div>
              
              <div className="mt-4">
                <p className="text-xs text-cyan-500/60 mb-2 font-bold">Quick Start Templates:</p>
                <div className="grid grid-cols-1 gap-2">
                  {examplePrompts.slice(0, 3).map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setDescription(prompt)}
                      disabled={isGenerating}
                      className="w-full text-left px-3 py-2 bg-black/40 hover:bg-cyan-900/20 border border-cyan-500/20 hover:border-cyan-500/50 rounded-lg text-xs text-gray-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span className="relative pl-2">{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Template Selection */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-cyan-800/30 p-6">
              <label className="text-sm font-bold text-cyan-300 mb-4 block uppercase tracking-wider">
                Website Template ({templates.length} Available)
              </label>
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    disabled={isGenerating}
                    className={`p-3 rounded-xl text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      selectedTemplate === template.id
                        ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-white border-2 border-cyan-400"
                        : "bg-gray-950/50 text-gray-300 border border-cyan-800/30 hover:border-cyan-600/50"
                    }`}
                  >
                    <div className="font-bold text-sm mb-1 flex items-center gap-2">
                      <span>{template.icon}</span>
                      {template.name}
                    </div>
                    <div className="text-xs opacity-80">{template.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-cyan-800/30 p-6">
              <label className="text-sm font-bold text-cyan-300 mb-4 block uppercase tracking-wider">
                Design Style
              </label>
              <div className="grid grid-cols-4 gap-3">
                {styles.map((style) => {
                  const Icon = style.icon;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      disabled={isGenerating}
                      className={`p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedStyle === style.id
                          ? "bg-gradient-to-br " + style.color + " text-white ring-2 ring-white/50"
                          : "bg-gray-950/50 text-gray-300 border border-cyan-800/30 hover:border-cyan-600/50"
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-xs font-bold text-center">{style.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Scheme Customizer */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-cyan-800/30 p-6">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                disabled={isGenerating}
                className="w-full flex items-center justify-between text-sm font-bold text-cyan-300 uppercase tracking-wider mb-4 disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Custom Color Scheme
                </span>
                {showColorPicker ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showColorPicker && (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(customColors).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-xs text-gray-400 mb-2 block capitalize">{key}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => setCustomColors({...customColors, [key]: e.target.value})}
                          disabled={isGenerating}
                          className="w-12 h-12 rounded-lg cursor-pointer border-2 border-cyan-500/30 disabled:opacity-50"
                        />
                        <Input
                          type="text"
                          value={value}
                          onChange={(e) => setCustomColors({...customColors, [key]: e.target.value})}
                          disabled={isGenerating}
                          className="flex-1 bg-gray-950/50 border-cyan-800/30 text-gray-100 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section Manager */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-cyan-800/30 p-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                disabled={isGenerating}
                className="w-full flex items-center justify-between text-sm font-bold text-cyan-300 uppercase tracking-wider mb-4 disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Website Sections ({selectedSections.length} selected)
                </span>
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showAdvanced && (
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => toggleSection(section.id)}
                      disabled={isGenerating}
                      className={`p-3 rounded-lg text-left transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedSections.includes(section.id)
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                          : "bg-gray-950/50 text-gray-400 border border-cyan-800/30 hover:border-cyan-600/50"
                      }`}
                    >
                      <div className="font-bold text-xs mb-1">{section.name}</div>
                      <div className="text-xs opacity-80">{section.desc}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Generate Button - PREMIUM AGENCY */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !description.trim()}
              className="w-full h-16 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-700 hover:via-blue-700 hover:to-cyan-700 text-white rounded-2xl font-black text-lg shadow-2xl shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
              {isGenerating ? (
                <span className="flex items-center gap-3 relative z-10">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Building Website... {generationProgress}%
                </span>
              ) : (
                <span className="flex items-center gap-3 relative z-10">
                  <Globe className="w-6 h-6" />
                  Generate Professional Website
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </span>
              )}
            </Button>
          </div>

          {/* Right - Preview */}
          <div className="space-y-6">
            {/* Preview Controls */}
            {generatedHTML && (
              <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-cyan-800/30 p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setViewMode("desktop")}
                      variant={viewMode === "desktop" ? "default" : "outline"}
                      size="sm"
                    >
                      <Monitor className="w-4 h-4 mr-2" />
                      Desktop
                    </Button>
                    <Button
                      onClick={() => setViewMode("mobile")}
                      variant={viewMode === "mobile" ? "default" : "outline"}
                      size="sm"
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      Mobile
                    </Button>
                    <Button
                      onClick={() => setViewMode("code")}
                      variant={viewMode === "code" ? "default" : "outline"}
                      size="sm"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        as="span"
                        variant="outline"
                        size="sm"
                        disabled={uploadingImage}
                      >
                        {uploadingImage ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                        Image
                      </Button>
                    </label>
                    <Button
                      onClick={enableEditing}
                      variant="outline"
                      size="sm"
                      className={isEditing ? "bg-green-500/20 border-green-500" : ""}
                    >
                      {isEditing ? <Check className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                      {isEditing ? "Save" : "Edit"}
                    </Button>
                  </div>
                </div>

                {/* Download & Deploy Options */}
                <div className="border-t border-cyan-800/30 pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Download Dropdown */}
                    <div className="relative">
                      <Button
                        onClick={() => setShowDeployMenu(!showDeployMenu)}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                        <ChevronDown className="w-3 h-3 ml-2" />
                      </Button>
                      
                      {showDeployMenu && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-gray-900 border border-cyan-800/30 rounded-xl shadow-2xl z-50 overflow-hidden">
                          <button
                            onClick={() => handleDownload("html")}
                            className="w-full px-4 py-3 text-left hover:bg-cyan-900/20 transition-colors flex items-center gap-3"
                          >
                            <FileText className="w-4 h-4 text-blue-400" />
                            <div>
                              <div className="text-sm font-bold text-white">Single HTML</div>
                              <div className="text-xs text-gray-400">All-in-one file</div>
                            </div>
                          </button>
                          <button
                            onClick={() => handleDownload("split")}
                            className="w-full px-4 py-3 text-left hover:bg-cyan-900/20 transition-colors flex items-center gap-3 border-t border-cyan-800/30"
                          >
                            <Code className="w-4 h-4 text-green-400" />
                            <div>
                              <div className="text-sm font-bold text-white">Separate Files</div>
                              <div className="text-xs text-gray-400">HTML, CSS, JS</div>
                            </div>
                          </button>
                          <button
                            onClick={() => handleDownload("zip")}
                            className="w-full px-4 py-3 text-left hover:bg-cyan-900/20 transition-colors flex items-center gap-3 border-t border-cyan-800/30"
                          >
                            <Archive className="w-4 h-4 text-cyan-400" />
                            <div>
                              <div className="text-sm font-bold text-white">ZIP Package</div>
                              <div className="text-xs text-gray-400">Organized folders</div>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Deploy Button */}
                    <Button
                      onClick={() => setShowDeployGuide(true)}
                      variant="default"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      size="sm"
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Deploy Now
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Preview Area */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-cyan-800/30 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-950/80 to-blue-950/80 px-6 py-4 border-b border-cyan-800/30">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                    {viewMode === "code" ? "HTML Source Code" : "Live Website Preview"}
                  </span>
                </div>
              </div>

              <div className="bg-gray-950 p-8" style={{ minHeight: "600px" }}>
                {!generatedHTML ? (
                  <div className="flex flex-col items-center justify-center h-full py-24">
                    <div className="w-32 h-32 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-3xl flex items-center justify-center mb-6">
                      <Globe className="w-16 h-16 text-cyan-400/50" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-400 mb-2">
                      Your Website Preview
                    </h3>
                    <p className="text-gray-500 text-center max-w-md">
                      Configure your perfect website, then hit generate to see the magic
                    </p>
                  </div>
                ) : viewMode === "code" ? (
                  <div className="relative">
                    <button
                      onClick={copyCode}
                      className="absolute top-4 right-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-bold z-10"
                    >
                      Copy All Code
                    </button>
                    <pre className="bg-gray-900 text-gray-300 p-6 rounded-xl overflow-x-auto text-xs font-mono border border-cyan-800/30 max-h-[600px] overflow-y-auto">
                      <code>{generatedHTML}</code>
                    </pre>
                  </div>
                ) : (
                  <div 
                    className={`mx-auto bg-white rounded-lg overflow-hidden shadow-2xl transition-all ${
                      viewMode === "mobile" ? "max-w-sm" : "w-full"
                    }`}
                    style={{ height: "600px" }}
                  >
                    <iframe
                      ref={iframeRef}
                      srcDoc={generatedHTML}
                      className="w-full h-full border-0"
                      title="Website Preview"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Guide Modal */}
      {showDeployGuide && (
        <DeploymentGuideModal
          onClose={() => setShowDeployGuide(false)}
          htmlCode={generatedHTML}
          onDeploy={{
            netlify: deployToNetlify,
            vercel: deployToVercel,
            github: deployToGitHub
          }}
        />
      )}
    </div>
  );
}