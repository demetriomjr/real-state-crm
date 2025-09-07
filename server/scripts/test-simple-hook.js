// Test a simple hook call to see if N8N is responding
const axios = require('axios');

async function testSimpleHook() {
  const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';
  
  console.log('🔍 TESTANDO SE N8N ESTÁ RESPONDENDO');
  console.log('============================================================');
  
  // Test 1: Check if N8N is running
  try {
    console.log('1️⃣ Testando se N8N está rodando...');
    const healthResponse = await axios.get(`${N8N_BASE_URL}/healthz`);
    console.log('✅ N8N está rodando:', healthResponse.data);
  } catch (error) {
    console.log('❌ N8N não está rodando:', error.message);
    return;
  }
  
  // Test 2: Try a different webhook endpoint
  try {
    console.log('\n2️⃣ Testando webhook diferente...');
    const testResponse = await axios.post(`${N8N_BASE_URL}/webhook/test`, {
      test: 'data'
    });
    console.log('✅ Webhook de teste funcionou:', testResponse.data);
  } catch (error) {
    console.log('ℹ️ Webhook de teste não existe (normal):', error.response?.status);
  }
  
  // Test 3: Try the session manager with minimal data
  try {
    console.log('\n3️⃣ Testando Session Manager com dados mínimos...');
    const sessionResponse = await axios.post(`${N8N_BASE_URL}/webhook/whatsapp/session`, {
      session_id: 'test',
      tenant_id: 'test'
    });
    console.log('✅ Session Manager respondeu:', sessionResponse.data);
  } catch (error) {
    console.log('❌ Session Manager erro:', error.response?.data);
  }
  
  // Test 4: Try with proper UUIDs again
  try {
    console.log('\n4️⃣ Testando Session Manager com UUIDs válidos...');
    const uuidResponse = await axios.post(`${N8N_BASE_URL}/webhook/whatsapp/session`, {
      session_id: '12345678-1234-1234-1234-123456789abc',
      tenant_id: '87654321-4321-4321-4321-cba987654321'
    });
    console.log('✅ Session Manager com UUIDs:', uuidResponse.data);
  } catch (error) {
    console.log('❌ Session Manager com UUIDs erro:', error.response?.data);
  }
  
  console.log('\n============================================================');
  console.log('🎯 TESTE CONCLUÍDO');
  console.log('============================================================');
}

testSimpleHook();
