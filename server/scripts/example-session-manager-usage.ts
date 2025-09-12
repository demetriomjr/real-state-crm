#!/usr/bin/env ts-node

/**
 * Exemplo de uso do Session Manager Hook via N8NWhatsappService
 * 
 * Este script demonstra como usar o serviço NestJS para chamar
 * o Session Manager Hook de forma integrada.
 */

import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { N8NWhatsappService } from "../src/Application/Services/n8n-whatsapp.service";
import { v4 as uuidv4 } from "uuid";

async function exampleSessionManagerUsage() {
  console.log("=" .repeat(60));
  console.log("🎯 EXEMPLO DE USO DO SESSION MANAGER HOOK");
  console.log("=" .repeat(60));
  
  // Cria a aplicação NestJS
  const app = await NestFactory.createApplicationContext(AppModule);
  
  // Obtém o serviço N8N
  const n8nService = app.get(N8NWhatsappService);
  
  // Gera IDs únicos para o teste
  const sessionId = uuidv4();
  const tenantId = uuidv4();
  
  console.log(`🆔 Session ID: ${sessionId}`);
  console.log(`🆔 Tenant ID: ${tenantId}`);
  console.log();
  
  try {
    console.log("🚀 Chamando createSession (Session Manager Hook)...");
    
    // Chama o Session Manager Hook via serviço
    const result = await n8nService.createSession(sessionId, tenantId);
    
    console.log("✅ Resultado recebido:");
    console.log(JSON.stringify(result, null, 2));
    
    console.log();
    console.log("🔍 Aguardando 5 segundos para verificar se a sessão foi criada...");
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Opcional: Tenta gerar QR code para verificar se a sessão foi criada
    try {
      console.log("📱 Tentando gerar QR code...");
      const qrResult = await n8nService.getAuthQRCode(sessionId);
      console.log("✅ QR code gerado com sucesso!");
      console.log("📊 QR Result:", JSON.stringify(qrResult, null, 2));
    } catch (qrError: any) {
      console.log("⚠️  Erro ao gerar QR code (pode ser normal se a sessão ainda não estiver pronta):");
      console.log(qrError.message);
    }
    
  } catch (error: any) {
    console.error("❌ Erro ao chamar Session Manager Hook:");
    console.error(error.message);
  } finally {
    // Fecha a aplicação
    await app.close();
  }
  
  console.log();
  console.log("=" .repeat(60));
  console.log("🎉 EXEMPLO CONCLUÍDO!");
  console.log("=" .repeat(60));
}

// Executa o exemplo se chamado diretamente
if (require.main === module) {
  exampleSessionManagerUsage().catch(console.error);
}

export { exampleSessionManagerUsage };
