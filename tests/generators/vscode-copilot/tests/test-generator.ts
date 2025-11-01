/**
 * Quick test script for the VS Code Copilot Generator
 */
import codeReviewerAgent from '../../../../examples/agent-configs/code-reviewer.js';
import { generateChatmode } from '../../../../generators/vscode-copilot/generate-chatmode.js';

async function test() {
  console.log('🧪 Testing VS Code Copilot Generator...\n');

  try {
    const result = await generateChatmode({
      agentConfig: codeReviewerAgent,
      overwrite: true
    });

    if (result.success && result.outputPath) {
      console.log('✅ Success! Chatmode generated at:');
      console.log(`   ${result.outputPath}\n`);
      console.log('You can now use this chatmode in VS Code Copilot!');
    } else {
      console.error('❌ Generation failed:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

test();
