import type { Options as TsupOptions } from "tsup";
import type { BuildConfig as UnbuildConfig } from "unbuild";

/**
 * Generate tsup config file content
 */
export function generateTsupConfig(options: Partial<TsupOptions> = {}): string {
    const config = {
        entry: options.entry ?? ["src/index.ts"],
        format: options.format ?? ["esm", "cjs"],
        dts: options.dts ?? true,
        sourcemap: options.sourcemap ?? true,
        clean: options.clean ?? true,
        ...options,
    };

    return `import { makeTsupConfig } from "@adddog/build-configs/tsup";

export default makeTsupConfig(${JSON.stringify(config, null, 2)});
`;
}

/**
 * Generate unbuild config file content
 */
export function generateUnbuildConfig(
    options: Partial<UnbuildConfig> = {},
): string {
    const config = {
        entries: options.entries ?? ["src/index"],
        declaration: options.declaration ?? true,
        rollup: {
            emitCJS: options.rollup?.emitCJS ?? false,
            ...options.rollup,
        },
        ...options,
    };

    return `import { makeUnbuildConfig } from "@adddog/build-configs/unbuild";

export default makeUnbuildConfig(${JSON.stringify(config, null, 2)});
`;
}

/**
 * Generate package.json scripts
 */
export function generatePackageJsonScripts(
    bundler: "tsup" | "unbuild",
): Record<string, string> {
    const buildCommand = bundler === "tsup" ? "tsup" : "unbuild";
    const watchCommand =
        bundler === "tsup" ? "tsup --watch" : "unbuild --watch";

    return {
        "build": buildCommand,
        "build:watch": watchCommand,
        "prepublishOnly": "pnpm build",
    };
}

/**
 * Generate package.json exports based on bundler
 */
export function generatePackageJsonExports(
    _bundler: "tsup" | "unbuild",
    formats: string[],
): Record<string, string | Record<string, string>> {
    const hasESM = formats.includes("esm");
    const hasCJS = formats.includes("cjs");

    if (hasESM && hasCJS) {
        return {
            ".": {
                types: "./dist/index.d.ts",
                import: "./dist/index.mjs",
                require: "./dist/index.cjs",
            },
        };
    } else if (hasESM) {
        return {
            ".": {
                types: "./dist/index.d.ts",
                import: "./dist/index.mjs",
            },
        };
    } else {
        return {
            ".": {
                types: "./dist/index.d.ts",
                require: "./dist/index.cjs",
            },
        };
    }
}

/**
 * Generate complete tsconfig.json for build
 */
export function generateTsConfig(): string {
    return `{
  "extends": "@rad/config/base.tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
`;
}
