import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { ShortcutInput } from "./ShortcutInput";
import type { SpokenSymbolMapping } from "@/bindings";

export const SpokenSymbols: React.FC = () => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();
  const [newSpoken, setNewSpoken] = useState("");
  const [newSymbol, setNewSymbol] = useState("");

  const enabled = getSetting("spoken_symbols_enabled") ?? false;
  const mappings: SpokenSymbolMapping[] = getSetting("spoken_symbols") ?? [];

  const handleAddRow = () => {
    const spoken = newSpoken.trim().toLowerCase();
    const symbol = newSymbol; // do not trim — the symbol may itself be whitespace
    if (!spoken || symbol.length === 0) return;
    if (mappings.some((m) => m.spoken.toLowerCase() === spoken)) return;
    updateSetting("spoken_symbols", [...mappings, { spoken, symbol }]);
    setNewSpoken("");
    setNewSymbol("");
  };

  const handleDelete = (index: number) => {
    updateSetting(
      "spoken_symbols",
      mappings.filter((_, i) => i !== index),
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRow();
    }
  };

  const isSaving = isUpdating("spoken_symbols");

  return (
    <>
      <ShortcutInput
        shortcutId="transcribe_with_symbols"
        descriptionMode="tooltip"
        grouped={true}
      />
      <ToggleSwitch
        checked={enabled}
        onChange={(val) => updateSetting("spoken_symbols_enabled", val)}
        isUpdating={isUpdating("spoken_symbols_enabled")}
        label={t("settings.postProcessing.symbols.enabledLabel")}
        description={t("settings.postProcessing.symbols.enabledDescription")}
        descriptionMode="tooltip"
        grouped={true}
      />

      <div className="px-4 pb-3">
      <div className="w-full overflow-hidden rounded-md border border-mid-gray/20">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-mid-gray/20 bg-mid-gray/5">
              <th className="px-3 py-2 text-left font-medium text-mid-gray">
                {t("settings.postProcessing.symbols.table.spokenPhrase")}
              </th>
              <th className="px-3 py-2 text-left font-medium text-mid-gray w-24">
                {t("settings.postProcessing.symbols.table.symbol")}
              </th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {mappings.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-3 py-4 text-center text-mid-gray/60 text-xs"
                >
                  {t("settings.postProcessing.symbols.table.empty")}
                </td>
              </tr>
            )}
            {mappings.map((mapping, index) => (
              <tr
                key={index}
                className="border-b border-mid-gray/10 last:border-0 hover:bg-mid-gray/5"
              >
                <td className="px-3 py-2 font-mono text-xs">
                  {mapping.spoken}
                </td>
                <td className="px-3 py-2 font-mono text-xs w-24">
                  {mapping.symbol}
                </td>
                <td className="px-2 py-1 text-right w-10">
                  <button
                    onClick={() => handleDelete(index)}
                    disabled={isSaving}
                    aria-label={t(
                      "settings.postProcessing.symbols.table.delete",
                    )}
                    className="p-1 rounded text-mid-gray/50 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}

            {/* Add row */}
            <tr className="bg-mid-gray/5">
              <td className="px-2 py-2">
                <Input
                  type="text"
                  value={newSpoken}
                  onChange={(e) => setNewSpoken(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t(
                    "settings.postProcessing.symbols.table.spokenPlaceholder",
                  )}
                  variant="compact"
                  disabled={isSaving}
                  className="w-full"
                />
              </td>
              <td className="px-2 py-2 w-24">
                <Input
                  type="text"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t(
                    "settings.postProcessing.symbols.table.symbolPlaceholder",
                  )}
                  variant="compact"
                  disabled={isSaving}
                  className="w-full"
                />
              </td>
              <td className="px-2 py-2 text-right w-10">
                <Button
                  onClick={handleAddRow}
                  variant="primary"
                  size="sm"
                  disabled={!newSpoken.trim() || newSymbol.length === 0 || isSaving}
                >
                  {t("settings.postProcessing.symbols.table.add")}
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
};
