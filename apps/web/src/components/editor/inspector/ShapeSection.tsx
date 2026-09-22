import React, { useCallback, useMemo } from "react";
import {
  Square,
  Circle,
  Triangle,
  Star,
  Hexagon,
  ArrowRight,
} from "lucide-react";
import { useProjectStore } from "../../../stores/project-store";
import { useI18n } from "../../../i18n";
import type { ShapeStyle, FillStyle, StrokeStyle } from "@openreel/core";
import { ColorPicker, LabeledSlider as Slider } from "@openreel/ui";

const ColorField: React.FC<{
  label: string;
  value: string;
  onChange: (color: string) => void;
  showAlpha?: boolean;
}> = ({ label, value, onChange, showAlpha = false }) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-[10px] text-text-secondary">{label}</span>
    <ColorPicker
      value={value}
      onChange={onChange}
      showAlpha={showAlpha}
      className="max-w-[170px]"
    />
  </div>
);

const NumberInput: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}> = ({ label, value, onChange, min = 0, max = 1000, step = 1, unit = "" }) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] text-text-secondary">{label}</span>
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        className="w-16 px-2 py-1 text-[10px] font-mono text-text-primary bg-background-tertiary border border-border rounded text-right outline-none focus:border-primary"
      />
      {unit && <span className="text-[10px] text-text-muted">{unit}</span>}
    </div>
  </div>
);

const StrokeStyleSelector: React.FC<{
  value: number[] | undefined;
  onChange: (dashArray: number[] | undefined) => void;
  language: "es" | "en";
}> = ({ value, onChange, language }) => {
  const styles = [
    { value: undefined, label: language === "es" ? "Sólido" : "Solid", preview: "────" },
    { value: [5, 5], label: language === "es" ? "Discontinuo" : "Dashed", preview: "- - -" },
    { value: [2, 2], label: language === "es" ? "Punteado" : "Dotted", preview: "• • •" },
  ];

  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-text-secondary">{language === "es" ? "Estilo" : "Style"}</span>
      <div className="flex gap-1">
        {styles.map((style, index) => (
          <button
            key={index}
            onClick={() => onChange(style.value)}
            className={`px-2 py-1 text-[9px] rounded transition-colors ${
              (style.value === undefined && value === undefined) ||
              (style.value && value && style.value[0] === value[0])
                ? "bg-primary text-white"
                : "bg-background-tertiary border border-border text-text-secondary hover:text-text-primary"
            }`}
            title={style.label}
          >
            {style.preview}
          </button>
        ))}
      </div>
    </div>
  );
};

const ShapeTypeDisplay: React.FC<{
  shapeType: string;
  language: "es" | "en";
}> = ({ shapeType, language }) => {
  const shapeIcons: Record<string, React.ReactNode> = {
    rectangle: <Square size={16} />,
    circle: <Circle size={16} />,
    ellipse: <Circle size={16} />,
    triangle: <Triangle size={16} />,
    star: <Star size={16} />,
    polygon: <Hexagon size={16} />,
    arrow: <ArrowRight size={16} />,
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-background-tertiary rounded-lg">
      <div className="p-1.5 bg-background-secondary rounded">
        {shapeIcons[shapeType] || <Square size={16} />}
      </div>
      <div>
        <span className="text-[10px] font-medium text-text-primary capitalize">
          {language === "es"
            ? ({ rectangle: "Rectángulo", circle: "Círculo", ellipse: "Elipse", triangle: "Triángulo", star: "Estrella", polygon: "Polígono", arrow: "Flecha" } as Record<string,string>)[shapeType] ?? shapeType
            : shapeType}
        </span>
        <p className="text-[9px] text-text-muted">{language === "es" ? "Clip de forma" : "Shape clip"}</p>
      </div>
    </div>
  );
};

interface ShapeSectionProps {
  clipId: string;
}

