#!/usr/bin/env ts-node

/**
 * Test runner for all N8N routes integration tests
 * 
 * This script runs comprehensive tests for all N8N webhook endpoints:
 * - SessionManager Hook (/whatsapp/sessions)
 * - StartSession Hook (/whatsapp/session/start) 
 * - SessionAuth Hook (/whatsapp/auth)
 * - SendMessage Hook (/whatsapp/sendMessage)
 * - IncomingMessage Webhook (/whatsapp)
 * 
 * Usage:
 * npm run test:integration:n8n-routes
 * or
 * npx ts-node tests/integration/run-all-n8n-routes-tests.ts
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface TestResult {
  testFile: string;
  status: 'passed' | 'failed' | 'skipped';
  duration?: number;
  error?: string;
}

class N8NRoutesTestRunner {
  private results: TestResult[] = [];
  private startTime: number = 0;

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting N8N Routes Integration Tests');
    console.log('=' .repeat(60));
    
    this.startTime = Date.now();
    
    const testFiles = [
      'tests/integration/n8n-all-routes-fixed.integration.spec.ts',
      'tests/integration/session-manager.integration.spec.ts',
      'tests/integration/session-start.integration.spec.ts', 
      'tests/integration/session-auth.integration.spec.ts',
      'tests/integration/send-message.integration.spec.ts',
      'tests/integration/webhook.integration.spec.ts',
      'tests/integration/n8n-whatsapp.integration.spec.ts'
    ];

    for (const testFile of testFiles) {
      await this.runTestFile(testFile);
    }

    this.printSummary();
  }

  private async runTestFile(testFile: string): Promise<void> {
    console.log(`\n📋 Running: ${testFile}`);
    console.log('-'.repeat(50));
    
    const testStartTime = Date.now();
    
    try {
      // Check if file exists (Windows compatible)
      const fs = require('fs');
      if (!fs.existsSync(testFile)) {
        console.log(`⏭️  Skipping ${testFile} - file not found`);
        this.results.push({
          testFile,
          status: 'skipped'
        });
        return;
      }

      // Run the test
      const { stdout, stderr } = await execAsync(
        `npx jest ${testFile} --verbose --detectOpenHandles --forceExit`
      );
      
      const duration = Date.now() - testStartTime;
      
      if (stderr && stderr.includes('FAIL')) {
        console.log(`❌ ${testFile} - FAILED`);
        console.log(stderr);
        this.results.push({
          testFile,
          status: 'failed',
          duration,
          error: stderr
        });
      } else {
        console.log(`✅ ${testFile} - PASSED (${duration}ms)`);
        this.results.push({
          testFile,
          status: 'passed',
          duration
        });
      }
      
    } catch (error: any) {
      const duration = Date.now() - testStartTime;
      console.log(`❌ ${testFile} - ERROR`);
      console.error(error.message);
      
      this.results.push({
        testFile,
        status: 'failed',
        duration,
        error: error.message
      });
    }
  }

  private printSummary(): void {
    const totalDuration = Date.now() - this.startTime;
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    const total = this.results.length;

    console.log('\n' + '='.repeat(60));
    console.log('📊 N8N ROUTES TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`⏱️  Total Duration: ${totalDuration}ms`);
    console.log(`📈 Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`📊 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results
        .filter(r => r.status === 'failed')
        .forEach(result => {
          console.log(`  - ${result.testFile}`);
          if (result.error) {
            console.log(`    Error: ${result.error.substring(0, 100)}...`);
          }
        });
    }

    if (skipped > 0) {
      console.log('\n⏭️  SKIPPED TESTS:');
      this.results
        .filter(r => r.status === 'skipped')
        .forEach(result => {
          console.log(`  - ${result.testFile}`);
        });
    }

    console.log('\n' + '='.repeat(60));
    
    if (failed === 0) {
      console.log('🎉 ALL N8N ROUTES TESTS PASSED!');
      process.exit(0);
    } else {
      console.log('💥 SOME TESTS FAILED!');
      process.exit(1);
    }
  }
}

// Run the tests
async function main() {
  const runner = new N8NRoutesTestRunner();
  
  try {
    await runner.runAllTests();
  } catch (error) {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  }
}

// Handle process signals
process.on('SIGINT', () => {
  console.log('\n🛑 Test runner interrupted by user');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Test runner terminated');
  process.exit(1);
});

// Run if this file is executed directly
if (require.main === module) {
  main();
}

export { N8NRoutesTestRunner };
