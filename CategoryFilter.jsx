import React from "react";
import { motion } from "framer-motion";
import { Blocks, Rocket, Brain, ShoppingCart, BookOpen, Grid3x3 } from "lucide-react";

const categories = [
  { id: "all", name: "All", icon: Grid3x3, color: "emerald", gradient: "from-emerald-500 to-green-600" },
  { id: "no_code_builders", name: "No-Code Builders", icon: Blocks, color: "orange", gradient: "from-orange-500 to-amber-600" },
  { id: "mvp_tools", name: "MVP Solutions", icon: Rocket, color: "cyan", gradient: "from-cyan-500 to-blue-600" },
  { id: "ai_tools", name: "AI Powered", icon: Brain, color: "emerald", gradient: "from-emerald-500 to-teal-600" },
  { id: "dropshipping", name: "E-Commerce", icon: ShoppingCart, color: "orange", gradient: "from-orange-500 to-red-600" },
  { id: "guides", name: "Resources", icon: BookOpen, color: "amber", gradient: "from-amber-500 to-orange-600" },
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <section className="py-12 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Explore by Category
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Handpicked selections across multiple domains
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => onCategoryChange(category.id)}
                className={`group relative flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                  isSelected
                    ? "text-white shadow-2xl scale-105"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-xl hover:scale-105"
                }`}
                style={
                  isSelected
                    ? {
                        background: `linear-gradient(135deg, ${getCategoryColors(category.gradient)})`,
                      }
                    : {}
                }
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${getCategoryColors(category.gradient)})`,
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <div className="relative flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isSelected 
                      ? "bg-white/20" 
                      : "bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold">{category.name}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function getCategoryColors(gradient) {
  const colorMap = {
    "from-emerald-500 to-green-600": "#10B981, #059669",
    "from-orange-500 to-amber-600": "#F97316, #D97706",
    "from-cyan-500 to-blue-600": "#06B6D4, #2563EB",
    "from-emerald-500 to-teal-600": "#10B981, #0D9488",
    "from-orange-500 to-red-600": "#F97316, #DC2626",
    "from-amber-500 to-orange-600": "#F59E0B, #EA580C",
  };
  return colorMap[gradient] || "#10B981, #059669";
}