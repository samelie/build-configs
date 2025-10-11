import { buildCommand } from "./build";
import { logger } from "../utils/logger";

interface WatchCommandOptions {
    config?: string;
    preset?: string;
    bundler?: "tsup" | "unbuild";
}

/**
 * Watch command handler - Rebuild on file changes
 */
export async function watchCommand(options: WatchCommandOptions): Promise<void> {
    logger.info("Starting watch mode...");

    // Delegate to build command with watch flag
    await buildCommand([], {
        ...options,
        watch: true,
    });
}
