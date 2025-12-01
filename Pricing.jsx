/**
 * NetNapz Article Page - Enhanced with Full Content Support
 * © 2025 NetNapz. All Rights Reserved.
 * UPDATED: Now properly displays full content from homepage articles
 */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Calendar, User, Eye, Heart, MessageCircle, 
  Share2, BookOpen, Tag, Clock, ExternalLink,
  Facebook, Twitter, Link, Mail, Home,
  TrendingUp, Users as UsersIcon, Zap, Crown, Music,
  Sparkles, Star, Rocket, Shield, Database, FileText
} from "lucide-react";

// Article Comments Component
const ArticleComments = ({ articleId, comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;

    const comment = {
      id: Date.now().toString(),
      user: userName,
      text: newComment,
      timestamp: new Date().toLocaleDateString(),
      likes: 0,
      liked: false
    };

    onAddComment(articleId, comment);
    setNewComment('');
    setUserName('');
  };

  const handleLikeComment = (articleId, commentId) => {
    onAddComment(articleId, null, commentId);
  };

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-2xl font-black text-gray-900">Comments ({comments.length})</h4>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-medium"
            required
          />
          <textarea
            placeholder="Add your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm font-medium"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm"
            >
              Post Comment
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">{comment.user}</h5>
                    <span className="text-sm text-gray-500">{comment.timestamp}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4 leading-relaxed">{comment.text}</p>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleLikeComment(articleId, comment.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    comment.liked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${comment.liked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{comment.likes}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to handle adding comments
  const handleAddComment = (articleId, newComment, commentIdToLike = null) => {
    if (newComment) {
      setArticle(prev => ({
        ...prev,
        userComments: [newComment, ...(prev.userComments || [])],
        comments: (parseInt(prev.comments || 0) + 1).toString()
      }));
    } else if (commentIdToLike) {
      setArticle(prev => ({
        ...prev,
        userComments: prev.userComments.map(comment => 
          comment.id === commentIdToLike 
            ? { 
                ...comment, 
                likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
                liked: !comment.liked
              }
            : comment
        )
      }));
    }
  };

  // Load article data
  useEffect(() => {
    const loadArticle = async () => {
      setIsLoading(true);
      
      try {
        // Get from sessionStorage (from homepage click)
        const savedArticle = sessionStorage.getItem('currentArticle');
        if (savedArticle) {
          const articleData = JSON.parse(savedArticle);
          console.log('📄 Loading article in viewer:', {
            title: articleData.title,
            has_full_content: !!articleData.fullContent,
            hasFullContent: articleData.hasFullContent,
            is_manual: articleData.is_manual,
            source: articleData.source,
            description_length: articleData.description?.length,
            fullContent_length: articleData.fullContent?.length
          });
          setArticle(articleData);
          setIsLoading(false);
          return;
        }

        // If no article found, navigate home
        setTimeout(() => {
          setIsLoading(false);
          navigate('/');
        }, 1000);
        
      } catch (error) {
        console.error('Error loading article:', error);
        setIsLoading(false);
        navigate('/');
      }
    };

    loadArticle();
  }, [slug, navigate]);

  // Share functions
  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnTwitter = () => {
    const text = article?.title || 'Check out this article on NetNapz';
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const shareViaEmail = () => {
    const subject = article?.title || 'NetNapz Article';
    const body = `Check out this article: ${article?.title}\n\n${window.location.href}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      'music': Music,
      'creators': UsersIcon,
      'drama': MessageCircle,
      'viral': Share2,
      'sports': Crown,
      'finance': Zap,
      'tech': Rocket,
      'success': Star,
      'breaking': TrendingUp,
      'trending': TrendingUp
    };
    return icons[category] || BookOpen;
  };

  // Check if article has enhanced/full content
  const hasEnhancedContent = (article) => {
    if (!article) return false;
    
    // Check for full content from homepage
    if (article.hasFullContent && article.fullContent) return true;
    
    // Manual articles have full content
    if (article.is_manual && article.fullContent) return true;
    
    // Legacy support for AI-researched articles
    if (article.is_researched && article.enhanced_content) return true;
    
    return false;
  };

  // Format content with proper paragraphs
  const formatContent = (content) => {
    if (!content) return '';
    
    // If it's already HTML content (manual articles)
    if (content.includes('<h2>') || content.includes('<p>') || content.includes('<ul>')) {
      return (
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    
    // Split by double newlines for paragraphs
    if (content.includes('\n\n')) {
      return content.split('\n\n').map((paragraph, index) => (
        <p key={index} className="mb-6 leading-relaxed text-gray-800 text-lg">
          {paragraph}
        </p>
      ));
    }
    
    // Single paragraph for shorter content
    return <p className="leading-relaxed text-gray-800 text-lg">{content}</p>;
  };

  // Handle external link clicks with affiliate conversion
  const handleExternalLinkClick = async (url, event) => {
    event.preventDefault();
    
    try {
      // Convert to affiliate link
      const response = await fetch('/api/sovrn-convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          tool_id: article?.id,
          tool_name: article?.title
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          window.open(data.affiliate_link, '_blank');
          return;
        }
      }
      
      // Fallback to original URL
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error converting affiliate link:', error);
      window.open(url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-gray-900 mb-2">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isEnhanced = article.hasFullContent || article.is_researched;
  const isManual = article.is_manual;
  const hasFullContent = hasEnhancedContent(article);
  const CategoryIcon = getCategoryIcon(article.category);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to News
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">NN</span>
              </div>
              <span className="font-black text-gray-900">NetNapz</span>
            </div>

            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
            >
              <Home className="w-5 h-5" />
              Home
            </button>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Category and Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span className="bg-red-600 text-white px-3 py-1.5 rounded-full font-semibold text-xs flex items-center gap-1">
              <CategoryIcon className="w-3 h-3" />
              {article.category?.toUpperCase() || 'NEWS'}
            </span>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {article.timestamp || new Date().toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {article.author || 'NetNapz News'}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {article.readTime || '5 min read'}
            </div>
            {hasFullContent && (
              <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                FULL STORY
              </span>
            )}
            {isManual && (
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <FileText className="w-3 h-3" />
                MANUAL
              </span>
            )}
            {article.is_researched && (
              <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                AI-ENHANCED
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>

          {/* Description - Only show if we don't have full content */}
          {!hasFullContent && (
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-medium mb-8">
              {article.description}
            </p>
          )}

          {/* Engagement Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-b border-gray-200 py-4">
            <span className="flex items-center gap-2 font-medium">
              <Eye className="w-4 h-4" />
              {article.views || '0'} views
            </span>
            <span className="flex items-center gap-2 font-medium">
              <Heart className="w-4 h-4" />
              {article.likes || '0'} likes
            </span>
            <span className="flex items-center gap-2 font-medium">
              <MessageCircle className="w-4 h-4" />
              {article.comments || '0'} comments
            </span>
          </div>
        </motion.header>

        {/* Featured Image */}
        {(article.image || article.image_url) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 rounded-xl overflow-hidden relative"
          >
            <img 
              src={article.image || article.image_url} 
              alt={article.title}
              className="w-full h-auto max-h-96 object-cover"
            />
            {article.logo_stamp && (
              <div className="absolute bottom-4 right-4">
                <div className="w-12 h-12 bg-black/80 rounded-full p-1">
                  <img 
                    src={article.logo_stamp} 
                    alt="NetNapz" 
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Article Body - UPDATED FOR NEW CONTENT STRUCTURE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          {hasFullContent ? (
            /* FULL CONTENT ARTICLES - FROM HOMEPAGE */
            <div className="text-gray-800 leading-relaxed space-y-8">
              {/* Full Content */}
              <div className="prose prose-lg max-w-none">
                {formatContent(article.fullContent)}
              </div>
              
              {/* Key Facts Section (for AI articles) */}
              {article.key_facts && article.key_facts.length > 0 && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-600 p-6 rounded-r-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">🔍 Key Facts You Should Know</h3>
                      <p className="text-red-700">AI-researched additional insights</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {article.key_facts.map((fact, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-600 font-bold mr-3 mt-1">•</span>
                        <span className="text-gray-700 text-lg">{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Full Content Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-green-900">Full Article Content</h4>
                    <p className="text-green-700 text-sm">
                      {article.is_researched 
                        ? "This article has been researched and enhanced with AI to provide additional context, facts, and insights beyond the original source."
                        : "This is the complete article content pulled from RSS feeds and enhanced for better readability."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* REGULAR ARTICLES - ORIGINAL CONTENT WITH EXTERNAL LINK */
            <div className="text-gray-800 leading-relaxed space-y-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  {article.description}
                </p>
              </div>

              {article.url && article.url !== '#' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-blue-900">Read Full Story</h4>
                      <p className="text-blue-700 text-sm">
                        This is a summary from {article.source || 'our news partners'}. 
                        Read the complete story at the original source.
                      </p>
                    </div>
                  </div>
                  
                  <a 
                    href={article.affiliateUrl || article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Read Full Story on {article.source || 'Original Source'}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-200">
            {hasFullContent ? (
              <>
                <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Full Content
                </span>
                <span className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Enhanced Readability
                </span>
                {article.is_researched && (
                  <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    AI-Researched
                  </span>
                )}
                {article.tags && article.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    #{tag}
                  </span>
                ))}
              </>
            ) : (
              <>
                <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {article.source || 'News Partner'}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  News Summary
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Source Available
                </span>
              </>
            )}
          </div>
        </motion.div>

        {/* Share Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-xl p-6 mb-12"
        >
          <h3 className="text-lg font-black text-gray-900 mb-4">Share This Article</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={shareOnFacebook}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </button>
            <button
              onClick={shareOnTwitter}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </button>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              <Link className="w-4 h-4" />
              Copy Link
            </button>
            <button
              onClick={shareViaEmail}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
          </div>
        </motion.section>

        {/* Comments Section */}
        <ArticleComments 
          articleId={article.id}
          comments={article.userComments || []}
          onAddComment={handleAddComment}
        />
      </article>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white font-black text-xs">NN</span>
              </div>
              <span className="text-xl font-black">NetNapz Entertainment</span>
            </div>
            <p className="text-gray-400 mb-6">
              Your daily source for music charts, creator drama, and viral entertainment news
            </p>
            <div className="text-sm text-gray-500">
              © 2025 NetNapz. All entertainment news, all the time. Daily 9 AM auto-refresh with RSS + MediaStack.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}