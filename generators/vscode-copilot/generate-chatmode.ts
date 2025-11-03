import * as fs from 'fs';
import * as path from 'path';
import type { AgentConfig } from '../../core/schema/agent.schema.js';
import { validateAgentConfig } from '../../core/schema/agent.schema.js';
import {
  ContextChipRegistries,
  ContextChipRegistriesKeys,
} from '../../core/schema/context.schema.js';
import { BEHAVIOR_PROMPTS } from '../../prompts/injectable/behavior-prompts.js';
import {
  getPromptForPermission,
  getToolsForPermission,
} from '../../prompts/injectable/permission-prompts.js';
import { ROLE_PROMPTS } from '../../prompts/injectable/role-prompts.js';
import { resolveChipPath } from '../../registries/index.js';

/**
 * VS CODE COPILOT CHATMODE GENERATOR
 *
 * Generates VS Code Copilot chatmode files from agent configurations.
 * Output: .github/chatmodes/[agent-name].chatmode.md
 */

// ============================================================================
// TYPES
// ============================================================================

export interface GeneratorOptions {
  /** Path to agent config file or config object */
  agentConfig: string | AgentConfig;
  /** Output directory (defaults to .github/chatmodes) */
  outputDir?: string;
  /** Whether to overwrite existing files */
  overwrite?: boolean;
}

export interface GeneratorResult {
  success: boolean;
  outputPath?: string;
  error?: string;
}

// ============================================================================
// CONFIG READER
// ============================================================================

/**
 * Reads and validates an agent configuration
 */
