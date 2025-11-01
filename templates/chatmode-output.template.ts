import type { AgentConfig } from '../core/schema/agent.schema';

/**
 * VS CODE CHATMODE OUTPUT TEMPLATE
 *
 * This template defines the structure for generated chatmode files.
 * Used by the VS Code Copilot generator to ensure consistent output.
 *
 * Output Format:
 * - YAML frontmatter (description, tools, model, handoffs)
 * - Markdown body (role, behavior, permissions, context)
 */

// ============================================================================
// YAML FRONTMATTER TEMPLATE
// ============================================================================

export interface FrontmatterFields {
  /** Brief description shown in chat input placeholder */
  description: string;

  /** Array of available tools for this chatmode */
  tools: string[];

  /** Optional: AI model selection (e.g., 'Claude Sonnet 4') */
  model?: string;

  /** Optional: Workflow transitions to other chatmodes */
  handoffs?: Array<{
    label: string;
    agent: string;
    prompt?: string;
    send?: boolean;
  }>;
}

/**
 * Generates YAML frontmatter from agent config
 */
export function generateFrontmatter(config: AgentConfig, tools: string[], options?: { model?: string; handoffs?: FrontmatterFields['handoffs'] }): string {
  const fields: FrontmatterFields = {
    description: config.description,
    tools: tools,
    ...(options?.model && { model: options.model }),
    ...(options?.handoffs && { handoffs: options.handoffs })
  };

  let yaml = '---\n';
  yaml += `description: ${fields.description}\n`;
  yaml += `tools: [${fields.tools.map(t => `'${t}'`).join(', ')}]\n`;

  if (fields.model) {
    yaml += `model: ${fields.model}\n`;
  }

  if (fields.handoffs && fields.handoffs.length > 0) {
    yaml += 'handoffs:\n';
    for (const handoff of fields.handoffs) {
      yaml += `  - label: ${handoff.label}\n`;
      yaml += `    agent: ${handoff.agent}\n`;
      if (handoff.prompt) yaml += `    prompt: ${handoff.prompt}\n`;
      if (handoff.send !== undefined) yaml += `    send: ${handoff.send}\n`;
    }
  }

  yaml += '---';
  return yaml;
}

// ============================================================================
// MARKDOWN BODY TEMPLATE
// ============================================================================

export interface BodySections {
  /** Agent name and description header */
  header: string;

  /** Role-based introduction */
  roleIntroduction: string;

  /** Behavior-based communication style */
  behaviorStyle: string;

  /** Permissions-based capabilities */
  permissionsCapabilities: string;

  /** Tech stack context (optional) */
  techStack?: string;

  /** Conventions context (optional) */
  conventions?: string;

  /** Patterns context (optional) */
  patterns?: string;

  /** External context chips (optional) */
  contextChips?: string;

  /** Footer with version info */
  footer: string;
}

/**
 * Generates the header section
 */
export function generateHeader(config: AgentConfig): string {
  return `# ${config.name}\n\n${config.description}`;
}

/**
 * Generates the footer section
 */
export function generateFooter(config: AgentConfig): string {
  return `---\n\n**Agent Version**: ${config.version}`;
}

/**
 * Combines all body sections into final Markdown
 */
export function generateBody(sections: BodySections): string {
  const parts: string[] = [sections.header, sections.roleIntroduction, sections.behaviorStyle, sections.permissionsCapabilities];

  // Add optional context sections
  if (sections.techStack) parts.push(sections.techStack);
  if (sections.conventions) parts.push(sections.conventions);
  if (sections.patterns) parts.push(sections.patterns);
  if (sections.contextChips) parts.push(sections.contextChips);

  // Add footer
  parts.push(sections.footer);

  return parts.join('\n\n').trim();
}

// ============================================================================
// COMPLETE CHATMODE FILE TEMPLATE
// ============================================================================

export interface ChatmodeFileTemplate {
  frontmatter: string;
  body: string;
}

/**
 * Generates complete chatmode file content (frontmatter + body)
 */
export function generateChatmodeFile(template: ChatmodeFileTemplate): string {
  return `${template.frontmatter}\n\n${template.body}\n`;
}

// ============================================================================
// TEMPLATE METADATA
// ============================================================================

export const TEMPLATE_VERSION = '1.0.0';

export const SUPPORTED_TOOLS = ['search', 'edit', 'new', 'fetch', 'githubRepo', 'usages', 'runCommands', 'runTasks', 'vscodeAPI', 'problems', 'changes', 'testFailure'] as const;

export type SupportedTool = (typeof SUPPORTED_TOOLS)[number];

/**
 * Template configuration for different chatmode styles
 */
export const TEMPLATE_PRESETS = {
  /** Minimal template with only essential sections */
  minimal: {
    includeTechStack: false,
    includeConventions: false,
    includePatterns: false
  },

  /** Standard template with common sections */
  standard: {
    includeTechStack: true,
    includeConventions: true,
    includePatterns: false
  },

  /** Full template with all available sections */
  full: {
    includeTechStack: true,
    includeConventions: true,
    includePatterns: true
  }
} as const;

export type TemplatePreset = keyof typeof TEMPLATE_PRESETS;

export default {
  generateFrontmatter,
  generateHeader,
  generateFooter,
  generateBody,
  generateChatmodeFile,
  TEMPLATE_VERSION,
  SUPPORTED_TOOLS,
  TEMPLATE_PRESETS
};
