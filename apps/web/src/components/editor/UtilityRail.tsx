import React, { useMemo, useState } from "react";
import {
  Braces,
  Captions,
  Clock3,
  Diamond,
  Home,
  Music2,
  Redo2,
  Search,
  Undo2,
  X,
} from "lucide-react";
import { useRouter } from "../../hooks/use-router";
import { useI18n } from "../../i18n";
import { useProjectStore } from "../../stores/project-store";
import { useUIStore } from "../../stores/ui-store";
import { HistoryPanel } from "./inspector/HistoryPanel";

export const UtilityRail: React.FC = () => {
  const { navigate } = useRouter();
  const { language } = useI18n();
  const [historyOpen, setHistoryOpen] = useState(false);

  const projectModifiedAt = useProjectStore((state) => state.project.modifiedAt);
  const undo = useProjectStore((state) => state.undo);
  const redo = useProjectStore((state) => state.redo);
  const canUndo = useProjectStore((state) => state.canUndo);
  const canRedo = useProjectStore((state) => state.canRedo);

  const {
    openModal,
    keyframeEditorOpen,
    toggleKeyframeEditor,
    panels,
    togglePanel,
  } = useUIStore();

  const historyState = useMemo(
    () => ({ undo: canUndo(), redo: canRedo() }),
    [canUndo, canRedo, projectModifiedAt],
  );

  const labels = language === "es"
    ? {
        home: "Inicio",
        search: "Buscar",
        undo: "Deshacer",
        redo: "Rehacer",
        history: "Historial",
        keyframes: "Editor de keyframes",
        audio: "Mezclador de audio",
        subtitles: "Subtítulos",
        script: "Vista de script",
      }
    : {
        home: "Home",
        search: "Search",
        undo: "Undo",
        redo: "Redo",
        history: "History",
        keyframes: "Keyframe editor",
        audio: "Audio mixer",
        subtitles: "Subtitles",
        script: "Script view",
      };

  const railButton =
    "w-9 h-9 grid place-items-center rounded-lg transition-colors text-text-muted hover:text-text-primary hover:bg-background-tertiary disabled:opacity-25 disabled:pointer-events-none";
  const activeButton = "bg-primary/15 text-primary";

  return (
    <>
      <aside className="w-11 shrink-0 border-r border-border bg-background flex flex-col items-center py-2 gap-1 z-20">
        <button className={railButton} title={labels.home} onClick={() => navigate("welcome")}>
          <Home size={17} />
        </button>
        <button className={railButton} title={labels.search} onClick={() => openModal("search")}>
          <Search size={17} />
        </button>

        <div className="w-5 h-px bg-border my-1" />

        <button
          className={railButton}
          title={`${labels.undo} · Ctrl/Cmd+Z`}
          disabled={!historyState.undo}
          onClick={() => void undo()}
        >
          <Undo2 size={17} />
        </button>
        <button
          className={railButton}
          title={`${labels.redo} · Ctrl/Cmd+Shift+Z`}
          disabled={!historyState.redo}
          onClick={() => void redo()}
        >
          <Redo2 size={17} />
        </button>
        <button
          className={`${railButton} ${historyOpen ? activeButton : ""}`}
          title={labels.history}
          onClick={() => setHistoryOpen((value) => !value)}
        >
          <Clock3 size={17} />
        </button>

        <div className="w-5 h-px bg-border my-1" />

        <button
          className={`${railButton} ${keyframeEditorOpen ? activeButton : ""}`}
          title={labels.keyframes}
          onClick={toggleKeyframeEditor}
        >
          <Diamond size={17} />
        </button>
        <button
          className={`${railButton} ${panels.audioMixer?.visible ? activeButton : ""}`}
          title={labels.audio}
          onClick={() => togglePanel("audioMixer")}
        >
          <Music2 size={17} />
        </button>
        <button
          className={`${railButton} ${panels.subtitles?.visible ? activeButton : ""}`}
          title={labels.subtitles}
          onClick={() => togglePanel("subtitles")}
        >
          <Captions size={17} />
        </button>
        <button
          className={railButton}
          title={labels.script}
          onClick={() => openModal("scriptView")}
        >
          <Braces size={17} />
        </button>
      </aside>

      {historyOpen && (
        <div className="absolute left-11 top-0 bottom-0 w-80 z-40 bg-background-secondary border-r border-border shadow-2xl flex flex-col">
          <div className="h-11 px-3 flex items-center justify-between border-b border-border shrink-0">
            <span className="text-xs font-semibold text-text-primary">{labels.history}</span>
            <button
              className="w-7 h-7 grid place-items-center rounded hover:bg-background-tertiary text-text-muted"
              onClick={() => setHistoryOpen(false)}
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <HistoryPanel />
          </div>
        </div>
      )}
    </>
  );
};

export default UtilityRail;
