import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Translation data
const translations = {
  en: {
    // Navigation
    nav_home: "Home",
    nav_community: "Community",
    nav_roadmaps: "Roadmaps",
    nav_pricing: "Pricing",
    nav_ai_tools: "AI Tools",
    nav_coding_terminal: "Coding Terminal",
    nav_image_generator: "Image Generator",
    
    // Hero
    hero_badge: "150+ Premium Resources • AI-Powered Search",
    hero_title_1: "Build Anything.",
    hero_title_2: "Ship Faster.",
    hero_subtitle: "Ask anything about",
    hero_subtitle_nocode: "no-code platforms",
    hero_subtitle_ai: "AI solutions",
    hero_subtitle_tech: "tech resources",
    hero_subtitle_end: "NetNapz scans the web for answers.",
    hero_search_placeholder: "Ask NetNapz anything... Try: 'Best no-code tools for building a marketplace?'",
    hero_ask_button: "Ask NetNapz",
    hero_try_asking: "Try asking:",
    
    // AI Assistant CTA
    ai_assistant_title: "Chat with NetNapz AI Assistant",
    ai_assistant_description: "Get personalized tool recommendations, create project roadmaps, and get expert advice on no-code & AI solutions",
    ai_assistant_feature_1: "🔍 Tool Discovery",
    ai_assistant_feature_2: "🗺️ Project Roadmaps",
    ai_assistant_feature_3: "💡 Expert Advice",
    ai_assistant_cta: "Start Chat",
    
    // Stats
    stats_platforms: "Platforms",
    stats_categories: "Categories",
    stats_creators: "Creators",
    stats_updates: "Updates",
    stats_weekly: "Weekly",
    
    // Sections
    featured_title: "Featured Selections",
    featured_subtitle: "Premium picks from our expert curation team",
    directory_title: "Complete Directory",
    directory_verified: "Verified & Curated",
    loading: "Loading premium content...",
    no_matches: "No matches found",
    try_different: "Try adjusting your search terms or explore different categories",
    
    // Tool Card
    tool_verified: "Verified",
    tool_learn_more: "Learn More",
    tool_free_trial: "Free Trial",
    tool_free: "Free",
    tool_paid: "Paid",
    
    // Pricing
    pricing_badge: "Simple Pricing",
    pricing_title: "Choose Your",
    pricing_subtitle: "AI Power Level",
    pricing_description: "Start free, upgrade when you need more power. No hidden fees, cancel anytime.",
    pricing_free_name: "Free",
    pricing_free_desc: "Perfect for trying out our AI tools",
    pricing_premium_name: "Premium",
    pricing_premium_desc: "Unlimited AI power for serious creators",
    pricing_popular: "⭐ Most Popular",
    pricing_current: "Current Plan",
    pricing_upgrade: "Upgrade Now",
    pricing_login: "Login to Get Started",
    pricing_per_month: "per month",
    pricing_forever: "forever",
    
    // Pricing Features
    feature_ai_searches: "AI searches",
    feature_images: "image generations",
    feature_code: "code generations",
    feature_messages: "chatbot messages",
    feature_per_day: "per day",
    feature_per_month: "per month",
    feature_priority: "Priority support",
    feature_early_access: "Early access to new features",
    feature_no_watermark: "No watermarks",
    feature_commercial: "Commercial use license",
    feature_roadmaps: "Custom project roadmaps",
    feature_analytics: "Advanced analytics",
    feature_directory: "Access to tool directory",
    feature_community: "Community support",
    
    // FAQ
    faq_title: "Frequently Asked Questions",
    faq_cancel_q: "Can I cancel anytime?",
    faq_cancel_a: "Yes! Cancel your premium subscription at any time. No questions asked.",
    faq_limits_q: "What happens when I hit my limits?",
    faq_limits_a: "Free tier limits reset daily at midnight UTC. Premium limits reset monthly. You'll be notified when approaching your limit.",
    faq_enough_q: "Are 500 AI searches really enough?",
    faq_enough_a: "Absolutely! That's 16-17 searches per day. Our data shows 98% of premium users stay well under these limits. Plus, you get 300 image generations and 400 code generations monthly!",
    faq_commercial_q: "What's included with commercial use license?",
    faq_commercial_a: "Use all AI-generated content (code, images, text) in your commercial projects without watermarks or attribution requirements.",
    
    // Community
    community_badge: "Community Hub",
    community_title: "Connect with",
    community_subtitle: "Fellow Builders",
    community_description: "Share your projects, get help, and connect with creators building amazing things with no-code and AI",
    community_messages: "Messages",
    community_members: "Members",
    community_chat_title: "Community Chat",
    community_online: "online now",
    community_placeholder: "Share your thoughts, ask for help, or just say hi... (Ctrl+Enter to send)",
    community_be_respectful: "Be respectful and supportive",
    community_send: "Send",
    community_start_conversation: "Start the Conversation",
    community_first_message: "Be the first to share your thoughts, ask questions, or introduce yourself!",
    community_join: "Join the Conversation",
    community_login_description: "Login to share your thoughts and connect with the community",
    community_login: "Login to Post",
    community_login_required: "Please login to post messages",
    community_login_to_like: "Please login to like messages",
    
    // Roadmaps
    roadmaps_badge: "Your Project Roadmaps",
    roadmaps_title: "Project",
    roadmaps_subtitle: "Roadmaps",
    roadmaps_description: "Track your progress and achieve your goals step by step",
    roadmaps_create: "Create Roadmap",
    roadmaps_total: "Total Roadmaps",
    roadmaps_in_progress: "In Progress",
    roadmaps_completed: "Completed",
    roadmaps_none_title: "No Roadmaps Yet",
    roadmaps_none_description: "Chat with NetNapz AI to create your first personalized project roadmap",
    roadmaps_create_first: "Create Your First Roadmap",
    roadmaps_step: "Step",
    roadmaps_recommended_tools: "Recommended Tools:",
    roadmaps_completed_ago: "Completed",
    roadmaps_start: "Start",
    roadmaps_pause: "Pause",
    roadmaps_close: "Close",
    roadmaps_login_title: "Login to Access Roadmaps",
    roadmaps_login_description: "Sign in to create and track your personalized project roadmaps",
    roadmaps_login: "Login Now",
    
    // Status
    status_planning: "Planning",
    status_in_progress: "In Progress",
    status_completed: "Completed",
    status_on_hold: "On Hold",
    
    // Terminal
    terminal_title: "NAPZ CODING TERMINAL",
    terminal_subtitle: "Full-Stack AI Code Generator",
    terminal_memory: "MEMORY",
    terminal_clear: "CLEAR",
    terminal_welcome: "Welcome to Napz Coding Terminal!",
    terminal_description: "I'm your full-stack code writer with conversation memory. Tell me what you want to build!",
    terminal_placeholder: "$ describe what you want to build... (Ctrl/Cmd + Enter)",
    terminal_run: "RUN",
    terminal_generating: "Generating code with context...",
    terminal_copy: "Code copied to clipboard!",
    terminal_download: "Code downloaded!",
    terminal_free_notice: "Free tier includes watermarks.",
    terminal_upgrade: "Upgrade",
    
    // Image Generator
    image_gen_title: "NAPZ IMAGE GENERATOR",
    image_gen_subtitle: "AI-Powered Image Creation Studio",
    image_gen_badge: "AI-Powered",
    image_gen_hero_title: "Transform Words",
    image_gen_hero_subtitle: "Into Stunning Art",
    image_gen_hero_description: "Describe your vision and watch AI bring it to life in seconds",
    image_gen_label: "Describe Your Image",
    image_gen_placeholder: "A serene Japanese garden with cherry blossoms, koi pond, and traditional bridge at golden hour...",
    image_gen_generate: "Generate Image",
    image_gen_generating: "Generating Magic...",
    image_gen_examples: "Example Prompts",
    image_gen_preview: "Generated Image",
    image_gen_download: "Download",
    image_gen_awaits: "Your Canvas Awaits",
    image_gen_awaits_desc: "Describe what you want to see and let AI create it for you",
    image_gen_creating: "Creating Your Masterpiece",
    image_gen_painting: "AI is painting your vision...",
    image_gen_free_notice: "Free tier images include a watermark.",
    
    // Footer
    footer_tagline: "Your premium destination for discovering the world's best no-code platforms, AI innovations, and digital solutions.",
    footer_quick_links: "Quick Links",
    footer_explore: "Explore Directory",
    footer_legal: "Legal",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Service",
    footer_copyright: "NetNapz Knowledge Hub. Crafted with precision for creators worldwide.",
    footer_updated: "Updated Weekly",
    
    // Notifications
    toast_copied: "copied to clipboard!",
    toast_success: "Success!",
    toast_error: "Error",
    toast_login_required: "Please login to use this feature",
    
    // Common
    login: "Login",
    logout: "Logout",
    close: "Close",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    search: "Search",
    filter: "Filter",
    all: "All",
    new: "NEW",
    or: "or",
    and: "and",
  },
  
  es: {
    // Navigation
    nav_home: "Inicio",
    nav_community: "Comunidad",
    nav_roadmaps: "Hojas de Ruta",
    nav_pricing: "Precios",
    nav_ai_tools: "Herramientas IA",
    nav_coding_terminal: "Terminal de Código",
    nav_image_generator: "Generador de Imágenes",
    
    // Hero
    hero_badge: "150+ Recursos Premium • Búsqueda con IA",
    hero_title_1: "Construye Cualquier Cosa.",
    hero_title_2: "Lanza Más Rápido.",
    hero_subtitle: "Pregunta sobre",
    hero_subtitle_nocode: "plataformas no-code",
    hero_subtitle_ai: "soluciones IA",
    hero_subtitle_tech: "recursos tecnológicos",
    hero_subtitle_end: "NetNapz escanea la web por respuestas.",
    hero_search_placeholder: "Pregunta a NetNapz... Ej: '¿Mejores herramientas no-code para un marketplace?'",
    hero_ask_button: "Preguntar a NetNapz",
    hero_try_asking: "Prueba preguntar:",
    
    // AI Assistant CTA
    ai_assistant_title: "Chatea con el Asistente IA NetNapz",
    ai_assistant_description: "Obtén recomendaciones personalizadas, crea hojas de ruta de proyectos y recibe asesoramiento experto",
    ai_assistant_feature_1: "🔍 Descubrimiento de Herramientas",
    ai_assistant_feature_2: "🗺️ Hojas de Ruta",
    ai_assistant_feature_3: "💡 Asesoramiento Experto",
    ai_assistant_cta: "Iniciar Chat",
    
    // Stats
    stats_platforms: "Plataformas",
    stats_categories: "Categorías",
    stats_creators: "Creadores",
    stats_updates: "Actualizaciones",
    stats_weekly: "Semanales",
    
    // Sections
    featured_title: "Selecciones Destacadas",
    featured_subtitle: "Selecciones premium de nuestro equipo experto",
    directory_title: "Directorio Completo",
    directory_verified: "Verificado y Curado",
    loading: "Cargando contenido premium...",
    no_matches: "No se encontraron coincidencias",
    try_different: "Intenta ajustar tus términos de búsqueda o explorar diferentes categorías",
    
    // Tool Card
    tool_verified: "Verificado",
    tool_learn_more: "Más Información",
    tool_free_trial: "Prueba Gratis",
    tool_free: "Gratis",
    tool_paid: "Pago",
    
    // Pricing
    pricing_badge: "Precios Simples",
    pricing_title: "Elige Tu",
    pricing_subtitle: "Nivel de Poder IA",
    pricing_description: "Comienza gratis, actualiza cuando necesites más poder. Sin tarifas ocultas, cancela en cualquier momento.",
    pricing_free_name: "Gratis",
    pricing_free_desc: "Perfecto para probar nuestras herramientas IA",
    pricing_premium_name: "Premium",
    pricing_premium_desc: "Poder IA ilimitado para creadores serios",
    pricing_popular: "⭐ Más Popular",
    pricing_current: "Plan Actual",
    pricing_upgrade: "Actualizar Ahora",
    pricing_login: "Inicia Sesión para Comenzar",
    pricing_per_month: "por mes",
    pricing_forever: "para siempre",
    
    // Community
    community_badge: "Centro Comunitario",
    community_title: "Conecta con",
    community_subtitle: "Otros Constructores",
    community_description: "Comparte proyectos, obtén ayuda y conecta con creadores construyendo cosas increíbles",
    community_messages: "Mensajes",
    community_members: "Miembros",
    community_chat_title: "Chat Comunitario",
    community_online: "en línea ahora",
    community_placeholder: "Comparte tus pensamientos, pide ayuda o saluda... (Ctrl+Enter para enviar)",
    community_be_respectful: "Sé respetuoso y solidario",
    community_send: "Enviar",
    community_start_conversation: "Inicia la Conversación",
    community_first_message: "¡Sé el primero en compartir, hacer preguntas o presentarte!",
    
    // Common
    login: "Iniciar Sesión",
    logout: "Cerrar Sesión",
    close: "Cerrar",
    cancel: "Cancelar",
    save: "Guardar",
    delete: "Eliminar",
    edit: "Editar",
    search: "Buscar",
    filter: "Filtrar",
    all: "Todos",
    new: "NUEVO",
  },
  
  fr: {
    // Navigation
    nav_home: "Accueil",
    nav_community: "Communauté",
    nav_roadmaps: "Feuilles de Route",
    nav_pricing: "Tarifs",
    nav_ai_tools: "Outils IA",
    nav_coding_terminal: "Terminal de Code",
    nav_image_generator: "Générateur d'Images",
    
    // Hero
    hero_badge: "150+ Ressources Premium • Recherche IA",
    hero_title_1: "Construisez N'importe Quoi.",
    hero_title_2: "Expédiez Plus Vite.",
    hero_subtitle: "Posez des questions sur",
    hero_subtitle_nocode: "plateformes no-code",
    hero_subtitle_ai: "solutions IA",
    hero_subtitle_tech: "ressources tech",
    hero_subtitle_end: "NetNapz scanne le web pour des réponses.",
    hero_search_placeholder: "Demandez à NetNapz... Ex: 'Meilleurs outils no-code pour un marketplace?'",
    hero_ask_button: "Demander à NetNapz",
    
    // Stats
    stats_platforms: "Plateformes",
    stats_categories: "Catégories",
    stats_creators: "Créateurs",
    stats_updates: "Mises à Jour",
    stats_weekly: "Hebdomadaires",
    
    // Common
    login: "Se Connecter",
    logout: "Se Déconnecter",
    close: "Fermer",
    cancel: "Annuler",
    save: "Sauvegarder",
    new: "NOUVEAU",
  },
  
  de: {
    // Navigation
    nav_home: "Startseite",
    nav_community: "Community",
    nav_roadmaps: "Roadmaps",
    nav_pricing: "Preise",
    nav_ai_tools: "KI-Tools",
    
    // Hero
    hero_title_1: "Baue Alles.",
    hero_title_2: "Versende Schneller.",
    hero_search_placeholder: "Frage NetNapz... Z.B: 'Beste No-Code-Tools für einen Marktplatz?'",
    hero_ask_button: "NetNapz Fragen",
    
    // Common
    login: "Anmelden",
    logout: "Abmelden",
    new: "NEU",
  },
  
  zh: {
    // Navigation
    nav_home: "首页",
    nav_community: "社区",
    nav_roadmaps: "路线图",
    nav_pricing: "定价",
    nav_ai_tools: "AI工具",
    
    // Hero
    hero_title_1: "构建任何东西。",
    hero_title_2: "更快发布。",
    hero_search_placeholder: "问NetNapz... 例如：'构建市场的最佳无代码工具？'",
    hero_ask_button: "询问NetNapz",
    
    // Common
    login: "登录",
    logout: "登出",
    new: "新",
  },
  
  ar: {
    // Navigation
    nav_home: "الرئيسية",
    nav_community: "المجتمع",
    nav_roadmaps: "خرائط الطريق",
    nav_pricing: "الأسعار",
    nav_ai_tools: "أدوات الذكاء الاصطناعي",
    
    // Hero
    hero_title_1: "ابنِ أي شيء.",
    hero_title_2: "أطلق بشكل أسرع.",
    hero_search_placeholder: "اسأل NetNapz... مثال: 'أفضل أدوات no-code لبناء سوق؟'",
    hero_ask_button: "اسأل NetNapz",
    
    // Common
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    new: "جديد",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [direction, setDirection] = useState('ltr');

  useEffect(() => {
    // Auto-detect browser language on mount
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0]; // Get base language code
    
    // Check if we support this language
    if (translations[langCode]) {
      setLanguage(langCode);
    }
    
    // Load saved preference
    const savedLang = localStorage.getItem('netnapz_language');
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    // Set text direction based on language
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    const isRTL = rtlLanguages.includes(language);
    setDirection(isRTL ? 'rtl' : 'ltr');
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Save preference
    localStorage.setItem('netnapz_language', language);
  }, [language]);

  const t = (key, fallback) => {
    return translations[language]?.[key] || translations['en']?.[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, direction }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}