async function readAgentConfig(configPath: string): Promise<AgentConfig> {
  try {
    // Import the config file
    const absolutePath = path.resolve(configPath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Config file not found: ${absolutePath}`);
    }

    // Convert to file:// URL for Windows compatibility
    const fileUrl = new URL(`file:///${absolutePath.replace(/\\/g, '/')}`).href;

    // Dynamic import to load the TypeScript config
    const module = await import(fileUrl);

    // Handle default export or named export
    const config = module.default || module;

    // Validate the configuration
    const validation = validateAgentConfig(config);

    if (!validation.success) {
      const errorMessages = validation.errors?.issues
        .map(e => `  - ${e.path.join('.')}: ${e.message}`)
        .join('\n');
      throw new Error(`Invalid agent configuration:\n${errorMessages}`);
    }

    return validation.data!;
  } catch (error) {
    throw new Error(
      `Failed to read agent config: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// ============================================================================
// CONTEXT CHIP LOADER
// ============================================================================

/**
 * Loads context chip content from markdown files
 * Supports both registry IDs and direct paths
 */
async function loadContextChips(config: AgentConfig): Promise<string> {
  if (!config.context || Object.keys(config.context).length === 0) {
    return '';
  }

  const contextSections: string[] = [];

  // Convert Set to Array for iteration
  const entries = Object.entries(config.context);

  for (const [registry, chipIds] of entries) {
    if (!chipIds || chipIds.size === 0) continue;

    for (const chipId of chipIds) {
      try {
        // Resolve path from registry ID or use direct path
        let chipPath: string | undefined;

        if (chipId) {
          // Try to resolve from registry
          chipPath = resolveChipPath(
            registry as ContextChipRegistriesKeys,
            chipId as keyof ContextChipRegistries[ContextChipRegistriesKeys]
          );
          if (!chipPath) {
            console.warn(`Warning: Context chip ID "${chipId}" not found in registry, skipping...`);
            continue;
          }
        } else {
          console.warn(
            `Warning: Context chip "${chipId}" has neither ID nor pathFromRoot, skipping...`
          );
          continue;
        }

        // Resolve to absolute path
        const absolutePath = path.resolve(chipPath);

        if (!fs.existsSync(absolutePath)) {
          console.warn(`Warning: Context chip file not found: ${absolutePath}`);
          continue;
        }

        const content = fs.readFileSync(absolutePath, 'utf-8');
        contextSections.push(content);
      } catch (error) {
        console.warn(
          `Warning: Failed to load context chip "${chipId}": ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
  }

  return contextSections.length > 0 ? '\n\n' + contextSections.join('\n\n---\n\n') : '';
}

// ============================================================================
// INLINE CONTEXT RENDERER
// ============================================================================

/**
 * Renders inline context (techStack, conventions, patterns) as Markdown
 * @deprecated Inline context is no longer supported in chatmodes
 */
// function renderInlineContext(config: AgentConfig): string {
//   const sections: string[] = [];

//   // Tech Stack
//   if (config.context?.techStack) {
//     const techStack = config.context.techStack;
//     const items: string[] = [];

//     if (techStack.framework) items.push(`- **Framework**: ${techStack.framework}`);
//     if (techStack.language) items.push(`- **Language**: ${techStack.language}`);
//     if (techStack.runtime) items.push(`- **Runtime**: ${techStack.runtime}`);
//     if (techStack.packageManager) items.push(`- **Package Manager**: ${techStack.packageManager}`);
//     if (techStack.testing) items.push(`- **Testing**: ${techStack.testing}`);
//     if (techStack.linting) items.push(`- **Linting**: ${techStack.linting}`);
//     if (techStack.database) items.push(`- **Database**: ${techStack.database}`);
//     if (techStack.orm) items.push(`- **ORM**: ${techStack.orm}`);
//     if (techStack.stateManagement && techStack.stateManagement.length > 0) items.push(`- **State Management**: ${techStack.stateManagement.join(', ')}`);
//     if (techStack.styling) items.push(`- **Styling**: ${techStack.styling}`);
//     if (techStack.buildTool) items.push(`- **Build Tool**: ${techStack.buildTool}`);

//     if (items.length > 0) {
//       sections.push(`## Tech Stack\n\n${items.join('\n')}`);
//     }
//   }

//   // Conventions
//   if (config.context?.conventions) {
//     const conventions = config.context.conventions;
//     const items: string[] = [];

//     if (conventions.fileNaming) items.push(`- **File Naming**: ${conventions.fileNaming}`);
//     if (conventions.componentNaming) items.push(`- **Component Naming**: ${conventions.componentNaming}`);
//     if (conventions.functionNaming) items.push(`- **Function Naming**: ${conventions.functionNaming}`);
//     if (conventions.testPattern) items.push(`- **Test Pattern**: ${conventions.testPattern}`);
//     if (conventions.importOrder && conventions.importOrder.length > 0) items.push(`- **Import Order**: ${conventions.importOrder.join(' → ')}`);

//     if (items.length > 0) {
//       sections.push(`## Conventions\n\n${items.join('\n')}`);
//     }
//   }

//   // Patterns
//   if (config.context?.patterns) {
//     const patterns = config.context.patterns;
//     const items: string[] = [];

//     if (patterns.preferred && patterns.preferred.length > 0) items.push(`**Preferred Patterns:**\n${patterns.preferred.map(p => `- ${p}`).join('\n')}`);
//     if (patterns.forbidden && patterns.forbidden.length > 0) items.push(`**Forbidden Patterns:**\n${patterns.forbidden.map(p => `- ${p}`).join('\n')}`);
//     if (patterns.architectural) items.push(`**Architectural Style:** ${patterns.architectural}`);

//     if (items.length > 0) {
//       sections.push(`## Patterns\n\n${items.join('\n\n')}`);
//     }
//   }

//   return sections.length > 0 ? '\n\n' + sections.join('\n\n') : '';
// }

// ============================================================================
// CHATMODE RENDERER
// ============================================================================

/**
 * Renders a complete chatmode file (YAML frontmatter + Markdown body)
 */
async function renderChatmodeFile(config: AgentConfig): Promise<string> {
  // Get tools for permission level
  const tools = getToolsForPermission(config.permissions.level);

  // Get prompts
  const rolePrompt = ROLE_PROMPTS[config.role];
  const behaviorPrompt = BEHAVIOR_PROMPTS[config.behavior.profile];
  const permissionPrompt = getPromptForPermission(config.permissions.level);

  // Load context chips
  const contextChipsContent = await loadContextChips(config);

  // // Render inline context (deprecated)
  // const inlineContextContent = renderInlineContext(config);

  // Build YAML frontmatter
  const frontmatter = `---
description: ${config.description}
tools: [${tools.map(t => `'${t}'`).join(', ')}]
---`;

  // Build Markdown body
  const body = `
# ${config.name}

${config.description}

${rolePrompt}

${behaviorPrompt}

${permissionPrompt}

${contextChipsContent}

---

**Agent Version**: ${config.version}
`.trim();

  return `${frontmatter}\n\n${body}\n`;
}

// ============================================================================
// FILE WRITER
// ============================================================================

/**
 * Writes the generated chatmode file to disk
 */
function writeChatmodeFile(
  config: AgentConfig,
  content: string,
  outputDir: string,
  overwrite: boolean
): string {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate filename from agent name (kebab-case)
  const filename = config.name.toLowerCase().replace(/\s+/g, '-') + '.chatmode.md';
  const outputPath = path.join(outputDir, filename);

  // Check if file exists and overwrite is false
  if (fs.existsSync(outputPath) && !overwrite) {
    throw new Error(`File already exists: ${outputPath}. Use overwrite option to replace it.`);
  }

  // Write the file
  fs.writeFileSync(outputPath, content, 'utf-8');

  return outputPath;
}

// ============================================================================
// MAIN GENERATOR FUNCTION
// ============================================================================

/**
 * Generates a VS Code Copilot chatmode file from an agent configuration
 */
export async function generateChatmode(options: GeneratorOptions): Promise<GeneratorResult> {
  try {
    // Step 1: Read and validate config
    let config: AgentConfig;

    if (typeof options.agentConfig === 'string') {
      config = await readAgentConfig(options.agentConfig);
    } else {
      // Step 2: Validate provided config object
      const validation = validateAgentConfig(options.agentConfig);
      if (!validation.success) {
        const errorMessages = validation.errors?.issues
          .map(e => `  - ${e.path.join('.')}: ${e.message}`)
          .join('\n');
        throw new Error(`Invalid agent configuration:\n${errorMessages}`);
      }

      // Step 3: Use validated config
      config = validation.data!;
    }

    // Step 4: Set default output directory
    const outputDir = options.outputDir || path.join(process.cwd(), '.github', 'chatmodes');

    // Step 5: Render the chatmode file
    const content = await renderChatmodeFile(config);

    // Step 6: Write to disk
    const outputPath = writeChatmodeFile(config, content, outputDir, options.overwrite || false);

    return {
      success: true,
      outputPath,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// ============================================================================
// CLI EXECUTION
// ============================================================================

/**
 * Main function for CLI execution
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(
      'Usage: tsx generate-chatmode.ts <config-path> [--output-dir <dir>] [--overwrite]'
    );
    process.exit(1);
  }

  const configPath = args[0];
  const outputDirIndex = args.indexOf('--output-dir');
  const outputDir = outputDirIndex >= 0 ? args[outputDirIndex + 1] : undefined;
  const overwrite = args.includes('--overwrite');

  console.log('🤖 Generating VS Code Copilot chatmode...');
  console.log(`📄 Config: ${configPath}`);
  if (outputDir) console.log(`📁 Output: ${outputDir}`);
  console.log('');

  const result = await generateChatmode({
    agentConfig: configPath,
    outputDir,
    overwrite,
  });

  if (result.success) {
    console.log(`✅ Successfully generated chatmode: ${result.outputPath}`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Open VS Code in this workspace');
    console.log('2. Start a new chat');
    console.log("3. Type '@' to see your custom chatmode");
  } else {
    console.error(`❌ Failed to generate chatmode:\n${result.error}`);
    process.exit(1);
  }
}

// Execute main function if this file is run directly
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __argv1 = process.argv[1] ? path.resolve(process.argv[1]) : '';

if (__filename === __argv1) {
  main().catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}

export default generateChatmode;
