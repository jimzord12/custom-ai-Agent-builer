import { randomUUID } from 'crypto';
import { AgentConfig } from '../../core/schema/agent.schema.js';

/**
 * Example agent using the new registry-based schema builder
 *
 * This demonstrates:
 * - Single-selection for role and permissions (IntelliSense shows valid options)
 * - Multi-selection for behaviors (IntelliSense shows valid options)
 * - Optional project context (IntelliSense shows valid chip IDs)
 * - Compile-time type checking
 */
export const enhancedAgentExample: AgentConfig = {
  id: randomUUID(),
  name: 'Enhanced Feature Builder',
  version: '1.0.0',
  description: 'Demonstrates the new registry-based schema with validation',

  // Character: Framework-managed traits
  character: {
    role: new Set(['implementer']), // ✅ IntelliSense shows: 'analyst' | 'architect' | 'implementer' | 'reviewer' | 'guide' | 'orchestrator'
    permissions: new Set(['controlled']), // ✅ IntelliSense shows: 'read-only' | 'documentation' | 'controlled' | 'full'
    behaviors: new Set(['autonomous', 'creative']), // ✅ IntelliSense shows: 'concise' | 'detailed' | 'interactive' | 'autonomous' | 'creative' | 'conservative'
  },

  // Context: Project-specific (optional)
  context: {
    frontend: new Set(['architecture', 'code-style']), // ✅ IntelliSense shows: 'constitution' | 'architecture' | 'api-guidelines' | 'testing-standards' | 'code-style'
  },
};

export default enhancedAgentExample;
