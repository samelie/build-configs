import type { Options as TsupOptions } from "tsup";
import type { BuildConfig as UnbuildConfig } from "unbuild";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import * as p from "@clack/prompts";
import { getPreset, listPresets } from "../../presets";
import {
    generatePackageJsonExports,
    generatePackageJsonScripts,
    generateTsupConfig,
    generateUnbuildConfig,
} from "../templates";
import { getPackageJson, updatePackageJson } from "../utils/config-loader";
import { colors, logError } from "../utils/logger";

interface InitCommandOptions {
    bundler?: "tsup" | "unbuild";
    preset?: string;
    force?: boolean;
}

/**
 * Init command handler - Interactive project initialization
 */
export async function initCommand(options: InitCommandOptions): Promise<void> {
    try {
        p.intro(colors.bold("Welcome to @adddog/build-configs!"));

        // Check if config already exists
        const tsupConfigExists = existsSync("tsup.config.ts");
        const buildConfigExists = existsSync("build.config.ts");

        if ((tsupConfigExists || buildConfigExists) && !options.force) {
            const shouldOverwrite = await p.confirm({
                message: "Config file already exists. Overwrite?",
                initialValue: false,
            });

            if (p.isCancel(shouldOverwrite) || !shouldOverwrite) {
                p.cancel("Operation cancelled");
                process.exit(0);
            }
        }

        // 1. Choose bundler
        const bundler =
            options.bundler ??
            (await p.select({
                message: "Which bundler do you prefer?",
                options: [
                    {
                        value: "unbuild",
                        label: "unbuild",
                        hint: "Preserves file structure, better for libraries",
                    },
                    {
                        value: "tsup",
                        label: "tsup",
                        hint: "Faster builds, bundles everything",
                    },
                ],
            }));

        if (p.isCancel(bundler)) {
            p.cancel("Operation cancelled");
            process.exit(0);
        }

        // 2. Choose preset or custom
        const usePreset = await p.select({
            message: "Start with a preset or custom config?",
            options: [
                { value: "preset", label: "Use a preset" },
                { value: "custom", label: "Custom configuration" },
            ],
        });

        if (p.isCancel(usePreset)) {
            p.cancel("Operation cancelled");
            process.exit(0);
        }

        let selectedPreset: string | undefined;
        let finalConfig: Partial<TsupOptions & UnbuildConfig> = {};

        if (usePreset === "preset") {
            // Get presets for selected bundler
            const availablePresets = listPresets().filter(name => {
                const preset = getPreset(name);
                return (
                    preset &&
                    (preset.bundler === bundler || preset.bundler === "both")
                );
            });

            const presetChoice = await p.select({
                message: "Select a preset:",
                options: availablePresets.map(name => {
                    const preset = getPreset(name)!;
                    return {
                        value: name,
                        label: name,
                        hint: preset.description,
                    };
                }),
            });

            selectedPreset = String(presetChoice);

            if (p.isCancel(selectedPreset)) {
                p.cancel("Operation cancelled");
                process.exit(0);
            }

            const preset = getPreset(selectedPreset as string);
            if (preset) {
                finalConfig = (bundler === "tsup" ? preset.tsup ?? {} : preset.unbuild ?? {}) as Partial<TsupOptions & UnbuildConfig>;
            }
        } else {
            // Custom configuration
            const formats = await p.multiselect({
                message: "Output formats?",
                options: [
                    { value: "esm", label: "ESM (modern)" },
                    { value: "cjs", label: "CommonJS (compatibility)" },
                    ...(bundler === "tsup"
                        ? [{ value: "iife", label: "IIFE (browser global)" }]
                        : []),
                ],
                initialValues: ["esm"],
                required: true,
            });

            if (p.isCancel(formats)) {
                p.cancel("Operation cancelled");
                process.exit(0);
            }

            const features = await p.multiselect({
                message: "Additional features?",
                options: [
                    { value: "sourcemaps", label: "Generate sourcemaps" },
                    { value: "minify", label: "Minify output" },
                    { value: "declarations", label: "TypeScript declarations" },
                ],
                initialValues: ["sourcemaps", "declarations"],
            });

            if (p.isCancel(features)) {
                p.cancel("Operation cancelled");
                process.exit(0);
            }

            // Build config from answers
            const formatsArray = formats as string[];
            finalConfig = {
                format: formatsArray as TsupOptions["format"],
                sourcemap: (features as string[]).includes("sourcemaps"),
                minify: (features as string[]).includes("minify"),
            };

            if (bundler === "tsup") {
                finalConfig.dts = (features as string[]).includes("declarations");
            } else {
                finalConfig.declaration = (features as string[]).includes(
                    "declarations",
                );
                finalConfig.rollup = {
                    emitCJS: (formats as string[]).includes("cjs"),
                };
            }
        }

        // Generate and write config file
        const spinner = p.spinner();
        spinner.start("Creating configuration files...");

        try {
            // Write config file
            const configFileName =
                bundler === "tsup" ? "tsup.config.ts" : "build.config.ts";
            const configContent =
                bundler === "tsup"
                    ? generateTsupConfig(finalConfig as Partial<TsupOptions>)
                    : generateUnbuildConfig(finalConfig as Partial<UnbuildConfig>);

            await writeFile(join(process.cwd(), configFileName), configContent);

            // Update package.json
            const pkg = await getPackageJson();
            if (pkg) {
                const scripts = generatePackageJsonScripts(bundler);
                const formatArray = Array.isArray(finalConfig.format)
                    ? finalConfig.format
                    : finalConfig.format
                        ? [finalConfig.format]
                        : ["esm", "cjs"];
                const exports = generatePackageJsonExports(
                    bundler,
                    formatArray as string[],
                );

                const pkgScripts = typeof pkg.scripts === "object" && pkg.scripts !== null
                    ? (pkg.scripts as Record<string, string>)
                    : {};

                await updatePackageJson({
                    scripts: { ...pkgScripts, ...scripts },
                    exports,
                    main:
                        formatArray.includes("cjs") ||
                        finalConfig.rollup?.emitCJS
                            ? "./dist/index.cjs"
                            : undefined,
                    module: "./dist/index.mjs",
                    types: "./dist/index.d.ts",
                    files: ["dist"],
                });
            }

            spinner.stop("Configuration created successfully!");

            p.outro(
                colors.success(`
Next steps:
  1. ${colors.command("pnpm install")} - Install dependencies
  2. ${colors.command("pnpm build")} - Build your project
  3. Edit ${colors.file(configFileName)} to customize

${selectedPreset ? `Using preset: ${colors.primary(selectedPreset)}` : ""}

Happy building! 🚀
            `),
            );
        } catch (error) {
            spinner.stop("Failed to create configuration");
            throw error;
        }
    } catch (error) {
        logError("Initialization failed", error as Error);
        process.exit(1);
    }
}
