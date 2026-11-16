#!/usr/bin/env bash
#
# Deploy Fragmós to Vercel.
#
#   ./deploy.sh                 Preview deploy (safe default, gives you a unique URL)
#   ./deploy.sh --prod          Production deploy (asks for confirmation first)
#   ./deploy.sh --prod --yes    Production deploy without the confirmation prompt
#   ./deploy.sh --skip-checks   Skip the local lint and build checks
#   ./deploy.sh --help          Show this help
#
# First run: it logs you in and links the folder to a Vercel project if needed.
# Server env vars (GEMINI_API_KEY and friends) live in Vercel, not in this repo.
# Set them once with:  npx vercel env add GEMINI_API_KEY production

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

PROD=false
YES=false
SKIP_CHECKS=false

for arg in "$@"; do
  case "$arg" in
    --prod) PROD=true ;;
    --yes|-y) YES=true ;;
    --skip-checks) SKIP_CHECKS=true ;;
    --help|-h)
      sed -n '2,13p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "Unknown option: $arg (try --help)" >&2
      exit 1
      ;;
  esac
done

if [ -t 1 ]; then
  BOLD=$'\033[1m'; DIM=$'\033[2m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; RED=$'\033[31m'; RESET=$'\033[0m'
else
  BOLD=""; DIM=""; GREEN=""; YELLOW=""; RED=""; RESET=""
fi

step() { echo; echo "${BOLD}==> $*${RESET}"; }
ok()   { echo "${GREEN}ok${RESET} $*"; }
warn() { echo "${YELLOW}warning${RESET} $*"; }
die()  { echo "${RED}error${RESET} $*" >&2; exit 1; }

# ---------------------------------------------------------------- tooling

step "Checking tools"

command -v node >/dev/null 2>&1 || die "Node is not installed."
command -v npm  >/dev/null 2>&1 || die "npm is not installed."

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
NODE_MINOR="$(node -p 'process.versions.node.split(".")[1]')"
if [ "$NODE_MAJOR" -lt 20 ] || { [ "$NODE_MAJOR" -eq 20 ] && [ "$NODE_MINOR" -lt 9 ]; }; then
  die "Next.js 16 needs Node 20.9 or newer. You have $(node -v)."
fi
ok "Node $(node -v)"

if command -v vercel >/dev/null 2>&1; then
  VERCEL=(vercel)
  ok "Using installed Vercel CLI $(vercel --version 2>/dev/null | head -n1)"
else
  VERCEL=(npx --yes vercel@latest)
  warn "Vercel CLI not installed, using npx (slower on first run). Install it with: npm i -g vercel"
fi

# ---------------------------------------------------------------- checks

if [ ! -d node_modules ]; then
  step "Installing dependencies"
  npm ci
fi

if [ "$SKIP_CHECKS" = false ]; then
  step "Linting"
  npm run lint
  ok "Lint passed"

  step "Building locally"
  npm run build
  ok "Build passed"
else
  warn "Skipping lint and build checks"
fi

# ---------------------------------------------------------------- account and project

step "Checking Vercel login"
if ! "${VERCEL[@]}" whoami >/dev/null 2>&1; then
  echo "You are not logged in. Opening login."
  "${VERCEL[@]}" login
fi
ok "Logged in as $("${VERCEL[@]}" whoami 2>/dev/null | tail -n1)"

step "Checking project link"
if [ ! -f .vercel/project.json ]; then
  echo "This folder is not linked to a Vercel project yet."
  "${VERCEL[@]}" link
fi
ok "Linked ($(node -p 'const p=require("./.vercel/project.json");p.projectName||p.projectId' 2>/dev/null || echo ".vercel/project.json"))"

# ---------------------------------------------------------------- environment

TARGET="preview"
if [ "$PROD" = true ]; then
  TARGET="production"
fi

step "Checking server environment ($TARGET)"
ENV_LIST="$("${VERCEL[@]}" env ls "$TARGET" 2>/dev/null || true)"
if echo "$ENV_LIST" | grep -q "GEMINI_API_KEY"; then
  ok "GEMINI_API_KEY is set for $TARGET"
else
  warn "GEMINI_API_KEY is not set for $TARGET."
  echo "${DIM}   People can still paste their own key in Settings, but the built in Gemini key will not work.${RESET}"
  echo "${DIM}   Add it with: ${VERCEL[*]} env add GEMINI_API_KEY $TARGET${RESET}"
fi

# ---------------------------------------------------------------- deploy

if [ "$PROD" = true ]; then
  if [ "$YES" = false ]; then
    echo
    read -r -p "${BOLD}Deploy to PRODUCTION?${RESET} Type 'yes' to continue: " answer
    if [ "$answer" != "yes" ]; then
      die "Cancelled. Nothing was deployed."
    fi
  fi
  step "Deploying to production"
  URL="$("${VERCEL[@]}" deploy --prod --yes)"
else
  step "Deploying a preview"
  URL="$("${VERCEL[@]}" deploy --yes)"
fi

echo
ok "Deployed: ${BOLD}${URL}${RESET}"
if [ "$PROD" = false ]; then
  echo "${DIM}   This is a preview. Run ./deploy.sh --prod to go live.${RESET}"
fi
