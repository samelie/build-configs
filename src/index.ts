import type { Options as TsupOptions } from "tsup";
import type { BuildConfig as UnbuildConfig } from "unbuild";
import { makeTsupConfig } from "./tsup.config";
import { makeUnbuildConfig } from "./unbuild.config";

// Discriminated union types for type-safe config definition
export type TsupBuildConfig = {
    type: "tsup";
    options?: TsupOptions;
};

export type UnbuildBuildConfig = {
    type: "unbuild";
    options?: UnbuildConfig;
};

export type BuildConfigInput = TsupBuildConfig | UnbuildBuildConfig;

/**
 * Define a build configuration with automatic bundler detection.
 *
 * This function provides a type-safe way to define build configurations
 * for either tsup or unbuild based on the `type` discriminator.
 *
 * @param config - Build configuration with type discriminator
 * @returns Configuration object for the selected bundler
 *
 * @example
 * ```ts
 * // For tsup
 * export default defineBuildConfig({
 *   type: 'tsup',
 *   options: {
 *     entry: ['src/index.ts'],
 *     format: ['esm', 'cjs'],
 *   },
 * });
 *
 * // For unbuild
 * export default defineBuildConfig({
 *   type: 'unbuild',
 *   options: {
 *     entries: ['src/index'],
 *   },
 * });
 * ```
 */
export function defineBuildConfig(
    config: TsupBuildConfig,
): ReturnType<typeof makeTsupConfig>;
export function defineBuildConfig(
    config: UnbuildBuildConfig,
): ReturnType<typeof makeUnbuildConfig>;
export function defineBuildConfig(
    config: BuildConfigInput,
): ReturnType<typeof makeTsupConfig> | ReturnType<typeof makeUnbuildConfig> {
    if (config.type === "tsup") {
        return makeTsupConfig(config.options ?? {});
    }
    return makeUnbuildConfig(config.options ?? {});
}
