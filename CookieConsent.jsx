import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
        >
          <div className="glass rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-blue-500" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  We value your privacy
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  We use cookies to enhance your browsing experience and analyze site traffic. By clicking "Accept", you consent to our use of cookies.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleAccept}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={handleDecline}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600"
                  >
                    Decline
                  </Button>
                  <a
                    href="#"
                    className="text-sm text-blue-500 hover:underline self-center"
                  >
                    Learn More
                  </a>
                </div>
              </div>

              <button
                onClick={handleDecline}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}