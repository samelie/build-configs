import { z } from "zod";

/**
 * Zod schema for tsup format
 */
const TsupFormatSchema = z.enum(["cjs", "esm", "iife"]);

/**
 * Zod schema for tsup platform
 */
const TsupPlatformSchema = z.enum(["node", "browser", "neutral"]);

/**
 * Zod schema for tsup DTS configuration
 */
const TsupDtsSchema = z.union([
    z.boolean(),
    z.string(),
    z.object({
        entry: z.any().optional(),
        resolve: z
            .union([z.boolean(), z.array(z.union([z.string(), z.instanceof(RegExp)]))])
            .optional(),
        only: z.boolean().optional(),
        banner: z.string().optional(),
        footer: z.string().optional(),
        compilerOptions: z.any().optional(),
    }),
]);

/**
 * Zod schema for tsup entry
 */
const TsupEntrySchema = z.union([
    z.array(z.string()),
    z.record(z.string(), z.string()),
]);

/**
 * Zod schema for tsup configuration
 */
export const TsupConfigSchema = z.object({
    name: z.string().optional(),
    entry: TsupEntrySchema.optional(),
    entryPoints: TsupEntrySchema.optional(),
    format: z.union([TsupFormatSchema, z.array(TsupFormatSchema)]).optional(),
    outDir: z.string().optional(),
    target: z.union([z.string(), z.array(z.string())]).optional(),
    platform: TsupPlatformSchema.optional(),
    dts: TsupDtsSchema.optional(),
    experimentalDts: z
        .union([
            z.boolean(),
            z.string(),
            z.object({
                entry: z.any().optional(),
                compilerOptions: z.any().optional(),
            }),
        ])
        .optional(),
    sourcemap: z.union([z.boolean(), z.literal("inline")]).optional(),
    minify: z.union([z.boolean(), z.literal("terser")]).optional(),
    bundle: z.boolean().optional(),
    splitting: z.boolean().optional(),
    clean: z.union([z.boolean(), z.array(z.string())]).optional(),
    treeshake: z.any().optional(),
    external: z.array(z.union([z.string(), z.instanceof(RegExp)])).optional(),
    noExternal: z.array(z.union([z.string(), z.instanceof(RegExp)])).optional(),
    skipNodeModulesBundle: z.boolean().optional(),
    keepNames: z.boolean().optional(),
    watch: z
        .union([z.boolean(), z.string(), z.array(z.union([z.string(), z.boolean()]))])
        .optional(),
    ignoreWatch: z.union([z.array(z.string()), z.string()]).optional(),
    tsconfig: z.string().optional(),
    shims: z.boolean().optional(),
    cjsInterop: z.boolean().optional(),
    removeNodeProtocol: z.boolean().optional(),
});

/**
 * Zod schema for unbuild builder types
 */
const UnbuildBuilderSchema = z.enum(["rollup", "mkdist", "copy", "untyped"]);

/**
 * Zod schema for unbuild declaration
 */
const UnbuildDeclarationSchema = z.union([
    z.boolean(),
    z.literal("compatible"),
    z.literal("node16"),
]);

/**
 * Zod schema for unbuild entry
 */
const UnbuildEntrySchema = z.union([
    z.string(),
    z.object({
        builder: UnbuildBuilderSchema.optional(),
        input: z.string(),
        name: z.string().optional(),
        outDir: z.string().optional(),
        declaration: UnbuildDeclarationSchema.optional(),
        format: z.enum(["esm", "cjs"]).optional(),
        ext: z.string().optional(),
    }),
]);

/**
 * Zod schema for unbuild configuration
 */
export const UnbuildConfigSchema = z.object({
    name: z.string().optional(),
    rootDir: z.string().optional(),
    entries: z.array(UnbuildEntrySchema).optional(),
    outDir: z.string().optional(),
    clean: z.boolean().optional(),
    declaration: UnbuildDeclarationSchema.optional(),
    sourcemap: z.boolean().optional(),
    stub: z.boolean().optional(),
    watch: z.boolean().optional(),
    parallel: z.boolean().optional(),
    externals: z.array(z.union([z.string(), z.instanceof(RegExp)])).optional(),
    alias: z.record(z.string(), z.string()).optional(),
    replace: z.record(z.string(), z.string()).optional(),
    failOnWarn: z.boolean().optional(),
    rollup: z
        .object({
            emitCJS: z.boolean().optional(),
            cjsBridge: z.boolean().optional(),
            preserveDynamicImports: z.boolean().optional(),
            inlineDependencies: z
                .union([z.boolean(), z.array(z.union([z.string(), z.instanceof(RegExp)]))])
                .optional(),
        })
        .optional(),
});

/**
 * Validate a tsup configuration
 * @param config - Configuration to validate
 * @returns Validation result
 */
export function validateTsupConfig(config: unknown) {
    return TsupConfigSchema.safeParse(config);
}

/**
 * Validate an unbuild configuration
 * @param config - Configuration to validate
 * @returns Validation result
 */
export function validateUnbuildConfig(config: unknown) {
    return UnbuildConfigSchema.safeParse(config);
}

/**
 * Validate a configuration based on bundler type
 * @param config - Configuration to validate
 * @param bundler - Bundler type
 * @returns Validation result
 */
export function validateConfig(config: unknown, bundler: "tsup" | "unbuild") {
    if (bundler === "tsup") {
        return validateTsupConfig(config);
    }
    return validateUnbuildConfig(config);
}
