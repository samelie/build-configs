import { describe, expect, it } from "vitest";

import { defineBuildConfig } from "../index";

describe("defineBuildConfig", () => {
    it("returns tsup config when type is tsup", () => {
        const config = defineBuildConfig({
            type: "tsup",
        });
        expect(config).toBeDefined();
        // tsup configs have format array
        expect(config.format).toBeDefined();
    });

    it("returns unbuild config (array) when type is unbuild", () => {
        const configs = defineBuildConfig({
            type: "unbuild",
        });
        expect(configs).toBeDefined();
        // unbuild's defineBuildConfig returns BuildConfig[]
        expect(Array.isArray(configs)).toBe(true);
        const config = (configs as unknown[])[0] as Record<string, unknown>;
        expect(config.entries).toBeDefined();
    });

    it("passes tsup options through to makeTsupConfig", () => {
        const config = defineBuildConfig({
            type: "tsup",
            options: {
                entry: ["src/main.ts"],
                format: ["esm"],
            },
        });
        expect(config.entry).toEqual(["src/main.ts"]);
        expect(config.format).toEqual(["esm"]);
    });

    it("passes unbuild options through to makeUnbuildConfig", () => {
        const configs = defineBuildConfig({
            type: "unbuild",
            options: {
                entries: ["src/main"],
            },
        });
        const config = (configs as unknown[])[0] as Record<string, unknown>;
        expect(config.entries).toEqual(["src/main"]);
    });

    it("uses defaults when options is empty for tsup", () => {
        const config = defineBuildConfig({
            type: "tsup",
            options: {},
        });
        expect(config.entry).toEqual(["src/index.ts"]);
        expect(config.format).toEqual(["esm", "cjs"]);
    });

    it("uses defaults when options is empty for unbuild", () => {
        const configs = defineBuildConfig({
            type: "unbuild",
            options: {},
        });
        const config = (configs as unknown[])[0] as Record<string, unknown>;
        expect(config.entries).toEqual(["src/index"]);
        expect(config.declaration).toBe("compatible");
    });
});
