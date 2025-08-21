#!/usr/bin/env ts-node

import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from main .env file
require('dotenv').config({ path: '../.env' });

interface TestResult {
  category: string;
  success: boolean;
  exitCode: number;
  output: string;
  errorOutput: string;
  duration: number;
  timestamp: string;
  passed: number;
  failed: number;
  skipped: number;
  coverage: number;
}

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  coverage: number;
  duration: number;
  categories: { [key: string]: TestResult };
}

class TestRunner {
  private results: TestResult[] = [];
  private startTime: number = 0;

  constructor() {
    this.setupEnvironment();
  }

  private setupEnvironment(): void {
    // Set test environment variables from .env
    process.env.NODE_ENV = process.env.NODE_ENV || 'test';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
    process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
    process.env.TEST_USER = process.env.TEST_USER || 'admin';
    process.env.TEST_PASSWORD = process.env.TEST_PASSWORD || 'test123';
  }

  private async runTestCategory(category: string): Promise<TestResult> {
    const startTime = Date.now();
    
    console.log(`\n🧪 Running ${category} tests...`);
    console.log('='.repeat(50));

    return new Promise((resolve, reject) => {
      const command = this.getTestCommand(category);
      const child = spawn('npm', ['run', command], {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true,
        env: { ...process.env }
      });

      let output = '';
      let errorOutput = '';

      child.stdout.on('data', (data) => {
        const message = data.toString();
        output += message;
        this.logWithColor(message, 'info');
      });

      child.stderr.on('data', (data) => {
        const message = data.toString();
        errorOutput += message;
        this.logWithColor(message, 'error');
      });

      child.on('close', (code) => {
        const duration = Date.now() - startTime;
        const result: TestResult = {
          category,
          success: code === 0,
          exitCode: code || 0,
          output,
          errorOutput,
          duration,
          timestamp: new Date().toISOString(),
          passed: this.extractTestCount(output, 'passed'),
          failed: this.extractTestCount(output, 'failed'),
          skipped: this.extractTestCount(output, 'skipped'),
          coverage: this.extractCoverage(output)
        };

        this.results.push(result);
        
        this.logTestResult(result);
        
        if (code === 0) {
          resolve(result);
        } else {
          reject(new Error(`${category} tests failed with exit code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  private getTestCommand(category: string): string {
    const commands = {
      unit: 'test:unit',
      integration: 'test:integration',
      e2e: 'test:e2e',
      all: 'test:all'
    };
    return commands[category as keyof typeof commands] || 'test:all';
  }

  private extractTestCount(output: string, type: string): number {
    const regex = new RegExp(`(\\d+)\\s+${type}`, 'i');
    const match = output.match(regex);
    return match ? parseInt(match[1]) : 0;
  }

  private extractCoverage(output: string): number {
    const regex = /All files\s+\|\s+(\d+(?:\.\d+)?)%/;
    const match = output.match(regex);
    return match ? parseFloat(match[1]) : 0;
  }

  private logWithColor(message: string, type: 'info' | 'success' | 'warning' | 'error'): void {
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m'    // Red
    };
    const reset = '\x1b[0m';
    
    const lines = message.trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${colors[type]}${line}${reset}`);
      }
    });
  }

  private logTestResult(result: TestResult): void {
    const status = result.success ? '✅ PASSED' : '❌ FAILED';
    const color = result.success ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';
    
    console.log('\n' + '='.repeat(50));
    console.log(`${color}${status}${reset} - ${result.category.toUpperCase()} Tests`);
    console.log(`Duration: ${result.duration}ms`);
    console.log(`Passed: ${result.passed}, Failed: ${result.failed}, Skipped: ${result.skipped}`);
    console.log(`Coverage: ${result.coverage}%`);
    console.log('='.repeat(50));
  }

  private generateSummary(): TestSummary {
    const summary: TestSummary = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      coverage: 0,
      duration: Date.now() - this.startTime,
      categories: {}
    };

    this.results.forEach(result => {
      summary.passed += result.passed;
      summary.failed += result.failed;
      summary.skipped += result.skipped;
      summary.categories[result.category] = result;
    });

    summary.total = summary.passed + summary.failed + summary.skipped;
    
    // Calculate average coverage
    const validResults = this.results.filter(r => r.coverage > 0);
    if (validResults.length > 0) {
      summary.coverage = validResults.reduce((sum, r) => sum + r.coverage, 0) / validResults.length;
    }

    return summary;
  }

  private saveResults(summary: TestSummary): void {
    const resultsDir = path.join(__dirname, 'results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `test-results-${timestamp}.json`;
    const filepath = path.join(resultsDir, filename);

    const report = {
      summary,
      results: this.results,
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        testUser: process.env.TEST_USER,
        majesticPort: process.env.MAJESTIC_PORT
      }
    };

    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`\n📊 Test results saved to: ${filepath}`);
  }

  private displaySummary(summary: TestSummary): void {
    console.log('\n' + '🚀'.repeat(20));
    console.log('📊 TEST EXECUTION SUMMARY');
    console.log('🚀'.repeat(20));
    
    console.log(`\n⏱️  Total Duration: ${summary.duration}ms`);
    console.log(`📈 Total Tests: ${summary.total}`);
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(`⏭️  Skipped: ${summary.skipped}`);
    console.log(`📊 Coverage: ${summary.coverage.toFixed(2)}%`);
    
    console.log('\n📋 Category Results:');
    Object.entries(summary.categories).forEach(([category, result]) => {
      const status = result.success ? '✅' : '❌';
      console.log(`  ${status} ${category}: ${result.passed}/${result.passed + result.failed + result.skipped} passed`);
    });

    const successRate = summary.total > 0 ? (summary.passed / summary.total * 100).toFixed(2) : '0';
    console.log(`\n🎯 Success Rate: ${successRate}%`);
    
    if (summary.failed > 0) {
      console.log('\n⚠️  Some tests failed. Check the output above for details.');
    } else {
      console.log('\n🎉 All tests passed successfully!');
    }
  }

  async runAllTests(): Promise<void> {
    this.startTime = Date.now();
    
    console.log('🚀 Starting comprehensive test suite...');
    console.log('🔐 Test Environment: Development');
    console.log('👤 Test User: admin');
    console.log('🔑 Test Password: test123');
    console.log('🌐 Majestic UI: http://localhost:4000/Tests');
    
    const categories = ['unit', 'integration', 'e2e'];
    
    try {
      for (const category of categories) {
        try {
          await this.runTestCategory(category);
        } catch (error) {
          console.error(`\n❌ Error running ${category} tests:`, error);
          // Continue with other categories even if one fails
        }
      }
      
      const summary = this.generateSummary();
      this.displaySummary(summary);
      this.saveResults(summary);
      
      // Exit with appropriate code
      process.exit(summary.failed > 0 ? 1 : 0);
      
    } catch (error) {
      console.error('\n💥 Fatal error during test execution:', error);
      process.exit(1);
    }
  }

  async runSpecificCategory(category: string): Promise<void> {
    this.startTime = Date.now();
    
    console.log(`🚀 Running ${category} tests...`);
    
    try {
      await this.runTestCategory(category);
      
      const summary = this.generateSummary();
      this.displaySummary(summary);
      this.saveResults(summary);
      
      process.exit(summary.failed > 0 ? 1 : 0);
      
    } catch (error) {
      console.error(`\n💥 Error running ${category} tests:`, error);
      process.exit(1);
    }
  }
}

// Main execution
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const category = args[0];
  
  const runner = new TestRunner();
  
  if (category && ['unit', 'integration', 'e2e', 'all'].includes(category)) {
    await runner.runSpecificCategory(category);
  } else {
    await runner.runAllTests();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { TestRunner, TestResult, TestSummary };
