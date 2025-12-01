
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  Search, 
  MessageCircle, 
  Terminal,
  Map,
  Zap,
  CheckCircle,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ONBOARDING_STEPS = [
  {
    id: "welcome",
    title: "Welcome to NetNapz! 👋",
    description: "Your AI-powered hub for discovering the best no-code tools, creating project roadmaps, and building faster.",
    icon: Sparkles,
    type: "modal",
    features: [
      "🔍 AI-Powered Search & Recommendations",
      "🗺️ Personalized Project Roadmaps",
      "💻 Napz Coding Terminal",
      "🎨 AI Image Generator",
      "💬 24/7 AI Assistant"
    ]
  },
  {
    id: "ai-search",
    title: "Ask NetNapz Anything",
    description: "Our AI scans the web in real-time to answer your questions about no-code tools, AI solutions, and tech resources.",
    icon: Search,
    type: "spotlight",
    target: ".onboarding-search-bar",
    position: "bottom",
    tryIt: "Try asking: 'Best no-code tools for building a marketplace?'"
  },
  {
    id: "ai-assistant",
    title: "Your Personal AI Assistant",
    description: "Chat with NetNapz AI for personalized tool recommendations and expert advice. Click the bot icon in the bottom right!",
    icon: MessageCircle,
    type: "spotlight",
    target: ".onboarding-chatbot",
    position: "left"
  },
  {
    id: "napz-tools",
    title: "Napz AI Tools",
    description: "Access our powerful AI coding terminal and image generator to bring your ideas to life instantly!",
    icon: Terminal,
    type: "spotlight",
    target: ".onboarding-napz-tools",
    position: "bottom"
  },
  {
    id: "roadmaps",
    title: "Create Project Roadmaps",
    description: "Chat with our AI to create personalized, step-by-step roadmaps for your projects with recommended tools.",
    icon: Map,
    type: "spotlight",
    target: ".onboarding-roadmaps",
    position: "bottom"
  },
  {
    id: "complete",
    title: "You're All Set! 🚀",
    description: "You now know the essentials. Start exploring, ask questions, and build amazing things!",
    icon: CheckCircle,
    type: "modal",
    tips: [
      "💡 Use the AI search bar for instant answers",
      "🤖 Chat with the AI assistant for recommendations",
      "🗺️ Create roadmaps to plan your projects",
      "⚡ Explore 150+ curated tools in our directory"
    ]
  }
];

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [targetElement, setTargetElement] = useState(null);

  // Removed auto-start - users can manually start from Settings
  // useEffect(() => {
  //   const hasCompletedOnboarding = localStorage.getItem("netnapz_onboarding_completed");
  //   if (!hasCompletedOnboarding) {
  //     setTimeout(() => {
  //       setIsActive(true);
  //     }, 1000);
  //   }
  // }, []);

  useEffect(() => {
    if (isActive) {
      const step = ONBOARDING_STEPS[currentStep];
      if (step.type === "spotlight" && step.target) {
        // Find and highlight target element
        const element = document.querySelector(step.target);
        setTargetElement(element);
      } else {
        setTargetElement(null);
      }
    }
  }, [currentStep, isActive]);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    localStorage.setItem("netnapz_onboarding_completed", "true");
    setIsActive(false);
    toast.success("Welcome to NetNapz! Enjoy exploring!");
  };

  // This restartOnboarding is internal to the component, not the exported one
  // The exported one will reload the page, while this one just resets state
  const restartOnboarding = () => {
    localStorage.removeItem("netnapz_onboarding_completed");
    setCurrentStep(0);
    setIsActive(true);
  };

  if (!isActive) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const StepIcon = step.icon;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  // Calculate spotlight position
  const getSpotlightStyle = () => {
    if (!targetElement) return {};
    
    const rect = targetElement.getBoundingClientRect();
    return {
      top: rect.top - 10,
      left: rect.left - 10,
      width: rect.width + 20,
      height: rect.height + 20,
    };
  };

  // Calculate tooltip position
  const getTooltipStyle = () => {
    if (!targetElement) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    
    const rect = targetElement.getBoundingClientRect();
    const tooltipWidth = 400; // Fixed width for tooltip
    // Estimate tooltip height based on content or use a reasonable default
    // For more accurate positioning, especially for top/bottom, calculate dynamically or ensure enough space
    const tooltipHeight = 300; 
    
    let top, left, transform;
    
    switch (step.position) {
      case "bottom":
        top = rect.bottom + 30;
        left = rect.left + rect.width / 2;
        transform = "translateX(-50%)";
        break;
      case "left":
        top = rect.top + rect.height / 2;
        left = rect.left - tooltipWidth - 30;
        transform = "translateY(-50%)";
        break;
      case "right":
        top = rect.top + rect.height / 2;
        left = rect.right + 30;
        transform = "translateY(-50%)";
        break;
      case "top": // Added top position for completeness, though not used in ONBOARDING_STEPS currently
        top = rect.top - tooltipHeight - 30; 
        left = rect.left + rect.width / 2;
        transform = "translateX(-50%)";
        break;
      default: // Default to bottom if position is not specified or invalid
        top = rect.bottom + 30;
        left = rect.left + rect.width / 2;
        transform = "translateX(-50%)";
        break;
    }
    
    return { top, left, transform };
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999]">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={step.type === "modal" ? null : handleSkip}
        />

        {/* Spotlight for target element */}
        {step.type === "spotlight" && targetElement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute pointer-events-none"
            style={getSpotlightStyle()}
          >
            <div className="absolute inset-0 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] border-4 border-blue-500 animate-pulse"></div>
          </motion.div>
        )}

        {/* Tooltip / Modal */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="absolute"
          style={step.type === "spotlight" ? getTooltipStyle() : { 
            top: "50%", 
            left: "50%", 
            transform: "translate(-50%, -50%)" 
          }}
        >
          <div className={`bg-white dark:bg-gray-900 rounded-3xl border-2 border-blue-500/50 shadow-2xl overflow-hidden ${
            step.type === "modal" ? "w-[500px]" : "w-[400px]"
          }`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDE2em0wLTh2Mkgy')] opacity-30"></div>
              
              <div className="relative flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <StepIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white mb-1">
                      {step.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-white/80">
                      <span>Step {currentStep + 1} of {ONBOARDING_STEPS.length}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleSkip}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {step.description}
              </p>

              {/* Features List */}
              {step.features && (
                <div className="space-y-3 mb-6">
                  {step.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Tips List */}
              {step.tips && (
                <div className="space-y-2 mb-6">
                  {step.tips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3"
                    >
                      <span>{tip}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Try It Prompt */}
              {step.tryIt && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4 mb-6 border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-start gap-2">
                    <Play className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                        Try It Now!
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {step.tryIt}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {ONBOARDING_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? "w-8 bg-gradient-to-r from-blue-600 to-purple-600"
                        : index < currentStep
                        ? "w-2 bg-green-500"
                        : "w-2 bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3">
                {!isFirstStep && (
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>
                )}
                
                {isFirstStep && (
                  <Button
                    onClick={handleSkip}
                    variant="ghost"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    Skip Tutorial
                  </Button>
                )}

                <Button
                  onClick={handleNext}
                  className={`ml-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2 ${
                    isFirstStep ? "flex-1" : ""
                  }`}
                >
                  {isLastStep ? (
                    <>
                      Get Started
                      <Zap className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Export function to restart onboarding (can be called from settings/help)
export function restartOnboarding() {
  localStorage.removeItem("netnapz_onboarding_completed");
  window.location.reload();
}
