#!/usr/bin/env node
/**
 * Sincroniza variáveis de .env.local para o projeto Vercel linkado.
 * Requer: vercel login + vercel link (ou VERCEL_ORG_ID + VERCEL_PROJECT_ID).
 *
 * Uso: node scripts/sync-vercel-env.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envFile = join(root, ".env.local");

const REQUIRED_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const OPTIONAL_KEYS = ["DATABASE_URL", "RESEND_API_KEY", "EMAIL_FROM", "NEXT_PUBLIC_SITE_URL"];

const ENVIRONMENTS = ["production", "preview", "development"];

function parseEnvFile(path) {
  const vars = new Map();
  if (!existsSync(path)) return vars;

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    vars.set(key, value);
  }
  return vars;
}

function runVercel(args, input) {
  const result = spawnSync("npx", ["vercel", ...args], {
    cwd: root,
    input,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
  return result;
}

function envExists(key, environment) {
  const result = runVercel(["env", "ls", environment]);
  return result.stdout.includes(key);
}

function isSensitiveKey(key) {
  return /(?:KEY|SECRET|TOKEN|PASSWORD|DATABASE_URL)/i.test(key);
}

function addEnv(key, value, environment) {
  const args = [
    "env",
    "add",
    key,
    environment,
    "--force",
    "--yes",
    "--value",
    value,
  ];
  if (isSensitiveKey(key)) args.push("--sensitive");

  const result = runVercel(args);
  if (result.status !== 0) {
    const msg = (result.stderr || result.stdout || "").trim();
    throw new Error(`Falha ao adicionar ${key} (${environment}): ${msg}`);
  }
}

function main() {
  const vars = parseEnvFile(envFile);
  if (vars.size === 0) {
    console.error("Nenhuma variável encontrada em .env.local");
    process.exit(1);
  }

  const whoami = runVercel(["whoami"]);
  if (whoami.status !== 0) {
    console.error("Vercel CLI não autenticado. Execute: npx vercel login");
    process.exit(1);
  }

  const missing = REQUIRED_KEYS.filter((key) => !vars.get(key)?.trim());
  if (missing.length > 0) {
    console.error(`Variáveis obrigatórias ausentes em .env.local: ${missing.join(", ")}`);
    process.exit(1);
  }

  const keysToSync = [...REQUIRED_KEYS, ...OPTIONAL_KEYS.filter((key) => vars.get(key)?.trim())];

  console.log(`Sincronizando ${keysToSync.length} variáveis para Vercel (${ENVIRONMENTS.join(", ")})…`);

  for (const environment of ENVIRONMENTS) {
    for (const key of keysToSync) {
      const value = vars.get(key);
      if (!value?.trim()) continue;

      const exists = envExists(key, environment);
      if (exists) {
        console.log(`  ↷ ${key} (${environment}) — já existe, atualizando…`);
      } else {
        console.log(`  + ${key} (${environment})`);
      }
      addEnv(key, value, environment);
    }
  }

  console.log("\nConcluído. Faça um novo deploy: npm run deploy");
}

main();
