#!/bin/bash
# Generate VS Code Copilot Chatmode Script
#
# Generates VS Code Copilot chatmode files from TypeScript agent configurations

# Parse command line arguments
CONFIG_PATH="${1:-examples/agent-configs/code-reviewer.ts}"
OUTPUT_DIR=""
OVERWRITE=false

# Parse remaining arguments
shift
while [[ $# -gt 0 ]]; do
    case $1 in
        --output-dir)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        --overwrite)
            OVERWRITE=true
            shift
            ;;
        *)
            echo "Unknown argument: $1"
            exit 1
            ;;
    esac
done

echo "🤖 VS Code Copilot Chatmode Generator"
echo ""

# Get script directory and repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# Resolve config path relative to repo root
if [[ "$CONFIG_PATH" = /* ]]; then
    FULL_CONFIG_PATH="$CONFIG_PATH"
else
    FULL_CONFIG_PATH="$REPO_ROOT/$CONFIG_PATH"
fi

# Validate config file exists
if [ ! -f "$FULL_CONFIG_PATH" ]; then
    echo "❌ Configuration file not found: $FULL_CONFIG_PATH"
    echo ""
    echo "Usage:"
    echo "  ./generate.sh [config-path] [--output-dir <dir>] [--overwrite]"
    echo ""
    echo "Examples:"
    echo "  ./generate.sh"
    echo "  ./generate.sh examples/agent-configs/feature-builder.ts"
    echo "  ./generate.sh my-custom-agent.ts --output-dir ./output"
    echo "  ./generate.sh examples/agent-configs/code-reviewer.ts --overwrite"
    echo ""
    echo "Available example configs:"
    find "$REPO_ROOT/examples/agent-configs" -name "*.ts" 2>/dev/null | while read -r file; do
        echo "  - $(basename "$file")"
    done
    exit 1
fi

# Build generator command arguments
GENERATOR_PATH="$SCRIPT_DIR/../generators/vscode-copilot/generate-chatmode.ts"
ARGS=("$FULL_CONFIG_PATH")

if [ -n "$OUTPUT_DIR" ]; then
    ARGS+=("--output-dir" "$OUTPUT_DIR")
fi

if [ "$OVERWRITE" = true ]; then
    ARGS+=("--overwrite")
fi

# Display configuration
echo "📄 Config: $CONFIG_PATH"
if [ -n "$OUTPUT_DIR" ]; then
    echo "📁 Output: $OUTPUT_DIR"
else
    echo "📁 Output: .github/chatmodes/ (default)"
fi
if [ "$OVERWRITE" = true ]; then
    echo "🔄 Overwrite: enabled"
fi
echo "🔧 Running VS Code chatmode generator..."
echo ""

# Execute generator
if npx tsx "$GENERATOR_PATH" "${ARGS[@]}"; then
    echo ""
    echo "✅ Chatmode generated successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Open VS Code in this workspace"
    echo "2. Start a new chat"
    echo "3. Type '@' to see your custom chatmode"
else
    EXIT_CODE=$?
    echo ""
    echo "❌ Generator failed with exit code: $EXIT_CODE"
    exit $EXIT_CODE
fi
