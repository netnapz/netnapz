import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, Loader2, Map, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { createPageUrl } from "@/utils";

export default function AgentChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user when component mounts
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Load user error:", error);
      setUser(null);
    }
  };

  const addMessage = (text, isUser = false) => {
    setMessages(prev => [...prev, { text, isUser, timestamp: new Date() }]);
  };

  const getResponse = async (userMessage) => {
    try {
      // Call Elite Assistant backend function (same pattern as Terminal & Chatbot)
      const { data } = await base44.functions.invoke('eliteAssistant', {
        messages: messages.concat([{ text: userMessage, isUser: true }])
      });

      if (data.error) {
        return "⚠️ **Error:** " + (data.details || data.error);
      }

      if (!data.response) {
        return "⚠️ **Error:** Invalid response from server. Please try again.";
      }

      return data.response;
    } catch (error) {
      console.error('Elite Assistant error:', error);
      
      let errorMsg = "⚠️ **Error:** ";
      if (error.response?.data?.error) {
        errorMsg += error.response.data.error;
      } else if (error.message) {
        errorMsg += error.message;
      } else {
        errorMsg += "Unable to get response. Please try again.";
      }
      
      toast.error("Assistant failed. Please try again.");
      return errorMsg;
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    if (!user) {
      toast.error("Please login to chat with NetNapz AI");
      return;
    }

    const userMsg = inputValue;
    setInputValue("");
    addMessage(userMsg, true);
    
    setIsTyping(true);
    const response = await getResponse(userMsg);
    setIsTyping(false);
    addMessage(response, false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = createPageUrl("Login") + "?next=" + encodeURIComponent(window.location.pathname);
  };

  // Quick action buttons
  const quickActions = [
    { text: "Create a roadmap for my project", icon: Map },
    { text: "Help me find the right tools", icon: Search },
    { text: "Recommend platforms for an MVP", icon: Sparkles },
  ];

  const handleQuickAction = (text) => {
    setInputValue(text);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center z-50 group hover:shadow-purple-500/50 transition-all duration-300 onboarding-chatbot"
            aria-label="Open NetNapz AI Assistant"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <Bot className="w-7 h-7 text-white relative z-10" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] max-h-[80vh] glass border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">NetNapz AI</h3>
                  <p className="text-xs text-blue-100 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Elite Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
              {!user ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Bot className="w-16 h-16 text-purple-400 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Login to Chat
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    Sign in to get personalized tool recommendations and roadmaps
                  </p>
                  <Button
                    onClick={handleLoginRedirect}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  >
                    Login Now
                  </Button>
                </div>
              ) : messages.length === 0 && !isTyping ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
                    <Bot className="w-10 h-10 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Hello {user.full_name || 'there'}! 👋
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    I'm your elite AI assistant powered by DeepSeek V3.1!
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-blue-500" />
                      <span>Find perfect tools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Map className="w-4 h-4 text-purple-500" />
                      <span>Create intelligent roadmaps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-500" />
                      <span>Get expert advice</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="w-full space-y-2 mt-4">
                    {quickActions.map((action, idx) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleQuickAction(action.text)}
                          className="w-full p-3 text-left bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors text-sm flex items-center gap-2"
                        >
                          <Icon className="w-4 h-4 text-purple-500" />
                          <span className="text-gray-700 dark:text-gray-300">{action.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          msg.isUser
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        {!msg.isUser && (
                          <div className="flex items-center gap-2 mb-2">
                            <Bot className="w-3 h-3 text-purple-500" />
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">NetNapz AI</span>
                          </div>
                        )}
                        {!msg.isUser ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => <p className="text-sm leading-relaxed mb-2">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-sm mb-2">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 text-sm mb-2">{children}</ol>,
                                li: ({ children }) => <li className="text-sm">{children}</li>,
                                h1: ({ children }) => <h1 className="font-bold text-base mt-3 mb-2">{children}</h1>,
                                h2: ({ children }) => <h2 className="font-bold text-sm mt-3 mb-2">{children}</h2>,
                                h3: ({ children }) => <h3 className="font-bold text-sm mt-2 mb-1">{children}</h3>,
                                strong: ({ children }) => <strong className="font-semibold text-purple-600 dark:text-purple-400">{children}</strong>,
                                a: ({ href, children }) => (
                                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">
                                    {children}
                                  </a>
                                ),
                                code: ({ inline, children }) => 
                                  inline ? (
                                    <code className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-mono">
                                      {children}
                                    </code>
                                  ) : (
                                    <code className="block bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs font-mono my-2 overflow-x-auto">
                                      {children}
                                    </code>
                                  ),
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-2xl px-6 py-3 border border-gray-200 dark:border-gray-700">
                        <div className="flex gap-1 items-center">
                          <Bot className="w-4 h-4 text-purple-500 animate-pulse mr-2" />
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              {user ? (
                <>
                  <div className="flex gap-2">
                    <Textarea
                      id="agent-message"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask about tools, roadmaps, or advice..."
                      className="flex-1 rounded-xl border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 min-h-[44px] max-h-[100px] resize-none"
                      rows={1}
                      disabled={isTyping}
                      aria-label="Chat message"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-4 h-[44px]"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    {user.role === 'admin' ? '👑 Admin - Unlimited access' : 'Press Enter to send • Powered by DeepSeek V3.1'}
                  </p>
                </>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Login to start chatting with NetNapz AI
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}