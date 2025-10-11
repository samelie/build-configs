import type { Options as TsupOptions } from "tsup";
import type { BuildConfig as UnbuildConfig } from "unbuild";

/**
 * Preset configuration that can be used with either tsup or unbuild
 */
export interface PresetConfig {
    name: string;
    description: string;
    bundler: "tsup" | "unbuild" | "both";
    tsup?: Partial<TsupOptions>;
    unbuild?: Partial<UnbuildConfig>;
}

/**
 * Collection of available presets
 */
export interface PresetCollection {
    [key: string]: PresetConfig;
}

/**
 * Preset categories for organization
 */
export type PresetCategory = "library" | "cli" | "component" | "app";
