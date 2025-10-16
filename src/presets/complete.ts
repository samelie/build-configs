import type { PresetCollection } from "./types";
import process from "node:process";

/**
 * Complete default presets showing ALL available options
 * Useful as a reference and starting point for customization
 */
export const completePresets: PresetCollection = {
    "complete-tsup": {
        name: "complete-tsup",
        description: "Complete tsup config with all options defined",
        bundler: "tsup",
        tsup: {
            // Entry configuration
            entry: ["src/index.ts"],

            // Output configuration
            outDir: "dist",
            format: ["esm", "cjs"],
            legacyOutput: false,

            // Target and platform
            target: "node18",
            platform: "node",

            // TypeScript declarations
            dts: {
                resolve: true,
                only: false,
                compilerOptions: {
                    strict: true,
                },
            },

            // Source maps
            sourcemap: true,

            // Bundling behavior
            bundle: true,
            splitting: false,
            skipNodeModulesBundle: true,

            // Optimization
            minify: false,
            minifyWhitespace: false,
            minifyIdentifiers: false,
            minifySyntax: false,
            keepNames: true,
            treeshake: true,

            // Build control
            clean: true,
            watch: false,
            silent: false,

            // Dependencies
            external: [/node_modules/],
            noExternal: [],

            // Code transformation
            shims: false,
            cjsInterop: false,
            replaceNodeEnv: false,
            removeNodeProtocol: true,

            // Advanced
            metafile: false,
            publicDir: false,
        },
    },

    "complete-unbuild": {
        name: "complete-unbuild",
        description: "Complete unbuild config with all options defined",
        bundler: "unbuild",
        unbuild: {
            // Entry configuration
            entries: ["src/index"],

            // Output configuration
            outDir: "dist",

            // Build behavior
            clean: true,
            stub: false,
            watch: false,
            parallel: true,

            // TypeScript declarations
            declaration: "compatible",

            // Source maps
            sourcemap: true,

            // Build control
            failOnWarn: false,

            // Dependencies
            externals: [],

            // Code transformation
            alias: {},
            replace: {},

            // Rollup configuration
            rollup: {
                // Output format
                emitCJS: false,
                cjsBridge: false,

                // Bundling
                inlineDependencies: false,
                preserveDynamicImports: false,

                // Esbuild options
                esbuild: {
                    target: "node18",
                    minify: false,
                    tsconfigRaw: {
                        compilerOptions: {
                            strict: true,
                            experimentalDecorators: false,
                        },
                    },
                },

                // Plugins (set to false to disable)
                replace: {},
                alias: {},
                resolve: {
                    extensions: [".mjs", ".js", ".json", ".ts"],
                },
                json: {},
                commonjs: {
                    requireReturnsDefault: "auto",
                },
            },

            // Stub options
            stubOptions: {
                jiti: {
                    interopDefault: true,
                },
            },
        },
    },

    "complete-tsup-full": {
        name: "complete-tsup-full",
        description: "Exhaustive tsup config with every possible option",
        bundler: "tsup",
        tsup: {
            // === Entry Configuration ===
            entry: ["src/index.ts"],

            // === Output Configuration ===
            outDir: "dist",
            format: ["esm", "cjs", "iife"],
            legacyOutput: false,
            globalName: "MyLib",

            // === Target and Platform ===
            target: ["es2020", "node18"],
            platform: "neutral",

            // === TypeScript Declarations ===
            dts: {
                resolve: true,
                only: false,
                banner: "// TypeScript declarations",
                footer: "// End of declarations",
                compilerOptions: {
                    strict: true,
                    skipLibCheck: true,
                },
            },

            // === Source Maps ===
            sourcemap: true,

            // === Bundling Behavior ===
            bundle: true,
            splitting: true,
            skipNodeModulesBundle: false,

            // === Optimization ===
            minify: "terser",
            terserOptions: {
                compress: {
                    drop_console: false,
                    drop_debugger: true,
                },
                mangle: {
                    keep_classnames: true,
                    keep_fnames: true,
                },
            },
            minifyWhitespace: true,
            minifyIdentifiers: true,
            minifySyntax: true,
            keepNames: false,
            treeshake: "recommended",

            // === Build Control ===
            clean: ["dist/**/*"],
            watch: false,
            ignoreWatch: ["**/__tests__/**", "**/*.test.ts"],
            silent: false,

            // === Dependencies ===
            external: [/^node:/, /^@types\//],
            noExternal: ["some-package"],

            // === Code Transformation ===
            define: {
                "__VERSION__": JSON.stringify("1.0.0"),
                "process.env.NODE_ENV": JSON.stringify("production"),
            },
            env: {
                NODE_ENV: "production",
            },
            inject: [],
            banner: {
                js: "/* My Library Banner */",
            },
            footer: {
                js: "/* End of Library */",
            },
            shims: true,
            cjsInterop: true,
            replaceNodeEnv: true,
            removeNodeProtocol: false,

            // === Advanced ===
            tsconfig: "tsconfig.build.json",
            metafile: true,
            publicDir: "public",
            pure: ["console.log"],
            loader: {
                ".txt": "text",
                ".png": "base64",
            },

            // === CSS (experimental) ===
            injectStyle: false,

            // === JSX ===
            jsxFactory: "React.createElement",
            jsxFragment: "React.Fragment",
        },
    },

    "complete-unbuild-full": {
        name: "complete-unbuild-full",
        description: "Exhaustive unbuild config with every possible option",
        bundler: "unbuild",
        unbuild: {
            // === Project Configuration ===
            name: "my-package",
            rootDir: process.cwd(),

            // === Entry Configuration ===
            entries: [
                "src/index",
                {
                    builder: "rollup",
                    input: "src/main",
                    name: "main",
                },
                {
                    builder: "mkdist",
                    input: "src/components/",
                    outDir: "dist/components/",
                    format: "esm",
                    ext: "mjs",
                },
            ],

            // === Output Configuration ===
            outDir: "dist",

            // === Build Behavior ===
            clean: true,
            stub: false,
            watch: false,
            watchOptions: {
                exclude: ["node_modules/**", "dist/**"],
            },
            parallel: true,

            // === TypeScript Declarations ===
            declaration: "node16",

            // === Source Maps ===
            sourcemap: true,

            // === Build Control ===
            failOnWarn: false,

            // === Dependencies ===
            externals: [/^node:/, "external-pkg"],
            dependencies: [],
            peerDependencies: [],
            devDependencies: [],

            // === Code Transformation ===
            alias: {
                "@": "./src",
                "@utils": "./src/utils",
            },
            replace: {
                "__VERSION__": "1.0.0",
                "process.env.NODE_ENV": "production",
            },

            // === Rollup Configuration ===
            rollup: {
                // Output format
                emitCJS: true,
                cjsBridge: true,

                // Bundling
                inlineDependencies: false,
                preserveDynamicImports: false,
                watch: false,

                // Output options
                output: {
                    banner: "/* My Library */",
                    footer: "/* End */",
                    exports: "auto",
                    interop: "auto",
                },

                // Esbuild options
                esbuild: {
                    target: "es2020",
                    minify: true,
                    minifyWhitespace: true,
                    minifyIdentifiers: true,
                    minifySyntax: true,
                    tsconfigRaw: {
                        compilerOptions: {
                            strict: true,
                            experimentalDecorators: true,
                        },
                    },
                },

                // Plugin configurations
                replace: {
                    preventAssignment: true,
                    values: {
                        "process.env.NODE_ENV": JSON.stringify("production"),
                    },
                },
                alias: {
                    entries: [
                        { find: "@", replacement: "./src" },
                    ],
                },
                resolve: {
                    extensions: [".mjs", ".js", ".json", ".ts"],
                    browser: false,
                    preferBuiltins: true,
                },
                json: {
                    compact: false,
                    namedExports: true,
                    preferConst: true,
                },
                commonjs: {
                    include: /node_modules/,
                    requireReturnsDefault: "auto",
                    esmExternals: true,
                    transformMixedEsModules: true,
                },
                dts: {
                    respectExternal: true,
                },
            },

            // === Stub Options ===
            stubOptions: {
                jiti: {
                    interopDefault: true,
                    cache: true,
                    requireCache: false,
                    transformOptions: {},
                },
                absoluteJitiPath: false,
            },

            // === Hooks ===
            hooks: {
                "build:prepare": async _ctx => {
                    console.warn("Preparing build...");
                },
                "build:before": async _ctx => {
                    console.warn("Starting build...");
                },
                "build:done": async _ctx => {
                    console.warn("Build complete!");
                },
            },
        },
    },
};
