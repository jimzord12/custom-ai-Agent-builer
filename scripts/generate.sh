#!/bin/bash
# Generate Agents Script
#
# Generates GitHub Copilot CLI agent files from TypeScript configurations

CONFIG_PATH="${1:-config/agent-config.ts}"

echo "🤖 Minimal Agent Framework Generator"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Resolve config path
FULL_CONFIG_PATH="$REPO_ROOT/$CONFIG_PATH"

if [ ! -f "$FULL_CONFIG_PATH" ]; then
    echo "❌ Configuration file not found: $FULL_CONFIG_PATH"
    echo ""
    echo "Usage:"
    echo "  ./generate.sh [config-path]"
    echo ""
    echo "Examples:"
    echo "  ./generate.sh"
    echo "  ./generate.sh config/my-agents.ts"
    echo "  ./generate.sh .github/agent-system-prototype/examples/index.ts"
    exit 1
fi

# Run generator
GENERATOR_PATH="$SCRIPT_DIR/../generators/copilot-cli/generate-agent.ts"

echo "📄 Config: $CONFIG_PATH"
echo "🔧 Running generator..."
echo ""

npx tsx "$GENERATOR_PATH" "$FULL_CONFIG_PATH"
