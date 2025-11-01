/**
 * Test script to verify template integration
 */
import { generateChatmode } from './generators/vscode-copilot/generate-chatmode.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

async function test() {
  console.log('🧪 Testing Template Integration...\n');

  // Test both examples
  const tests = [
    { name: 'Code Reviewer', config: './examples/code-reviewer.ts' },
    { name: 'Feature Builder', config: './examples/feature-builder.ts' }
  ];

  const outputDir = '../chatmodes';

  for (const test of tests) {
    console.log(`� Testing: ${test.name}`);
    console.log(`   Config: ${test.config}`);

    const result = await generateChatmode({
      agentConfig: test.config,
      outputDir: outputDir,
      overwrite: true
    });

    if (result.success) {
      console.log(`   ✅ Success! Generated: ${result.outputPath}\n`);
    } else {
      console.log(`   ❌ Failed: ${result.error}\n`);
      process.exit(1);
    }
  }

  console.log('🎉 All tests passed!');
}

test();
