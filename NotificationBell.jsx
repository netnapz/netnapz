import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check, UserPlus, Heart, MessageCircle, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function NotificationBell({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.email],
    queryFn: () => user ? base44.entities.Notification.filter({ 
      user_email: user.email 
    }, "-created_date", 20) : [],
    enabled: !!user,
    refetchInterval: 60000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) => base44.entities.Notification.update(notificationId, { is_read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unread = notifications.filter(n => !n.is_read);
      await Promise.all(unread.map(n => base44.entities.Notification.update(n.id, { is_read: true })));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "friend_request":
      case "friend_accepted":
        return UserPlus;
      case "comment":
      case "comment_reply":
        return MessageCircle;
      case "review_like":
      case "comment_like":
        return Heart;
      case "new_tool":
        return Star;
      default:
        return Bell;
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsReadMutation.mutate(notification.id);
    }
    if (notification.link) {
      setIsOpen(false);
      window.location.href = notification.link;
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 z-40"
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-96 max-h-[600px] glass rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl z-50 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg">Notifications</h3>
                  <p className="text-white/80 text-xs">
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllAsReadMutation.mutate()}
                      className="text-white/80 hover:text-white text-xs font-semibold"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[500px]">
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  <div>
                    {notifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type);
                      
                      return (
                        <motion.button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left ${
                            !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              notification.type.includes('friend') ? 'bg-blue-100 dark:bg-blue-900/30' :
                              notification.type.includes('comment') ? 'bg-green-100 dark:bg-green-900/30' :
                              notification.type.includes('like') ? 'bg-red-100 dark:bg-red-900/30' :
                              'bg-purple-100 dark:bg-purple-900/30'
                            }`}>
                              <Icon className={`w-5 h-5 ${
                                notification.type.includes('friend') ? 'text-blue-600 dark:text-blue-400' :
                                notification.type.includes('comment') ? 'text-green-600 dark:text-green-400' :
                                notification.type.includes('like') ? 'text-red-600 dark:text-red-400' :
                                'text-purple-600 dark:text-purple-400'
                              }`} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p className={`font-bold text-sm ${
                                  !notification.is_read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {notification.title}
                                </p>
                                {!notification.is_read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {formatDistanceToNow(new Date(notification.created_date), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}