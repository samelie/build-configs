import { describe, expect, it } from "vitest";

import {
    getPreset,
    getPresetsByBundler,
    listPresets,
    presetCategories,
    presets,
} from "../index";

describe("presets index", () => {
    describe("presets collection", () => {
        it("merges all preset categories", () => {
            const keys = Object.keys(presets);
            expect(keys.length).toBeGreaterThan(0);
            // should include presets from each category
            expect(keys).toContain("library-esm");
            expect(keys).toContain("cli-simple");
            expect(keys).toContain("react-component");
            expect(keys).toContain("complete-tsup");
        });
    });

    describe("getPreset", () => {
        it("returns preset by name", () => {
            const preset = getPreset("library-esm");
            expect(preset).toBeDefined();
            expect(preset!.name).toBe("library-esm");
        });

        it("returns undefined for unknown preset", () => {
            expect(getPreset("nonexistent")).toBeUndefined();
        });
    });

    describe("listPresets", () => {
        it("returns array of all preset names", () => {
            const names = listPresets();
            expect(Array.isArray(names)).toBe(true);
            expect(names.length).toBe(Object.keys(presets).length);
            expect(names).toContain("library-dual");
            expect(names).toContain("cli-bundled");
        });
    });

    describe("getPresetsByBundler", () => {
        it("filters presets supporting tsup", () => {
            const tsupPresets = getPresetsByBundler("tsup");
            for (const preset of Object.values(tsupPresets)) {
                expect(["tsup", "both"]).toContain(preset.bundler);
            }
            // library-browser is tsup-only
            expect(tsupPresets["library-browser"]).toBeDefined();
        });

        it("filters presets supporting unbuild", () => {
            const unbuildPresets = getPresetsByBundler("unbuild");
            for (const preset of Object.values(unbuildPresets)) {
                expect(["unbuild", "both"]).toContain(preset.bundler);
            }
            // library-unbundled is unbuild-only
            expect(unbuildPresets["library-unbundled"]).toBeDefined();
        });

        it("excludes bundler-specific presets from other bundler", () => {
            const tsupPresets = getPresetsByBundler("tsup");
            // library-unbundled is unbuild-only, should not appear
            expect(tsupPresets["library-unbundled"]).toBeUndefined();

            const unbuildPresets = getPresetsByBundler("unbuild");
            // library-browser is tsup-only, should not appear
            expect(unbuildPresets["library-browser"]).toBeUndefined();
        });
    });

    describe("presetCategories", () => {
        it("has library, cli, component, complete categories", () => {
            expect(presetCategories.library).toBeDefined();
            expect(presetCategories.cli).toBeDefined();
            expect(presetCategories.component).toBeDefined();
            expect(presetCategories.complete).toBeDefined();
        });

        it("categories contain the correct presets", () => {
            expect(Object.keys(presetCategories.library)).toContain("library-esm");
            expect(Object.keys(presetCategories.cli)).toContain("cli-simple");
            expect(Object.keys(presetCategories.component)).toContain("react-component");
            expect(Object.keys(presetCategories.complete)).toContain("complete-tsup");
        });
    });
});
