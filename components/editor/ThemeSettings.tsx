"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChevronDown, ChevronRight, RotateCcw, Check, Loader2 } from "lucide-react";

const defaultTheme = {
  colors: {
    primary: "#2bee6c",
    secondary: "#0f172a",
    accent: "#22c55e",
    background: "#ffffff",
    backgroundAlt: "#f8fafc",
    text: "#0f172a",
    textMuted: "#64748b",
    border: "#e2e8f0",
  },
  typography: {
    headingFont: "system-ui",
    bodyFont: "system-ui",
    headingWeight: "700",
    bodyWeight: "400",
  },
  buttons: {
    borderRadius: "12",
    paddingX: "24",
    paddingY: "12",
    primaryBg: "#2bee6c",
    primaryText: "#0f172a",
  },
  spacing: {
    containerMaxWidth: "1280",
    sectionPaddingY: "64",
  },
};

function AccordionSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-slate-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-bold text-slate-700">{title}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputId = `color-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const hexId = `hex-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-xs font-bold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          id={inputId}
          type="color"
          value={value}
          title={`${label} color picker`}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border-2 border-slate-200 cursor-pointer overflow-hidden"
        />
        <input
          id={hexId}
          type="text"
          value={value}
          title={`${label} hex code`}
          aria-label={`${label} hex code`}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 text-sm font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-nb-green focus:ring-2 focus:ring-nb-green/20 transition-all"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  const selectId = `select-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="space-y-2">
      <label htmlFor={selectId} className="text-xs font-bold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        title={label}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-nb-green focus:ring-2 focus:ring-nb-green/20 transition-all cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SliderInput({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  unit: string;
  onChange: (value: string) => void;
}) {
  const sliderId = `slider-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={sliderId} className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          {label}
        </label>
        <span className="text-xs font-mono text-slate-400">
          {value}
          {unit}
        </span>
      </div>
      <input
        id={sliderId}
        type="range"
        title={label}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-nb-green"
      />
    </div>
  );
}

export function ThemeSettings() {
  const themeData = useQuery(api.theme.getThemeSettings);
  const saveAll = useMutation(api.theme.saveAllThemeSettings);
  const reset = useMutation(api.theme.resetThemeSettings);

  const [settings, setSettings] = useState<typeof defaultTheme>(defaultTheme);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    colors: true,
    typography: false,
    buttons: false,
    spacing: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (themeData) {
      setSettings(themeData);
    }
  }, [themeData]);

  const updateSetting = (category: string, key: string, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveAll({ settings });
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to save theme settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm("Are you sure you want to reset all theme settings to defaults?")) {
      await reset();
      setSettings(defaultTheme);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="px-4 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
            Theme Settings
          </h3>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
        <p className="text-xs text-slate-400">
          Customize your site&apos;s appearance globally.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AccordionSection
          title="Colors"
          isOpen={openSections.colors}
          onToggle={() => toggleSection("colors")}
        >
          <div className="space-y-4 pt-2">
            <ColorPicker
              label="Primary"
              value={settings.colors?.primary || "#2bee6c"}
              onChange={(v) => updateSetting("colors", "primary", v)}
            />
            <ColorPicker
              label="Secondary"
              value={settings.colors?.secondary || "#0f172a"}
              onChange={(v) => updateSetting("colors", "secondary", v)}
            />
            <ColorPicker
              label="Accent"
              value={settings.colors?.accent || "#22c55e"}
              onChange={(v) => updateSetting("colors", "accent", v)}
            />
            <ColorPicker
              label="Background"
              value={settings.colors?.background || "#ffffff"}
              onChange={(v) => updateSetting("colors", "background", v)}
            />
            <ColorPicker
              label="Background Alt"
              value={settings.colors?.backgroundAlt || "#f8fafc"}
              onChange={(v) => updateSetting("colors", "backgroundAlt", v)}
            />
            <ColorPicker
              label="Text"
              value={settings.colors?.text || "#0f172a"}
              onChange={(v) => updateSetting("colors", "text", v)}
            />
            <ColorPicker
              label="Text Muted"
              value={settings.colors?.textMuted || "#64748b"}
              onChange={(v) => updateSetting("colors", "textMuted", v)}
            />
            <ColorPicker
              label="Border"
              value={settings.colors?.border || "#e2e8f0"}
              onChange={(v) => updateSetting("colors", "border", v)}
            />
          </div>
        </AccordionSection>

        <AccordionSection
          title="Typography"
          isOpen={openSections.typography}
          onToggle={() => toggleSection("typography")}
        >
          <div className="space-y-4 pt-2">
            <SelectInput
              label="Heading Font"
              value={settings.typography?.headingFont || "system-ui"}
              options={[
                { label: "System UI", value: "system-ui" },
                { label: "Inter", value: "Inter" },
                { label: "Georgia", value: "Georgia" },
                { label: "Times New Roman", value: "Times New Roman" },
                { label: "Courier New", value: "Courier New" },
              ]}
              onChange={(v) => updateSetting("typography", "headingFont", v)}
            />
            <SelectInput
              label="Body Font"
              value={settings.typography?.bodyFont || "system-ui"}
              options={[
                { label: "System UI", value: "system-ui" },
                { label: "Inter", value: "Inter" },
                { label: "Georgia", value: "Georgia" },
                { label: "Arial", value: "Arial" },
                { label: "Helvetica", value: "Helvetica" },
              ]}
              onChange={(v) => updateSetting("typography", "bodyFont", v)}
            />
            <SelectInput
              label="Heading Weight"
              value={settings.typography?.headingWeight || "700"}
              options={[
                { label: "Normal (400)", value: "400" },
                { label: "Medium (500)", value: "500" },
                { label: "Semibold (600)", value: "600" },
                { label: "Bold (700)", value: "700" },
                { label: "Extra Bold (800)", value: "800" },
              ]}
              onChange={(v) => updateSetting("typography", "headingWeight", v)}
            />
            <SelectInput
              label="Body Weight"
              value={settings.typography?.bodyWeight || "400"}
              options={[
                { label: "Normal (400)", value: "400" },
                { label: "Medium (500)", value: "500" },
                { label: "Semibold (600)", value: "600" },
              ]}
              onChange={(v) => updateSetting("typography", "bodyWeight", v)}
            />
          </div>
        </AccordionSection>

        <AccordionSection
          title="Buttons"
          isOpen={openSections.buttons}
          onToggle={() => toggleSection("buttons")}
        >
          <div className="space-y-4 pt-2">
            <SliderInput
              label="Border Radius"
              value={settings.buttons?.borderRadius || "12"}
              min={0}
              max={32}
              unit="px"
              onChange={(v) => updateSetting("buttons", "borderRadius", v)}
            />
            <SliderInput
              label="Horizontal Padding"
              value={settings.buttons?.paddingX || "24"}
              min={8}
              max={48}
              unit="px"
              onChange={(v) => updateSetting("buttons", "paddingX", v)}
            />
            <SliderInput
              label="Vertical Padding"
              value={settings.buttons?.paddingY || "12"}
              min={4}
              max={24}
              unit="px"
              onChange={(v) => updateSetting("buttons", "paddingY", v)}
            />
            <ColorPicker
              label="Primary Background"
              value={settings.buttons?.primaryBg || "#2bee6c"}
              onChange={(v) => updateSetting("buttons", "primaryBg", v)}
            />
            <ColorPicker
              label="Primary Text"
              value={settings.buttons?.primaryText || "#0f172a"}
              onChange={(v) => updateSetting("buttons", "primaryText", v)}
            />
          </div>
        </AccordionSection>

        <AccordionSection
          title="Spacing"
          isOpen={openSections.spacing}
          onToggle={() => toggleSection("spacing")}
        >
          <div className="space-y-4 pt-2">
            <SliderInput
              label="Container Max Width"
              value={settings.spacing?.containerMaxWidth || "1280"}
              min={768}
              max={1920}
              unit="px"
              onChange={(v) => updateSetting("spacing", "containerMaxWidth", v)}
            />
            <SliderInput
              label="Section Padding Y"
              value={settings.spacing?.sectionPaddingY || "64"}
              min={16}
              max={128}
              unit="px"
              onChange={(v) => updateSetting("spacing", "sectionPaddingY", v)}
            />
          </div>
        </AccordionSection>
      </div>

      <div className="px-4 py-4 border-t border-slate-200 bg-white">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-nb-green text-slate-900 font-bold rounded-xl hover:bg-nb-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-nb-green/20"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Save Theme Settings
            </>
          )}
        </button>
        {lastSaved && (
          <p className="text-center text-xs text-slate-400 mt-2">
            Last saved {lastSaved.toLocaleTimeString()}
          </p>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
