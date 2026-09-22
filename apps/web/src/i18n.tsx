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
    importingMedia: "Importing media...",
    dropFiles: "Drop files to import",
    largeIcons: "Large icons",
    smallIcons: "Small icons",
    listView: "List view",
    mediaDescription: "Import footage, audio, and stills.",
    textDescription: "Add titles and text elements.",
    graphicsDescription: "Create shapes, arrows, and graphic overlays.",
    recipesDescription: "Apply reusable looks and edit stacks.",
    templatesDescription: "Load full-project starter layouts and presets.",
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
    backHome: "Back to Home",
    shortcutsHint: "Press ? for shortcuts",
    theme: "Theme",
    projectJson: "Project JSON - Export/Import",
    keyframeEditor: "Keyframe Editor",
    audioMixer: "Audio Mixer – track volume and master level",
    undoRedo: "History - Undo/Redo",
    screenRecording: "Screen Recording",
    bestMatch: "Best Match",
    estimated: "Est.",
    borderRadius: "Border Radius",
    fitMode: "Fit Mode",
    clickToSelect: "Click to select",
    locked: "Locked",
    free: "Free",
    lockAspect: "Lock aspect ratio",
    unlockAspect: "Unlock aspect ratio",
    delete: "Delete",
    replaceAsset: "Replace asset",
    addToTimeline: "Add to timeline",
    importedMedia: "Imported media",
    mediaLibrary: "Project Media",
    background: "Background",
    ideaTitle: "What do you want to create?",
    ideaSubtitle: "Describe the project in a few words. Frameo will use it as the project name; nothing is sent anywhere.",
    ideaPlaceholder: "Example: Short character animation for Instagram...",
    continue: "Continue",
    skip: "Skip",
    editVideoIdea: "Edit a video",
    socialIdea: "Social media video",
    montageIdea: "Montage / reel",
    animationIdea: "Animation",
    chooseFormat: "Choose the canvas format",

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
    importingMedia: "Importando medios...",
    dropFiles: "Suelta los archivos para importarlos",
    largeIcons: "Iconos grandes",
    smallIcons: "Iconos pequeños",
    listView: "Vista de lista",
    mediaDescription: "Importa video, audio e imágenes.",
    textDescription: "Añade títulos y elementos de texto.",
    graphicsDescription: "Crea formas, flechas y elementos gráficos.",
    recipesDescription: "Aplica estilos y pilas de edición reutilizables.",
    templatesDescription: "Carga diseños y ajustes iniciales de proyecto.",
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
    backHome: "Volver al inicio",
    shortcutsHint: "Pulsa ? para ver atajos",
    theme: "Tema",
    projectJson: "JSON del proyecto - Exportar/Importar",
    keyframeEditor: "Editor de fotogramas clave",
    audioMixer: "Mezclador de audio – volumen de pistas y nivel maestro",
    undoRedo: "Historial - Deshacer/Rehacer",
    screenRecording: "Grabación de pantalla",
    bestMatch: "Mejor opción",
    estimated: "Est.",
    borderRadius: "Radio de borde",
    fitMode: "Modo de ajuste",
    clickToSelect: "Haz clic para seleccionar",
    locked: "Bloqueado",
    free: "Libre",
    lockAspect: "Bloquear proporción",
    unlockAspect: "Desbloquear proporción",
    delete: "Eliminar",
    replaceAsset: "Reemplazar recurso",
    addToTimeline: "Añadir a la línea de tiempo",
    importedMedia: "Medios importados",
    mediaLibrary: "Medios del proyecto",
    background: "Fondo",
    ideaTitle: "¿Qué quieres crear?",
    ideaSubtitle: "Describe el proyecto en pocas palabras. Frameo lo usará como nombre del proyecto; no se envía a ningún servidor.",
    ideaPlaceholder: "Ejemplo: Animación corta de personaje para Instagram...",
    continue: "Continuar",
    skip: "Omitir",
    editVideoIdea: "Editar un video",
    socialIdea: "Video para redes",
    montageIdea: "Montaje / reel",
    animationIdea: "Animación",
    chooseFormat: "Elige el formato del canvas",

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
