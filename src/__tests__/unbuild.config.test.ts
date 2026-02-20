import { describe, expect, it } from "vitest";

import { makeUnbuildConfig } from "../unbuild.config";

/**
 * makeUnbuildConfig wraps defineBuildConfig from unbuild which returns BuildConfig[].
 * Access [0] for the single config object.
 */
describe("makeUnbuildConfig", () => {
    it("returns an array with one config entry", () => {
        const configs = makeUnbuildConfig();
        expect(Array.isArray(configs)).toBe(true);
        expect(configs).toHaveLength(1);
    });

    it("sets default entries to src/index", () => {
        const config = makeUnbuildConfig()[0]!;
        expect(config.entries).toEqual(["src/index"]);
    });

    it("sets default outDir to dist", () => {
        const config = makeUnbuildConfig()[0]!;
        expect(config.outDir).toBe("dist");
    });

    it("uses compatible declaration by default", () => {
        const config = makeUnbuildConfig()[0]!;
        expect(config.declaration).toBe("compatible");
    });

    it("enables sourcemap by default", () => {
        const config = makeUnbuildConfig()[0]!;
        expect(config.sourcemap).toBe(true);
    });

    it("enables clean by default", () => {
        const config = makeUnbuildConfig()[0]!;
        expect(config.clean).toBe(true);
    });

    it("enables parallel by default", () => {
        const config = makeUnbuildConfig()[0]!;
        expect(config.parallel).toBe(true);
    });

    it("disables failOnWarn by default", () => {
        const config = makeUnbuildConfig()[0]!;
        expect(config.failOnWarn).toBe(false);
    });

    it("disables CJS emit by default", () => {
        const config = makeUnbuildConfig()[0]!;
        expect(config.rollup?.emitCJS).toBe(false);
    });

    it("disables inline dependencies by default", () => {
        const config = makeUnbuildConfig()[0]!;
        expect(config.rollup?.inlineDependencies).toBe(false);
    });

    it("targets node18 via esbuild by default", () => {
        const config = makeUnbuildConfig()[0]!;
        const esbuild = config.rollup?.esbuild;
        expect(esbuild && esbuild.target).toBe("node18");
    });

    it("disables esbuild minify by default", () => {
        const config = makeUnbuildConfig()[0]!;
        const esbuild = config.rollup?.esbuild;
        expect(esbuild && esbuild.minify).toBe(false);
    });

    it("allows overriding entries", () => {
        const config = makeUnbuildConfig({
            entries: ["src/index", "src/cli"],
        })[0]!;
        expect(config.entries).toEqual(["src/index", "src/cli"]);
    });

    it("allows overriding rollup.emitCJS", () => {
        const config = makeUnbuildConfig({
            rollup: { emitCJS: true },
        })[0]!;
        // ...c spread overwrites the merged rollup object
        expect(config.rollup?.emitCJS).toBe(true);
    });

    it("allows overriding declaration", () => {
        const config = makeUnbuildConfig({
            declaration: false,
        })[0]!;
        expect(config.declaration).toBe(false);
    });

    it("allows overriding outDir", () => {
        const config = makeUnbuildConfig({
            outDir: "build",
        })[0]!;
        expect(config.outDir).toBe("build");
    });

    it("allows mkdist entries", () => {
        const config = makeUnbuildConfig({
            entries: [
                "src/index",
                {
                    builder: "mkdist",
                    input: "src/components/",
                    outDir: "dist/components/",
                },
            ],
        })[0]!;
        expect(config.entries).toHaveLength(2);
    });
});
