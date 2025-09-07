// Test different validation approaches
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

async function testDifferentValidation() {
  const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';
  const SESSION_MANAGER_ENDPOINT = `${N8N_BASE_URL}/webhook/whatsapp/session`;
  
  console.log('🔍 TESTANDO DIFERENTES FORMATOS DE UUID');
  console.log('============================================================');
  
  const testCases = [
    {
      name: 'UUID v4 padrão',
      sessionId: uuidv4(),
      tenantId: uuidv4()
    },
    {
      name: 'UUID com letras minúsculas',
      sessionId: '12345678-1234-1234-1234-123456789abc',
      tenantId: '87654321-4321-4321-4321-cba987654321'
    },
    {
      name: 'UUID com letras maiúsculas',
      sessionId: '12345678-1234-1234-1234-123456789ABC',
      tenantId: '87654321-4321-4321-4321-CBA987654321'
    },
    {
      name: 'UUID com números',
      sessionId: '12345678-1234-1234-1234-123456789012',
      tenantId: '87654321-4321-4321-4321-210987654321'
    }
  ];
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n${i + 1}️⃣ Testando: ${testCase.name}`);
    console.log(`Session ID: ${testCase.sessionId}`);
    console.log(`Tenant ID:  ${testCase.tenantId}`);
    
    try {
      const response = await axios.post(SESSION_MANAGER_ENDPOINT, {
        session_id: testCase.sessionId,
        tenant_id: testCase.tenantId
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      });
      
      console.log(`✅ Resposta: ${response.data.status} - ${response.data.message}`);
      
      if (response.data.status === 200) {
        console.log('🎉 SUCESSO! Este formato funcionou!');
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

testDifferentValidation();
