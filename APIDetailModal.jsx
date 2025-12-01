import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Star,
  Shield,
  DollarSign,
  Code,
  BookOpen,
  Zap,
  Users,
  TrendingUp,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function APIDetailModal({ api, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  const pricingColors = {
    free: "bg-green-500",
    freemium: "bg-blue-500",
    paid: "bg-orange-500",
    enterprise: "bg-purple-500",
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "features", label: "Features", icon: Zap },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "examples", label: "Code Examples", icon: Code },
    { id: "tutorial", label: "Tutorial", icon: BookOpen },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDocumentationClick = () => {
    window.open(api.documentation_url, '_blank');
    toast.success("Opening documentation...");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="glass rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className={`${pricingColors[api.pricing_model]} p-8 relative`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="flex items-start gap-6">
              {api.logo_url ? (
                <img
                  src={api.logo_url}
                  alt={`${api.name} logo`}
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg border-4 border-white/20"
                />
              ) : (
                <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white/20">
                  <span className="text-4xl font-black text-white">
                    {api.name.charAt(0)}
                  </span>
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-3xl font-black text-white">
                    {api.name}
                  </h2>
                  {api.is_verified && (
                    <Shield className="w-6 h-6 text-white" />
                  )}
                </div>

                <p className="text-white/90 text-lg mb-4">
                  {api.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {api.rating > 0 && (
                    <Badge className="bg-white/20 text-white border-0">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {api.rating.toFixed(1)} ({api.review_count} reviews)
                    </Badge>
                  )}
                  {api.click_count > 0 && (
                    <Badge className="bg-white/20 text-white border-0">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {api.click_count} uses
                    </Badge>
                  )}
                  {api.bookmark_count > 0 && (
                    <Badge className="bg-white/20 text-white border-0">
                      <Users className="w-3 h-3 mr-1" />
                      {api.bookmark_count} bookmarks
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleDocumentationClick}
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Documentation
              </Button>
              {api.signup_url && (
                <Button
                  onClick={() => window.open(api.signup_url, '_blank')}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/20"
                >
                  Get API Key
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-8 pt-4 bg-white dark:bg-gray-900">
            <div className="flex gap-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-t-xl font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-gray-100 dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-gray-900">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        About {api.name}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {api.long_description || api.description}
                      </p>
                    </div>

                    {api.use_cases && api.use_cases.length > 0 && (
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-purple-500" />
                          Common Use Cases
                        </h4>
                        <ul className="space-y-2">
                          {api.use_cases.map((useCase, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-purple-500 mt-1">•</span>
                              <span className="text-gray-700 dark:text-gray-300">
                                {useCase}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {api.authentication_type && (
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                          Authentication
                        </h4>
                        <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          {api.authentication_type.toUpperCase().replace('_', ' ')}
                        </Badge>
                      </div>
                    )}

                    {api.rate_limits && (
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                          Rate Limits
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          {api.rate_limits}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "features" && (
                  <div className="space-y-6">
                    {api.key_features && api.key_features.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                          Key Features
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {api.key_features.map((feature, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl"
                            >
                              <Check className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 dark:text-gray-300">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(api.pros && api.pros.length > 0) || (api.cons && api.cons.length > 0) && (
                      <div className="grid md:grid-cols-2 gap-6">
                        {api.pros && api.pros.length > 0 && (
                          <div>
                            <h4 className="font-bold text-green-600 dark:text-green-400 mb-3">
                              Pros
                            </h4>
                            <ul className="space-y-2">
                              {api.pros.map((pro, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                                    {pro}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {api.cons && api.cons.length > 0 && (
                          <div>
                            <h4 className="font-bold text-red-600 dark:text-red-400 mb-3">
                              Cons
                            </h4>
                            <ul className="space-y-2">
                              {api.cons.map((con, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                                    {con}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "pricing" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        Pricing Information
                      </h3>
                      <Badge className={`${pricingColors[api.pricing_model]} text-white text-lg px-4 py-2`}>
                        {api.pricing_model.charAt(0).toUpperCase() + api.pricing_model.slice(1)}
                      </Badge>
                    </div>

                    {api.free_tier_limits && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-700">
                        <h4 className="font-bold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                          <Zap className="w-5 h-5" />
                          Free Tier
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          {api.free_tier_limits}
                        </p>
                      </div>
                    )}

                    {api.pricing_details && (
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                          Pricing Details
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {api.pricing_details}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "examples" && (
                  <div className="space-y-6">
                    {api.endpoint_examples && api.endpoint_examples.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                          API Endpoints
                        </h3>
                        <div className="space-y-4">
                          {api.endpoint_examples.map((example, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-gray-900 dark:text-white">
                                  {example.name}
                                </span>
                                <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                  {example.method}
                                </Badge>
                              </div>
                              <code className="block bg-gray-900 dark:bg-gray-950 text-green-400 p-3 rounded-lg text-sm font-mono mb-2 overflow-x-auto">
                                {example.endpoint}
                              </code>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {example.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {api.code_examples && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                          Code Examples
                        </h3>
                        {Object.entries(api.code_examples).map(([lang, code]) => (
                          <div key={lang} className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-gray-900 dark:text-white capitalize">
                                {lang}
                              </h4>
                              <button
                                onClick={() => copyToClipboard(code)}
                                className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                              >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copied!" : "Copy"}
                              </button>
                            </div>
                            <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-xl overflow-x-auto">
                              <code>{code}</code>
                            </pre>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "tutorial" && (
                  <div>
                    {api.tutorial_content ? (
                      <ReactMarkdown
                        className="prose prose-lg dark:prose-invert max-w-none"
                        components={{
                          h1: ({children}) => <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">{children}</h1>,
                          h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 mt-6">{children}</h2>,
                          h3: ({children}) => <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 mt-4">{children}</h3>,
                          p: ({children}) => <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{children}</p>,
                          code: ({inline, children}) => 
                            inline ? (
                              <code className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-sm">
                                {children}
                              </code>
                            ) : (
                              <code className="block bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-xl overflow-x-auto mb-4">
                                {children}
                              </code>
                            ),
                        }}
                      >
                        {api.tutorial_content}
                      </ReactMarkdown>
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          No Tutorial Available
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Check the official documentation for integration guides
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}