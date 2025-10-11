import type { BuildConfig } from "unbuild";
import { defineBuildConfig } from "unbuild";

/**
 * Creates an unbuild configuration with sensible defaults for Node.js libraries.
 *
 * Default configuration:
 * - Entry: src/index (auto-inferred from package.json if omitted)
 * - Output: dist/
 * - ESM-only output (can be overridden for CJS)
 * - TypeScript declarations (compatible mode)
 * - Source maps enabled
 * - Clean build directory
 * - Parallel builds
 * - Target: node18
 *
 * @param c - Partial unbuild config to override defaults
 * @returns Complete unbuild configuration
 *
 * @example
 * ```ts
 * import { makeUnbuildConfig } from '@adddog/build-configs/unbuild';
 *
 * export default makeUnbuildConfig({
 *   entries: ['src/index', 'src/cli'],
 *   rollup: {
 *     emitCJS: true, // Enable CJS output
 *   },
 * });
 * ```
 *
 * @example
 * // File-to-file transpilation with mkdist
 * ```ts
 * export default makeUnbuildConfig({
 *   entries: [
 *     'src/index',
 *     {
 *       builder: 'mkdist',
 *       input: 'src/components',
 *       outDir: 'dist/components',
 *     },
 *   ],
 * });
 * ```
 */
export function makeUnbuildConfig(c: BuildConfig = {}) {
    return defineBuildConfig({
        // Entry points - auto-inferred from package.json if not specified
        entries: c.entries ?? ["src/index"],

        // Output directory
        outDir: "dist",

        // TypeScript declarations
        // 'compatible' generates .d.ts, .d.mts, .d.cts for maximum compatibility
        declaration: "compatible",

        // Source maps
        sourcemap: true,

        // Build behavior
        clean: true,
        parallel: true, // Run multiple builders in parallel
        failOnWarn: false,

        // Rollup configuration
        rollup: {
            emitCJS: false, // ESM-only by default, set to true for dual CJS+ESM
            inlineDependencies: false, // Don't bundle dependencies
            esbuild: {
                target: "node18",
                minify: false,
            },
            ...c.rollup,
        },

        // Allow user overrides
        ...c,
    });
}
