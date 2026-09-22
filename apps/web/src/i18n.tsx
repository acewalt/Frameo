import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "es" | "en";

const messages = {
  en: {
    appName: "Frameo",
    loadingEditor: "Loading editor...",
    newProject: "New Project",
    verticalProject: "New Vertical Video",
    horizontalProject: "New Horizontal Video",
    squareProject: "New Square Video",
    back: "Back",
    templates: "Templates",
    recentProjects: "Recent Projects",
    tagline: "From idea to export.",
    inBrowser: "In your browser.",
    pickFormat: "Pick a format and start creating. You can change this anytime.",
    vertical: "Vertical",
    horizontal: "Horizontal",
    square: "Square",
    startCreating: "Start creating",
    browseTemplates: "Browse templates",
    openEditor: "Open editor",
    skipStartup: "Skip on startup",
    language: "Language",
    english: "English",
    spanish: "Español",
    media: "Media",
    text: "Text",
    graphics: "Graphics",
    effects: "Effects",
    transitions: "Transitions",
    recipes: "Recipes",
    projectTemplates: "Project Templates",
    import: "Import",
    record: "Record",
    searchMedia: "Search media",
    addMedia: "Add media",
    player: "Player",
    noSelection: "No selection",
    selectClip: "Select a clip to view its properties",
    export: "Export",
    settings: "Settings",
    history: "History",
    transform: "Transform",
    position: "Position",
    scale: "Scale",
    rotation: "Rotation",
    opacity: "Opacity",
    addTrack: "Add track",
    initializing: "Initializing editor...",
    searchTools: "Search tools and effects...",
    searchSelected: "Search effects for selected clip...",
    exportComplete: "Downloaded!",
    customExport: "Custom Export...",
    editorTour: "Editor Tour",
    animationTour: "Animation & Effects Tour",
  },
  es: {
    appName: "Frameo",
    loadingEditor: "Cargando editor...",
    newProject: "Nuevo proyecto",
    verticalProject: "Nuevo video vertical",
    horizontalProject: "Nuevo video horizontal",
    squareProject: "Nuevo video cuadrado",
    back: "Volver",
    templates: "Plantillas",
    recentProjects: "Proyectos recientes",
    tagline: "De la idea a la exportación.",
    inBrowser: "En tu navegador.",
    pickFormat: "Elige un formato y empieza a crear. Puedes cambiarlo cuando quieras.",
    vertical: "Vertical",
    horizontal: "Horizontal",
    square: "Cuadrado",
    startCreating: "Empezar a crear",
    browseTemplates: "Ver plantillas",
    openEditor: "Abrir editor",
    skipStartup: "Omitir al iniciar",
    language: "Idioma",
    english: "English",
    spanish: "Español",
    media: "Medios",
    text: "Texto",
    graphics: "Gráficos",
    effects: "Efectos",
    transitions: "Transiciones",
    recipes: "Recetas",
    projectTemplates: "Plantillas de proyecto",
    import: "Importar",
    record: "Grabar",
    searchMedia: "Buscar medios",
    addMedia: "Añadir medio",
    player: "Reproductor",
    noSelection: "Sin selección",
    selectClip: "Selecciona un clip para ver sus propiedades",
    export: "Exportar",
    settings: "Ajustes",
    history: "Historial",
    transform: "Transformación",
    position: "Posición",
    scale: "Escala",
    rotation: "Rotación",
    opacity: "Opacidad",
    addTrack: "Añadir pista",
    initializing: "Inicializando editor...",
    searchTools: "Buscar herramientas y efectos...",
    searchSelected: "Buscar efectos para el clip seleccionado...",
    exportComplete: "¡Descargado!",
    customExport: "Exportación personalizada...",
    editorTour: "Recorrido del editor",
    animationTour: "Recorrido de animación y efectos",
  },
} as const;

type MessageKey = keyof typeof messages.en;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: MessageKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("frameo-language");
    if (saved === "es" || saved === "en") return saved;
    return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
  });

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    localStorage.setItem("frameo-language", next);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguage(language === "es" ? "en" : "es"),
    t: (key) => messages[language][key] ?? messages.en[key],
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useI18n = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used inside LanguageProvider");
  return ctx;
};
