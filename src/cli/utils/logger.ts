import { consola } from "consola";
import pc from "picocolors";

/**
 * Custom logger instance with colorized output
 */
export const logger = consola.create({
    formatOptions: {
        colors: true,
        compact: false,
        date: false,
    },
});

/**
 * Color utilities for consistent styling
 */
export const colors = {
    primary: pc.cyan,
    success: pc.green,
    warning: pc.yellow,
    error: pc.red,
    info: pc.blue,
    dim: pc.dim,
    bold: pc.bold,
    bundler: pc.magenta,
    file: pc.yellow,
    command: pc.green,
};

/**
 * Log a formatted success message
 */
export function logSuccess(message: string): void {
    logger.success(colors.success(message));
}

/**
 * Log a formatted error message
 */
export function logError(message: string, error?: Error): void {
    logger.error(colors.error(message));
    if (error) {
        logger.error(colors.dim(error.message));
        if (error.stack) {
            logger.error(colors.dim(error.stack));
        }
    }
}

/**
 * Log a formatted warning message
 */
export function logWarning(message: string): void {
    logger.warn(colors.warning(message));
}

/**
 * Log a formatted info message
 */
export function logInfo(message: string): void {
    logger.info(colors.info(message));
}

/**
 * Log a formatted step message
 */
export function logStep(step: number, total: number, message: string): void {
    logger.info(
        `${colors.dim(`[${step}/${total}]`)} ${colors.primary(message)}`,
    );
}

/**
 * Log a formatted file path
 */
export function logFile(action: string, path: string): void {
    logger.info(`${colors.success(action)} ${colors.file(path)}`);
}

/**
 * Log bundler selection
 */
export function logBundler(bundler: "tsup" | "unbuild"): void {
    logger.info(`Using bundler: ${colors.bundler(bundler)}`);
}

/**
 * Create a box for prominent messages
 */
export function logBox(title: string, content: string[]): void {
    const maxLength = Math.max(
        title.length,
        ...content.map((line) => line.length),
    );
    const border = "─".repeat(maxLength + 4);

    console.log(colors.primary(`┌${border}┐`));
    console.log(
        colors.primary(`│  ${colors.bold(title.padEnd(maxLength))}  │`),
    );
    console.log(colors.primary(`├${border}┤`));
    content.forEach((line) => {
        console.log(colors.primary(`│  ${line.padEnd(maxLength)}  │`));
    });
    console.log(colors.primary(`└${border}┘`));
}
