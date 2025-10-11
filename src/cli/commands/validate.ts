import { loadConfig, discoverConfigFile } from "../utils/config-loader";
import { validateConfig } from "../utils/validators";
import { logger, logSuccess, logError, colors } from "../utils/logger";

interface ValidateCommandOptions {
    config?: string;
    bundler?: "tsup" | "unbuild";
}

/**
 * Validate command handler - Validate build configuration
 */
export async function validateCommand(
    options: ValidateCommandOptions,
): Promise<void> {
    try {
        logger.start("Validating configuration...");

        // Discover config file
        const configPath = await discoverConfigFile(
            process.cwd(),
            options.config,
        );

        if (!configPath) {
            logError("No configuration file found");
            logger.info("Run 'rad-build init' to create a configuration file");
            process.exit(1);
        }

        logger.info(`Found config: ${colors.file(configPath)}`);

        // Load config
        const { config, bundler } = await loadConfig({
            ...(options.config && { configPath: options.config }),
            bundler: options.bundler ?? "auto",
        });

        logger.info(`Detected bundler: ${colors.bundler(bundler)}`);

        // Validate config
        const result = validateConfig(config, bundler);

        if (result.success) {
            logSuccess("✓ Configuration is valid!");

            // Show some config details
            logger.info("\nConfiguration summary:");
            if (bundler === "tsup") {
                const tsupConfig = config as any;
                logger.info(`  Entry: ${JSON.stringify(tsupConfig.entry ?? ["src/index.ts"])}`);
                logger.info(`  Format: ${JSON.stringify(tsupConfig.format ?? ["esm", "cjs"])}`);
                logger.info(`  DTS: ${tsupConfig.dts !== false ? "enabled" : "disabled"}`);
                logger.info(
                    `  Sourcemap: ${tsupConfig.sourcemap !== false ? "enabled" : "disabled"}`,
                );
            } else {
                const unbuildConfig = config as any;
                logger.info(
                    `  Entries: ${JSON.stringify(unbuildConfig.entries ?? ["src/index"])}`,
                );
                logger.info(
                    `  Declaration: ${unbuildConfig.declaration !== false ? "enabled" : "disabled"}`,
                );
                logger.info(
                    `  CJS: ${unbuildConfig.rollup?.emitCJS ? "enabled" : "disabled"}`,
                );
            }
        } else {
            logError("✗ Configuration validation failed");

            // Show validation errors
            if (result.error) {
                logger.error("\nValidation errors:");
                result.error.errors.forEach((err) => {
                    logger.error(`  ${colors.error("•")} ${err.path.join(".")}: ${err.message}`);
                });
            }

            process.exit(1);
        }
    } catch (error) {
        logError("Validation failed", error as Error);
        process.exit(1);
    }
}
