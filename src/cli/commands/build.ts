import type { Options as TsupOptions } from "tsup";
import type { BuildConfig as UnbuildConfig } from "unbuild";
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execa } from "execa";
import { makeTsupConfig } from "../../tsup.config";
import { makeUnbuildConfig } from "../../unbuild.config";
import { loadConfig } from "../utils/config-loader";
import { logBundler, logError, logger, logSuccess } from "../utils/logger";

interface BuildCommandOptions {
    config?: string;
    preset?: string;
    bundler?: "tsup" | "unbuild";
    format?: string;
    minify?: boolean;
    watch?: boolean;
    sourcemap?: boolean;
    dts?: boolean;
    clean?: boolean;
}

/**
 * Build command handler
 */
export async function buildCommand(
    entries: string[],
    options: BuildCommandOptions,
): Promise<void> {
    try {
        logger.start("Building project...");

        // Parse CLI flags
        const cliFlags: Partial<TsupOptions> & Partial<UnbuildConfig> = {};
        if (options.format) {
            (cliFlags as any).format = options.format.split(",");
        }
        if (options.minify !== undefined) {
            (cliFlags as any).minify = options.minify;
        }
        if (options.sourcemap !== undefined) {
            cliFlags.sourcemap = options.sourcemap;
        }
        if (options.dts !== undefined) {
            (cliFlags as any).dts = options.dts;
            (cliFlags as any).declaration = options.dts;
        }
        if (options.clean !== undefined) {
            cliFlags.clean = options.clean;
        }
        if (entries.length > 0) {
            (cliFlags as TsupOptions).entry = entries;
            (cliFlags as UnbuildConfig).entries = entries;
        }

        // Load merged config
        const { config, bundler, configPath } = await loadConfig({
            ...(options.config && { configPath: options.config }),
            ...(options.preset && { preset: options.preset }),
            bundler: options.bundler ?? "auto",
            cliFlags,
        });

        logBundler(bundler);

        // Create temporary config file for the build
        const tempConfigPath = join(
            process.cwd(),
            `.rad-build-temp.${bundler === "tsup" ? "tsup" : "build"}.config.js`,
        );

        try {
            // Generate final config
            const finalConfig =
                bundler === "tsup"
                    ? makeTsupConfig(config as TsupOptions)
                    : makeUnbuildConfig(config as UnbuildConfig);

            // Write temp config
            const configContent = `export default ${JSON.stringify(finalConfig, null, 2)}`;
            writeFileSync(tempConfigPath, configContent);

            // Run the appropriate bundler
            if (bundler === "tsup") {
                await execa(
                    "tsup",
                    [
                        "--config",
                        tempConfigPath,
                        ...(options.watch ? ["--watch"] : []),
                    ],
                    {
                        stdio: "inherit",
                        cwd: process.cwd(),
                    },
                );
            } else {
                await execa(
                    "unbuild",
                    [
                        ...(options.watch ? ["--watch"] : []),
                        ...(configPath ? [] : ["--config", tempConfigPath]),
                    ],
                    {
                        stdio: "inherit",
                        cwd: process.cwd(),
                    },
                );
            }

            logSuccess("Build completed successfully!");
        } finally {
            // Clean up temp config
            if (existsSync(tempConfigPath)) {
                try {
                    const { unlinkSync } = await import("node:fs");
                    unlinkSync(tempConfigPath);
                } catch {
                    // Ignore cleanup errors
                }
            }
        }
    } catch (error) {
        logError("Build failed", error as Error);
        process.exit(1);
    }
}
