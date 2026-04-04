#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const allowlistedPublicKeys = new Set([
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_RISKDELTA_EDITION",
]);
const sensitiveKeyPattern = /(SECRET|PASSWORD|TOKEN|PRIVATE|ENCRYPTION|DATABASE|REDIS|MINIO|AUTH)/i;

function readFileIfExists(filePath) {
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf8");
}

function parseEnvKeys(contents) {
  return contents
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map((line) => line.split("=")[0]?.trim())
    .filter(Boolean);
}

function listFilesRecursive(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const queue = [dirPath];
  const files = [];
  while (queue.length > 0) {
    const current = queue.pop();
    if (!current) continue;
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(absolute);
      } else {
        files.push(absolute);
      }
    }
  }
  return files;
}

function scanNextPublicUsage() {
  const targetDir = path.join(root, "apps", "web");
  const files = listFilesRecursive(targetDir).filter((file) =>
    /\.(tsx?|jsx?|mjs|cjs)$/.test(file),
  );
  const found = new Set();
  const pattern = /NEXT_PUBLIC_[A-Z0-9_]+/g;
  for (const file of files) {
    const content = readFileIfExists(file);
    const matches = content.match(pattern);
    if (!matches) continue;
    for (const key of matches) found.add(key);
  }
  return [...found].sort();
}

function scanClientBundleForValues(secretValues) {
  const staticDir = path.join(root, "apps", "web", ".next", "static");
  const files = listFilesRecursive(staticDir).filter((file) => /\.(js|mjs|css|map)$/.test(file));
  const findings = [];
  for (const file of files) {
    const content = readFileIfExists(file);
    for (const value of secretValues) {
      if (value.length < 12) continue;
      if (content.includes(value)) {
        findings.push({ file, value });
      }
    }
  }
  return findings;
}

const envExample = readFileIfExists(path.join(root, ".env.example"));
const envLocal = readFileIfExists(path.join(root, ".env"));
const envKeys = [...new Set([...parseEnvKeys(envExample), ...parseEnvKeys(envLocal)])];

const suspiciousPublicEnvKeys = envKeys.filter(
  (key) => key.startsWith("NEXT_PUBLIC_") && !allowlistedPublicKeys.has(key),
);

const riskyPublicNames = envKeys.filter(
  (key) => key.startsWith("NEXT_PUBLIC_") && sensitiveKeyPattern.test(key),
);

const sourcePublicUsage = scanNextPublicUsage();
const unknownPublicUsage = sourcePublicUsage.filter((key) => !allowlistedPublicKeys.has(key));

const secretValuesFromEnv = envLocal
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"))
  .map((line) => {
    const [key, ...rest] = line.split("=");
    return { key, value: rest.join("=").replace(/^"(.*)"$/, "$1") };
  })
  .filter(({ key, value }) => sensitiveKeyPattern.test(key) && value && !/^replace-with/i.test(value))
  .map(({ value }) => value);

const bundleLeaks = scanClientBundleForValues(secretValuesFromEnv);

const failures = [];
if (suspiciousPublicEnvKeys.length > 0) {
  failures.push(
    `Unexpected NEXT_PUBLIC keys in env files: ${suspiciousPublicEnvKeys.join(", ")}`,
  );
}
if (riskyPublicNames.length > 0) {
  failures.push(`Sensitive-looking NEXT_PUBLIC keys found: ${riskyPublicNames.join(", ")}`);
}
if (unknownPublicUsage.length > 0) {
  failures.push(`Unknown NEXT_PUBLIC usage in source: ${unknownPublicUsage.join(", ")}`);
}
if (bundleLeaks.length > 0) {
  failures.push(
    `Potential secret literals found in client bundle: ${bundleLeaks
      .slice(0, 5)
      .map((item) => item.file)
      .join(", ")}`,
  );
}

if (failures.length > 0) {
  console.error("Public env audit failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Public env audit passed.");
