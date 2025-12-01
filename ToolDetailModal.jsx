 import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Star, 
  ExternalLink, 
  ThumbsUp,
  MessageSquare,
  Crown,
  Sparkles,
  Send,
  Loader2,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function ToolDetailModal({ tool, isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
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

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", tool?.id],
    queryFn: () => tool ? base44.entities.Review.filter({ tool_id: tool.id }, "-created_date") : [],
    enabled: !!tool && isOpen,
  });

  const { data: userReview } = useQuery({
    queryKey: ["userReview", tool?.id, user?.email],
    queryFn: () => user && tool ? base44.entities.Review.filter({ 
      tool_id: tool.id, 
      user_email: user.email 
    }).then(reviews => reviews[0]) : null,
    enabled: !!user && !!tool && isOpen,
  });

  const submitReviewMutation = useMutation({
    mutationFn: (reviewData) => base44.entities.Review.create(reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["userReview"] });
      setUserRating(0);
      setReviewText("");
      toast.success("Review submitted successfully!");
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: ({ reviewId, data }) => base44.entities.Review.update(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["userReview"] });
      toast.success("Review updated!");
    },
  });

  const toggleHelpful = (review) => {
    if (!user) {
      toast.error("Please login to mark reviews as helpful");
      return;
    }

    const hasMarked = review.helpful_by?.includes(user.email);
    const newHelpfulBy = hasMarked
      ? review.helpful_by.filter((email) => email !== user.email)
      : [...(review.helpful_by || []), user.email];
    const newCount = hasMarked ? review.helpful_count - 1 : review.helpful_count + 1;

    updateReviewMutation.mutate({
      reviewId: review.id,
      data: {
        helpful_by: newHelpfulBy,
        helpful_count: newCount,
      },
    });
  };

  const handleSubmitReview = () => {
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    setSubmitting(true);

    if (userReview) {
      // Update existing review
      updateReviewMutation.mutate(
        {
          reviewId: userReview.id,
          data: {
            rating: userRating,
            review_text: reviewText,
          },
        },
        {
          onSettled: () => setSubmitting(false),
        }
      );
    } else {
      // Create new review
      submitReviewMutation.mutate(
        {
          tool_id: tool.id,
          tool_name: tool.name,
          user_email: user.email,
          user_name: user.full_name || "Anonymous",
          rating: userRating,
          review_text: reviewText,
          verified_user: user.subscription_tier === "premium",
        },
        {
          onSettled: () => setSubmitting(false),
        }
      );
    }
  };

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100 
      : 0,
  }));

  // Sort reviews by helpful count
  const sortedReviews = [...reviews].sort((a, b) => b.helpful_count - a.helpful_count);

  // Load existing review into form if it exists
  useEffect(() => {
    if (userReview) {
      setUserRating(userReview.rating);
      setReviewText(userReview.review_text);
    } else {
      setUserRating(0);
      setReviewText("");
    }
  }, [userReview, isOpen]);

  if (!isOpen || !tool) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="glass rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl max-w-5xl w-full my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 p-8 sticky top-0 z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                {/* Logo */}
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  {tool.logo_url ? (
                    <img src={tool.logo_url} alt={`${tool.name} logo`} className="w-14 h-14 object-contain rounded-xl" />
                  ) : (
                    <Sparkles className="w-10 h-10 text-purple-500" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-black text-white">{tool.name}</h2>
                    {tool.is_premium && <Crown className="w-6 h-6 text-amber-400" />}
                  </div>
                  <p className="text-white/90 mb-4">{tool.description}</p>
                  
                  {/* Rating Summary */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(avgRating)
                                ? "text-amber-400 fill-current"
                                : "text-white/30"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white font-bold text-lg">{avgRating}</span>
                      <span className="text-white/80 text-sm">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
                    </div>
                    
                    <a 
                      href={tool.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white font-semibold"
                    >
                      Visit Website
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors text-white flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 p-8">
            {/* Left Column - Details & Write Review */}
            <div className="lg:col-span-1 space-y-6">
              {/* Tool Details */}
              <div className="glass rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  Details
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Pricing
                    </p>
                    <Badge className={`${
                      tool.pricing === 'free' ? 'bg-green-500' :
                      tool.pricing === 'freemium' ? 'bg-blue-500' :
                      'bg-purple-500'
                    } text-white`}>
                      {tool.pricing === 'freemium' ? 'Free Trial' : tool.pricing.toUpperCase()}
                    </Badge>
                  </div>

                  {tool.tags && tool.tags.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Tags
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tool.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="glass rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  Rating Distribution
                </h3>
                <div className="space-y-2">
                  {ratingCounts.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8">
                        {rating}★
                      </span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Write Review */}
              <div className="glass rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-500" />
                  {userReview ? 'Edit Your Review' : 'Write a Review'}
                </h3>

                {user ? (
                  <div className="space-y-4">
                    {/* Star Rating */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Rating
                      </p>
                      <div className="flex gap-2" role="radiogroup" aria-label="Rate from 1 to 5 stars">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setUserRating(rating)}
                            className="transition-transform hover:scale-110"
                            aria-label={`Rate ${rating} ${rating === 1 ? 'star' : 'stars'}`}
                            role="radio"
                            aria-checked={userRating === rating}
                          >
                            <Star
                              className={`w-8 h-8 ${
                                rating <= userRating
                                  ? "text-amber-400 fill-current"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Review Text */}
                    <div>
                      <label htmlFor="review-text-input" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Your Review
                      </label>
                      <Textarea
                        id="review-text-input"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience with this tool..."
                        className="min-h-[120px]"
                        aria-label="Review text"
                      />
                    </div>

                    <Button
                      onClick={handleSubmitReview}
                      disabled={submitting || userRating === 0 || !reviewText.trim()}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {userReview ? 'Update Review' : 'Submit Review'}
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Login to write a review
                    </p>
                    <Button
                      onClick={() => base44.auth.redirectToLogin()}
                      variant="outline"
                    >
                      Login
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Reviews */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-purple-500" />
                User Reviews
              </h3>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                </div>
              ) : sortedReviews.length === 0 ? (
                <div className="text-center py-12 glass rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                  <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No reviews yet. Be the first to review this tool!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedReviews.map((review, index) => {
                    const isHelpful = user && review.helpful_by?.includes(user.email);
                    
                    return (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6"
                      >
                        {/* Review Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold">
                                {review.user_name?.charAt(0).toUpperCase() || '?'}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-gray-900 dark:text-white">
                                  {review.user_name}
                                </span>
                                {review.verified_user && (
                                  <Badge className="bg-purple-500 text-white text-xs">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Premium
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex" role="img" aria-label={`${review.rating} out of 5 stars`}>
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? "text-amber-400 fill-current"
                                          : "text-gray-300 dark:text-gray-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDistanceToNow(new Date(review.created_date), { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Review Text */}
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                          {review.review_text}
                        </p>

                        {/* Helpful Button */}
                        <button
                          onClick={() => toggleHelpful(review)}
                          disabled={!user}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                            isHelpful
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                          aria-label={`Mark review as helpful. ${review.helpful_count} ${review.helpful_count === 1 ? 'person has' : 'people have'} found this helpful`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${isHelpful ? 'fill-current' : ''}`} />
                          Helpful ({review.helpful_count})
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}