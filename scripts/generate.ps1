# Generate Agents Script
#
# Generates GitHub Copilot CLI agent files from TypeScript configurations

param(
    [Parameter(Position=0)]
    [string]$ConfigPath = "config/agent-config.ts"
)

Write-Host "🤖 Minimal Agent Framework Generator" -ForegroundColor Cyan
Write-Host ""

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Resolve-Path "$ScriptDir/../../.."

# Resolve config path
$FullConfigPath = Join-Path $RepoRoot $ConfigPath

if (-not (Test-Path $FullConfigPath)) {
    Write-Host "❌ Configuration file not found: $FullConfigPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\generate.ps1 [config-path]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\generate.ps1" -ForegroundColor Gray
    Write-Host "  .\generate.ps1 config/my-agents.ts" -ForegroundColor Gray
    Write-Host "  .\generate.ps1 .github/agent-system-prototype/examples/index.ts" -ForegroundColor Gray
    exit 1
}

# Run generator
$GeneratorPath = Join-Path $ScriptDir "../generators/copilot-cli/generate-agent.ts"

Write-Host "📄 Config: $ConfigPath" -ForegroundColor Gray
Write-Host "🔧 Running generator..." -ForegroundColor Gray
Write-Host ""

npx tsx $GeneratorPath $FullConfigPath
