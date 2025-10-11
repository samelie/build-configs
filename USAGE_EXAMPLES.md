# Usage Examples & Verification Commands

This document provides practical examples and verification commands to test all features of `@adddog/build-configs`.

## Table of Contents

1. [Setup & Installation](#setup--installation)
2. [CLI Commands Verification](#cli-commands-verification)
3. [Programmatic API Examples](#programmatic-api-examples)
4. [Preset Testing](#preset-testing)
5. [Build Verification](#build-verification)
6. [Integration Testing](#integration-testing)

---

## Setup & Installation

### Install in a test project

```bash
# Create a test project
mkdir test-project && cd test-project
npm init -y

# Install @adddog/build-configs
npm install @adddog/build-configs

# Or link locally during development
cd /path/to/samelie-monorepo/packages/build-configs
pnpm link --global
cd /path/to/test-project
pnpm link --global @adddog/build-configs
```

### Verify installation

```bash
# Check CLI is available
npx rad-build --version

# Should output version number
```

---

## CLI Commands Verification

### 1. `rad-build init` - Interactive Initialization

```bash
# Test interactive init
npx rad-build init

# Expected prompts:
# 1. Choose bundler (tsup or unbuild)
# 2. Choose preset or custom
# 3. Select output formats
# 4. Select features

# Verify outputs:
ls -la | grep -E "(tsup|build).config.ts"  # Config file created
cat package.json | grep -A 5 "scripts"     # Scripts updated
cat package.json | grep -A 10 "exports"    # Exports added
```

**Test with force flag:**
```bash
# Create config first
npx rad-build init

# Then force overwrite
npx rad-build init --force

# Should overwrite without prompting
```

**Test with preset:**
```bash
npx rad-build init --preset library-dual

# Verify:
# - Config file uses preset settings
# - package.json has dual format exports
```

### 2. `rad-build` - Build Command

```bash
# Create a simple source file first
mkdir -p src
echo 'export const hello = "world";' > src/index.ts

# Run build
npx rad-build

# Verify outputs:
ls -la dist/                    # Check dist directory exists
ls dist/ | grep -E "\.(mjs|cjs|d\.ts)"  # Check output files

# Check file contents
cat dist/index.mjs              # Should contain transpiled code
cat dist/index.d.ts             # Should contain type declarations
```

**Test with CLI flags:**
```bash
# Build with specific format
npx rad-build --format esm

# Verify only ESM output
ls dist/*.mjs && ! ls dist/*.cjs

# Build with minification
npx rad-build --minify

# Verify minified output (smaller file size)
wc -c dist/index.mjs
```

**Test with config file:**
```bash
# Create custom config
cat > custom.config.ts << 'EOF'
import { makeTsupConfig } from "@adddog/build-configs/tsup";

export default makeTsupConfig({
  entry: ["src/index.ts"],
  minify: true,
  target: "es2022",
});
EOF

# Build with custom config
npx rad-build --config custom.config.ts

# Verify custom settings applied
```

### 3. `rad-build watch` - Watch Mode

```bash
# Start watch mode (in background)
npx rad-build watch &
WATCH_PID=$!

# Make a change
echo 'export const updated = true;' >> src/index.ts

# Wait for rebuild
sleep 3

# Verify rebuild occurred
cat dist/index.mjs | grep "updated"

# Cleanup
kill $WATCH_PID
```

### 4. `rad-build validate` - Config Validation

```bash
# Test with valid config
npx rad-build validate

# Expected output:
# ✓ Configuration is valid!
# Configuration summary: ...

echo $?  # Should be 0 (success)
```

**Test with invalid config:**
```bash
# Create invalid config
cat > tsup.config.ts << 'EOF'
export default {
  invalidOption: true,
  format: "invalid-format",
};
EOF

# Run validation
npx rad-build validate

# Expected output:
# ✗ Configuration validation failed
# Validation errors: ...

echo $?  # Should be non-zero (failure)
```

### 5. `rad-build info` - Project Information

```bash
# Show project info
npx rad-build info

# Expected output sections:
# - Project Information (name, version, config, bundler)
# - Build Configuration (entry, format, features)
# - Package Exports
# - Build Scripts

# Verify specific fields
npx rad-build info | grep "Bundler:"
npx rad-build info | grep "Entry:"
npx rad-build info | grep "Format:"
```

### 6. `rad-build list-presets` - List Available Presets

```bash
# List all presets
npx rad-build list-presets

# Expected output:
# Available Presets
# LIBRARY
#   library-esm - Modern ESM-only library
#   library-dual - Library with both ESM and CJS outputs
#   ...
# CLI
#   cli-simple - Simple CLI tool with single entry point
#   ...
# COMPONENT
#   react-component - React component library
#   ...

# Count presets
npx rad-build list-presets | grep -c "^  "  # Should be ~11
```

---

## Programmatic API Examples

### 1. Unified API (defineBuildConfig)

**Test with tsup:**
```typescript
// test-tsup-unified.config.ts
import { defineBuildConfig } from "@adddog/build-configs";

export default defineBuildConfig({
  type: "tsup",
  options: {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    minify: true,
  },
});
```

**Verify:**
```bash
npx tsup --config test-tsup-unified.config.ts
ls dist/*.{mjs,cjs} # Both formats should exist
```

**Test with unbuild:**
```typescript
// test-unbuild-unified.config.ts
import { defineBuildConfig } from "@adddog/build-configs";

export default defineBuildConfig({
  type: "unbuild",
  options: {
    entries: ["src/index"],
    rollup: { emitCJS: true },
  },
});
```

**Verify:**
```bash
npx unbuild --config test-unbuild-unified.config.ts
ls dist/*.{mjs,cjs}
```

### 2. Direct API

**tsup direct:**
```typescript
// direct-tsup.config.ts
import { makeTsupConfig } from "@adddog/build-configs/tsup";

export default makeTsupConfig({
  entry: ["src/index.ts", "src/utils.ts"],
  format: ["esm"],
});
```

**Verify:**
```bash
npx tsup
ls dist/{index,utils}.mjs  # Both entries should exist
```

**unbuild direct:**
```typescript
// direct-unbuild.config.ts
import { makeUnbuildConfig } from "@adddog/build-configs/unbuild";

export default makeUnbuildConfig({
  entries: ["src/index", "src/utils"],
});
```

**Verify:**
```bash
npx unbuild
ls dist/{index,utils}.mjs
```

---

## Preset Testing

### Test Each Preset

**Library Presets:**
```bash
# Test library-esm
npx rad-build init --preset library-esm --force
npx rad-build
ls dist/*.mjs && ! ls dist/*.cjs  # Only ESM

# Test library-dual
npx rad-build init --preset library-dual --force
npx rad-build
ls dist/*.{mjs,cjs}  # Both formats

# Test library-browser
npx rad-build init --preset library-browser --force
npx rad-build
ls dist/*.{mjs,cjs,global.js}  # All formats including IIFE

# Test library-monorepo
npx rad-build init --preset library-monorepo --force
npx rad-build
cat package.json | grep "workspace:"  # Should support workspace protocol
```

**CLI Presets:**
```bash
# Create CLI entry
echo '#!/usr/bin/env node\nconsole.log("Hello CLI");' > src/cli.ts

# Test cli-simple
npx rad-build init --preset cli-simple --force
npx rad-build
node dist/cli.mjs  # Should output: Hello CLI

# Test cli-bundled
npx rad-build init --preset cli-bundled --force
npx rad-build
ls -lh dist/cli.mjs  # Should be larger (bundled)
```

**Component Presets:**
```bash
# Create component
mkdir -p src/components
echo 'export const Button = () => "button";' > src/components/Button.ts

# Test react-component
npx rad-build init --preset react-component --force
cat package.json | grep -A 5 "peerDependencies"  # Should have react
npx rad-build
ls dist/components/Button.{mjs,d.ts}
```

---

## Build Verification

### Verify Build Outputs

```bash
# Build with all options
npx rad-build --format esm,cjs --dts --sourcemap --minify

# Verify all outputs
verify_build() {
  echo "Checking build outputs..."

  # Check formats
  [[ -f "dist/index.mjs" ]] && echo "✓ ESM output" || echo "✗ ESM missing"
  [[ -f "dist/index.cjs" ]] && echo "✓ CJS output" || echo "✗ CJS missing"

  # Check declarations
  [[ -f "dist/index.d.ts" ]] && echo "✓ Type declarations" || echo "✗ Declarations missing"

  # Check sourcemaps
  [[ -f "dist/index.mjs.map" ]] && echo "✓ Sourcemaps" || echo "✗ Sourcemaps missing"

  # Check minification (file size should be smaller)
  size=$(wc -c < dist/index.mjs)
  [[ $size -lt 5000 ]] && echo "✓ Minified ($size bytes)" || echo "⚠ Large file ($size bytes)"
}

verify_build
```

### Verify Package.json Updates

```bash
# Verify exports field
verify_exports() {
  local pkg="package.json"

  echo "Verifying package.json exports..."

  # Check exports exist
  jq '.exports' $pkg > /dev/null && echo "✓ Exports field exists" || echo "✗ Exports missing"

  # Check types
  jq -e '.exports["."].types' $pkg > /dev/null && echo "✓ Types export" || echo "✗ Types missing"

  # Check import
  jq -e '.exports["."].import' $pkg > /dev/null && echo "✓ Import export" || echo "✗ Import missing"

  # Check require (if CJS)
  jq -e '.exports["."].require' $pkg > /dev/null && echo "✓ Require export" || echo "⚠ No CJS export"
}

verify_exports
```

### Verify Type Declarations

```bash
# Test TypeScript can use the built types
cat > test-types.ts << 'EOF'
import { hello } from "./dist/index";

const test: string = hello;  // Should type-check
console.log(test);
EOF

# Run TypeScript compiler
npx tsc --noEmit test-types.ts

echo $?  # Should be 0 (no errors)
```

---

## Integration Testing

### Test in Real Project

```bash
# Create test library
mkdir test-lib && cd test-lib
npm init -y

# Setup with @adddog/build-configs
npx rad-build init --preset library-dual

# Create source
mkdir src
cat > src/index.ts << 'EOF'
export function add(a: number, b: number): number {
  return a + b;
}

export const VERSION = "1.0.0";
EOF

cat > src/utils.ts << 'EOF'
export function multiply(a: number, b: number): number {
  return a * b;
}
EOF

# Build
npx rad-build

# Test outputs
node -e "const { add } = require('./dist/index.cjs'); console.log(add(2, 3));"  # Should output: 5
node --input-type=module -e "import { add } from './dist/index.mjs'; console.log(add(2, 3));"  # Should output: 5

# Verify types
npx tsc --noEmit
```

### Test CLI Tool Build

```bash
# Create CLI project
mkdir test-cli && cd test-cli
npm init -y

# Setup
npx rad-build init --preset cli-simple

# Create CLI
mkdir src
cat > src/cli.ts << 'EOF'
#!/usr/bin/env node
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    name: { type: "string", default: "World" },
  },
});

console.log(`Hello, ${values.name}!`);
EOF

# Build
npx rad-build

# Make executable
chmod +x dist/cli.mjs

# Test
./dist/cli.mjs  # Should output: Hello, World!
./dist/cli.mjs --name=Claude  # Should output: Hello, Claude!
```

---

## Complete Verification Script

Create a comprehensive test script:

```bash
#!/bin/bash
# verify-all.sh - Complete verification script

set -e  # Exit on error

echo "=== @adddog/build-configs Verification ==="
echo ""

# 1. Version check
echo "1. Checking version..."
npx rad-build --version
echo "✓ Version check passed"
echo ""

# 2. List presets
echo "2. Listing presets..."
npx rad-build list-presets | grep -q "library-dual"
echo "✓ Presets available"
echo ""

# 3. Initialize project
echo "3. Initializing project with preset..."
npx rad-build init --preset library-dual --force
[[ -f "build.config.ts" ]] || [[ -f "tsup.config.ts" ]]
echo "✓ Config created"
echo ""

# 4. Create source
echo "4. Creating source files..."
mkdir -p src
echo 'export const test = "hello";' > src/index.ts
echo "✓ Source created"
echo ""

# 5. Validate config
echo "5. Validating configuration..."
npx rad-build validate
echo "✓ Config valid"
echo ""

# 6. Show info
echo "6. Showing project info..."
npx rad-build info | grep -q "Bundler:"
echo "✓ Info displayed"
echo ""

# 7. Build
echo "7. Building project..."
npx rad-build
[[ -d "dist" ]]
echo "✓ Build successful"
echo ""

# 8. Verify outputs
echo "8. Verifying outputs..."
ls dist/*.mjs > /dev/null
ls dist/*.d.ts > /dev/null
echo "✓ Outputs verified"
echo ""

# 9. Test import
echo "9. Testing imports..."
node -e "const m = require('./dist/index.cjs'); console.log(m);"
echo "✓ Imports working"
echo ""

echo "=== All Verifications Passed! ==="
```

**Run verification:**
```bash
chmod +x verify-all.sh
./verify-all.sh
```

---

## Summary Checklist

Use this checklist to verify all functionality:

- [ ] Installation successful
- [ ] `rad-build --version` works
- [ ] `rad-build init` creates config
- [ ] `rad-build init --preset X` works for all presets
- [ ] `rad-build` builds successfully
- [ ] `rad-build --format esm,cjs` produces both formats
- [ ] `rad-build --minify` reduces file size
- [ ] `rad-build watch` responds to file changes
- [ ] `rad-build validate` checks config
- [ ] `rad-build info` shows project details
- [ ] `rad-build list-presets` shows all presets
- [ ] Programmatic API (defineBuildConfig) works
- [ ] Direct API (makeTsupConfig/makeUnbuildConfig) works
- [ ] All presets build successfully
- [ ] Type declarations generated
- [ ] Sourcemaps generated
- [ ] Package.json updated correctly
- [ ] Built files are importable (CJS/ESM)

---

## Next Steps

After verification:

1. Test in real monorepo packages
2. Update existing projects to use @adddog/build-configs
3. Create custom presets for project-specific needs
4. Report any issues or suggestions

Happy building! 🚀
