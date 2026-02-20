import { describe, expect, it } from "vitest";

import { cliPresets } from "../cli";

describe("cliPresets", () => {
    it("contains all expected preset keys", () => {
        expect(Object.keys(cliPresets)).toEqual([
            "cli-simple",
            "cli-multi",
            "cli-bundled",
        ]);
    });

    describe("cli-simple", () => {
        const preset = cliPresets["cli-simple"]!;

        it("supports both bundlers", () => {
            expect(preset.bundler).toBe("both");
        });

        it("tsup targets node platform", () => {
            expect(preset.tsup?.platform).toBe("node");
            expect(preset.tsup?.target).toBe("node18");
        });

        it("tsup disables dts (CLIs don't need type defs)", () => {
            expect(preset.tsup?.dts).toBe(false);
        });

        it("tsup enables shims for CJS/ESM compat", () => {
            expect(preset.tsup?.shims).toBe(true);
        });

        it("tsup entry points to cli.ts", () => {
            expect(preset.tsup?.entry).toEqual(["src/cli.ts"]);
        });

        it("unbuild disables declaration", () => {
            expect(preset.unbuild?.declaration).toBe(false);
        });

        it("unbuild entry is src/cli", () => {
            expect(preset.unbuild?.entries).toEqual(["src/cli"]);
        });
    });

    describe("cli-multi", () => {
        const preset = cliPresets["cli-multi"]!;

        it("tsup has multiple entry points as object", () => {
            expect(preset.tsup?.entry).toEqual({
                cli: "src/cli.ts",
                index: "src/index.ts",
            });
        });

        it("tsup enables dts for programmatic usage", () => {
            expect(preset.tsup?.dts).toBe(true);
        });

        it("tsup outputs both ESM and CJS", () => {
            expect(preset.tsup?.format).toEqual(["esm", "cjs"]);
        });

        it("unbuild enables declaration", () => {
            expect(preset.unbuild?.declaration).toBe(true);
        });

        it("unbuild emits CJS", () => {
            expect(preset.unbuild?.rollup?.emitCJS).toBe(true);
        });

        it("unbuild has two entries", () => {
            expect(preset.unbuild?.entries).toEqual(["src/cli", "src/index"]);
        });
    });

    describe("cli-bundled", () => {
        const preset = cliPresets["cli-bundled"]!;

        it("is tsup-only", () => {
            expect(preset.bundler).toBe("tsup");
            expect(preset.unbuild).toBeUndefined();
        });

        it("bundles all dependencies", () => {
            expect(preset.tsup?.skipNodeModulesBundle).toBe(false);
        });

        it("uses noExternal to include all deps", () => {
            expect(preset.tsup?.noExternal).toBeDefined();
            expect(preset.tsup?.noExternal).toHaveLength(1);
        });

        it("enables minification and treeshaking", () => {
            expect(preset.tsup?.minify).toBe(true);
            expect(preset.tsup?.treeshake).toBe(true);
        });

        it("disables dts", () => {
            expect(preset.tsup?.dts).toBe(false);
        });
    });

    it("every preset targets node platform where tsup is defined", () => {
        for (const preset of Object.values(cliPresets)) {
            if (preset.tsup) {
                expect(preset.tsup.platform).toBe("node");
            }
        }
    });

    it("every preset has name matching its key", () => {
        for (const [key, preset] of Object.entries(cliPresets)) {
            expect(preset.name).toBe(key);
        }
    });
});
