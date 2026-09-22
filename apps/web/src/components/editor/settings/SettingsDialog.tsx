import React from "react";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@openreel/ui";
import { useSettingsStore } from "../../../stores/settings-store";
import { GeneralPanel } from "./GeneralPanel";
import { useI18n } from "../../../i18n";

export const SettingsDialog: React.FC = () => {
  const { settingsOpen, closeSettings } = useSettingsStore();
  const { language } = useI18n();

  return (
    <Dialog open={settingsOpen} onOpenChange={(open) => !open && closeSettings()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] bg-background flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings size={18} className="text-primary" />
            {language === "es" ? "Ajustes" : "Settings"}
          </DialogTitle>
          <DialogDescription>
            {language === "es"
              ? "Configura las preferencias generales de Frameo."
              : "Configure Frameo's general preferences."}
          </DialogDescription>
        </DialogHeader>

        <div
          role="tabpanel"
          aria-label={language === "es" ? "Ajustes generales" : "General settings"}
          className="min-h-0"
        >
          <GeneralPanel />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
