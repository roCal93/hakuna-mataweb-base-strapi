import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

if (process.env.SKIP_ENSURE_NATIVE_DEPS === '1') {
    process.exit(0);
}

// This is primarily to protect Linux CI/container builds where the install step
// can be cached (e.g. Railpack) and optional native deps were previously omitted.
if (process.platform !== 'linux') {
    process.exit(0);
}

const arch = process.arch;

// Map to the most common native packages used by Strapi's admin tooling.
// Rollup:
const rollupPackage =
    arch === 'x64'
        ? '@rollup/rollup-linux-x64-gnu'
        : arch === 'arm64'
            ? '@rollup/rollup-linux-arm64-gnu'
            : null;

// SWC:
const swcPackage =
    arch === 'x64'
        ? '@swc/core-linux-x64-gnu'
        : arch === 'arm64'
            ? '@swc/core-linux-arm64-gnu'
            : null;

function isModulePresent(pkgName) {
    if (!pkgName) return true;
    try {
        require.resolve(pkgName);
        return true;
    } catch {
        return false;
    }
}

// Fallback for cases where require.resolve isn't reliable due to partial installs.
function isPackageDirPresent(pkgName) {
    if (!pkgName) return true;
    const path = new URL(`../node_modules/${pkgName}/package.json`, import.meta.url);
    return existsSync(path);
}

const missing = [];
if (!isModulePresent(rollupPackage) && !isPackageDirPresent(rollupPackage)) missing.push(rollupPackage);
if (!isModulePresent(swcPackage) && !isPackageDirPresent(swcPackage)) missing.push(swcPackage);

if (missing.length === 0) {
    process.exit(0);
}

console.log(`[ensure-native-deps] Missing native optional deps on linux/${arch}: ${missing.join(', ')}`);
console.log('[ensure-native-deps] Running npm install --include=optional to repair...');

execSync('npm install --include=optional --no-audit --no-fund', {
    stdio: 'inherit',
    env: {
        ...process.env,
        // Ensure optional deps are not omitted.
        NPM_CONFIG_OPTIONAL: 'true',
    },
});
