// Test if webhook is receiving data correctly
const axios = require('axios');

async function testWebhookReception() {
  const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';
  const SESSION_MANAGER_ENDPOINT = `${N8N_BASE_URL}/webhook/whatsapp/session`;
  
  console.log('🔍 TESTANDO RECEPÇÃO DO WEBHOOK');
  console.log('============================================================');
  
  // Test with different payloads
  const testCases = [
    {
      name: 'Payload normal',
      payload: {
        session_id: 'test-session-123',
        tenant_id: 'test-tenant-456'
      }
    },
    {
      name: 'Payload com campos extras',
      payload: {
        session_id: 'test-session-123',
        tenant_id: 'test-tenant-456',
        extra_field: 'extra-value'
      }
    },
    {
      name: 'Payload com arrays',
      payload: {
        session_id: ['test-session-123'],
        tenant_id: ['test-tenant-456']
      }
    },
    {
      name: 'Payload com objetos',
      payload: {
        session_id: { value: 'test-session-123' },
        tenant_id: { value: 'test-tenant-456' }
      }
    }
  ];
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n${i + 1}️⃣ Testando: ${testCase.name}`);
    console.log(`Payload:`, JSON.stringify(testCase.payload, null, 2));
    
    try {
      const response = await axios.post(SESSION_MANAGER_ENDPOINT, testCase.payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      });
      
      console.log(`✅ Resposta: ${response.data.status} - ${response.data.message}`);
      
      if (response.data.status === 200) {
        console.log('🎉 SUCESSO! Este payload funcionou!');
        break;
      }
      
    } catch (error) {
      console.log(`❌ Erro: ${error.response?.data?.message || error.message}`);
    }
    
    // Pequena pausa entre testes
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n============================================================');
  console.log('🎯 TESTE CONCLUÍDO');
  console.log('============================================================');
}

testWebhookReception();
