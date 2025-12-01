import React from "react";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "./LanguageContext";

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  
  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
        >
          <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 glass border border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-2xl p-2 max-h-96 overflow-y-auto"
      >
        <div className="px-3 py-2 mb-2 border-b border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-3 h-3" />
            Choose Language
          </p>
        </div>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer rounded-xl p-3 transition-all ${
              language === lang.code 
                ? 'bg-blue-50 dark:bg-blue-900/30' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <span className={`text-sm font-semibold ${
                  language === lang.code 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {lang.name}
                </span>
              </div>
              {language === lang.code && (
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}