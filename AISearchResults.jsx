import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, X, ExternalLink, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function AISearchResults({ query, answer, isLoading, onClose }) {
  if (!query && !isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative w-full max-w-4xl glass rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-8">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDE2em0wLTh2Mkgy')] opacity-30"></div>
            
            <div className="relative flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm font-bold text-white/90 uppercase tracking-wider">
                      AI-Powered Answer
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white leading-tight">
                    {query}
                  </h2>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm ml-4"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-900 p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Scanning the web...
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                  NetNapz AI is searching through millions of sources to find you the best answer
                </p>
                <div className="flex items-center gap-2 mt-6">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            ) : answer ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Answer Found
                  </span>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 mt-6">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 mt-4">{children}</h3>,
                      p: ({ children }) => <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300">{children}</ol>,
                      li: ({ children }) => <li className="ml-4">{children}</li>,
                      strong: ({ children }) => <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>,
                      em: ({ children }) => <em className="italic text-gray-800 dark:text-gray-200">{children}</em>,
                      a: ({ href, children }) => (
                        <a 
                          href={href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline inline-flex items-center gap-1"
                        >
                          {children}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ),
                      code: ({ inline, children }) => 
                        inline ? (
                          <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded text-sm font-mono">
                            {children}
                          </code>
                        ) : (
                          <code className="block p-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm font-mono overflow-x-auto mb-4">
                            {children}
                          </code>
                        ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-purple-500 pl-4 py-2 my-4 bg-purple-50 dark:bg-purple-900/20 rounded-r-lg">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {answer}
                  </ReactMarkdown>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-700/50">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Powered by NetNapz AI
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        This answer was generated by scanning the web in real-time. Always verify important information from official sources.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Have another question? Just ask!
              </p>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Got it, thanks!
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}