#!/usr/bin/env bash
set -euo pipefail

if ! command -v gitleaks >/dev/null 2>&1; then
  echo "gitleaks not found. Install from https://github.com/gitleaks/gitleaks"
  exit 1
fi

gitleaks detect --config .gitleaks.toml --redact --source .
