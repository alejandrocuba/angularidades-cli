#!/bin/bash

# Angularidades Ops - Initialization Script

# Function to get color from JS logger
get_color() {
    node -e "const {colors} = require('./scripts/publisher/logger'); console.log(colors['$1'] || '')" | sed 's/\x1b/\\033/g'
}

# Reuse colors from logger.js
RESET=$(get_color 'reset')
BOLD=$(get_color 'bold')
BLUE=$(get_color 'blue')
GREEN=$(get_color 'green')
RED=$(get_color 'red')
CYAN=$(get_color 'cyan')
YELLOW=$(get_color 'yellow')

# Icons (Unified with logger.js style)
CHECK="${GREEN}✔${RESET}"
CROSS="${RED}✘${RESET}"
WARNING="${YELLOW}⚠${RESET}"
ARROW="${CYAN}↳${RESET}"

# Header
echo -e "\n${BLUE}${BOLD}╔════════════════════════════════════════════╗"
echo -e "║      Angularidades: Project Initializer    ║"
echo -e "╚════════════════════════════════════════════╝${RESET}\n"

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${CROSS} pnpm is not installed. Please install it first (e.g., brew install pnpm)."
    exit 1
fi

echo -e "${ARROW} Installing dependencies..."
pnpm install --silent

echo -e "${ARROW} Linking CLI command 'angularidades'..."
# Ensure pnpm bin directory exists
mkdir -p ~/Library/pnpm/bin
pnpm add -g . --silent

echo -e "\n${GREEN}${BOLD}✨ Setup complete!${RESET}"
echo -e "${ARROW} You can now use the CLI by typing: ${BOLD}angularidades${RESET}"
echo -e "${ARROW} Try: ${BOLD}angularidades doctor${RESET}\n"
