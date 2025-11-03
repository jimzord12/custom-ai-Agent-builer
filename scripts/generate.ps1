# Generate VS Code Copilot Chatmode Script
#
# Generates VS Code Copilot chatmode files from TypeScript agent configurations

param(
    [Parameter(Position=0)]
    [string]$ConfigPath = "examples/agent-configs/code-reviewer.ts",

    [Parameter()]
    [string]$OutputDir,

    [Parameter()]
    [switch]$Overwrite
)

Write-Host "🤖 VS Code Copilot Chatmode Generator" -ForegroundColor Cyan
Write-Host ""

# Get script directory and repo root
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ScriptDir

# Resolve config path relative to repo root
if (-not [System.IO.Path]::IsPathRooted($ConfigPath)) {
    $FullConfigPath = Join-Path $RepoRoot $ConfigPath
} else {
    $FullConfigPath = $ConfigPath
}

# Validate config file exists
if (-not (Test-Path $FullConfigPath)) {
    Write-Host "❌ Configuration file not found: $FullConfigPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\generate.ps1 [config-path] [-OutputDir <dir>] [-Overwrite]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\generate.ps1" -ForegroundColor Gray
    Write-Host "  .\generate.ps1 examples/agent-configs/feature-builder.ts" -ForegroundColor Gray
    Write-Host "  .\generate.ps1 my-custom-agent.ts -OutputDir ./output" -ForegroundColor Gray
    Write-Host "  .\generate.ps1 examples/agent-configs/code-reviewer.ts -Overwrite" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Available example configs:" -ForegroundColor Yellow
    Get-ChildItem "$RepoRoot/examples/agent-configs/*.ts" | ForEach-Object {
        Write-Host "  - examples/agent-configs/$($_.Name)" -ForegroundColor Gray
    }
    exit 1
}

# Build generator command arguments
$GeneratorPath = Join-Path $ScriptDir "../generators/vscode-copilot/generate-chatmode.ts"
$Arguments = @($FullConfigPath)

if ($OutputDir) {
    $Arguments += "--output-dir"
    $Arguments += $OutputDir
}

if ($Overwrite) {
    $Arguments += "--overwrite"
}

# Display configuration
Write-Host "📄 Config: $ConfigPath" -ForegroundColor Gray
if ($OutputDir) {
    Write-Host "📁 Output: $OutputDir" -ForegroundColor Gray
} else {
    Write-Host "📁 Output: .github/chatmodes/ (default)" -ForegroundColor Gray
}
if ($Overwrite) {
    Write-Host "🔄 Overwrite: enabled" -ForegroundColor Gray
}
Write-Host "� Running VS Code chatmode generator..." -ForegroundColor Gray
Write-Host ""

# Execute generator
try {
    npx tsx $GeneratorPath @Arguments

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Chatmode generated successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Open VS Code in this workspace" -ForegroundColor Gray
        Write-Host "2. Start a new chat" -ForegroundColor Gray
        Write-Host "3. Type '@' to see your custom chatmode" -ForegroundColor Gray
    } else {
        Write-Host ""
        Write-Host "❌ Generator failed with exit code: $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
} catch {
    Write-Host ""
    Write-Host "❌ Error running generator: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
