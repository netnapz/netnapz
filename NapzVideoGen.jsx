
/*
 * NetNapz Video Generator
 * © 2025 NetNapz. All Rights Reserved.
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Wand2,
  Download,
  Loader2,
  Sparkles,
  Play,
  Info,
  Crown,
  ChevronDown,
  Clock,
  Film,
  Rocket,
  Lock,
  Zap,
  Star,
  Award,
  TrendingUp,
  Volume2,
  Upload,
  X,
  Image as ImageIcon,
  Coins, // Added Coins icon
  ShoppingCart // Added ShoppingCart icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createPageUrl } from "@/utils";
import UsageBanner from "../components/UsageBanner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUser } from "../components/UserContext";

export default function NapzVideoGen() {
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, refreshUser } = useUser(); // Added refreshUser
  const [duration, setDuration] = useState("5");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [generationTime, setGenerationTime] = useState(0);
  const [usageStatus, setUsageStatus] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState("");
  
  const [referenceImage, setReferenceImage] = useState(null);
  const [referenceImageUrl, setReferenceImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [style, setStyle] = useState("default");

  useEffect(() => {
    let interval;
    if (isGenerating) {
      setGenerationTime(0);
      interval = setInterval(() => {
        setGenerationTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const simulateProgress = () => {
    setGenerationProgress(0);
    setGenerationStage("🎬 Initializing Google Veo 3.1 AI...");
    
    const stages = [
      { progress: 15, stage: "🤖 Analyzing your prompt...", delay: 3000 },
      { progress: 30, stage: "🎨 Generating keyframes...", delay: 8000 },
      { progress: 50, stage: "🎥 Rendering video sequence...", delay: 20000 },
      { progress: 70, stage: "🎵 Adding cinematic audio...", delay: 15000 },
      { progress: 85, stage: "🎞️ Processing final output...", delay: 10000 },
      { progress: 95, stage: "✅ Almost ready...", delay: 5000 }
    ];
    
    let currentStage = 0;
    
    const updateStage = () => {
      if (currentStage < stages.length) {
        const stage = stages[currentStage];
        setTimeout(() => {
          setGenerationProgress(stage.progress);
          setGenerationStage(stage.stage);
          currentStage++;
          updateStage();
        }, stage.delay);
      }
    };
    
    updateStage();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('📤 Upload triggered - File:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    setIsUploadingImage(true);

    try {
      console.log('📤 Calling base44.integrations.Core.UploadFile...');
      
      // The UploadFile integration returns the data directly, not wrapped in {data: ...}
      const response = await base44.integrations.Core.UploadFile({ file });
      
      console.log('📦 Upload response:', response);
      
      // Check if response has the file_url directly or nested
      const fileUrl = response.file_url || response.data?.file_url;
      
      if (fileUrl) {
        setReferenceImageUrl(fileUrl);
        setReferenceImage(file);
        toast.success("Reference image uploaded!");
        console.log('✅ Image uploaded successfully:', fileUrl);
      } else {
        console.error('❌ No file_url in response:', response);
        throw new Error('No file URL returned from upload');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        data: error.response?.data
      });
      toast.error("Failed to upload image: " + (error.message || "Unknown error"));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeReferenceImage = () => {
    setReferenceImage(null);
    setReferenceImageUrl("");
    toast.info("Reference image removed");
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && !referenceImageUrl) { // Allow generation with only image
      toast.error("Please describe your video scene or upload a reference image");
      return;
    }

    if (!user) {
      toast.error("Please login to generate videos");
      setTimeout(() => {
        window.location.href = createPageUrl("Login") + "?next=" + encodeURIComponent(window.location.pathname);
      }, 1500);
      return;
    }

    const hasPremium = user.subscription_tier === "premium";
    const hasPro = user.subscription_tier === "pro";
    const isAdmin = user.role === "admin";

    if (!hasPremium && !hasPro && !isAdmin) {
      toast.error("Video generation requires Premium or Pro subscription!");
      setTimeout(() => {
        window.location.href = createPageUrl("Pricing");
      }, 2000);
      return;
    }

    setIsGenerating(true);
    setVideoUrl("");
    simulateProgress();

    try {
      console.log('🎬 Starting video generation...', { 
        prompt: prompt.trim(), 
        duration, 
        aspectRatio,
        hasReferenceImage: !!referenceImageUrl,
        referenceImageUrl: referenceImageUrl,
        style
      });
      
      const requestData = {
        prompt: prompt.trim(),
        duration: parseInt(duration),
        aspect_ratio: aspectRatio,
        style: style
      };

      // Add reference image if provided
      if (referenceImageUrl) {
        requestData.reference_image = referenceImageUrl;
        console.log('🖼️ Including reference image in request:', referenceImageUrl);
      }

      const response = await base44.functions.invoke("napzVideoGen", requestData);

      console.log('📦 Full response:', response);

      const data = response.data;

      if (!data) {
        console.error('❌ No data in response');
        toast.error("Invalid response from server. Check console (F12) for details.");
        return;
      }

      if (data.error) {
        console.error('❌ Server returned error:', data.error);
        toast.error(data.error, { duration: 5000 });
        if (data.needsUpgrade) {
          setTimeout(() => {
            window.location.href = createPageUrl("Pricing");
          }, 2000);
        }
        return;
      }

      if (!data.video_url) {
        console.error('❌ No video URL in response:', data);
        toast.error("Generation completed but no video URL. Check console (F12).");
        return;
      }

      console.log('✅ Video URL:', data.video_url);

      setGenerationProgress(100);
      setGenerationStage("✅ Video ready with sound!");
      setVideoUrl(data.video_url);
      
      // Refresh user credits
      refreshUser();
      
      try {
        await base44.entities.UserContent.create({
          user_email: user.email,
          content_type: "video",
          title: prompt.substring(0, 100) || "Generated Video",
          description: prompt,
          content_data: {
            video_url: data.video_url,
            thumbnail_url: data.thumbnail_url || data.video_url
          },
          metadata: {
            duration: parseInt(duration),
            aspect_ratio: aspectRatio,
            style: style,
            model_used: "google-veo-3.1",
            generation_time: generationTime,
            has_audio: true,
            had_reference_image: !!referenceImageUrl,
            credits_used: data.credits_used || 100, // Assuming 100 credits for now as per outline
            credits_remaining: data.credits // As per outline
          },
          tags: ["ai-generated", "google-veo-3.1", aspectRatio, `${duration}s`, "with-audio", style]
        });
        console.log('✅ Video saved to profile');
      } catch (saveError) {
        console.error('Failed to save video:', saveError);
      }
      
      toast.success(`🎬 Video generated! (100 credits used, ${data.credits || 'unknown'} remaining)`);
      
    } catch (error) {
      console.error("❌ Caught error:", error);
      console.error("Error object:", {
        message: error.message,
        response: error.response,
        data: error.response?.data
      });
      
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message
        || error.message 
        || "Video generation failed. Open console (F12) to see error details.";
        
      toast.error(errorMessage, { duration: 7000 });
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setGenerationProgress(0);
        setGenerationStage("");
      }, 3000);
    }
  };

  const handleDownload = async () => {
    if (!videoUrl) return;

    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `netnapz-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success("Video downloaded!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download video");
    }
  };

  const examplePrompts = [
    "A futuristic city at sunset with flying cars and neon lights",
    "Ocean waves crashing on a tropical beach at golden hour",
    "A magical forest with glowing mushrooms and fireflies at night",
    "Time-lapse of clouds moving over mountain peaks",
    "Abstract colorful paint mixing in slow motion",
    "Drone shot flying through a canyon with dramatic lighting"
  ];

  const videoStyles = [
    { id: "default", name: "Default", desc: "Natural video generation" },
    { id: "cinematic", name: "Cinematic", desc: "Film-like quality" },
    { id: "animation", name: "Animation", desc: "3D animated style" },
    { id: "realistic", name: "Realistic", desc: "Photorealistic output" },
    { id: "dreamlike", name: "Dreamlike", desc: "Surreal atmosphere" },
    { id: "action", name: "Action", desc: "Dynamic movement" },
    { id: "noir", name: "Noir", desc: "Black & white drama" }
  ];

  const handleExampleClick = (example) => {
    setPrompt(example);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const hasPremium = user?.subscription_tier === "premium";
  const hasPro = user?.subscription_tier === "pro";
  const isAdmin = user?.role === "admin";
  const hasAccess = hasPremium || hasPro || isAdmin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-pink-950 to-orange-950 text-gray-100 relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-pink-500 to-transparent"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-orange-500 to-transparent"></div>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(255,255,255,0.02)_20px,rgba(255,255,255,0.02)_22px)]"></div>
        </div>
        
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-500/30 to-transparent rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-transparent rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-gradient-to-br from-orange-500/30 to-transparent rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-2000"></div>
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#FF00FF05_1px,transparent_1px),linear-gradient(to_bottom,#FF00FF05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.3; }
          50% { transform: translate(40px, -40px) scale(1.1); opacity: 0.5; }
        }
        .animate-blob {
          animation: blob 8s infinite ease-in-out;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>

      <div className="relative z-10 border-b border-pink-800/30 bg-black/80 backdrop-blur-2xl shadow-2xl">
        <div className="container mx-auto px-3 md:px-6 py-3 md:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-5">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-orange-500 rounded-2xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity animate-pulse"></div>
                <div className="relative w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-white to-pink-100 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-pink-400/50">
                  <div className="relative w-10 h-10 md:w-14 md:h-14">
                    <Film className="w-full h-full text-pink-600" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-4 h-4 md:w-6 md:h-6 text-orange-500 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full border-2 border-gray-900 animate-pulse shadow-lg shadow-pink-500/50 flex items-center justify-center">
                  <Star className="w-2 h-2 text-white fill-white" />
                </div>
              </div>
              
              <div>
                <h1 className="text-lg md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-orange-400">
                  NAPZ CINEMA STUDIO
                </h1>
                <p className="hidden md:block text-xs md:text-sm text-pink-300/80 font-mono flex items-center gap-2">
                  <Volume2 className="w-3 h-3" />
                  Text/Image to Video + AI Sound
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              {user && user.role !== 'admin' && (
                <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-pink-500/20 to-orange-500/20 border border-pink-500/30 rounded-xl">
                  <Coins className="w-4 h-4 md:w-5 md:h-5 text-pink-400" />
                  <div className="text-left">
                    <p className="text-xs text-pink-300 font-semibold">Balance</p>
                    <p className="text-sm font-bold text-white">{user.credits || 0}</p>
                  </div>
                  <a href={createPageUrl("Pricing")}>
                    <Button size="sm" className="bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 ml-1 md:ml-2">
                      <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      <span className="hidden md:inline">Top Up</span>
                    </Button>
                  </a>
                </div>
              )}

              {user?.role === 'admin' && (
                <Badge className="bg-gradient-to-r from-pink-600 to-orange-600 text-white border-0 px-4 py-2 text-sm font-bold">
                  <Crown className="w-4 h-4 mr-2" />
                  ADMIN UNLIMITED
                </Badge>
              )}
            </div>
          </div>
          
          <div className="mt-2 md:mt-3 flex items-center justify-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-lg border border-pink-500/30">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-pink-400" />
            <span className="text-xs text-pink-300 font-bold">
              🎬 Google Veo 3.1 • Text OR Image to Video
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-6 py-4 md:py-12 relative z-10 max-w-7xl">
        
        {user && !hasAccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 glass rounded-3xl border-2 border-purple-500/50 p-6 md:p-8 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Crown className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-2 flex items-center justify-center md:justify-start gap-3 flex-wrap">
                  Premium Feature
                  <Badge className="bg-gradient-to-r from-pink-500 to-orange-500 text-white border-0 text-sm">Premium & Pro Only</Badge>
                </h3>
                <p className="text-sm md:text-base text-gray-300 mb-4">AI video generation requires Premium or Pro subscription!</p>
                <Button
                  onClick={() => window.location.href = createPageUrl("Pricing")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-11 md:h-12 px-6 md:px-8 rounded-xl font-bold shadow-lg">
                  <Crown className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {hasAccess && (
          <UsageBanner usage={usageStatus} feature="videos_generated" />
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-12"
        >
          <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2.5 bg-gradient-to-r from-pink-500/20 to-orange-500/20 border md:border-2 border-pink-500/30 rounded-full mb-4 md:mb-6 shadow-lg shadow-pink-500/20">
            <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-pink-400 animate-pulse" />
            <span className="text-xs md:text-sm font-bold text-pink-400 uppercase tracking-wider">
              <span className="hidden md:inline">Google Veo 3.1 • Image-to-Video Support!</span>
              <span className="md:hidden">Image-to-Video!</span>
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-3 md:mb-6 leading-tight px-2">
            <span className="block md:inline">Create Movie</span>
            <span className="block mt-1 md:mt-2">
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 blur-xl md:blur-2xl opacity-50"></span>
                <span className="relative bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                  Magic
                </span>
              </span>
            </span>
          </h1>

          <p className="text-sm md:text-lg text-gray-400 max-w-3xl mx-auto mb-4 md:mb-6 leading-relaxed px-4">
            Transform <span className="text-pink-400 font-bold">text OR images</span> into cinematic videos with sound
          </p>

          {hasAccess && (
            <div className="flex items-center justify-center gap-2 md:gap-6 flex-wrap px-2">
              <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 bg-pink-500/10 border border-pink-500/30 rounded-lg md:rounded-xl">
                <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-pink-400" />
                <span className="text-xs md:text-sm font-bold text-pink-400">
                  {hasPro ? "100/mo" : "50/mo"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg md:rounded-xl">
                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-400" />
                <span className="text-xs md:text-sm font-bold text-purple-400">
                  ~2min
                </span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg md:rounded-xl">
                <Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-400" />
                <span className="text-xs md:text-sm font-bold text-orange-400">
                  With Sound
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8 glass rounded-2xl md:rounded-3xl border-2 border-pink-500/50 p-5 md:p-8 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-pink-500 to-orange-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                  <Film className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-2xl font-bold text-white">Generating Video</h3>
                  <p className="text-xs md:text-sm text-pink-300">{generationStage}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-pink-300">
                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-lg font-bold">{formatTime(generationTime)}</span>
              </div>
            </div>
            
            <div className="space-y-2 md:space-y-3">
              <Progress 
                value={generationProgress} 
                className="h-3 md:h-4 bg-gray-900/50"
              />
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="text-pink-300 font-bold">{generationProgress}% Complete</span>
                <span className="text-gray-400">
                  {generationProgress === 100 ? "✅ Ready!" : "Processing..."}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div className={`grid lg:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-12 ${!hasAccess ? 'opacity-50 pointer-events-none' : ''}`}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3 md:space-y-6"
          >
            <div className="glass rounded-2xl md:rounded-3xl border md:border-2 border-pink-800/30 p-4 md:p-8 shadow-2xl bg-gradient-to-br from-gray-900/80 to-pink-950/20">
              <div className="flex items-center gap-2.5 md:gap-3 mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Wand2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-white">Your Vision</h2>
                  <p className="text-xs text-pink-400">Describe or upload image</p>
                </div>
              </div>

              {/* Reference Image Upload */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-pink-300 mb-2">
                  🖼️ Reference Image (Optional)
                </label>
                
                {referenceImageUrl ? (
                  <div className="relative">
                    <img 
                      src={referenceImageUrl} 
                      alt="Reference" 
                      className="w-full h-40 object-cover rounded-xl border-2 border-pink-500/30"
                    />
                    <button
                      onClick={removeReferenceImage}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all"
                      disabled={isGenerating}
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage || isGenerating}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-pink-500/30 hover:border-pink-500/60 rounded-xl p-6 text-center cursor-pointer transition-all bg-black/30 hover:bg-black/50">
                      {isUploadingImage ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
                          <p className="text-sm text-pink-300">Uploading...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-pink-400" />
                          <p className="text-sm text-pink-300 font-semibold">
                            Click to upload reference image
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                )}
              </div>

              <Textarea
                placeholder="Describe your cinematic scene...&#10;&#10;Example: 'A futuristic cityscape at night, neon lights, cinematic lighting'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[120px] md:min-h-[160px] bg-black/50 border-pink-500/30 text-white placeholder-gray-500 text-sm md:text-base leading-relaxed resize-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 rounded-xl md:rounded-2xl p-3 md:p-4"
                disabled={!hasAccess || isGenerating}
              />

              <div className="hidden md:flex items-start gap-2 mt-4 p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl">
                <Sparkles className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-pink-300 leading-relaxed">
                  <span className="font-bold">Pro Tip:</span> Upload a reference image for image-to-video! Veo 3.1 adds realistic sound automatically!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6">
                <div>
                  <label className="block text-xs md:text-sm font-bold text-pink-300 mb-1.5 md:mb-2 flex items-center gap-1.5 md:gap-2">
                    <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Duration
                  </label>
                  <Select value={duration} onValueChange={setDuration} disabled={!hasAccess || isGenerating}>
                    <SelectTrigger className="bg-black/50 border-pink-500/30 text-white h-10 md:h-12 rounded-lg md:rounded-xl text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">⚡ 5s</SelectItem>
                      <SelectItem value="10">🎬 10s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-bold text-pink-300 mb-1.5 md:mb-2 flex items-center gap-1.5 md:gap-2">
                    <Film className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Ratio
                  </label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={!hasAccess || isGenerating}>
                    <SelectTrigger className="bg-black/50 border-pink-500/30 text-white h-10 md:h-12 rounded-lg md:rounded-xl text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">📺 16:9</SelectItem>
                      <SelectItem value="9:16">📱 9:16</SelectItem>
                      <SelectItem value="1:1">⬜ 1:1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Style Selector */}
              <div className="mt-4">
                <label className="block text-xs md:text-sm font-bold text-pink-300 mb-1.5 md:mb-2 flex items-center gap-1.5 md:gap-2">
                  <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  Video Style
                </label>
                <Select value={style} onValueChange={setStyle} disabled={!hasAccess || isGenerating}>
                  <SelectTrigger className="bg-black/50 border-pink-500/30 text-white h-10 md:h-12 rounded-lg md:rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {videoStyles.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{s.name}</span>
                          <span className="text-xs text-gray-500">• {s.desc}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || (!prompt.trim() && !referenceImageUrl) || !hasAccess}
                className="w-full mt-4 md:mt-6 h-12 md:h-16 bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 hover:from-pink-700 hover:via-purple-700 hover:to-orange-700 text-white rounded-xl md:rounded-2xl font-black text-sm md:text-lg shadow-2xl shadow-pink-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group active:scale-95"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                {isGenerating ? (
                  <span className="flex items-center gap-2 md:gap-3">
                    <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                    <span className="hidden md:inline">Generating... {generationProgress}%</span>
                    <span className="md:hidden">Gen... {generationProgress}%</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2 md:gap-3">
                    <Film className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="hidden md:inline">Generate Video + Sound</span>
                    <span className="md:hidden">Generate Video</span>
                    <Volume2 className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
                  </span>
                )}
              </Button>
              
              {hasAccess && (
                <p className="text-xs text-center text-gray-500 mt-2 md:mt-3">
                  <span className="hidden md:inline">Press Enter • </span>{duration === "5" ? "Uses 1 gen" : "Uses 2 gens"}
                </p>
              )}
            </div>

            <div className="glass rounded-2xl md:rounded-3xl border md:border-2 border-pink-800/30 p-4 md:p-6 shadow-2xl bg-gradient-to-br from-gray-900/80 to-orange-950/20">
              <h3 className="text-base md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-pink-400 animate-pulse" />
                Examples
              </h3>
              <div className="space-y-2">
                {examplePrompts.slice(0, 3).map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    disabled={!hasAccess || isGenerating}
                    className="w-full text-left px-3 md:px-4 py-2.5 md:py-3 bg-black/40 hover:bg-pink-900/20 active:bg-pink-900/30 border border-pink-500/20 hover:border-pink-500/50 rounded-lg md:rounded-xl text-xs md:text-sm text-gray-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden line-clamp-2"
                  >
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="relative pl-2">{example}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-pink-400/60 mt-3 md:mt-4 text-center">
                Tap to use
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass rounded-2xl md:rounded-3xl border md:border-2 border-pink-800/30 p-4 md:p-8 shadow-2xl lg:sticky lg:top-24 bg-gradient-to-br from-gray-900/80 to-purple-950/20">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-2.5 md:gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-2xl font-bold text-white">Preview</h2>
                    <p className="text-xs text-pink-400 hidden md:block">Video appears here</p>
                  </div>
                </div>
                {videoUrl && (
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10 h-9 px-3"
                  >
                    <Download className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Download</span>
                  </Button>
                )}
              </div>

              <div className="relative rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-4 border-black shadow-2xl" style={{ aspectRatio: aspectRatio.replace(':', '/') }}>
                <div className="hidden md:flex absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900 to-black flex-col justify-around py-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-3 bg-gray-700 mx-1 rounded-sm"></div>
                  ))}
                </div>
                <div className="hidden md:flex absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-black flex-col justify-around py-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-3 bg-gray-700 mx-1 rounded-sm"></div>
                  ))}
                </div>

                {videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                  />
                ) : (
                  <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-4 md:p-8 text-center">
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-pink-500 animate-spin mb-3 md:mb-4" />
                        <p className="text-white text-base md:text-lg font-bold mb-1.5 md:mb-2">
                          Creating Magic...
                        </p>
                        <p className="text-pink-400 text-xs md:text-sm px-2">
                          {generationStage}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-orange-500/20 rounded-2xl md:rounded-3xl flex items-center justify-center mb-4 md:mb-6 border border-pink-500/30">
                          <Film className="w-10 h-10 md:w-12 md:h-12 text-pink-400" />
                        </div>
                        <p className="text-white text-lg md:text-xl font-bold mb-2 md:mb-3">
                          Your Cinema Awaits
                        </p>
                        <p className="text-gray-400 text-xs md:text-sm max-w-xs px-2">
                          {hasAccess 
                            ? "Describe your scene or upload image"
                            : "Upgrade to unlock"}
                        </p>
                        {hasAccess && (
                          <div className="mt-4 md:mt-6 flex items-center gap-1.5 md:gap-2 text-xs text-pink-400 px-2">
                            <Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
                            <span>HD • Sound • Cinematic</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {!videoUrl && hasAccess && (
                <div className="mt-4 md:mt-6 grid grid-cols-3 gap-2 md:gap-4">
                  <div className="text-center p-2 md:p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg md:rounded-xl">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-pink-400 mx-auto mb-0.5 md:mb-1" />
                    <p className="text-xs text-gray-400 hidden md:block">Duration</p>
                    <p className="text-sm font-bold text-white">{duration}s</p>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg md:rounded-xl">
                    <Film className="w-4 h-4 md:w-5 md:h-5 text-purple-400 mx-auto mb-0.5 md:mb-1" />
                    <p className="text-xs text-gray-400 hidden md:block">Ratio</p>
                    <p className="text-sm font-bold text-white">{aspectRatio}</p>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg md:rounded-xl">
                    <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-orange-400 mx-auto mb-0.5 md:mb-1" />
                    <p className="text-xs text-gray-400 hidden md:block">Audio</p>
                    <p className="text-sm font-bold text-white">AI</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl md:rounded-3xl border border-gray-700/50 p-5 md:p-8 shadow-2xl"
        >
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
            <Info className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
            Google Veo 3.1 Features
          </h3>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 text-gray-300 text-sm md:text-base">
            <div>
              <h4 className="font-bold text-white mb-2">✨ What You Get:</h4>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                <li>• <span className="text-pink-400">Text-to-Video:</span> Describe in words, get cinema</li>
                <li>• <span className="text-purple-400">Image-to-Video:</span> Upload reference image</li>
                <li>• <span className="text-blue-400">Style Controls:</span> Cinematic, Animation, Realistic & more</li>
                <li>• <span className="text-orange-400">AI Sound:</span> Realistic audio automatically added</li>
                <li>• <span className="text-green-400">HD Quality:</span> High-definition output</li>
                <li>• <span className="text-cyan-400">Fast:</span> Ready in ~2 minutes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">🎬 Perfect For:</h4>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                <li>• Social media content</li>
                <li>• Marketing videos</li>
                <li>• Product demos</li>
                <li>• Animation projects</li>
                <li>• Music videos</li>
                <li>• Creative experiments</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
