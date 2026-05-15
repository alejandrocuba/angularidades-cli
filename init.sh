#!/bin/bash

# Angularidades Ops - Initialization Script

# Function to get color from JS logger
get_color() {
    node -e "const {colors} = require('./scripts/publisher/logger'); console.log(colors['$1'] || '')" 2>/dev/null | sed 's/\x1b/\\033/g'
}

# Reuse colors from logger.js
RESET=$(get_color 'reset')
BOLD=$(get_color 'bold')
BLUE=$(get_color 'blue')
GREEN=$(get_color 'green')
RED=$(get_color 'red')
CYAN=$(get_color 'cyan')
YELLOW=$(get_color 'yellow')

# Fallback colors if node fails
[ -z "$RESET" ] && RESET="\033[0m"
[ -z "$BOLD" ] && BOLD="\033[1m"
[ -z "$BLUE" ] && BLUE="\033[34m"
[ -z "$GREEN" ] && GREEN="\033[32m"
[ -z "$RED" ] && RED="\033[31m"
[ -z "$CYAN" ] && CYAN="\033[36m"
[ -z "$YELLOW" ] && YELLOW="\033[33m"

# Icons
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
if ! pnpm install --silent; then
    echo -e "${CROSS} Failed to install dependencies."
    exit 1
fi

# Duplication Handling: Detect if 'angularidades' is already set up
ALREADY_SETUP=false
if command -v angularidades &> /dev/null; then
    echo -e "${WARNING} Skipping link process."
    ALREADY_SETUP=true
else
    echo -e "${ARROW} Linking CLI command 'angularidades'..."

    # Get pnpm global bin directory
    PNPM_BIN_DIR=$(pnpm config get global-bin-dir 2>/dev/null)
    if [ -z "$PNPM_BIN_DIR" ] || [ "$PNPM_BIN_DIR" = "undefined" ]; then
        PNPM_BIN_DIR="$HOME/Library/pnpm/bin"
    fi
    mkdir -p "$PNPM_BIN_DIR"

    # Check if PNPM_BIN_DIR is in PATH
    if [[ ":$PATH:" != *":$PNPM_BIN_DIR:"* ]]; then
        echo -e "${WARNING} The pnpm global bin directory is not in your PATH: ${BOLD}$PNPM_BIN_DIR${RESET}"
        echo -e "${ARROW} Attempting to link anyway and updating current session PATH..."
        export PATH="$PNPM_BIN_DIR:$PATH"
    fi

    if ! pnpm add -g . --silent; then
        echo -e "${CROSS} Failed to link 'angularidades' command."
        echo -e "${YELLOW}Tip: Try running 'pnpm setup' and then 'source ~/.zshrc' (or your shell config file).${RESET}"
        exit 1
    fi
fi

# Final verification and success message
if ! command -v angularidades &> /dev/null; then
    echo -e "${WARNING} Command 'angularidades' was linked but is not yet available in your shell."
    echo -e "${ARROW} Please run: ${BOLD}source ~/.zshrc${RESET} (or your shell's config file)"
    echo -e "${ARROW} After that, you can use: ${BOLD}angularidades doctor${RESET}\n"
elif [ "$ALREADY_SETUP" = true ]; then
    echo -e "\n${YELLOW}${BOLD}The command 'angularidades' is already available in your shell.${RESET}"
    echo -e "${ARROW} You're all set to go. Try: ${BOLD}angularidades doctor${RESET}\n"
else
    echo -e "\n${GREEN}${BOLD}✨ Setup complete!${RESET}"
    echo -e "${ARROW} You can now use the CLI by typing: ${BOLD}angularidades${RESET}"
    echo -e "${ARROW} Try: ${BOLD}angularidades doctor${RESET}\n"
fi


