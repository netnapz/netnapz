import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { 
  Video, 
  Image, 
  PenTool, 
  Zap, 
  Music, 
  Gamepad2,
  TrendingUp,
  Sparkles,
  Send,
  Download,
  Copy,
  Share2,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Eye,
  BarChart3,
  Target,
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wand2,
  Brain,
  Rocket,
  Crown,
  Star,
  Lightbulb,
  Mic,
  Film,
  Palette,
  Code2,
  MessageSquare,
  BookOpen,
  FileText,
  Search,
  Globe,
  Terminal,
  Monitor,
  Keyboard,
  Power,
  Cpu,
  HardDrive,
  MemoryStick
} from "lucide-react";

export default function CreatorTerminal() {
  const [activeTool, setActiveTool] = useState("ultimate_general");
  const [inputText, setInputText] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [contentStyle, setContentStyle] = useState("viral");
  const [history, setHistory] = useState([]);
  const [streamingData, setStreamingData] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [knowledgeBaseFiles, setKnowledgeBaseFiles] = useState([]);
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [isComputerOn, setIsComputerOn] = useState(true);
  const [progress, setProgress] = useState(0);
  const outputRef = useRef(null);

  // Enhanced creator tools with cartoon colors
  const creatorTools = [
    {
      id: "ultimate_image",
      icon: Image,
      label: "AI Images",
      color: "from-orange-400 to-yellow-400",
      bgColor: "bg-gradient-to-br from-orange-400 to-yellow-400",
      description: "Generate stunning AI images",
      platforms: ["all", "instagram", "twitter", "web"],
      function: "napzImageGen"
    },
    {
      id: "ultimate_video",
      icon: Video,
      label: "AI Videos",
      color: "from-green-400 to-blue-400",
      bgColor: "bg-gradient-to-br from-green-400 to-blue-400",
      description: "Create cinematic videos",
      platforms: ["all", "tiktok", "youtube", "instagram"],
      function: "napzVideoGen"
    },
    {
      id: "ultimate_game",
      icon: Gamepad2,
      label: "AI Games",
      color: "from-purple-400 to-pink-400",
      bgColor: "bg-gradient-to-br from-purple-400 to-pink-400",
      description: "Build interactive games instantly",
      platforms: ["all", "web", "mobile"],
      function: "deepseekSearch"
    },
    {
      id: "ultimate_website",
      icon: Code2,
      label: "AI Websites",
      color: "from-red-400 to-orange-400",
      bgColor: "bg-gradient-to-br from-red-400 to-orange-400",
      description: "Generate complete websites",
      platforms: ["all", "web"],
      function: "deepseekSearch"
    },
    {
      id: "ultimate_technical",
      icon: Zap,
      label: "AI Tools",
      color: "from-blue-400 to-green-400",
      bgColor: "bg-gradient-to-br from-blue-400 to-green-400",
      description: "Create technical applications",
      platforms: ["all"],
      function: "deepseekSearch"
    },
    {
      id: "ultimate_creative",
      icon: Wand2,
      label: "AI Creative",
      color: "from-pink-400 to-purple-400",
      bgColor: "bg-gradient-to-br from-pink-400 to-purple-400",
      description: "Innovative creative projects",
      platforms: ["all"],
      function: "deepseekSearch"
    },
    {
      id: "ultimate_general",
      icon: Brain,
      label: "AI Builder",
      color: "from-yellow-400 to-orange-400",
      bgColor: "bg-gradient-to-br from-yellow-400 to-orange-400",
      description: "Build anything with AI",
      platforms: ["all"],
      function: "deepseekSearch"
    }
  ];

  const platforms = [
    { id: "all", name: "All Platforms", color: "bg-gray-500" },
    { id: "tiktok", name: "TikTok", color: "bg-black" },
    { id: "instagram", name: "Instagram", color: "bg-pink-500" },
    { id: "youtube", name: "YouTube", color: "bg-red-600" },
    { id: "twitter", name: "Twitter", color: "bg-blue-400" },
    { id: "web", name: "Web", color: "bg-blue-600" },
  ];

  const contentStyles = [
    { id: "viral", name: "🔥 Viral", description: "Maximum engagement" },
    { id: "professional", name: "💼 Professional", description: "Business quality" },
    { id: "creative", name: "🎨 Creative", description: "Artistic and innovative" },
    { id: "minimal", name: "⚪ Minimal", description: "Clean and simple" },
    { id: "futuristic", name: "🚀 Futuristic", description: "Modern tech style" },
    { id: "cinematic", name: "🎬 Cinematic", description: "Movie-like quality" },
  ];

  // Progress simulation
  useEffect(() => {
    let progressInterval;
    if (isGenerating) {
      setProgress(0);
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);
    } else {
      setProgress(0);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isGenerating]);

  // Knowledge Base Functions
  const loadKnowledgeBase = async () => {
    try {
      const response = await base44.functions.invoke('napzTerminal', {
        action: 'list_files'
      });
      setKnowledgeBaseFiles(response.data?.files || []);
    } catch (error) {
      console.error('Failed to load knowledge base:', error);
    }
  };

  const uploadToKnowledgeBase = async (file) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target.result;
        const response = await base44.functions.invoke('napzTerminal', {
          action: 'upload_file',
          file_data: {
            filename: file.name,
            content: content,
            fileType: file.type,
            metadata: {
              size: file.size,
              type: file.type
            }
          }
        });
        if (response.data?.success) {
          await loadKnowledgeBase();
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // DIRECT FUNCTION CALLS - FIXED INTEGRATION
  const generateContent = async () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);
    setIsStreaming(true);
    setGeneratedContent("");
    setStreamingData(null);
    setActiveTab("preview");
    setProgress(0);

    try {
      const currentTool = creatorTools.find(tool => tool.id === activeTool);
      
      let response;
      
      if (activeTool === "ultimate_image") {
        response = await base44.functions.invoke('napzImageGen', {
          prompt: inputText,
          style: contentStyle,
          enhance_prompt: true,
          quality: 'highest'
        });
        
        if (response.data?.image_url) {
          setGeneratedContent(`![Generated Image](${response.data.image_url})`);
          setStreamingData({ 
            imageUrl: response.data.image_url, 
            type: 'image',
            prompt: inputText
          });
        }
        
      } else if (activeTool === "ultimate_video") {
        response = await base44.functions.invoke('napzVideoGen', {
          prompt: inputText,
          duration: 8,
          aspect_ratio: '16:9',
          style: 'Cinematic'
        });
        
        if (response.data?.video_url) {
          setGeneratedContent(`🎬 **Your Video is Ready!**\n\nWatch here: ${response.data.video_url}`);
          setStreamingData({ 
            videoUrl: response.data.video_url, 
            type: 'video',
            prompt: inputText
          });
        }
        
      } else {
        const enhancedPrompt = buildEnhancedPrompt(inputText, activeTool);
        
        response = await base44.functions.invoke('deepseekSearch', {
          prompt: enhancedPrompt,
          max_tokens: 4000
        });
        
        const content = response.data?.response || response.data?.content || "No content generated";
        setGeneratedContent(content);
        
        const detectedType = detectContentType(content, activeTool);
        setStreamingData({ 
          content: content,
          type: detectedType,
          prompt: inputText,
          rawContent: content
        });
      }
      
      if (response.data) {
        setHistory(prev => [{
          id: Date.now(),
          tool: activeTool,
          input: inputText,
          output: generatedContent || response.data.response || response.data.content,
          timestamp: new Date().toLocaleTimeString(),
          platform: selectedPlatform,
          type: streamingData?.type || 'unknown',
          metadata: response.data.metadata || {}
        }, ...prev.slice(0, 9)]);
      }

    } catch (error) {
      console.error('Generation error:', error);
      setGeneratedContent(`❌ Error: ${error.message}\n\nPlease try again or use a different tool.`);
    } finally {
      setIsGenerating(false);
      setIsStreaming(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const buildEnhancedPrompt = (userPrompt, tool) => {
    const toolPrompts = {
      'ultimate_website': `Create a complete, functional website for: "${userPrompt}". 
      Return full HTML, CSS, and JavaScript code that works in a browser. 
      Make it responsive, modern, and include all necessary code in one file.`,

      'ultimate_game': `Create a playable HTML5 game for: "${userPrompt}".
      Use HTML5 Canvas or pure JavaScript. Include:
      - Complete game code in one HTML file
      - Working controls and gameplay
      - Score system and game states
      - Mobile-friendly design
      - No external dependencies`,

      'ultimate_technical': `Create a functional web application for: "${userPrompt}".
      Return complete HTML/CSS/JavaScript code that works immediately.
      Include all features and make it user-friendly.`,

      'ultimate_creative': `Create an interactive creative project for: "${userPrompt}".
      Use HTML5, Canvas, or creative coding techniques.
      Make it engaging and visually appealing.`,

      'ultimate_general': `Create something amazing for: "${userPrompt}".
      Build a complete, functional project with HTML, CSS, and JavaScript.
      Make it impressive and working.`
    };

    return toolPrompts[tool] || userPrompt;
  };

  const detectContentType = (content, tool) => {
    if (tool === 'ultimate_image') return 'image';
    if (tool === 'ultimate_video') return 'video';
    
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('<!doctype html') || 
        lowerContent.includes('<html') || 
        lowerContent.includes('</html>')) {
      return 'website';
    }
    
    if (lowerContent.includes('canvas') || 
        lowerContent.includes('game') || 
        lowerContent.includes('requestanimationframe') ||
        lowerContent.includes('addEventListener(\'keydown\'')) {
      return 'game';
    }
    
    if (lowerContent.includes('function') || 
        lowerContent.includes('const ') || 
        lowerContent.includes('document.getElementById')) {
      return 'webapp';
    }
    
    return 'text';
  };

  const downloadContent = () => {
    if (!streamingData) return;

    let blob, filename, mimeType;

    switch(streamingData.type) {
      case 'image':
        const link = document.createElement('a');
        link.href = streamingData.imageUrl;
        link.download = `ai-image-${Date.now()}.png`;
        link.click();
        return;

      case 'website':
      case 'game':
      case 'webapp':
        blob = new Blob([streamingData.rawContent || generatedContent], { type: 'text/html' });
        filename = `creation-${Date.now()}.html`;
        mimeType = 'text/html';
        break;

      default:
        blob = new Blob([generatedContent], { type: 'text/plain' });
        filename = `content-${Date.now()}.txt`;
        mimeType = 'text/plain';
    }

    const element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = filename;
    element.click();
    URL.revokeObjectURL(element.href);
  };

  const viewInNewTab = () => {
    if (!streamingData) return;

    if (streamingData.type === 'image') {
      window.open(streamingData.imageUrl, '_blank');
      return;
    }

    if (streamingData.type === 'video') {
      window.open(streamingData.videoUrl, '_blank');
      return;
    }

    if (['website', 'game', 'webapp'].includes(streamingData.type)) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(streamingData.rawContent || generatedContent);
        newWindow.document.close();
      }
    }
  };

  const playContent = () => {
    if (!streamingData) return;

    if (['website', 'game', 'webapp'].includes(streamingData.type)) {
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${streamingData.prompt || 'AI Creation'}</title>
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              iframe { border: none; width: 100%; height: 100vh; }
            </style>
          </head>
          <body>
            <iframe srcdoc="${escapeHtml(streamingData.rawContent || generatedContent)}"></iframe>
          </body>
          </html>
        `);
        previewWindow.document.close();
      }
    }
  };

  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  const shareContent = () => {
    if (streamingData?.imageUrl) {
      window.open(streamingData.imageUrl, '_blank');
    } else if (streamingData?.videoUrl) {
      window.open(streamingData.videoUrl, '_blank');
    } else {
      navigator.clipboard.writeText(generatedContent);
    }
  };

  const clearContent = () => {
    setInputText("");
    setGeneratedContent("");
    setStreamingData(null);
    setActiveTab("preview");
  };

  const loadFromHistory = (historyItem) => {
    setInputText(historyItem.input);
    setGeneratedContent(historyItem.output);
    setActiveTool(historyItem.tool);
    setSelectedPlatform(historyItem.platform);
    setStreamingData({
      type: historyItem.type,
      content: historyItem.output,
      prompt: historyItem.input
    });
  };

  const renderContentPreview = () => {
    if (!generatedContent && !streamingData) return null;

    if (streamingData?.type === 'image') {
      return (
        <div className="text-center">
          <img 
            src={streamingData.imageUrl} 
            alt="AI Generated" 
            className="max-w-full h-auto rounded-2xl mx-auto max-h-96 object-contain border-4 border-orange-400 shadow-lg"
          />
          <div className="mt-4 flex gap-2 justify-center">
            <button
              onClick={viewInNewTab}
              className="flex items-center gap-2 px-4 py-2 bg-orange-400 text-white rounded-xl hover:bg-orange-500 transition-all cartoon-btn"
            >
              <Eye className="w-4 h-4" />
              View Full Size
            </button>
            <button
              onClick={downloadContent}
              className="flex items-center gap-2 px-4 py-2 bg-green-400 text-white rounded-xl hover:bg-green-500 transition-all cartoon-btn"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      );
    }

    if (streamingData?.type === 'video') {
      return (
        <div className="text-center">
          <div className="bg-yellow-100 rounded-2xl p-8 border-4 border-orange-400">
            <Film className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-gray-800 text-xl font-black mb-2">Video Generated! 🎬</h3>
            <p className="text-gray-600 mb-4">Your AI video is ready to watch</p>
            <button
              onClick={viewInNewTab}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-xl hover:shadow-xl transition-all cartoon-btn"
            >
              <Play className="w-4 h-4" />
              Watch Video
            </button>
          </div>
        </div>
      );
    }

    if (['website', 'game', 'webapp'].includes(streamingData?.type)) {
      return (
        <div className="h-full flex flex-col">
          <div className="flex border-b-4 border-orange-400 mb-4">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex-1 py-2 text-center font-black ${
                activeTab === "preview" 
                  ? "text-orange-500 border-b-4 border-orange-500" 
                  : "text-gray-600 hover:text-orange-500"
              }`}
            >
              🎯 Live Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`flex-1 py-2 text-center font-black ${
                activeTab === "code" 
                  ? "text-orange-500 border-b-4 border-orange-500" 
                  : "text-gray-600 hover:text-orange-500"
              }`}
            >
              📝 Source Code
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === "preview" ? (
              <div className="h-full flex flex-col">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={playContent}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-xl hover:shadow-xl transition-all cartoon-btn"
                  >
                    <Play className="w-4 h-4" />
                    {streamingData.type === 'game' ? 'Play Game' : 'Open Website'}
                  </button>
                  <button
                    onClick={viewInNewTab}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-xl hover:bg-blue-500 transition-all cartoon-btn"
                  >
                    <Globe className="w-4 h-4" />
                    New Tab
                  </button>
                  <button
                    onClick={downloadContent}
                    className="flex items-center gap-2 px-4 py-2 bg-green-400 text-white rounded-xl hover:bg-green-500 transition-all cartoon-btn"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
                
                <div className="flex-1 bg-white rounded-xl overflow-hidden border-4 border-orange-400 shadow-inner">
                  <iframe
                    srcDoc={streamingData.rawContent || generatedContent}
                    title="Live Preview"
                    className="w-full h-full"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            ) : (
              <div className="h-full bg-gray-800 rounded-xl p-4 overflow-auto border-4 border-orange-400">
                <pre className="text-white text-sm whitespace-pre-wrap font-mono">
                  {streamingData.rawContent || generatedContent}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="text-gray-700 whitespace-pre-wrap leading-relaxed font-mono">
        {generatedContent}
      </div>
    );
  };

  useEffect(() => {
    loadKnowledgeBase();
  }, []);

  return (
    <div className="min-h-screen bg-white transition-colors duration-300 relative overflow-hidden">
      {/* White Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[size:50px_50px] bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]"></div>
      
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-green-100/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-purple-100/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <style>{`
        .cartoon-btn {
          border: 3px solid #000;
          border-radius: 20px;
          box-shadow: 4px 4px 0px #000;
          transition: all 0.2s ease;
          transform: translate(0, 0);
          font-family: 'Comic Sans MS', cursive;
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
          background: linear-gradient(145deg, #666, #444);
          border: 8px solid #333;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .computer-screen {
          background: linear-gradient(135deg, #87CEEB, #4682B4);
          border: 6px solid #333;
          border-radius: 15px;
          position: relative;
          overflow: hidden;
        }

        .keyboard-key {
          background: linear-gradient(145deg, #666, #444);
          border: 3px solid #000;
          border-radius: 8px;
          color: #fff;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          transition: all 0.2s ease;
        }

        .keyboard-key:hover {
          background: linear-gradient(145deg, #777, #555);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .keyboard-key:active {
          transform: translateY(2px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
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

        @keyframes point {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(5px) rotate(10deg); }
        }

        .animate-point {
          animation: point 1s ease-in-out infinite;
        }
      `}</style>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl relative z-10 pt-8 pb-20 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl blur-xl opacity-60"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white">
                <Terminal className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-3xl md:text-5xl font-black text-gray-800">
                NetNapz
              </h1>
              <p className="text-orange-500 font-bold text-lg">AI Content Creation Hub</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border-4 border-orange-400 shadow-lg mb-4">
            <Rocket className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-black text-gray-800">ALL-IN-ONE CREATION SUITE</span>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>
        </motion.div>

        {/* Old Computer Desktop in Center */}
        <div className="relative z-20 max-w-6xl mx-auto mb-8">
          <div className="computer-frame p-6">
            <div className="computer-screen h-[500px]">
              {isComputerOn ? (
                <div className="h-full flex flex-col p-4">
                  {/* Progress Bar */}
                  {isGenerating && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-700">BUILDING...</span>
                        <span className="text-sm font-bold text-orange-500">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 border-2 border-black">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-300 ease-out border border-yellow-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Computer Screen Content */}
                  <div className="flex-1 bg-white rounded-lg border-4 border-gray-400 p-4 overflow-auto">
                    {renderContentPreview() || (
                      <div className="flex items-center justify-center h-full text-gray-600">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white">
                            <Sparkles className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-gray-800 font-black text-lg">NETNAPZ READY</p>
                          <p className="text-gray-600 text-sm mt-2">Describe what you want to build!</p>
                          <div className="mt-4 text-orange-500 animate-point">👇 Click a tool below to start!</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Computer Status Bar */}
                  <div className="flex items-center justify-between mt-2 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      <span className="text-xs text-gray-700 font-bold">ONLINE</span>
                    </div>
                    <div className="text-xs text-gray-700 font-bold">
                      {activeTool.replace('ultimate_', '').toUpperCase()} MODE
                    </div>
                    <div className="text-xs text-gray-700 font-bold">
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <Power className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold text-xl">SYSTEM OFFLINE</p>
                    <p className="text-gray-500 text-sm">Press power button to start</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Monitor Stand */}
          <div className="flex justify-center">
            <div className="w-32 h-4 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-none rounded-b-lg border-2 border-gray-700"></div>
          </div>

          {/* Computer Peripherals */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-gray-700">
                <Cpu className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs font-bold text-gray-700">CPU: AI READY</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-gray-700">
                <MemoryStick className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xs font-bold text-gray-700">MEM: OPTIMAL</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-gray-700">
                <HardDrive className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-xs font-bold text-gray-700">STORAGE: READY</span>
            </div>
          </div>
        </div>

        {/* Function Buttons Around Computer */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Tools Section */}
          <div className="bg-white rounded-2xl p-4 border-4 border-orange-400 shadow-lg relative">
            <div className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-black animate-point">
              👉 PRESS HERE
            </div>
            <h3 className="text-gray-800 font-black text-lg mb-3 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-orange-500" />
              CREATOR TOOLS
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {creatorTools.map(tool => {
                const Icon = tool.icon;
                return (
                  <motion.button
                    key={tool.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTool(tool.id)}
                    className={`${tool.bgColor} text-white p-2 rounded-xl text-center border-3 border-black shadow-lg ${
                      activeTool === tool.id ? 'ring-4 ring-yellow-400 ring-opacity-70 transform scale-105' : 'hover:shadow-xl'
                    } transition-all duration-200 relative`}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs font-bold leading-tight">{tool.label}</div>
                    {activeTool === tool.id && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Input Section */}
          <div className="bg-white rounded-2xl p-4 border-4 border-green-400 shadow-lg">
            <h3 className="text-gray-800 font-black text-lg mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-green-500" />
              CREATION REQUEST
            </h3>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="🎬 Describe what you want to create..."
              className="w-full h-24 bg-yellow-50 border-2 border-orange-400 rounded-xl p-3 text-gray-800 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 font-comic text-sm"
            />
            
            <div className="flex gap-2 mt-3">
              <button
                onClick={generateContent}
                disabled={!inputText.trim() || isGenerating}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-sm transition-all ${
                  !inputText.trim() || isGenerating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-2 border-gray-400'
                    : 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:shadow-xl cartoon-btn'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    BUILDING... {progress}%
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    CREATE
                  </>
                )}
              </button>
              
              <button
                onClick={clearContent}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all border-2 border-gray-400 font-bold"
              >
                CLEAR
              </button>
            </div>
          </div>

          {/* Platform & Style Selectors */}
          <div className="bg-white rounded-2xl p-4 border-4 border-purple-400 shadow-lg">
            <h3 className="text-gray-800 font-black text-lg mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" />
              TARGET PLATFORM
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`p-2 rounded-xl text-center text-xs font-bold transition-all border-3 ${
                    selectedPlatform === platform.id
                      ? 'bg-purple-400 text-white border-purple-700'
                      : 'bg-gray-100 text-gray-700 border-gray-500 hover:border-purple-400'
                  }`}
                >
                  {platform.name}
                </button>
              ))}
            </div>

            <h3 className="text-gray-800 font-black text-lg mb-3 mt-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-pink-500" />
              CONTENT STYLE
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {contentStyles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setContentStyle(style.id)}
                  className={`p-2 rounded-xl text-center text-xs font-bold transition-all border-3 ${
                    contentStyle === style.id
                      ? 'bg-pink-400 text-white border-pink-700'
                      : 'bg-gray-100 text-gray-700 border-gray-500 hover:border-pink-400'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* Actions & History */}
          <div className="bg-white rounded-2xl p-4 border-4 border-blue-400 shadow-lg">
            <h3 className="text-gray-800 font-black text-lg mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              QUICK ACTIONS
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={downloadContent}
                disabled={!generatedContent}
                className={`p-2 rounded-xl text-center text-xs font-bold transition-all border-3 ${
                  !generatedContent
                    ? 'bg-gray-300 text-gray-500 border-gray-400'
                    : 'bg-green-400 text-white border-green-700 hover:shadow-md cartoon-btn'
                }`}
              >
                <Download className="w-4 h-4 mx-auto mb-1" />
                DOWNLOAD
              </button>
              <button
                onClick={copyToClipboard}
                disabled={!generatedContent}
                className={`p-2 rounded-xl text-center text-xs font-bold transition-all border-3 ${
                  !generatedContent
                    ? 'bg-gray-300 text-gray-500 border-gray-400'
                    : 'bg-blue-400 text-white border-blue-700 hover:shadow-md cartoon-btn'
                }`}
              >
                <Copy className="w-4 h-4 mx-auto mb-1" />
                COPY
              </button>
              <button
                onClick={viewInNewTab}
                disabled={!streamingData}
                className={`p-2 rounded-xl text-center text-xs font-bold transition-all border-3 ${
                  !streamingData
                    ? 'bg-gray-300 text-gray-500 border-gray-400'
                    : 'bg-orange-400 text-white border-orange-700 hover:shadow-md cartoon-btn'
                }`}
              >
                <Eye className="w-4 h-4 mx-auto mb-1" />
                PREVIEW
              </button>
              <button
                onClick={() => setIsComputerOn(!isComputerOn)}
                className={`p-2 rounded-xl text-center text-xs font-bold transition-all border-3 cartoon-btn ${
                  isComputerOn 
                    ? 'bg-red-400 text-white border-red-700' 
                    : 'bg-green-400 text-white border-green-700'
                }`}
              >
                <Power className="w-4 h-4 mx-auto mb-1" />
                {isComputerOn ? 'OFF' : 'ON'}
              </button>
            </div>

            {history.length > 0 && (
              <>
                <h3 className="text-gray-800 font-black text-lg mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-yellow-500" />
                  RECENT BUILDS
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {history.slice(0, 3).map(item => (
                    <button
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="w-full text-left p-2 bg-yellow-50 hover:bg-orange-100 rounded-xl border-2 border-orange-300 hover:border-orange-500 transition-all duration-200"
                    >
                      <div className="font-bold text-gray-800 text-xs truncate">
                        {item.input.substring(0, 30)}...
                      </div>
                      <div className="text-xs text-gray-600 flex items-center justify-between">
                        <span className="font-semibold">{item.tool.replace('ultimate_', '')}</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Big Cartoon Keyboard */}
        <div className="bg-gray-700 rounded-2xl p-4 shadow-2xl border-4 border-gray-800">
          <div className="bg-gray-800 rounded-xl p-4 border-4 border-gray-900">
            {/* Space Bar Row */}
            <div className="flex justify-center mb-2">
              <div className="keyboard-key w-64 h-12 flex items-center justify-center text-sm font-black cursor-pointer bg-gradient-to-r from-orange-400 to-red-500 border-4 border-orange-600">
                🚀 SPACE BAR - PRESS TO CREATE! 🚀
              </div>
            </div>

            {/* Function Keys */}
            <div className="flex justify-between mb-2 px-4">
              {['AI', 'CREATE', 'BUILD', 'DESIGN', 'GENERATE', 'MAKE'].map((key) => (
                <div key={key} className="keyboard-key w-16 h-8 flex items-center justify-center text-xs font-black cursor-pointer bg-gradient-to-r from-green-400 to-blue-400 border-2 border-black">
                  {key}
                </div>
              ))}
            </div>

            {/* Keyboard Branding */}
            <div className="text-center mt-2">
              <div className="text-orange-400 text-lg font-black tracking-wider">NETNAPZ CREATOR TERMINAL</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}