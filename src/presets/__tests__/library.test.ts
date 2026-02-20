import { describe, expect, it } from "vitest";

import { libraryPresets } from "../library";

describe("libraryPresets", () => {
    it("contains all expected preset keys", () => {
        expect(Object.keys(libraryPresets)).toEqual([
            "library-esm",
            "library-dual",
            "library-browser",
            "library-unbundled",
            "library-monorepo",
        ]);
    });

    describe("library-esm", () => {
        const preset = libraryPresets["library-esm"]!;

        it("has correct name and bundler", () => {
            expect(preset.name).toBe("library-esm");
            expect(preset.bundler).toBe("both");
        });

        it("tsup outputs ESM only", () => {
            expect(preset.tsup?.format).toEqual(["esm"]);
            expect(preset.tsup?.target).toBe("es2022");
        });

        it("tsup enables dts resolve", () => {
            expect(preset.tsup?.dts).toEqual({ resolve: true });
        });

        it("unbuild disables CJS emit", () => {
            expect(preset.unbuild?.rollup?.emitCJS).toBe(false);
        });
    });

    describe("library-dual", () => {
        const preset = libraryPresets["library-dual"]!;

        it("has both ESM and CJS formats", () => {
            expect(preset.tsup?.format).toEqual(["esm", "cjs"]);
        });

        it("targets node18", () => {
            expect(preset.tsup?.target).toBe("node18");
        });

        it("unbuild emits CJS", () => {
            expect(preset.unbuild?.rollup?.emitCJS).toBe(true);
        });

        it("unbuild uses compatible declaration", () => {
            expect(preset.unbuild?.declaration).toBe("compatible");
        });
    });

    describe("library-browser", () => {
        const preset = libraryPresets["library-browser"]!;

        it("is tsup-only", () => {
            expect(preset.bundler).toBe("tsup");
            expect(preset.unbuild).toBeUndefined();
        });

        it("includes iife format", () => {
            expect(preset.tsup?.format).toContain("iife");
        });

        it("targets browser platform", () => {
            expect(preset.tsup?.platform).toBe("browser");
        });

        it("enables minification", () => {
            expect(preset.tsup?.minify).toBe(true);
        });

        it("sets a globalName", () => {
            expect(preset.tsup?.globalName).toBe("MyLib");
        });
    });

    describe("library-unbundled", () => {
        const preset = libraryPresets["library-unbundled"]!;

        it("is unbuild-only", () => {
            expect(preset.bundler).toBe("unbuild");
            expect(preset.tsup).toBeUndefined();
        });

        it("has mkdist entry", () => {
            const entries = preset.unbuild?.entries;
            expect(entries).toBeDefined();
            expect(entries).toHaveLength(2);
            expect(entries![1]).toMatchObject({
                builder: "mkdist",
                input: "src/",
                outDir: "dist/",
            });
        });
    });

    describe("library-monorepo", () => {
        const preset = libraryPresets["library-monorepo"]!;

        it("enables sourcemaps for both bundlers", () => {
            expect(preset.tsup?.sourcemap).toBe(true);
            expect(preset.unbuild?.sourcemap).toBe(true);
        });

        it("tsup skips node_modules bundling", () => {
            expect(preset.tsup?.skipNodeModulesBundle).toBe(true);
        });

        it("tsup enables clean builds", () => {
            expect(preset.tsup?.clean).toBe(true);
        });
    });

    it("every preset has name matching its key", () => {
        for (const [key, preset] of Object.entries(libraryPresets)) {
            expect(preset.name).toBe(key);
        }
    });

    it("every preset has a description", () => {
        for (const preset of Object.values(libraryPresets)) {
            expect(preset.description).toBeTruthy();
        }
    });
});
