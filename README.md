# @rad/build-configs

Reusable build configurations and CLI for [tsup](https://tsup.egoist.dev/) and [unbuild](https://github.com/unjs/unbuild) with sensible defaults, presets, and interactive setup.

## Features

- 🚀 **CLI Tool** - Interactive project initialization and build commands
- 📦 **Preset System** - Pre-configured setups for common use cases
- 🔧 **Smart Defaults** - Optimized configurations for Node.js libraries
- 🎯 **Type-Safe** - Full TypeScript support with discriminated unions
- 🔍 **Config Validation** - Zod-based validation for build configs
- 📝 **Auto-Discovery** - Automatically detects bundler and configuration files

## Installation

```bash
npm install @rad/build-configs
# or
pnpm add @rad/build-configs
# or
yarn add @rad/build-configs
```

## Quick Start

### Interactive Initialization

The fastest way to get started:

```bash
npx rad-build init
```

This will guide you through:
1. Choosing a bundler (tsup or unbuild)
2. Selecting a preset or custom configuration
3. Configuring output formats and features
4. Automatically updating package.json

### Build Your Project

```bash
npx rad-build
```

That's it! The CLI will detect your bundler and configuration automatically.

## CLI Commands

### `rad-build` (default)
Build your project with the configured bundler.

```bash
# Build with auto-detected config
rad-build

# Build with specific config file
rad-build --config custom.config.ts

# Build with preset
rad-build --preset library-dual

# Build with CLI overrides
rad-build --format esm,cjs --minify

# Build specific entries
rad-build src/index.ts src/cli.ts
```

**Options:**
- `--config <path>` - Path to config file
- `--preset <name>` - Use a preset configuration
- `--bundler <bundler>` - Specify bundler: `tsup` or `unbuild`
- `--format <formats>` - Output formats (comma-separated)
- `--minify` - Minify output
- `--watch` - Watch mode
- `--sourcemap` - Generate sourcemaps
- `--dts` - Generate TypeScript declarations
- `--clean` - Clean output directory before build

### `rad-build init`
Initialize build configuration interactively.

```bash
# Interactive setup
rad-build init

# Skip prompts with preset
rad-build init --preset library-esm

# Force overwrite existing config
rad-build init --force
```

### `rad-build watch`
Watch and rebuild on file changes.

```bash
rad-build watch

# With specific config
rad-build watch --config custom.config.ts
```

### `rad-build validate`
Validate your build configuration.

```bash
rad-build validate

# Validate specific config
rad-build validate --config tsup.config.ts
```

### `rad-build info`
Show build configuration and environment information.

```bash
rad-build info
```

### `rad-build list-presets`
List all available presets.

```bash
rad-build list-presets
```

## Programmatic API

### Unified API (Recommended)

```typescript
import { defineBuildConfig } from "@rad/build-configs";

// For tsup
export default defineBuildConfig({
  type: "tsup",
  options: {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
  },
});

// For unbuild
export default defineBuildConfig({
  type: "unbuild",
  options: {
    entries: ["src/index"],
  },
});
```

### Direct API

**tsup.config.ts:**
```typescript
import { makeTsupConfig } from "@rad/build-configs/tsup";

export default makeTsupConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
});
```

**build.config.ts:**
```typescript
import { makeUnbuildConfig } from "@rad/build-configs/unbuild";

export default makeUnbuildConfig({
  entries: ["src/index"],
  rollup: {
    emitCJS: true,
  },
});
```

## Presets

### Library Presets

- **`library-esm`** - Modern ESM-only library
- **`library-dual`** - Library with both ESM and CJS outputs
- **`library-browser`** - Browser-compatible library with IIFE
- **`library-unbundled`** - File-to-file transpilation with mkdist
- **`library-monorepo`** - Optimized for monorepo internal packages

### CLI Presets

- **`cli-simple`** - Simple CLI tool with single entry point
- **`cli-multi`** - CLI tool with multiple commands
- **`cli-bundled`** - CLI tool with all dependencies bundled

### Component Presets

- **`react-component`** - React component library
- **`vue-component`** - Vue component library
- **`web-component`** - Framework-agnostic web components
- **`design-system`** - Design system with components and tokens

### Using Presets

**Via CLI:**
```bash
rad-build init --preset library-dual
```

**Programmatically:**
```typescript
import { getPreset } from "@rad/build-configs/presets";

const preset = getPreset("library-dual");
```

## unbuild vs tsup: Key Differences

### When to use unbuild

✅ **Best for:**
- Building libraries with multiple entry points
- Preserving source file structure
- File-to-file transpilation (mkdist)
- Monorepo packages
- Advanced hooks and customization

**Output:**
```
src/
  index.ts
  utils.ts
dist/
  index.mjs    ← Separate files
  utils.mjs
```

**Key Features:**
- Multiple builders: `rollup`, `mkdist`, `copy`, `untyped`
- Stub mode for development (no rebuild needed)
- Auto-inference from package.json
- Extensive lifecycle hooks

### When to use tsup

✅ **Best for:**
- Fastest possible builds (powered by esbuild)
- Simple libraries with 1-2 entry points
- Bundling everything together
- IIFE format for browsers
- Zero-config setup

**Output:**
```
src/
  index.ts
  utils.ts
dist/
  index.js     ← Bundled together
```

**Key Features:**
- Lightning-fast esbuild-based bundling
- Code splitting for ESM
- CSS support (experimental)
- Multiple output formats: ESM, CJS, IIFE
- Terser minification

### Comparison Table

| Feature | unbuild | tsup |
|---------|---------|------|
| **Speed** | Fast (Rollup) | Fastest (esbuild) |
| **Bundling** | Unbundled by default | Bundled by default |
| **File Structure** | Preserved | Single output |
| **Entry Points** | Multiple | Multiple |
| **Output Formats** | ESM, CJS | ESM, CJS, IIFE |
| **Declaration Files** | ✓ (compatible/node16) | ✓ (with resolve) |
| **Source Maps** | ✓ | ✓ |
| **Tree Shaking** | ✓ (Rollup) | ✓ (esbuild + optional Rollup) |
| **Code Splitting** | Per file | Smart chunking |
| **Watch Mode** | ✓ (experimental) | ✓ |
| **Stub Mode** | ✓ | ✗ |
| **CSS Support** | Via plugins | ✓ (experimental) |
| **Hooks** | Extensive | Limited |
| **Config Complexity** | More options | Simpler |

## Default Configurations

### tsup Defaults

```typescript
{
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: {
    resolve: true,
    compilerOptions: { strict: true }
  },
  bundle: true,
  splitting: false,
  treeshake: true,
  clean: true,
  sourcemap: true,
  target: "node18",
  platform: "node",
  minify: false,
  keepNames: true,
  skipNodeModulesBundle: true,
  external: [/node_modules/]
}
```

### unbuild Defaults

```typescript
{
  entries: ["src/index"],
  outDir: "dist",
  declaration: "compatible",
  sourcemap: true,
  clean: true,
  parallel: true,
  failOnWarn: false,
  rollup: {
    emitCJS: false,
    inlineDependencies: false,
    esbuild: {
      target: "node18",
      minify: false
    }
  }
}
```

## Advanced Usage

### Custom Config with Preset

```typescript
import { makeTsupConfig } from "@rad/build-configs/tsup";
import { getPreset } from "@rad/build-configs/presets";

const preset = getPreset("library-dual");

export default makeTsupConfig({
  ...preset.tsup,
  // Override preset settings
  minify: true,
  target: "es2022",
});
```

### File-to-File Transpilation (unbuild)

```typescript
import { makeUnbuildConfig } from "@rad/build-configs/unbuild";

export default makeUnbuildConfig({
  entries: [
    "src/index",
    {
      builder: "mkdist",
      input: "src/components/",
      outDir: "dist/components/",
    },
  ],
});
```

### Multiple Builds

```typescript
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig([
  {
    name: "main",
    entries: ["src/index"],
  },
  {
    name: "minified",
    entries: ["src/index"],
    outDir: "dist/min",
    rollup: {
      esbuild: {
        minify: true,
      },
    },
  },
]);
```

## Configuration Discovery

The CLI automatically discovers configuration in this order:

1. CLI `--config` flag
2. `build.config.{ts,js,mjs,cjs}`
3. `tsup.config.{ts,js,mjs}`
4. `.radbuildrc.{ts,js,json}`
5. `radbuild` key in `package.json`

## Migration

### From tsup to unbuild

```bash
# Your existing tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
});

# Convert to unbuild
import { makeUnbuildConfig } from "@rad/build-configs/unbuild";

export default makeUnbuildConfig({
  entries: ["src/index"],
  rollup: {
    emitCJS: true,  // For CJS output
  },
});
```

### From unbuild to tsup

```bash
# Your existing build.config.ts
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index"],
  rollup: {
    emitCJS: true,
  },
});

# Convert to tsup
import { makeTsupConfig } from "@rad/build-configs/tsup";

export default makeTsupConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
});
```

## Troubleshooting

### Build fails with "Cannot find module"

Ensure dependencies are installed:
```bash
pnpm install unbuild tsup
```

### CLI command not found

Link the package locally:
```bash
pnpm link @rad/build-configs
```

### Config validation fails

Run validation to see specific errors:
```bash
rad-build validate
```

### Types not generated

Ensure `declaration` (unbuild) or `dts` (tsup) is enabled:
```typescript
// tsup
export default makeTsupConfig({
  dts: true,
});

// unbuild
export default makeUnbuildConfig({
  declaration: true,
});
```

## API Reference

See [API Documentation](./docs/api.md) for complete API reference.

## License

MIT
