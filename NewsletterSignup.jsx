import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsLoading(false);
    setEmail("");
    
    // Reset after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 md:p-12 overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">
                Join 5,000+ Subscribers
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated with New Tools
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Get weekly updates on the latest no-code tools, AI innovations, and exclusive guides delivered to your inbox.
            </p>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 px-6 py-6 bg-white/95 dark:bg-white/90 text-gray-900 border-0 rounded-xl text-base"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 rounded-xl font-semibold whitespace-nowrap"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Subscribing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Subscribe
                      </span>
                    )}
                  </Button>
                </div>
                <p className="text-white/80 text-sm mt-4">
                  No spam. Unsubscribe anytime. We respect your privacy.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-3 py-4"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
                <p className="text-xl font-semibold text-white">
                  Thanks for subscribing!
                </p>
                <p className="text-white/90">
                  Check your inbox for a confirmation email.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}