import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Map, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Target,
  ExternalLink,
  PlayCircle,
  PauseCircle,
  TrendingUp,
  Sparkles,
  Loader2,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { createPageUrl } from "@/utils";

// Ensure Badge component is available
if (!Badge) {
  console.error('Badge component not loaded!');
}

export default function Roadmaps() {
  const [user, setUser] = useState(null);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const handleLogin = () => {
    window.location.href = createPageUrl("Login") + "?next=" + encodeURIComponent(window.location.pathname);
  };

  const { data: roadmaps = [], isLoading } = useQuery({
    queryKey: ["roadmaps", user?.email],
    queryFn: () => user ? base44.entities.ProjectRoadmap.filter({ user_email: user.email }, "-created_date") : [],
    enabled: !!user,
  });

  const updateStepMutation = useMutation({
    mutationFn: ({ roadmapId, updatedSteps, progress }) => 
      base44.entities.ProjectRoadmap.update(roadmapId, { 
        steps: updatedSteps,
        overall_progress: progress
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
      toast.success("Progress updated!");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ roadmapId, status }) => 
      base44.entities.ProjectRoadmap.update(roadmapId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
      toast.success("Status updated!");
    },
  });

  const toggleStepCompletion = (roadmap, stepIndex) => {
    const updatedSteps = roadmap.steps.map((step, idx) => {
      if (idx === stepIndex) {
        return {
          ...step,
          is_completed: !step.is_completed,
          completed_date: !step.is_completed ? new Date().toISOString() : null
        };
      }
      return step;
    });

    const completedSteps = updatedSteps.filter(s => s.is_completed).length;
    const progress = Math.round((completedSteps / updatedSteps.length) * 100);

    updateStepMutation.mutate({
      roadmapId: roadmap.id,
      updatedSteps,
      progress
    });
  };

  const openChatbot = () => {
    // Trigger the chatbot to open
    const chatbotButton = document.querySelector('.onboarding-chatbot');
    if (chatbotButton) {
      chatbotButton.click();
      // Wait a moment then add a helpful message context
      setTimeout(() => {
        toast.info("💬 Ask NetNapz AI to create a project roadmap for you!");
      }, 500);
    } else {
      toast.error("Chatbot not available. Please refresh the page.");
    }
  };

  const statusConfig = {
    planning: { color: "bg-blue-500", label: "Planning", icon: Target },
    in_progress: { color: "bg-indigo-500", label: "In Progress", icon: PlayCircle },
    completed: { color: "bg-green-500", label: "Completed", icon: CheckCircle2 },
    on_hold: { color: "bg-gray-500", label: "On Hold", icon: PauseCircle }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-3 md:px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-2xl">
            <Map className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3 md:mb-4">
            Login Required
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6 px-4">
            Sign in to create and track roadmaps
          </p>
          <Button
            onClick={handleLogin}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-11 md:h-12 px-8 rounded-full shadow-lg font-bold"
          >
            Login Now
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* 📱 APP-STYLE Hero */}
      <section className="pt-20 md:pt-32 pb-6 md:pb-12 px-3 md:px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 md:mb-8"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full border border-indigo-500/30 shadow-sm">
                <Target className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs md:text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Your Roadmaps
                </span>
              </div>

              <Button
                onClick={openChatbot}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-9 md:h-12 px-4 md:px-6 rounded-full shadow-lg text-xs md:text-base font-bold active:scale-95 transition-transform"
              >
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden md:inline">Create New</span>
              </Button>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-2 md:mb-4 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Project Roadmaps
              </span>
            </h1>

            <p className="text-sm md:text-xl text-gray-600 dark:text-gray-400">
              Track your progress, achieve your goals
            </p>
          </motion.div>

          {/* 📱 APP-STYLE Stats */}
          {roadmaps.length > 0 && (
            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-3 md:p-6 shadow-lg"
              >
                <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1 md:mb-2">
                  {roadmaps.length}
                </div>
                <div className="text-xs md:text-sm font-bold text-gray-600 dark:text-gray-400">
                  Total
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-3 md:p-6 shadow-lg"
              >
                <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1 md:mb-2">
                  {roadmaps.filter(r => r.status === 'in_progress').length}
                </div>
                <div className="text-xs md:text-sm font-bold text-gray-600 dark:text-gray-400">
                  Active
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-3 md:p-6 shadow-lg"
              >
                <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1 md:mb-2">
                  {roadmaps.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-xs md:text-sm font-bold text-gray-600 dark:text-gray-400">
                  Done
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* 📱 MOBILE-OPTIMIZED Roadmaps List */}
      <section className="pb-6 md:pb-12 px-3 md:px-4">
        <div className="container mx-auto max-w-7xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 md:py-24">
              <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-emerald-500 animate-spin" />
            </div>
          ) : roadmaps.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 md:py-24"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-8 shadow-xl">
                <Map className="w-12 h-12 md:w-16 md:h-16 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3 md:mb-4">
                No Roadmaps Yet
              </h2>
              <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-4 md:mb-8 px-4">
                Create your first AI-powered project roadmap
              </p>
              <Button
                onClick={openChatbot}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-11 md:h-12 px-8 rounded-full shadow-lg font-bold"
              >
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Create Roadmap
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              <AnimatePresence>
                {roadmaps.map((roadmap, index) => {
                  const StatusIcon = statusConfig[roadmap.status]?.icon || Target;
                  const completedSteps = roadmap.steps.filter(s => s.is_completed).length;

                  return (
                    <motion.div
                      key={roadmap.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedRoadmap(roadmap)}
                      className="group bg-white dark:bg-gray-900 rounded-2xl md:rounded-3xl border border-gray-200 dark:border-gray-800 p-4 md:p-6 shadow-xl active:scale-[0.98] md:hover:shadow-2xl md:hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                      {/* Header */}
                      <div className="mb-3 md:mb-4">
                        <h3 className="text-base md:text-xl font-black text-gray-900 dark:text-white mb-1.5 md:mb-2 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all line-clamp-2">
                          {roadmap.project_name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {roadmap.project_description}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4 flex-wrap">
                        <Badge className={`${statusConfig[roadmap.status]?.color} text-white border-0 flex items-center gap-1 text-xs`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig[roadmap.status]?.label}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                          <Clock className="w-3 h-3" />
                          <span className="hidden md:inline">{roadmap.target_completion}</span>
                          <span className="md:hidden">{roadmap.target_completion.split(' ')[0]}</span>
                        </Badge>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2 mb-3 md:mb-4">
                        <div className="flex items-center justify-between text-xs md:text-sm">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            {completedSteps}/{roadmap.steps.length} completed
                          </span>
                          <span className="font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {roadmap.overall_progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 shadow-inner">
                          <div
                            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500 shadow-lg"
                            style={{ width: `${roadmap.overall_progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-800">
                        <span className="truncate font-medium">{formatDistanceToNow(new Date(roadmap.created_date), { addSuffix: true })}</span>
                        <Badge variant="outline" className="text-xs">
                          {roadmap.steps.length} steps
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* 📱 MOBILE-OPTIMIZED Roadmap Detail Modal */}
      <AnimatePresence>
        {selectedRoadmap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRoadmap(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-t-3xl md:rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl max-w-4xl w-full md:my-8 max-h-[95vh] md:max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-5 md:p-8 sticky top-0 z-10 rounded-t-3xl md:rounded-t-3xl">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-3xl font-black text-white mb-2 line-clamp-2">
                      {selectedRoadmap.project_name}
                    </h2>
                    <p className="text-white/90 mb-3 md:mb-4 text-sm md:text-base line-clamp-2 md:line-clamp-none leading-relaxed">
                      {selectedRoadmap.project_description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`${statusConfig[selectedRoadmap.status]?.color} text-white border-0 text-xs shadow-md`}>
                        {statusConfig[selectedRoadmap.status]?.label}
                      </Badge>
                      <Badge className="bg-white/20 text-white border-0 text-xs backdrop-blur-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {selectedRoadmap.target_completion}
                      </Badge>
                      <Badge className="bg-white/20 text-white border-0 text-xs font-black backdrop-blur-sm">
                        {selectedRoadmap.overall_progress}% Complete
                      </Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRoadmap(null)}
                    className="w-9 h-9 md:w-10 md:h-10 bg-white/20 hover:bg-white/30 active:scale-95 rounded-2xl flex items-center justify-center transition-all text-white text-xl md:text-2xl font-bold flex-shrink-0 backdrop-blur-sm"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Steps */}
              <div className="p-4 md:p-8 space-y-3 md:space-y-6">
                {selectedRoadmap.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 p-4 md:p-6 transition-all ${
                      step.is_completed
                        ? 'border-green-500/50 bg-green-50 dark:bg-green-900/20 shadow-md'
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-500/50'
                    }`}
                  >
                    {/* Step Number & Status */}
                    <div className="flex items-start gap-3 md:gap-4">
                      <button
                        onClick={() => toggleStepCompletion(selectedRoadmap, index)}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all active:scale-90 ${
                          step.is_completed
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-indigo-500 hover:text-white'
                        }`}
                      >
                        {step.is_completed ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-3 mb-2">
                          <h3 className={`text-sm md:text-lg font-bold ${
                            step.is_completed 
                              ? 'line-through text-gray-500 dark:text-gray-400'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            Step {step.step_number}: {step.title}
                          </h3>
                          <Badge variant="outline" className="text-xs w-fit">
                            <Clock className="w-3 h-3 mr-1" />
                            {step.estimated_duration}
                          </Badge>
                        </div>

                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4 leading-relaxed">
                          {step.description}
                        </p>

                        {/* Recommended Tools */}
                        {step.recommended_tools && step.recommended_tools.length > 0 && (
                          <div className="space-y-2 mt-3">
                            <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              Recommended:
                            </p>
                            <div className="space-y-2">
                              {step.recommended_tools.map((tool, toolIndex) => (
                                <div
                                  key={toolIndex}
                                  className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-2.5 md:p-3 border border-indigo-200/50 dark:border-indigo-700/30"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-gray-900 dark:text-white text-xs md:text-sm truncate">
                                        {tool.tool_name}
                                      </p>
                                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {tool.reason}
                                      </p>
                                    </div>
                                    {tool.tool_id && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-indigo-600 hover:text-indigo-700 h-8 w-8 p-0 flex-shrink-0"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Completed Date */}
                        {step.is_completed && step.completed_date && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            ✓ {formatDistanceToNow(new Date(step.completed_date), { addSuffix: true })}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-900/80 p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 rounded-b-3xl md:rounded-b-3xl backdrop-blur-sm">
                <div className="flex gap-2">
                  <Button
                    onClick={() => updateStatusMutation.mutate({ 
                      roadmapId: selectedRoadmap.id, 
                      status: 'in_progress' 
                    })}
                    disabled={selectedRoadmap.status === 'in_progress'}
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10 md:h-11 text-xs md:text-sm font-bold rounded-xl active:scale-95 transition-transform"
                  >
                    <PlayCircle className="w-4 h-4 mr-1.5 md:mr-2" />
                    Start
                  </Button>
                  <Button
                    onClick={() => updateStatusMutation.mutate({ 
                      roadmapId: selectedRoadmap.id, 
                      status: 'on_hold' 
                    })}
                    disabled={selectedRoadmap.status === 'on_hold'}
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10 md:h-11 text-xs md:text-sm font-bold rounded-xl active:scale-95 transition-transform"
                  >
                    <PauseCircle className="w-4 h-4 mr-1.5 md:mr-2" />
                    Pause
                  </Button>
                  <Button 
                    onClick={() => setSelectedRoadmap(null)}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-10 md:h-11 rounded-xl shadow-lg font-bold active:scale-95 transition-transform"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}