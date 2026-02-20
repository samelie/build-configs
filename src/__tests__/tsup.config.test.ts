import { describe, expect, it } from "vitest";

import { makeTsupConfig } from "../tsup.config";

describe("makeTsupConfig", () => {
    it("returns config with default values when called with no args", () => {
        const config = makeTsupConfig();
        expect(config).toBeDefined();
    });

    it("sets default entry to src/index.ts", () => {
        const config = makeTsupConfig();
        expect(config.entry).toEqual(["src/index.ts"]);
    });

    it("sets default format to ESM and CJS", () => {
        const config = makeTsupConfig();
        expect(config.format).toEqual(["esm", "cjs"]);
    });

    it("enables dts with resolve by default", () => {
        const config = makeTsupConfig();
        expect(config.dts).toEqual({
            resolve: true,
            compilerOptions: { strict: true },
        });
    });

    it("enables bundle by default", () => {
        const config = makeTsupConfig();
        expect(config.bundle).toBe(true);
    });

    it("disables splitting by default", () => {
        const config = makeTsupConfig();
        expect(config.splitting).toBe(false);
    });

    it("enables treeshake by default", () => {
        const config = makeTsupConfig();
        expect(config.treeshake).toBe(true);
    });

    it("enables clean by default", () => {
        const config = makeTsupConfig();
        expect(config.clean).toBe(true);
    });

    it("enables sourcemap by default", () => {
        const config = makeTsupConfig();
        expect(config.sourcemap).toBe(true);
    });

    it("targets node18 by default", () => {
        const config = makeTsupConfig();
        expect(config.target).toBe("node18");
        expect(config.platform).toBe("node");
    });

    it("disables minify by default", () => {
        const config = makeTsupConfig();
        expect(config.minify).toBe(false);
    });

    it("keeps names by default", () => {
        const config = makeTsupConfig();
        expect(config.keepNames).toBe(true);
    });

    it("skips node_modules bundling by default", () => {
        const config = makeTsupConfig();
        expect(config.skipNodeModulesBundle).toBe(true);
    });

    it("allows overriding entry", () => {
        const config = makeTsupConfig({
            entry: ["src/cli.ts"],
        });
        expect(config.entry).toEqual(["src/cli.ts"]);
    });

    it("allows overriding format", () => {
        const config = makeTsupConfig({
            format: ["esm"],
        });
        expect(config.format).toEqual(["esm"]);
    });

    it("allows overriding target and platform", () => {
        const config = makeTsupConfig({
            target: "es2020",
            platform: "browser",
        });
        expect(config.target).toBe("es2020");
        expect(config.platform).toBe("browser");
    });

    it("allows overriding dts to false", () => {
        const config = makeTsupConfig({ dts: false });
        expect(config.dts).toBe(false);
    });

    it("allows enabling minification", () => {
        const config = makeTsupConfig({ minify: true });
        expect(config.minify).toBe(true);
    });

    it("allows overriding multiple options at once", () => {
        const config = makeTsupConfig({
            entry: ["src/main.ts"],
            format: ["esm"],
            platform: "browser",
            minify: true,
            splitting: true,
        });
        expect(config.entry).toEqual(["src/main.ts"]);
        expect(config.format).toEqual(["esm"]);
        expect(config.platform).toBe("browser");
        expect(config.minify).toBe(true);
        expect(config.splitting).toBe(true);
    });
});
