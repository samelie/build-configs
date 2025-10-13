#!/usr/bin/env node

import { cac } from "cac";
import { version } from "../../package.json";
// Import commands (will be created next)
import { buildCommand } from "./commands/build";

import { infoCommand } from "./commands/info";
import { initCommand } from "./commands/init";
import { validateCommand } from "./commands/validate";
import { watchCommand } from "./commands/watch";
import { colors, logBox, logger } from "./utils/logger";

const cli = cac("rad-build");

// Global version and help
cli.version(version).help();

// Build command (default)
cli
    .command("[...entries]", "Build your project")
    .option("--config <path>", "Path to config file")
    .option("--preset <name>", "Use a preset configuration")
    .option("--bundler <bundler>", "Specify bundler: tsup or unbuild")
    .option("--format <formats>", "Output formats (comma-separated)")
    .option("--minify", "Minify output")
    .option("--watch", "Watch mode")
    .option("--sourcemap", "Generate sourcemaps")
    .option("--dts", "Generate TypeScript declarations")
    .option("--clean", "Clean output directory before build")
    .action(buildCommand);

// Init command
cli
    .command("init", "Initialize build configuration")
    .option("--bundler <bundler>", "Specify bundler: tsup or unbuild")
    .option("--preset <name>", "Use a preset configuration")
    .option("--force", "Overwrite existing config")
    .action(initCommand);

// Validate command
cli
    .command("validate", "Validate build configuration")
    .option("--config <path>", "Path to config file")
    .option("--bundler <bundler>", "Specify bundler: tsup or unbuild")
    .action(validateCommand);

// Info command
cli
    .command("info", "Show build configuration and environment info")
    .option("--config <path>", "Path to config file")
    .action(infoCommand);

// Watch command
cli
    .command("watch", "Watch and rebuild on file changes")
    .option("--config <path>", "Path to config file")
    .option("--preset <name>", "Use a preset configuration")
    .option("--bundler <bundler>", "Specify bundler: tsup or unbuild")
    .action(watchCommand);

// List presets command
cli.command("list-presets", "List all available presets").action(async () => {
    const { presetCategories } = await import("../presets");

    logBox("Available Presets", [
        "",
        ...Object.entries(presetCategories).flatMap(([category, presets]) => [
            colors.bold(category.toUpperCase()),
            ...Object.entries(presets).map(
                ([name, preset]) =>
                    `  ${colors.primary(name.padEnd(25))} - ${colors.dim(preset.description)}`,
            ),
            "",
        ]),
    ]);
});

// Parse CLI arguments
cli.parse();

// Handle errors
process.on("unhandledRejection", error => {
    logger.error("Unhandled error:", error as Error);
    process.exit(1);
});
