#!/usr/bin/env ts-node

/**
 * Script para executar teste de integração N8N WhatsApp
 * 
 * Este script executa o teste de integração completo que:
 * 1. Deleta sessão WAHA existente
 * 2. Cria nova sessão via N8N
 * 3. Verifica se sessão foi criada no WAHA
 * 4. Gera QR code e abre no Chrome
 * 5. Aguarda autenticação manual
 * 6. Testa envio de mensagem
 * 7. Limpa sessão de teste
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function runN8NIntegrationTest() {
  console.log("🚀 Iniciando teste de integração N8N WhatsApp...");
  console.log("=" .repeat(60));
  
  try {
    // Executa o teste específico
    const command = "npm test -- tests/integration/n8n-whatsapp.integration.spec.ts";
    console.log(`📋 Executando: ${command}`);
    
    const { stdout, stderr } = await execAsync(command, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log("✅ Teste de integração N8N concluído com sucesso!");
    
  } catch (error: any) {
    console.error("❌ Erro ao executar teste de integração N8N:");
    console.error(error.message);
    
    if (error.stdout) {
      console.log("📤 Output:", error.stdout);
    }
    
    if (error.stderr) {
      console.error("📥 Error:", error.stderr);
    }
    
    process.exit(1);
  }
}

// Executa o teste se este arquivo for chamado diretamente
if (require.main === module) {
  runN8NIntegrationTest();
}

export { runN8NIntegrationTest };
