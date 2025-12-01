import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Rocket, ExternalLink, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DeploymentGuideModal({ onClose, htmlCode, onDeploy }) {
  const platforms = [
    {
      id: "netlify",
      name: "Netlify Drop",
      icon: "🚀",
      difficulty: "Easiest",
      time: "30 seconds",
      color: "from-teal-500 to-cyan-500",
      steps: [
        "Click 'Deploy to Netlify' button below",
        "Drag and drop your HTML file",
        "Your site is live instantly!",
        "Get a free .netlify.app domain"
      ],
      features: ["✅ Free forever", "✅ Instant deployment", "✅ Auto HTTPS", "✅ CDN included"]
    },
    {
      id: "vercel",
      name: "Vercel",
      icon: "▲",
      difficulty: "Easy",
      time: "1 minute",
      color: "from-gray-700 to-black",
      steps: [
        "Click 'Deploy to Vercel' button",
        "Sign in with GitHub (free)",
        "Upload your HTML file",
        "Deploy with one click"
      ],
      features: ["✅ Free tier", "✅ Fast CDN", "✅ Auto SSL", "✅ Analytics"]
    },
    {
      id: "github",
      name: "GitHub Pages",
      icon: "📦",
      difficulty: "Moderate",
      time: "5 minutes",
      color: "from-purple-500 to-pink-500",
      steps: [
        "Create a GitHub account (free)",
        "Create new repository",
        "Upload your HTML file",
        "Enable GitHub Pages in settings",
        "Access at username.github.io/repo"
      ],
      features: ["✅ 100% free", "✅ Custom domains", "✅ Version control", "✅ No limits"]
    },
    {
      id: "surge",
      name: "Surge.sh",
      icon: "⚡",
      difficulty: "Easy",
      time: "2 minutes",
      color: "from-green-500 to-emerald-500",
      steps: [
        "Install: npm install -g surge",
        "Run: surge (in your file folder)",
        "Follow prompts",
        "Get instant domain"
      ],
      features: ["✅ Free", "✅ CLI-based", "✅ Custom domains", "✅ Super fast"]
    }
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(htmlCode);
    toast.success("Code copied! Now paste it where you deploy");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl border border-purple-500/30 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-xl px-8 py-6 border-b border-purple-500/30 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Rocket className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Deploy Your Website</h2>
                  <p className="text-purple-300 text-sm">Choose your deployment platform (all free!)</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Quick Copy Section */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Copy className="w-5 h-5 text-blue-400" />
                    Quick Deploy Tip
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Most platforms let you drag-and-drop or paste your HTML file. Download your file first, then follow the steps below!
                  </p>
                </div>
                <Button
                  onClick={handleCopyCode}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
              </div>
            </div>

            {/* Platform Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {platforms.map((platform) => (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-gradient-to-br ${platform.color} p-[2px] rounded-2xl group hover:shadow-2xl transition-all`}
                >
                  <div className="bg-gray-900 rounded-2xl p-6 h-full">
                    {/* Platform Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{platform.icon}</span>
                        <div>
                          <h3 className="text-xl font-black text-white">{platform.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded">
                              {platform.difficulty}
                            </span>
                            <span className="text-xs text-gray-400">{platform.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-purple-300 mb-3 uppercase tracking-wider">
                        Steps:
                      </h4>
                      <ol className="space-y-2">
                        {platform.steps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="flex-shrink-0 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-purple-300 mb-2 uppercase tracking-wider">
                        Features:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {platform.features.map((feature, index) => (
                          <div key={index} className="text-xs text-gray-400">
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deploy Button */}
                    <Button
                      onClick={() => {
                        if (platform.id === 'netlify') onDeploy.netlify();
                        else if (platform.id === 'vercel') onDeploy.vercel();
                        else if (platform.id === 'github') {
                          window.open("https://github.com/new", "_blank");
                        } else if (platform.id === 'surge') {
                          window.open("https://surge.sh", "_blank");
                        }
                      }}
                      className={`w-full bg-gradient-to-r ${platform.color} hover:opacity-90 text-white font-bold`}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Deploy to {platform.name}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Resources */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                After Deployment
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Your website will have a free domain (e.g., yoursite.netlify.app)</li>
                <li>• You can add a custom domain later (e.g., yoursite.com)</li>
                <li>• All platforms offer free SSL certificates (HTTPS)</li>
                <li>• You can update your site anytime by re-uploading</li>
                <li>• Most platforms have excellent documentation and support</li>
              </ul>
            </div>

            {/* Close Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={onClose}
                variant="outline"
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              >
                Close Guide
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}