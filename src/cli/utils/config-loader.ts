import type { Options as TsupOptions } from "tsup";
import type { BuildConfig as UnbuildConfig } from "unbuild";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { defu } from "defu";
import { createJiti } from "jiti";
import { getPreset } from "../../presets";
import { logger } from "./logger";

/**
 * Config file names to search for (in order of priority)
 */
const CONFIG_FILES = [
    "build.config.ts",
    "build.config.js",
    "build.config.mjs",
    "build.config.cjs",
    "tsup.config.ts",
    "tsup.config.js",
    "tsup.config.mjs",
    ".radbuildrc.ts",
    ".radbuildrc.js",
    ".radbuildrc.json",
];

/**
 * Detect which bundler is being used based on existing config files
 */
export async function detectBundler(
    cwd: string = process.cwd(),
): Promise<"tsup" | "unbuild" | null> {
    // Check for tsup config
    for (const file of ["tsup.config.ts", "tsup.config.js", "tsup.config.mjs"]) {
        if (existsSync(join(cwd, file))) {
            return "tsup";
        }
    }

    // Check for unbuild config
    for (const file of [
        "build.config.ts",
        "build.config.js",
        "build.config.mjs",
    ]) {
        if (existsSync(join(cwd, file))) {
            const configPath = join(cwd, file);
            try {
                const jiti = createJiti(cwd, {
                    interopDefault: true,
                });
                const config = (await jiti.import(configPath)) as any;

                // Check if config has unbuild-specific properties
                if (
                    config.entries ||
                    config.rollup ||
                    (config[0] && config[0].entries)
                ) {
                    return "unbuild";
                }
            } catch {
                // If we can't load the config, continue
            }
        }
    }

    // Check package.json scripts
    try {
        const pkgPath = join(cwd, "package.json");
        if (existsSync(pkgPath)) {
            const pkg = JSON.parse(await readFile(pkgPath, "utf-8"));
            if (pkg.scripts?.build) {
                if (pkg.scripts.build.includes("tsup")) return "tsup";
                if (pkg.scripts.build.includes("unbuild")) return "unbuild";
            }
        }
    } catch {
        // Ignore errors
    }

    return null;
}

/**
 * Discover config file in the current working directory
 */
export async function discoverConfigFile(
    cwd: string = process.cwd(),
    customPath?: string,
): Promise<string | null> {
    // If custom path provided, use it
    if (customPath) {
        const fullPath = resolve(cwd, customPath);
        if (existsSync(fullPath)) {
            return fullPath;
        }
        logger.warn(`Custom config file not found: ${customPath}`);
        return null;
    }

    // Search for config files
    for (const file of CONFIG_FILES) {
        const fullPath = join(cwd, file);
        if (existsSync(fullPath)) {
            return fullPath;
        }
    }

    // Check package.json for config
    const pkgPath = join(cwd, "package.json");
    if (existsSync(pkgPath)) {
        try {
            const pkg = JSON.parse(await readFile(pkgPath, "utf-8"));
            if (pkg.radbuild) {
                return pkgPath;
            }
        } catch {
            // Ignore errors
        }
    }

    return null;
}

/**
 * Load config from a file
 */
export async function loadConfigFile<T = TsupOptions | UnbuildConfig>(
    configPath: string,
    cwd: string = process.cwd(),
): Promise<T | null> {
    try {
        // Handle package.json config
        if (configPath.endsWith("package.json")) {
            const pkg = JSON.parse(await readFile(configPath, "utf-8"));
            return (pkg.radbuild as T) || null;
        }

        // Handle JSON config
        if (configPath.endsWith(".json")) {
            return JSON.parse(await readFile(configPath, "utf-8")) as T;
        }

        // Handle JS/TS config with jiti
        const jiti = createJiti(cwd, {
            interopDefault: true,
        });

        const config = (await jiti.import(configPath)) as T;

        return config;
    } catch (error) {
        logger.error(
            `Failed to load config from ${configPath}`,
            error as Error,
        );
        return null;
    }
}

/**
 * Load and merge configuration from multiple sources
 */
export async function loadConfig(options: {
    cwd?: string;
    configPath?: string;
    preset?: string;
    bundler?: "tsup" | "unbuild" | "auto";
    cliFlags?: Partial<TsupOptions | UnbuildConfig>;
}): Promise<{
    config: TsupOptions | UnbuildConfig;
    bundler: "tsup" | "unbuild";
    configPath: string | null;
}> {
    const cwd = options.cwd ?? process.cwd();

    // 1. Detect bundler if not specified
    let bundler = options.bundler === "auto" ? null : options.bundler;
    if (!bundler) {
        bundler = (await detectBundler(cwd)) ?? "unbuild";
    }

    // 2. Load preset if specified
    let presetConfig = {};
    if (options.preset) {
        const preset = getPreset(options.preset);
        if (preset) {
            presetConfig =
                bundler === "tsup" ? preset.tsup ?? {} : preset.unbuild ?? {};
            logger.info(`Using preset: ${preset.name}`);
        } else {
            logger.warn(`Preset not found: ${options.preset}`);
        }
    }

    // 3. Discover and load project config
    const configPath = await discoverConfigFile(cwd, options.configPath);
    let projectConfig = {};
    if (configPath) {
        const loaded = await loadConfigFile(configPath, cwd);
        if (loaded) {
            projectConfig = loaded;
            logger.info(`Loaded config from: ${configPath}`);
        }
    }

    // 4. Merge configs (right takes precedence)
    const config = defu(
        options.cliFlags ?? {},
        projectConfig,
        presetConfig,
        {}, // Default config is applied in the makers
    );

    return {
        config,
        bundler,
        configPath,
    };
}

/**
 * Get package.json from current directory
 */
export async function getPackageJson(
    cwd: string = process.cwd(),
): Promise<Record<string, any> | null> {
    try {
        const pkgPath = join(cwd, "package.json");
        if (!existsSync(pkgPath)) return null;

        return JSON.parse(await readFile(pkgPath, "utf-8"));
    } catch {
        return null;
    }
}

/**
 * Update package.json with new fields
 */
export async function updatePackageJson(
    updates: Record<string, any>,
    cwd: string = process.cwd(),
): Promise<void> {
    const { writeFile } = await import("node:fs/promises");
    const pkgPath = join(cwd, "package.json");

    const pkg = (await getPackageJson(cwd)) ?? {};
    const updated = defu(updates, pkg);

    await writeFile(pkgPath, `${JSON.stringify(updated, null, 2)}\n`);
}
