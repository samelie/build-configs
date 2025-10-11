import type { PresetCollection } from "./types";

/**
 * Component library presets for building UI components
 */
export const componentPresets: PresetCollection = {
    "react-component": {
        name: "react-component",
        description: "React component library",
        bundler: "both",
        tsup: {
            entry: ["src/index.ts"],
            format: ["esm", "cjs"],
            target: "es2020",
            platform: "browser",
            dts: {
                resolve: true,
            },
            external: ["react", "react-dom"],
            sourcemap: true,
            clean: true,
            splitting: false,
        },
        unbuild: {
            entries: [
                "src/index",
                {
                    builder: "mkdist",
                    input: "src/components/",
                    outDir: "dist/components/",
                },
            ],
            externals: ["react", "react-dom"],
            rollup: {
                emitCJS: true,
            },
        },
    },

    "vue-component": {
        name: "vue-component",
        description: "Vue component library",
        bundler: "unbuild",
        unbuild: {
            entries: [
                "src/index",
                {
                    builder: "mkdist",
                    input: "src/components/",
                    outDir: "dist/components/",
                },
            ],
            externals: ["vue"],
            rollup: {
                emitCJS: false,
            },
        },
    },

    "web-component": {
        name: "web-component",
        description: "Framework-agnostic web components",
        bundler: "tsup",
        tsup: {
            entry: ["src/index.ts"],
            format: ["esm", "iife"],
            target: "es2020",
            platform: "browser",
            dts: {
                resolve: true,
            },
            globalName: "WebComponents",
            minify: true,
            sourcemap: true,
        },
    },

    "design-system": {
        name: "design-system",
        description: "Design system with components and tokens",
        bundler: "unbuild",
        unbuild: {
            entries: [
                "src/index",
                {
                    builder: "mkdist",
                    input: "src/components/",
                    outDir: "dist/components/",
                },
                {
                    builder: "mkdist",
                    input: "src/tokens/",
                    outDir: "dist/tokens/",
                },
            ],
            rollup: {
                emitCJS: true,
            },
            declaration: "compatible",
        },
    },
};
