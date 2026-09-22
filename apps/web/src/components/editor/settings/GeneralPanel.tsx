import React from "react";
import { Switch, Label } from "@openreel/ui";
import { useSettingsStore } from "../../../stores/settings-store";
import { useI18n } from "../../../i18n";

export const GeneralPanel: React.FC = () => {
  const { language } = useI18n();
  const {
    autoSave,
    autoSaveInterval,
    setAutoSave,
    setAutoSaveInterval,
  } = useSettingsStore();

  const minuteLabel = (minutes: number) => {
    if (language === "es") {
      return minutes === 1 ? "1 minuto" : `${minutes} minutos`;
    }
    return minutes === 1 ? "1 minute" : `${minutes} minutes`;
  };

  return (
    <div className="space-y-6 pb-4">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-text-primary">
          {language === "es" ? "Guardado automático" : "Auto-Save"}
        </h3>

        <div className="flex items-center justify-between gap-6">
          <div>
            <Label className="text-sm text-text-secondary">
              {language === "es" ? "Activar guardado automático" : "Enable auto-save"}
            </Label>
            <p className="text-xs text-text-muted mt-0.5">
              {language === "es"
                ? "Guarda el proyecto automáticamente a intervalos regulares."
                : "Automatically save your project at regular intervals."}
            </p>
          </div>
          <Switch checked={autoSave} onCheckedChange={setAutoSave} />
        </div>

        {autoSave && (
          <div className="flex items-center gap-3">
            <Label className="text-sm text-text-secondary whitespace-nowrap">
              {language === "es" ? "Guardar cada" : "Save every"}
            </Label>
            <select
              value={autoSaveInterval}
              onChange={(e) => setAutoSaveInterval(Number(e.target.value))}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              {[1, 2, 5, 10, 15, 30].map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minuteLabel(minutes)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="h-px bg-border" />

      <div className="rounded-lg border border-border bg-background-secondary/60 p-4">
        <p className="text-xs text-text-muted">
          {language === "es"
            ? "Frameo mantiene el flujo principal de edición y exportación en el navegador, sin asistentes ni proveedores de IA en la interfaz."
            : "Frameo keeps its main editing and export workflow in the browser, without AI assistants or AI providers in the interface."}
        </p>
      </div>
    </div>
  );
};

export default GeneralPanel;
