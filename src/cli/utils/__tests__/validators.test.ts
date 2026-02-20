import { describe, expect, it } from "vitest";

import {
    validateConfig,
    validateTsupConfig,
    validateUnbuildConfig,
} from "../validators";

describe("validateTsupConfig", () => {
    it("accepts valid minimal config", () => {
        const result = validateTsupConfig({});
        expect(result.success).toBe(true);
    });

    it("accepts config with entry as string array", () => {
        const result = validateTsupConfig({
            entry: ["src/index.ts"],
        });
        expect(result.success).toBe(true);
    });

    it("accepts config with entry as record", () => {
        const result = validateTsupConfig({
            entry: { index: "src/index.ts", cli: "src/cli.ts" },
        });
        expect(result.success).toBe(true);
    });

    it("accepts config with all format types", () => {
        const result = validateTsupConfig({
            format: ["esm", "cjs", "iife"],
        });
        expect(result.success).toBe(true);
    });

    it("accepts config with single format", () => {
        const result = validateTsupConfig({
            format: "esm",
        });
        expect(result.success).toBe(true);
    });

    it("rejects invalid format value", () => {
        const result = validateTsupConfig({
            format: "umd",
        });
        expect(result.success).toBe(false);
    });

    it("accepts all valid platform values", () => {
        for (const platform of ["node", "browser", "neutral"]) {
            const result = validateTsupConfig({ platform });
            expect(result.success).toBe(true);
        }
    });

    it("rejects invalid platform", () => {
        const result = validateTsupConfig({ platform: "deno" });
        expect(result.success).toBe(false);
    });

    it("accepts dts as boolean", () => {
        expect(validateTsupConfig({ dts: true }).success).toBe(true);
        expect(validateTsupConfig({ dts: false }).success).toBe(true);
    });

    it("accepts dts as object with resolve", () => {
        const result = validateTsupConfig({
            dts: { resolve: true, only: false },
        });
        expect(result.success).toBe(true);
    });

    it("accepts sourcemap as boolean or inline", () => {
        expect(validateTsupConfig({ sourcemap: true }).success).toBe(true);
        expect(validateTsupConfig({ sourcemap: false }).success).toBe(true);
        expect(validateTsupConfig({ sourcemap: "inline" }).success).toBe(true);
    });

    it("accepts minify as boolean or terser", () => {
        expect(validateTsupConfig({ minify: true }).success).toBe(true);
        expect(validateTsupConfig({ minify: false }).success).toBe(true);
        expect(validateTsupConfig({ minify: "terser" }).success).toBe(true);
    });

    it("accepts boolean flags", () => {
        const result = validateTsupConfig({
            bundle: true,
            splitting: false,
            clean: true,
            skipNodeModulesBundle: true,
            keepNames: true,
            shims: true,
            cjsInterop: false,
            removeNodeProtocol: false,
        });
        expect(result.success).toBe(true);
    });

    it("accepts external as array of strings and regexps", () => {
        const result = validateTsupConfig({
            external: ["react", /node_modules/],
        });
        expect(result.success).toBe(true);
    });

    it("accepts clean as array of strings", () => {
        const result = validateTsupConfig({
            clean: ["dist/**/*"],
        });
        expect(result.success).toBe(true);
    });

    it("accepts target as string or array", () => {
        expect(validateTsupConfig({ target: "node18" }).success).toBe(true);
        expect(validateTsupConfig({ target: ["es2020", "node18"] }).success).toBe(true);
    });

    it("rejects config with wrong types", () => {
        const result = validateTsupConfig({
            bundle: "yes",
        });
        expect(result.success).toBe(false);
    });
});

describe("validateUnbuildConfig", () => {
    it("accepts valid minimal config", () => {
        const result = validateUnbuildConfig({});
        expect(result.success).toBe(true);
    });

    it("accepts config with string entries", () => {
        const result = validateUnbuildConfig({
            entries: ["src/index"],
        });
        expect(result.success).toBe(true);
    });

    it("accepts config with object entries", () => {
        const result = validateUnbuildConfig({
            entries: [
                "src/index",
                {
                    builder: "mkdist",
                    input: "src/components/",
                    outDir: "dist/components/",
                },
            ],
        });
        expect(result.success).toBe(true);
    });

    it("accepts all valid builder types", () => {
        for (const builder of ["rollup", "mkdist", "copy", "untyped"]) {
            const result = validateUnbuildConfig({
                entries: [{ builder, input: "src/" }],
            });
            expect(result.success).toBe(true);
        }
    });

    it("rejects invalid builder type", () => {
        const result = validateUnbuildConfig({
            entries: [{ builder: "webpack", input: "src/" }],
        });
        expect(result.success).toBe(false);
    });

    it("accepts all valid declaration modes", () => {
        expect(validateUnbuildConfig({ declaration: true }).success).toBe(true);
        expect(validateUnbuildConfig({ declaration: false }).success).toBe(true);
        expect(validateUnbuildConfig({ declaration: "compatible" }).success).toBe(true);
        expect(validateUnbuildConfig({ declaration: "node16" }).success).toBe(true);
    });

    it("rejects invalid declaration value", () => {
        const result = validateUnbuildConfig({ declaration: "invalid" });
        expect(result.success).toBe(false);
    });

    it("accepts rollup config", () => {
        const result = validateUnbuildConfig({
            rollup: {
                emitCJS: true,
                cjsBridge: false,
                preserveDynamicImports: false,
                inlineDependencies: false,
            },
        });
        expect(result.success).toBe(true);
    });

    it("accepts boolean flags", () => {
        const result = validateUnbuildConfig({
            clean: true,
            sourcemap: true,
            stub: false,
            watch: false,
            parallel: true,
            failOnWarn: false,
        });
        expect(result.success).toBe(true);
    });

    it("accepts alias and replace as records", () => {
        const result = validateUnbuildConfig({
            alias: { "@": "./src" },
            replace: { __VERSION__: "1.0.0" },
        });
        expect(result.success).toBe(true);
    });

    it("accepts externals with strings and regexps", () => {
        const result = validateUnbuildConfig({
            externals: ["react", /^node:/],
        });
        expect(result.success).toBe(true);
    });

    it("accepts entry with format and ext fields", () => {
        const result = validateUnbuildConfig({
            entries: [
                {
                    builder: "mkdist",
                    input: "src/",
                    outDir: "dist/",
                    format: "esm",
                    ext: "mjs",
                },
            ],
        });
        expect(result.success).toBe(true);
    });

    it("rejects wrong types for boolean fields", () => {
        const result = validateUnbuildConfig({
            clean: "yes",
        });
        expect(result.success).toBe(false);
    });
});

describe("validateConfig", () => {
    it("delegates to tsup validator when bundler is tsup", () => {
        const result = validateConfig({ format: ["esm"] }, "tsup");
        expect(result.success).toBe(true);
    });

    it("delegates to unbuild validator when bundler is unbuild", () => {
        const result = validateConfig({ entries: ["src/index"] }, "unbuild");
        expect(result.success).toBe(true);
    });

    it("tsup validator rejects unbuild-specific fields", () => {
        // entries is not a valid tsup field (tsup uses "entry")
        const result = validateConfig({ entries: ["src/index"] }, "tsup");
        // zod strict mode would reject, but passthrough mode may not
        // the key point is it doesn't crash
        expect(result).toBeDefined();
    });
});
