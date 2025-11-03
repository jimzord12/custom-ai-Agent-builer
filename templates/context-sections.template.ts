import type { AgentConfig } from '../core/schema/agent.schema';

/**
 * CONTEXT SECTIONS TEMPLATE (LEGACY - DEPRECATED)
 *
 * ⚠️ DEPRECATION NOTICE:
 * These templates were used for rendering inline context (techStack, conventions, patterns)
 * directly embedded in agent configurations.
 *
 * The framework has migrated to a registry-based context chip system.
 * These functions are preserved ONLY for legacy test cases.
 *
 * FOR NEW DEVELOPMENT:
 * - Create context chips in registries/ directory
 * - Add markdown files in contexts/ directory
 * - Reference chips by ID in agent configs
 *
 * See: registries/frontend.registry.ts and examples/agent-configs/
 *
 * @deprecated Use registry-based context chips instead
 */

// ============================================================================
// TECH STACK SECTION
// ============================================================================

/**
 * Renders the Tech Stack section from agent config
 */
export function renderTechStackSection(config: AgentConfig): string {
  if (!config.context?.techStack) {
    return '';
  }

  const techStack = config.context.techStack;
  const items: string[] = [];

  if (techStack.framework) items.push(`- **Framework**: ${techStack.framework}`);
  if (techStack.language) items.push(`- **Language**: ${techStack.language}`);
  if (techStack.runtime) items.push(`- **Runtime**: ${techStack.runtime}`);
  if (techStack.packageManager) items.push(`- **Package Manager**: ${techStack.packageManager}`);
  if (techStack.testing) items.push(`- **Testing**: ${techStack.testing}`);
  if (techStack.linting) items.push(`- **Linting**: ${techStack.linting}`);
  if (techStack.database) items.push(`- **Database**: ${techStack.database}`);
  if (techStack.orm) items.push(`- **ORM**: ${techStack.orm}`);
  if (techStack.stateManagement && techStack.stateManagement.length > 0) {
    items.push(`- **State Management**: ${techStack.stateManagement.join(', ')}`);
  }
  if (techStack.styling) items.push(`- **Styling**: ${techStack.styling}`);
  if (techStack.buildTool) items.push(`- **Build Tool**: ${techStack.buildTool}`);

  if (items.length === 0) {
    return '';
  }

  return `## Tech Stack\n\n${items.join('\n')}`;
}

// ============================================================================
// CONVENTIONS SECTION
// ============================================================================

/**
 * Renders the Conventions section from agent config
 */
export function renderConventionsSection(config: AgentConfig): string {
  if (!config.context?.conventions) {
    return '';
  }

  const conventions = config.context.conventions;
  const items: string[] = [];

  if (conventions.fileNaming) {
    items.push(`- **File Naming**: ${conventions.fileNaming}`);
  }
  if (conventions.componentNaming) {
    items.push(`- **Component Naming**: ${conventions.componentNaming}`);
  }
  if (conventions.functionNaming) {
    items.push(`- **Function Naming**: ${conventions.functionNaming}`);
  }
  if (conventions.testPattern) {
    items.push(`- **Test Pattern**: ${conventions.testPattern}`);
  }
  if (conventions.importOrder && conventions.importOrder.length > 0) {
    items.push(`- **Import Order**: ${conventions.importOrder.join(' → ')}`);
  }

  if (items.length === 0) {
    return '';
  }

  return `## Conventions\n\n${items.join('\n')}`;
}

// ============================================================================
// PATTERNS SECTION
// ============================================================================

/**
 * Renders the Patterns section from agent config
 */
export function renderPatternsSection(config: AgentConfig): string {
  if (!config.context?.patterns) {
    return '';
  }

  const patterns = config.context.patterns;
  const items: string[] = [];

  if (patterns.preferred && patterns.preferred.length > 0) {
    items.push(`**Preferred Patterns:**\n${patterns.preferred.map(p => `- ${p}`).join('\n')}`);
  }

  if (patterns.forbidden && patterns.forbidden.length > 0) {
    items.push(`**Forbidden Patterns:**\n${patterns.forbidden.map(p => `- ${p}`).join('\n')}`);
  }

  if (patterns.architectural) {
    items.push(`**Architectural Style:** ${patterns.architectural}`);
  }

  if (items.length === 0) {
    return '';
  }

  return `## Patterns\n\n${items.join('\n\n')}`;
}

// ============================================================================
// ALL INLINE CONTEXT SECTIONS
// ============================================================================

/**
 * Renders all inline context sections (techStack, conventions, patterns)
 */
export function renderAllInlineContext(config: AgentConfig): string {
  const sections: string[] = [];

  const techStack = renderTechStackSection(config);
  if (techStack) sections.push(techStack);

  const conventions = renderConventionsSection(config);
  if (conventions) sections.push(conventions);

  const patterns = renderPatternsSection(config);
  if (patterns) sections.push(patterns);

  return sections.length > 0 ? sections.join('\n\n') : '';
}

// ============================================================================
// SECTION TEMPLATES
// ============================================================================

/**
 * Template for a generic context section
 */
export function createContextSection(title: string, content: string): string {
  return `## ${title}\n\n${content}`;
}

/**
 * Template for a list-based context section
 */
export function createListSection(title: string, items: string[]): string {
  if (items.length === 0) return '';
  return `## ${title}\n\n${items.map(item => `- ${item}`).join('\n')}`;
}

/**
 * Template for a key-value context section
 */
export function createKeyValueSection(
  title: string,
  entries: Array<{ key: string; value: string }>
): string {
  if (entries.length === 0) return '';
  return `## ${title}\n\n${entries.map(e => `- **${e.key}**: ${e.value}`).join('\n')}`;
}

export default {
  renderTechStackSection,
  renderConventionsSection,
  renderPatternsSection,
  renderAllInlineContext,
  createContextSection,
  createListSection,
  createKeyValueSection,
};
