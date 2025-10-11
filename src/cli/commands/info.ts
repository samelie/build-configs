import { loadConfig, discoverConfigFile, getPackageJson } from "../utils/config-loader";
import { logger, logBox, colors } from "../utils/logger";

interface InfoCommandOptions {
    config?: string;
}

/**
 * Info command handler - Show build configuration and environment info
 */
export async function infoCommand(options: InfoCommandOptions): Promise<void> {
    try {
        logger.start("Gathering project information...\n");

        // Get package.json
        const pkg = await getPackageJson();
        const projectName = pkg?.name ?? "unknown";
        const projectVersion = pkg?.version ?? "0.0.0";

        // Discover config file
        const configPath = await discoverConfigFile(
            process.cwd(),
            options.config,
        );

        // Load config if exists
        let bundler: "tsup" | "unbuild" | "none" = "none";
        let config: any = {};

        if (configPath) {
            const loaded = await loadConfig({
                ...(options.config && { configPath: options.config }),
                bundler: "auto",
            });
            bundler = loaded.bundler;
            config = loaded.config;
        }

        // Display project info
        logBox("Project Information", [
            `Name:    ${colors.primary(projectName)}`,
            `Version: ${colors.primary(projectVersion)}`,
            `Config:  ${configPath ? colors.file(configPath) : colors.dim("not found")}`,
            `Bundler: ${bundler !== "none" ? colors.bundler(bundler) : colors.dim("not configured")}`,
        ]);

        // Display build configuration
        if (bundler !== "none") {
            console.log("\n" + colors.bold("Build Configuration:"));

            if (bundler === "tsup") {
                const tsupConfig = config as any;
                console.log(colors.dim("├─") + " Entry:      " + JSON.stringify(tsupConfig.entry ?? ["src/index.ts"]));
                console.log(colors.dim("├─") + " Format:     " + JSON.stringify(tsupConfig.format ?? ["esm", "cjs"]));
                console.log(
                    colors.dim("├─") + " Target:     " + (tsupConfig.target ?? "node18"),
                );
                console.log(
                    colors.dim("├─") + " Platform:   " + (tsupConfig.platform ?? "node"),
                );
                console.log(
                    colors.dim("├─") + " DTS:        " + (tsupConfig.dts !== false ? colors.success("✓") : colors.dim("✗")),
                );
                console.log(
                    colors.dim("├─") + " Sourcemap:  " +
                        (tsupConfig.sourcemap !== false ? colors.success("✓") : colors.dim("✗")),
                );
                console.log(
                    colors.dim("├─") + " Minify:     " + (tsupConfig.minify ? colors.success("✓") : colors.dim("✗")),
                );
                console.log(
                    colors.dim("└─") + " Clean:      " +
                        (tsupConfig.clean !== false ? colors.success("✓") : colors.dim("✗")),
                );
            } else {
                const unbuildConfig = config as any;
                console.log(
                    colors.dim("├─") + " Entries:      " +
                        JSON.stringify(unbuildConfig.entries ?? ["src/index"]),
                );
                console.log(
                    colors.dim("├─") + " Out Dir:      " + (unbuildConfig.outDir ?? "dist"),
                );
                console.log(
                    colors.dim("├─") + " Declaration:  " +
                        (unbuildConfig.declaration !== false
                            ? colors.success("✓")
                            : colors.dim("✗")),
                );
                console.log(
                    colors.dim("├─") + " Emit CJS:     " +
                        (unbuildConfig.rollup?.emitCJS
                            ? colors.success("✓")
                            : colors.dim("✗")),
                );
                console.log(
                    colors.dim("├─") + " Sourcemap:    " +
                        (unbuildConfig.sourcemap ? colors.success("✓") : colors.dim("✗")),
                );
                console.log(
                    colors.dim("├─") + " Parallel:     " +
                        (unbuildConfig.parallel !== false
                            ? colors.success("✓")
                            : colors.dim("✗")),
                );
                console.log(
                    colors.dim("└─") + " Clean:        " +
                        (unbuildConfig.clean !== false
                            ? colors.success("✓")
                            : colors.dim("✗")),
                );
            }
        }

        // Display package.json exports
        if (pkg?.exports) {
            console.log("\n" + colors.bold("Package Exports:"));
            console.log(JSON.stringify(pkg.exports, null, 2));
        }

        // Display scripts
        if (pkg?.scripts) {
            const buildScripts = Object.entries(pkg.scripts).filter(
                ([key]) => key.includes("build") || key.includes("watch"),
            );

            if (buildScripts.length > 0) {
                console.log("\n" + colors.bold("Build Scripts:"));
                buildScripts.forEach(([name, script]) => {
                    console.log(`  ${colors.command(name.padEnd(20))} ${colors.dim(script as string)}`);
                });
            }
        }

        // Show next steps if not configured
        if (bundler === "none") {
            console.log("\n" + colors.warning("⚠ No build configuration found"));
            console.log(
                colors.info("\nRun ") +
                    colors.command("rad-build init") +
                    colors.info(" to set up your project"),
            );
        }
    } catch (error) {
        logger.error("Failed to gather information", error as Error);
        process.exit(1);
    }
}
