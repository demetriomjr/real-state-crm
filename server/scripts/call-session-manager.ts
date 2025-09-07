#!/usr/bin/env ts-node

/**
 * Script para chamar o Session Manager Hook do N8N
 * 
 * Este script demonstra como chamar o webhook do Session Manager
 * que cria uma nova sessão WhatsApp via N8N.
 */

import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Configuração
const N8N_BASE_URL = process.env.N8N_BASE_URL || "http://localhost:5678";
const SESSION_MANAGER_ENDPOINT = `${N8N_BASE_URL}/webhook/whatsapp/session`;

interface SessionManagerRequest {
  session_id: string;
  tenant_id: string;
}

interface SessionManagerResponse {
  status: number;
  message: string;
  session_id?: string;
  tenant_id?: string;
}

async function callSessionManagerHook(
  sessionId: string,
  tenantId: string
): Promise<SessionManagerResponse> {
  console.log("🚀 Chamando Session Manager Hook...");
  console.log(`📋 URL: ${SESSION_MANAGER_ENDPOINT}`);
  console.log(`📋 Session ID: ${sessionId}`);
  console.log(`📋 Tenant ID: ${tenantId}`);
  
  try {
    const payload: SessionManagerRequest = {
      session_id: sessionId,
      tenant_id: tenantId,
    };
    
    console.log("📤 Enviando payload:", JSON.stringify(payload, null, 2));
    
    const response = await axios.post(SESSION_MANAGER_ENDPOINT, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 segundos timeout
    });
    
    console.log("✅ Resposta recebida:");
    console.log(`📊 Status: ${response.status}`);
    console.log(`📊 Data:`, JSON.stringify(response.data, null, 2));
    
    return response.data;
    
  } catch (error: any) {
    console.error("❌ Erro ao chamar Session Manager Hook:");
    
    if (error.response) {
      console.error(`📊 Status: ${error.response.status}`);
      console.error(`📊 Data:`, JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error("📊 Erro de rede:", error.message);
    } else {
      console.error("📊 Erro:", error.message);
    }
    
    throw error;
  }
}

async function main() {
  console.log("=" .repeat(60));
  console.log("🎯 CHAMADA DO SESSION MANAGER HOOK");
  console.log("=" .repeat(60));
  
  // Gera IDs únicos para o teste
  const sessionId = uuidv4();
  const tenantId = uuidv4();
  
  console.log(`🆔 Session ID gerado: ${sessionId}`);
  console.log(`🆔 Tenant ID gerado: ${tenantId}`);
  console.log();
  
  try {
    const result = await callSessionManagerHook(sessionId, tenantId);
    
    console.log();
    console.log("=" .repeat(60));
    console.log("🎉 CHAMADA CONCLUÍDA COM SUCESSO!");
    console.log("=" .repeat(60));
    
    if (result.status === 200) {
      console.log("✅ Sessão criada com sucesso!");
    } else if (result.status === 404) {
      console.log("ℹ️  Sessão já existe e está funcionando");
    } else {
      console.log(`⚠️  Status inesperado: ${result.status}`);
    }
    
  } catch (error: any) {
    console.log();
    console.log("=" .repeat(60));
    console.log("💥 CHAMADA FALHOU!");
    console.log("=" .repeat(60));
    console.error("Erro:", error.message);
    
    process.exit(1);
  }
}

// Executa o script se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

export { callSessionManagerHook };
