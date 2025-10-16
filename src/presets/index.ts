import type { PresetCollection, PresetConfig } from "./types";
import { cliPresets } from "./cli";
import { completePresets } from "./complete";
import { componentPresets } from "./component";
import { libraryPresets } from "./library";

/**
 * All available presets organized by category
 */
export const presets: PresetCollection = {
    ...libraryPresets,
    ...cliPresets,
    ...componentPresets,
    ...completePresets,
};

/**
 * Get a preset by name
 * @param name - The preset name
 * @returns The preset configuration or undefined if not found
 */
export function getPreset(name: string): PresetConfig | undefined {
    return presets[name];
}

/**
 * List all available preset names
 * @returns Array of preset names
 */
export function listPresets(): string[] {
    return Object.keys(presets);
}

/**
 * Get presets by bundler type
 * @param bundler - The bundler type to filter by
 * @returns Presets that support the specified bundler
 */
export function getPresetsByBundler(
    bundler: "tsup" | "unbuild",
): PresetCollection {
    return Object.fromEntries(
        Object.entries(presets).filter(
            ([, preset]) =>
                preset.bundler === bundler || preset.bundler === "both",
        ),
    );
}

/**
 * Preset categories for easy filtering
 */
export const presetCategories = {
    library: libraryPresets,
    cli: cliPresets,
    component: componentPresets,
    complete: completePresets,
};
