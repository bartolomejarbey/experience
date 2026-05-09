#!/usr/bin/env node
// Runs after every Claude turn ends:
//   1. Prettier --write on files changed in this branch (vs HEAD)
//   2. tsc --noEmit on the whole project
// Exit non-zero on tsc failure → Claude sees the error and can fix it.

import { execSync } from "node:child_process";

const FORMAT_GLOB = /\.(ts|tsx|css|md|mdx|json|mjs|cjs|js|jsx)$/;

function sh(cmd) {
  return execSync(cmd, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

// 1. Format files changed in this branch.
try {
  const changed = sh("git diff --name-only HEAD")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((f) => FORMAT_GLOB.test(f));

  if (changed.length > 0) {
    const args = changed.map((f) => `"${f}"`).join(" ");
    try {
      execSync(`npx prettier --write ${args}`, { stdio: "inherit" });
    } catch {
      // Prettier syntax errors are real — let typecheck below surface them
      // with a more useful message.
    }
  }
} catch {
  // Not in a git repo, or no HEAD yet (first commit). Skip silently.
}

// 2. Typecheck the project.
try {
  execSync("npx tsc --noEmit --pretty", { stdio: "inherit" });
} catch {
  process.exit(1);
}
