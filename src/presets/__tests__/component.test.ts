import type { BuildEntry } from "unbuild";
import { describe, expect, it } from "vitest";

import { componentPresets } from "../component";

describe("componentPresets", () => {
    it("contains all expected preset keys", () => {
        expect(Object.keys(componentPresets)).toEqual([
            "react-component",
            "vue-component",
            "web-component",
            "design-system",
        ]);
    });

    describe("react-component", () => {
        const preset = componentPresets["react-component"]!;

        it("supports both bundlers", () => {
            expect(preset.bundler).toBe("both");
        });

        it("tsup externalizes react and react-dom", () => {
            expect(preset.tsup?.external).toEqual(["react", "react-dom"]);
        });

        it("unbuild externalizes react and react-dom", () => {
            expect(preset.unbuild?.externals).toEqual(["react", "react-dom"]);
        });

        it("targets browser platform", () => {
            expect(preset.tsup?.platform).toBe("browser");
        });

        it("disables splitting for CJS compat", () => {
            expect(preset.tsup?.splitting).toBe(false);
        });

        it("unbuild has mkdist entry for components", () => {
            const entries = preset.unbuild?.entries;
            expect(entries).toBeDefined();
            const mkdistEntry = entries?.find(
                (e): e is BuildEntry =>
                    typeof e === "object" && e !== null && "builder" in e,
            );
            expect(mkdistEntry).toMatchObject({
                builder: "mkdist",
                input: "src/components/",
                outDir: "dist/components/",
            });
        });
    });

    describe("vue-component", () => {
        const preset = componentPresets["vue-component"]!;

        it("is unbuild-only", () => {
            expect(preset.bundler).toBe("unbuild");
            expect(preset.tsup).toBeUndefined();
        });

        it("externalizes vue", () => {
            expect(preset.unbuild?.externals).toEqual(["vue"]);
        });

        it("does not emit CJS", () => {
            expect(preset.unbuild?.rollup?.emitCJS).toBe(false);
        });
    });

    describe("web-component", () => {
        const preset = componentPresets["web-component"]!;

        it("is tsup-only", () => {
            expect(preset.bundler).toBe("tsup");
            expect(preset.unbuild).toBeUndefined();
        });

        it("includes iife for script-tag usage", () => {
            expect(preset.tsup?.format).toContain("iife");
        });

        it("sets globalName", () => {
            expect(preset.tsup?.globalName).toBe("WebComponents");
        });

        it("enables minification", () => {
            expect(preset.tsup?.minify).toBe(true);
        });
    });

    describe("design-system", () => {
        const preset = componentPresets["design-system"]!;

        it("is unbuild-only", () => {
            expect(preset.bundler).toBe("unbuild");
        });

        it("has entries for components and tokens", () => {
            const entries = preset.unbuild?.entries;
            expect(entries).toBeDefined();
            expect(entries).toHaveLength(3);
        });

        it("uses compatible declaration", () => {
            expect(preset.unbuild?.declaration).toBe("compatible");
        });

        it("emits CJS", () => {
            expect(preset.unbuild?.rollup?.emitCJS).toBe(true);
        });
    });

    it("every preset has name matching its key", () => {
        for (const [key, preset] of Object.entries(componentPresets)) {
            expect(preset.name).toBe(key);
        }
    });
});
