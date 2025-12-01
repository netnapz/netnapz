import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Send, 
  Mail, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Bug,
  Lightbulb,
  CreditCard,
  Wrench,
  MessageSquare,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function Contact() {
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue_type: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        name: currentUser.full_name || "",
        email: currentUser.email || ""
      }));
    } catch (error) {
      setUser(null);
    }
  };

  const issueTypes = [
    { value: "bug_report", label: "Bug Report", icon: Bug, color: "text-red-500" },
    { value: "feature_request", label: "Feature Request", icon: Lightbulb, color: "text-yellow-500" },
    { value: "billing_issue", label: "Billing Issue", icon: CreditCard, color: "text-green-500" },
    { value: "technical_support", label: "Technical Support", icon: Wrench, color: "text-blue-500" },
    { value: "general_inquiry", label: "General Inquiry", icon: MessageSquare, color: "text-purple-500" },
    { value: "feedback", label: "Feedback", icon: Heart, color: "text-pink-500" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.issue_type || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get browser info
      const browserInfo = `${navigator.userAgent} | ${window.screen.width}x${window.screen.height}`;

      // Create submission in database
      await base44.entities.ContactSubmission.create({
        name: formData.name,
        email: formData.email,
        issue_type: formData.issue_type,
        subject: formData.subject,
        message: formData.message,
        user_email: user?.email || formData.email,
        browser_info: browserInfo,
        priority: formData.issue_type === "billing_issue" ? "high" : "medium",
        status: "new"
      });

      // Send email notification to admin
      const issueTypeLabel = issueTypes.find(t => t.value === formData.issue_type)?.label || formData.issue_type;
      
      await base44.integrations.Core.SendEmail({
        from_name: "NetNapz Contact Form",
        to: "support@netnapz.com",
        subject: `[NetNapz Support] ${issueTypeLabel}: ${formData.subject}`,
        body: `
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #dc2626 0%, #e11d48 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0;">NetNapz Support</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">New Contact Submission</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Contact Details</h2>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${formData.email}" style="color: #dc2626; text-decoration: none;">${formData.email}</a></p>
      <p><strong>Type:</strong> <span style="background: #fee2e2; padding: 4px 12px; border-radius: 20px; font-weight: bold; color: #dc2626;">${issueTypeLabel}</span></p>
      <p><strong>Subject:</strong> ${formData.subject}</p>
      ${user ? `<p><strong>User Account:</strong> ${user.email} ${user.subscription_tier ? `<span style="background: #fce7f3; padding: 2px 8px; border-radius: 12px; font-size: 12px; color: #be185d;">${user.subscription_tier.toUpperCase()}</span>` : ''}</p>` : '<p><strong>User Status:</strong> <span style="color: #999;">Not logged in</span></p>'}
      <p><strong>Priority:</strong> <span style="background: ${formData.issue_type === "billing_issue" ? '#fef2f2' : '#fff7ed'}; padding: 4px 12px; border-radius: 20px; font-weight: bold; color: ${formData.issue_type === "billing_issue" ? '#dc2626' : '#ea580c'};">${formData.issue_type === "billing_issue" ? 'HIGH' : 'MEDIUM'}</span></p>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Message</h2>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626;">
        <p style="white-space: pre-wrap; margin: 0; line-height: 1.6;">${formData.message}</p>
      </div>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Technical Info</h2>
      <p style="font-size: 12px; color: #666; margin: 5px 0;"><strong>Browser:</strong> ${browserInfo}</p>
      <p style="font-size: 12px; color: #666; margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      <p style="font-size: 12px; color: #666; margin: 5px 0;"><strong>Referrer:</strong> ${typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
    </div>
    
    <div style="text-align: center; margin-top: 20px; padding: 20px; background: linear-gradient(135deg, #fef2f2 0%, #fce7f3 100%); border-radius: 12px; border: 2px solid #dc2626;">
      <p style="margin: 0 0 15px 0; color: #dc2626; font-weight: bold; font-size: 16px;">💡 Quick Actions</p>
      <a href="mailto:${formData.email}?subject=Re: ${encodeURIComponent(formData.subject)}" style="display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 5px;">
        📧 Reply to Customer
      </a>
      <p style="margin: 15px 0 0 0; font-size: 12px; color: #666;">View in Dashboard: <strong>Data → ContactSubmission</strong></p>
    </div>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #999; font-size: 11px;">
    <p style="margin: 0;">NetNapz Support System • Powered by Base44</p>
  </div>
</body>
</html>
        `
      });

      // Success!
      setSubmitted(true);
      toast.success("Message sent successfully! We'll get back to you soon.");
      
      // Reset form after a delay
      setTimeout(() => {
        setFormData({
          name: user?.full_name || "",
          email: user?.email || "",
          issue_type: "",
          subject: "",
          message: ""
        });
        setSubmitted(false);
      }, 5000);

    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to send message. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50/30 to-pink-50/30 relative overflow-hidden">
      {/* White Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#DC262608_1px,transparent_1px),linear-gradient(to_bottom,#DC262608_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-500/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-32 relative z-10 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-100 rounded-full mb-6">
            <MessageCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-bold text-red-600 uppercase tracking-wider">
              Get in Touch
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6">
            Contact
            <span className="block mt-2 bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">
              Support
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have an issue, question, or feedback? We're here to help! Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl border border-green-500/30 p-12 text-center shadow-lg"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Message Sent!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for contacting us. We've received your message and will get back to you within 24 hours.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-red-200/50 p-8 shadow-lg space-y-6">
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-red-600" />
                  Contact Form
                </h2>

                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="John Doe"
                    className="border-red-200 focus:border-red-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="john@example.com"
                    className="border-red-200 focus:border-red-500"
                    required
                  />
                </div>

                {/* Issue Type */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    What can we help you with? <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.issue_type}
                    onValueChange={(value) => handleChange("issue_type", value)}
                    required
                  >
                    <SelectTrigger className="border-red-200 focus:border-red-500 text-gray-900">
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <span className="flex items-center gap-2">
                              <Icon className={`w-4 h-4 ${type.color}`} />
                              {type.label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    placeholder="Brief description of your issue"
                    className="border-red-200 focus:border-red-500"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="Please describe your issue or question in detail..."
                    className="border-red-200 focus:border-red-500 min-h-[160px]"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white h-14 rounded-xl font-bold text-lg shadow-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <Send className="w-5 h-5" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            )}
          </motion.div>

          {/* Right Side - Info & FAQs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Quick Info */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-red-200/50 p-8 shadow-lg">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Quick Info</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Email Response Time</h4>
                    <p className="text-sm text-gray-600">We typically respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Urgent Issues</h4>
                    <p className="text-sm text-gray-600">Select "Billing Issue" for priority support</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Account Verified</h4>
                    <p className="text-sm text-gray-600">
                      {user ? "Logged in users get priority support" : "Login for faster response"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Issue Type Guide */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-red-200/50 p-8 shadow-lg">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Choose the Right Type</h3>
              
              <div className="space-y-4">
                {issueTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div key={type.value} className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 ${type.color} flex-shrink-0 mt-0.5`} />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{type.label}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {type.value === "bug_report" && "Something's not working correctly"}
                          {type.value === "feature_request" && "Suggest a new feature or improvement"}
                          {type.value === "billing_issue" && "Questions about payments or subscriptions"}
                          {type.value === "technical_support" && "Need help using NetNapz"}
                          {type.value === "general_inquiry" && "General questions about the platform"}
                          {type.value === "feedback" && "Share your thoughts and suggestions"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Alternative Contact */}
            <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-3xl border border-red-200/50 p-8 shadow-lg">
              <h3 className="text-xl font-black text-gray-900 mb-4">Other Ways to Reach Us</h3>
              <p className="text-sm text-gray-600 mb-4">
                Prefer email? You can also reach us directly at:
              </p>
              <a
                href="mailto:support@netnapz.com"
                className="text-red-600 hover:text-red-700 font-bold flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                support@netnapz.com
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}