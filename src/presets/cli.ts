import type { PresetCollection } from "./types";

/**
 * CLI tool presets for building command-line applications
 */
export const cliPresets: PresetCollection = {
    "cli-simple": {
        name: "cli-simple",
        description: "Simple CLI tool with single entry point",
        bundler: "both",
        tsup: {
            entry: ["src/cli.ts"],
            format: ["esm"],
            target: "node18",
            platform: "node",
            dts: false, // CLIs don't need type definitions
            clean: true,
            minify: false,
            shims: true, // Add CJS/ESM shims for compatibility
        },
        unbuild: {
            entries: ["src/cli"],
            declaration: false,
            rollup: {
                emitCJS: false,
            },
        },
    },

    "cli-multi": {
        name: "cli-multi",
        description: "CLI tool with multiple commands",
        bundler: "both",
        tsup: {
            entry: {
                cli: "src/cli.ts",
                index: "src/index.ts",
            },
            format: ["esm", "cjs"],
            target: "node18",
            platform: "node",
            dts: true, // Include types for programmatic usage
            clean: true,
            splitting: false,
        },
        unbuild: {
            entries: ["src/cli", "src/index"],
            declaration: true,
            rollup: {
                emitCJS: true,
            },
        },
    },

    "cli-bundled": {
        name: "cli-bundled",
        description: "CLI tool with all dependencies bundled",
        bundler: "tsup",
        tsup: {
            entry: ["src/cli.ts"],
            format: ["esm"],
            target: "node18",
            platform: "node",
            dts: false,
            bundle: true,
            skipNodeModulesBundle: false, // Bundle everything
            noExternal: [/.*/], // Include all dependencies
            minify: true,
            treeshake: true,
        },
    },
};
