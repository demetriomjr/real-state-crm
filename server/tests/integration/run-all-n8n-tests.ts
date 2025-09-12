#!/usr/bin/env ts-node

/**
 * Script para executar todos os testes N8N em sequência
 * 
 * Este script executa os testes na ordem correta:
 * 1. SessionManager - Cria sessão, gera QR, para sessão
 * 2. SessionStart - Testa start de sessão parada
 * 3. SessionAuth - Gera QR code e aguarda autenticação manual
 * 4. SendMessage - Testa envio de mensagem + webhook injection
 */

import { exec } from "child_process";
import { promisify } from "util";
import * as readline from "readline";

const execAsync = promisify(exec);

// Função para aguardar input do usuário
const waitForUserInput = (question: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

async function runTest(testFile: string, testName: string) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🚀 Executando: ${testName}`);
  console.log(`📁 Arquivo: ${testFile}`);
  console.log(`${"=".repeat(60)}\n`);
  
  try {
    const command = `npm test -- ${testFile}`;
    console.log(`📋 Comando: ${command}`);
    
    const { stdout, stderr } = await execAsync(command, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log(`\n✅ ${testName} concluído com sucesso!`);
    return true;
    
  } catch (error: any) {
    console.error(`\n❌ Erro ao executar ${testName}:`);
    console.error(error.message);
    
    if (error.stdout) {
      console.log("📤 Output:", error.stdout);
    }
    
    if (error.stderr) {
      console.error("📥 Error:", error.stderr);
    }
    
    return false;
  }
}

async function runAllN8NTests() {
  console.log("🎯 Iniciando sequência completa de testes N8N WhatsApp...");
  console.log("📋 Ordem dos testes:");
  console.log("   1. SessionManager - Cria sessão, gera QR, para sessão");
  console.log("   2. SessionStart - Testa start de sessão parada");
  console.log("   3. SessionAuth - Gera QR code e aguarda autenticação manual");
  console.log("   4. SendMessage - Testa envio de mensagem + webhook injection");
  console.log("   5. Webhook - Testa recebimento de mensagens");
  console.log("   6. Error Scenarios - Testa cenários de erro e edge cases");
  console.log("   7. Performance - Testa performance e carga");
  
  const tests = [
    {
      file: "tests/integration/session-manager.integration.spec.ts",
      name: "SessionManager Test"
    },
    {
      file: "tests/integration/session-start.integration.spec.ts", 
      name: "SessionStart Test"
    },
    {
      file: "tests/integration/session-auth.integration.spec.ts",
      name: "SessionAuth Test"
    },
    {
      file: "tests/integration/send-message.integration.spec.ts",
      name: "SendMessage Test"
    },
    {
      file: "tests/integration/webhook.integration.spec.ts",
      name: "Webhook Test"
    },
    {
      file: "tests/integration/n8n-error-scenarios.integration.spec.ts",
      name: "Error Scenarios Test"
    },
    {
      file: "tests/integration/n8n-performance.integration.spec.ts",
      name: "Performance Test"
    }
  ];

  let allPassed = true;

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    
    // Pausa entre testes (exceto no primeiro)
    if (i > 0) {
      console.log(`\n⏸️  Pausa entre testes...`);
      const continueTest = await waitForUserInput("Pressione Enter para continuar para o próximo teste (ou 'q' para sair): ");
      
      if (continueTest.toLowerCase() === 'q') {
        console.log("🛑 Execução cancelada pelo usuário");
        break;
      }
    }
    
    const success = await runTest(test.file, test.name);
    
    if (!success) {
      console.error(`\n💥 Teste ${test.name} falhou!`);
      const continueAnyway = await waitForUserInput("Continuar mesmo assim? (y/n): ");
      
      if (continueAnyway.toLowerCase() !== 'y') {
        allPassed = false;
        break;
      }
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  if (allPassed) {
    console.log("🎉 Todos os testes N8N foram executados com sucesso!");
  } else {
    console.log("💥 Alguns testes falharam ou foram cancelados");
  }
  console.log(`${"=".repeat(60)}\n`);
}

// Executa os testes se este arquivo for chamado diretamente
if (require.main === module) {
  runAllN8NTests().catch(console.error);
}

export { runAllN8NTests };
