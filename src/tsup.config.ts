import type { Options } from "tsup";
import { defineConfig } from "tsup";

/**
 * Creates a tsup configuration with sensible defaults for Node.js libraries.
 *
 * Default configuration:
 * - Entry: src/index.ts
 * - Formats: ESM and CJS
 * - TypeScript declarations with type resolution
 * - Source maps enabled
 * - Clean build directory
 * - Tree shaking enabled
 * - Target: node18
 * - Preserve function/class names
 *
 * @param c - Partial tsup options to override defaults
 * @returns Complete tsup configuration
 *
 * @example
 * ```ts
 * import { makeTsupConfig } from '@rad/build-configs/tsup';
 *
 * export default makeTsupConfig({
 *   entry: ['src/index.ts', 'src/cli.ts'],
 *   format: ['esm'],
 * });
 * ```
 */
export function makeTsupConfig(c: Options = {}) {
    return defineConfig({
        // Entry points
        entry: ["src/index.ts"],

        // Output formats
        format: ["esm", "cjs"],

        // TypeScript declarations
        dts: {
            resolve: true, // Resolve external types from node_modules
            compilerOptions: {
                strict: true,
            },
        },

        // Build behavior
        bundle: true,
        splitting: false, // Disable code splitting for better CJS compatibility
        treeshake: true,
        clean: true,

        // Source maps
        sourcemap: true,

        // Target environment
        target: "node18",
        platform: "node",

        // Optimization
        minify: false, // Let consumers minify if needed
        keepNames: true, // Preserve function/class names for debugging

        // Dependencies
        skipNodeModulesBundle: true, // Don't bundle node_modules
        external: [/node_modules/], // Mark all node_modules as external

        // Allow user overrides
        ...c,
    });
}
