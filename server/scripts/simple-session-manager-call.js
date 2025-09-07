// Simple script to call Session Manager Hook
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

async function callSessionManager() {
  const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';
  const SESSION_MANAGER_ENDPOINT = `${N8N_BASE_URL}/webhook/whatsapp/session`;
  
  // Generate unique IDs
  const sessionId = uuidv4();
  const tenantId = uuidv4();
  
  console.log('============================================================');
  console.log('🎯 CHAMADA DO SESSION MANAGER HOOK');
  console.log('============================================================');
  console.log(`📋 URL: ${SESSION_MANAGER_ENDPOINT}`);
  console.log(`🆔 Session ID: ${sessionId}`);
  console.log(`🆔 Tenant ID: ${tenantId}`);
  console.log('');
  
  const payload = {
    session_id: sessionId,
    tenant_id: tenantId
  };
  
  console.log('📤 Enviando payload:');
  console.log(JSON.stringify(payload, null, 2));
  console.log('');
  
  try {
    console.log('🚀 Executando chamada...');
    
    const response = await axios.post(SESSION_MANAGER_ENDPOINT, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('✅ Resposta recebida:');
    console.log(`📊 Status: ${response.status}`);
    console.log('📊 Data:', JSON.stringify(response.data, null, 2));
    
    console.log('');
    console.log('============================================================');
    console.log('🎉 CHAMADA CONCLUÍDA COM SUCESSO!');
    console.log('============================================================');
    
    if (response.data.status === 200) {
      console.log('✅ Sessão criada com sucesso!');
    } else if (response.data.status === 404) {
      console.log('ℹ️  Sessão já existe e está funcionando');
    } else {
      console.log(`⚠️  Status inesperado: ${response.data.status}`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao chamar Session Manager Hook:');
    
    if (error.response) {
      console.error(`📊 Status: ${error.response.status}`);
      console.error('📊 Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('📊 Erro de rede:', error.message);
    } else {
      console.error('📊 Erro:', error.message);
    }
    
    console.log('');
    console.log('============================================================');
    console.log('💥 CHAMADA FALHOU!');
    console.log('============================================================');
    
    process.exit(1);
  }
}

// Run the function
callSessionManager();
