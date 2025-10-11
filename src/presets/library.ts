import type { PresetCollection } from "./types";

/**
 * Library presets for building npm packages
 */
export const libraryPresets: PresetCollection = {
    "library-esm": {
        name: "library-esm",
        description: "Modern ESM-only library",
        bundler: "both",
        tsup: {
            format: ["esm"],
            target: "es2022",
            dts: {
                resolve: true,
            },
        },
        unbuild: {
            rollup: {
                emitCJS: false,
            },
        },
    },

    "library-dual": {
        name: "library-dual",
        description: "Library with both ESM and CJS outputs",
        bundler: "both",
        tsup: {
            format: ["esm", "cjs"],
            target: "node18",
            dts: {
                resolve: true,
            },
        },
        unbuild: {
            rollup: {
                emitCJS: true,
            },
            declaration: "compatible",
        },
    },

    "library-browser": {
        name: "library-browser",
        description: "Browser-compatible library",
        bundler: "tsup",
        tsup: {
            format: ["esm", "cjs", "iife"],
            platform: "browser",
            target: "es2020",
            globalName: "MyLib",
            dts: {
                resolve: true,
            },
            minify: true,
        },
    },

    "library-unbundled": {
        name: "library-unbundled",
        description: "Library with file-to-file transpilation (mkdist)",
        bundler: "unbuild",
        unbuild: {
            entries: [
                "src/index",
                {
                    builder: "mkdist",
                    input: "src/",
                    outDir: "dist/",
                },
            ],
        },
    },

    "library-monorepo": {
        name: "library-monorepo",
        description: "Optimized for monorepo internal packages",
        bundler: "both",
        tsup: {
            format: ["esm"],
            dts: true,
            sourcemap: true,
            clean: true,
            skipNodeModulesBundle: true,
        },
        unbuild: {
            rollup: {
                emitCJS: false,
                inlineDependencies: false,
            },
            sourcemap: true,
        },
    },
};
