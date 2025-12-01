// pages/MyCreations.jsx
import React, { useState, useEffect } from "react";
import { useUser } from "@/components/UserContext";
import { motion } from "framer-motion";
import {
  Globe,
  Image as ImageIcon,
  Code,
  Video,
  Download,
  Trash2,
  Star,
  Eye,
  Search,
  Calendar,
  Heart,
  Loader2,
  Archive,
  MoreVertical,
  Terminal,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function MyCreations() {
  const { user } = useUser();
  const [userContent, setUserContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    loadUserContent();
  }, [user]);

  const loadUserContent = () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const creations = JSON.parse(localStorage.getItem('netnapz_creations') || '[]');
      const userCreations = creations.filter(creation => creation.user_id === user.id);
      setUserContent(userCreations);
    } catch (error) {
      console.error("Failed to load content:", error);
      toast.error("Failed to load your creations");
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = userContent.filter((item) => {
    const matchesSearch = 
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prompt?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "all" || item.type === filterType;

    return matchesSearch && matchesType;
  });

  const handleDelete = async (contentId) => {
    if (!confirm("Are you sure you want to delete this item? This cannot be undone.")) {
      return;
    }

    try {
      const creations = JSON.parse(localStorage.getItem('netnapz_creations') || '[]');
      const updatedCreations = creations.filter(item => item.id !== contentId);
      localStorage.setItem('netnapz_creations', JSON.stringify(updatedCreations));
      setUserContent(updatedCreations.filter(item => item.user_id === user.id));
      toast.success("Item deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleDownload = (content) => {
    let blob, filename, mimeType;

    switch(content.type) {
      case 'website':
      case 'game':
      case 'webapp':
        blob = new Blob([content.content], { type: 'text/html' });
        filename = `${content.title}-${Date.now()}.html`;
        break;
      default:
        blob = new Blob([content.content || content.prompt], { type: 'text/plain' });
        filename = `${content.title}-${Date.now()}.txt`;
    }

    const element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = filename;
    element.click();
    URL.revokeObjectURL(element.href);
  };

  const handleView = (content) => {
    if (content.type === 'image' && content.image_url) {
      window.open(content.image_url, '_blank');
    } else if (content.type === 'video' && content.video_url) {
      window.open(content.video_url, '_blank');
    } else if (['website', 'game', 'webapp'].includes(content.type)) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(content.content);
        newWindow.document.close();
      }
    } else {
      const newWindow = window.open('', '_blank');
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${content.title}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              max-width: 800px; 
              margin: 0 auto;
              background: #f5f5f5;
            }
            .content { 
              background: white; 
              padding: 20px; 
              border-radius: 10px; 
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>
          <h1>${content.title}</h1>
          <div class="content">${content.content || content.prompt}</div>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const contentTypes = [
    { id: "all", name: "All Content", icon: Archive },
    { id: "website", name: "Websites", icon: Globe },
    { id: "image", name: "Images", icon: ImageIcon },
    { id: "code", name: "Code", icon: Code },
    { id: "video", name: "Videos", icon: Video },
    { id: "game", name: "Games", icon: Sparkles },
    { id: "webapp", name: "Web Apps", icon: Terminal },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-red-50/30 to-pink-50/30 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-red-50/30 to-pink-50/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Archive className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">My Creations</h2>
          <p className="text-gray-600 mb-6">
            Login to view and manage your AI creations
          </p>
          <Link to={createPageUrl("Settings")}>
            <Button className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-3 rounded-xl font-bold">
              Login / Sign Up
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const stats = {
    total: userContent.length,
    websites: userContent.filter(c => c.type === "website").length,
    images: userContent.filter(c => c.type === "image").length,
    code: userContent.filter(c => c.type === "code").length,
    videos: userContent.filter(c => c.type === "video").length,
    games: userContent.filter(c => c.type === "game").length,
    webapps: userContent.filter(c => c.type === "webapp").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50/30 to-pink-50/30">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#DC262608_1px,transparent_1px),linear-gradient(to_bottom,#DC262608_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center">
              <Archive className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">My Creations</h1>
              <p className="text-gray-600">All your AI-generated content in one place</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-red-200/50 p-4">
              <div className="text-3xl font-black text-red-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-red-200/50 p-4">
              <div className="text-3xl font-black text-blue-600">{stats.websites}</div>
              <div className="text-sm text-gray-600">Websites</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-red-200/50 p-4">
              <div className="text-3xl font-black text-pink-600">{stats.images}</div>
              <div className="text-sm text-gray-600">Images</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-red-200/50 p-4">
              <div className="text-3xl font-black text-green-600">{stats.code}</div>
              <div className="text-sm text-gray-600">Code</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-red-200/50 p-4">
              <div className="text-3xl font-black text-purple-600">{stats.videos}</div>
              <div className="text-sm text-gray-600">Videos</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-red-200/50 p-4">
              <div className="text-3xl font-black text-yellow-600">{stats.games}</div>
              <div className="text-sm text-gray-600">Games</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-red-200/50 p-4">
              <div className="text-3xl font-black text-indigo-600">{stats.webapps}</div>
              <div className="text-sm text-gray-600">Web Apps</div>
            </div>
          </div>
        </motion.div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-red-200/50 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, prompt, or content..."
                className="pl-12 border-red-200"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {contentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setFilterType(type.id)}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                      filterType === type.id
                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white"
                        : "bg-white text-gray-600 hover:text-red-600 border border-red-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {type.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {filteredContent.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-white/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Archive className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              {searchQuery || filterType !== "all" ? "No content found" : "No creations yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterType !== "all" 
                ? "Try adjusting your filters" 
                : "Start creating with our AI tools!"}
            </p>
            <Link to={createPageUrl("NapzTerminal")}>
              <Button className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-3 rounded-xl font-bold">
                <Terminal className="w-4 h-4 mr-2" />
                Start Creating
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((content, index) => (
              <ContentCard
                key={content.id}
                content={content}
                index={index}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ContentCard({ content, index, onDelete, onDownload, onView }) {
  const typeIcons = {
    website: Globe,
    image: ImageIcon,
    code: Code,
    video: Video,
    game: Sparkles,
    webapp: Terminal,
    text: Archive,
  };

  const typeColors = {
    website: "from-blue-500 to-cyan-500",
    image: "from-pink-500 to-rose-500",
    code: "from-green-500 to-emerald-500",
    video: "from-purple-500 to-indigo-500",
    game: "from-yellow-500 to-orange-500",
    webapp: "from-red-500 to-pink-500",
    text: "from-gray-500 to-gray-700",
  };

  const Icon = typeIcons[content.type] || Archive;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-red-200/50 overflow-hidden hover:border-red-300 transition-all group shadow-lg hover:shadow-xl"
    >
      <div className={`h-48 bg-gradient-to-br ${typeColors[content.type] || 'from-gray-500 to-gray-700'} relative overflow-hidden`}>
        {content.type === "image" && content.image_url && (
          <img 
            src={content.image_url} 
            alt={content.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <Icon className="w-16 h-16 text-white/50" />
        </div>
        <div className="absolute top-4 left-4">
          <Badge className={`bg-white/90 text-gray-800 border-none font-bold`}>
            {content.type.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
              {content.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {content.prompt || "No prompt provided"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(content.created_at)}
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI Generated
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => onView(content)}
            variant="outline"
            size="sm"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button
            onClick={() => onDownload(content)}
            variant="outline"
            size="sm"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={() => onDelete(content.id)}
            variant="outline"
            size="sm"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}