export const ShapeSection: React.FC<ShapeSectionProps> = ({ clipId }) => {
  const { language } = useI18n();
  const { getShapeClip, updateShapeStyle, project } = useProjectStore();

  const shapeClip = useMemo(
    () => getShapeClip(clipId),
    [clipId, getShapeClip, project.modifiedAt],
  );

  const defaultFill: FillStyle = {
    type: "solid",
    color: "#3b82f6",
    opacity: 1,
  };

  const defaultStroke: StrokeStyle = {
    color: "#1d4ed8",
    width: 2,
    opacity: 1,
  };

  const defaultStyle: ShapeStyle = {
    fill: defaultFill,
    stroke: defaultStroke,
  };

  const style = shapeClip?.style || defaultStyle;
  const shapeType = shapeClip?.shapeType || "rectangle";

  const handleStyleChange = useCallback(
    (changes: Partial<ShapeStyle>) => {
      updateShapeStyle(clipId, changes);
    },
    [clipId, updateShapeStyle],
  );

  if (!shapeClip) {
    return (
      <div className="p-4 text-center">
        <Square size={24} className="mx-auto mb-2 text-text-muted" />
        <p className="text-[10px] text-text-muted">{language === "es" ? "No hay una forma seleccionada" : "No shape clip selected"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ShapeTypeDisplay shapeType={shapeType} language={language} />

      <div className="space-y-2 p-3 bg-background-tertiary rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary font-medium">
            {language === "es" ? "Relleno" : "Fill"}
          </span>
          <button
            onClick={() =>
              handleStyleChange({
                fill: {
                  ...style.fill,
                  type: style.fill?.type === "none" ? "solid" : "none",
                  color: style.fill?.color || "#3b82f6",
                  opacity: style.fill?.opacity ?? 1,
                },
              })
            }
            className={`rounded px-2 py-0.5 text-[9px] border ${
              style.fill?.type !== "none"
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-text-muted"
            }`}
          >
            {style.fill?.type !== "none"
              ? (language === "es" ? "Activo" : "On")
              : (language === "es" ? "Desactivado" : "Off")}
          </button>
        </div>
        <ColorField
          label={language === "es" ? "Color" : "Color"}
          value={style.fill?.color || "#3b82f6"}
          onChange={(color) =>
            handleStyleChange({
              fill: {
                ...style.fill,
                color,
                type: "solid",
                opacity: style.fill?.opacity || 1,
              },
            })
          }
        />
        <Slider
          label={language === "es" ? "Opacidad" : "Opacity"}
          value={(style.fill?.opacity || 1) * 100}
          onChange={(opacity) =>
            handleStyleChange({
              fill: {
                ...style.fill,
                opacity: opacity / 100,
                type: style.fill?.type || "solid",
              },
            })
          }
          min={0}
          max={100}
          unit="%"
        />
      </div>

      <div className="space-y-2 p-3 bg-background-tertiary rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary font-medium">
            {language === "es" ? "Contorno" : "Stroke"}
          </span>
          <button
            onClick={() =>
              handleStyleChange({
                stroke: {
                  ...style.stroke,
                  color: style.stroke?.color || "#1d4ed8",
                  width: (style.stroke?.width || 0) > 0 ? 0 : 2,
                  opacity: style.stroke?.opacity || 1,
                },
              })
            }
            className={`rounded px-2 py-0.5 text-[9px] border ${
              (style.stroke?.width || 0) > 0
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-text-muted"
            }`}
          >
            {(style.stroke?.width || 0) > 0
              ? (language === "es" ? "Activo" : "On")
              : (language === "es" ? "Desactivado" : "Off")}
          </button>
        </div>
        <ColorField
          label={language === "es" ? "Color" : "Color"}
          value={style.stroke?.color || "#1d4ed8"}
          onChange={(color) =>
            handleStyleChange({
              stroke: {
                ...style.stroke,
                color,
                width: style.stroke?.width || 2,
                opacity: style.stroke?.opacity || 1,
              },
            })
          }
        />
        <NumberInput
          label={language === "es" ? "Ancho" : "Width"}
          value={style.stroke?.width || 0}
          onChange={(width) =>
            handleStyleChange({
              stroke: {
                ...style.stroke,
                width,
                color: style.stroke?.color || "#1d4ed8",
                opacity: style.stroke?.opacity || 1,
              },
            })
          }
          min={0}
          max={50}
          unit="px"
        />
        <StrokeStyleSelector
          value={style.stroke?.dashArray}
          language={language}
          onChange={(dashArray) =>
            handleStyleChange({
              stroke: {
                ...style.stroke,
                dashArray,
                color: style.stroke?.color || "#1d4ed8",
                width: style.stroke?.width || 2,
                opacity: style.stroke?.opacity || 1,
              },
            })
          }
        />
      </div>

      {shapeType === "rectangle" && (
        <div className="space-y-2 p-3 bg-background-tertiary rounded-lg">
          <span className="text-[10px] text-text-secondary font-medium">
            {language === "es" ? "Esquinas" : "Corners"}
          </span>
          <Slider
            label={language === "es" ? "Radio" : "Radius"}
            value={style.cornerRadius || 0}
            onChange={(cornerRadius) => handleStyleChange({ cornerRadius })}
            min={0}
            max={100}
            unit="px"
          />
        </div>
      )}

      <div className="space-y-2 p-3 bg-background-tertiary rounded-lg">
        <span className="text-[10px] text-text-secondary font-medium">
          {language === "es" ? "Sombra" : "Shadow"}
        </span>
        <ColorField
          label={language === "es" ? "Color" : "Color"}
          value={style.shadow?.color || "#000000"}
          onChange={(color) =>
            handleStyleChange({
              shadow: {
                color,
                offsetX: style.shadow?.offsetX || 0,
                offsetY: style.shadow?.offsetY || 0,
                blur: style.shadow?.blur || 0,
              },
            })
          }
          showAlpha
        />
        <NumberInput
          label={language === "es" ? "Desplazamiento X" : "Offset X"}
          value={style.shadow?.offsetX || 0}
          onChange={(offsetX) =>
            handleStyleChange({
              shadow: {
                offsetX,
                color: style.shadow?.color || "#000000",
                offsetY: style.shadow?.offsetY || 0,
                blur: style.shadow?.blur || 0,
              },
            })
          }
          min={-50}
          max={50}
          unit="px"
        />
        <NumberInput
          label={language === "es" ? "Desplazamiento Y" : "Offset Y"}
          value={style.shadow?.offsetY || 0}
          onChange={(offsetY) =>
            handleStyleChange({
              shadow: {
                offsetY,
                color: style.shadow?.color || "#000000",
                offsetX: style.shadow?.offsetX || 0,
                blur: style.shadow?.blur || 0,
              },
            })
          }
          min={-50}
          max={50}
          unit="px"
        />
        <Slider
          label={language === "es" ? "Desenfoque" : "Blur"}
          value={style.shadow?.blur || 0}
          onChange={(blur) =>
            handleStyleChange({
              shadow: {
                blur,
                color: style.shadow?.color || "#000000",
                offsetX: style.shadow?.offsetX || 0,
                offsetY: style.shadow?.offsetY || 0,
              },
            })
          }
          min={0}
          max={50}
          unit="px"
        />
      </div>
    </div>
  );
};

export default ShapeSection;
