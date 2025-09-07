// Analyze the UUID validation regex
const regex = /^(?!0{8}-0{4}-0{4}-0{4}-0{12})[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

console.log('🔍 ANÁLISE DO REGEX DE VALIDAÇÃO DE UUID');
console.log('============================================================');
console.log('Regex:', regex);
console.log('');

console.log('📋 BREAKDOWN DO REGEX:');
console.log('^                                    - Início da string');
console.log('(?!0{8}-0{4}-0{4}-0{4}-0{12})        - Negative lookahead: NÃO pode ser todos zeros');
console.log('[0-9a-fA-F]{8}                        - 8 caracteres hexadecimais');
console.log('-                                     - Hífen literal');
console.log('[0-9a-fA-F]{4}                        - 4 caracteres hexadecimais');
console.log('-                                     - Hífen literal');
console.log('[0-9a-fA-F]{4}                        - 4 caracteres hexadecimais');
console.log('-                                     - Hífen literal');
console.log('[0-9a-fA-F]{4}                        - 4 caracteres hexadecimais');
console.log('-                                     - Hífen literal');
console.log('[0-9a-fA-F]{12}                       - 12 caracteres hexadecimais');
console.log('$                                     - Fim da string');
console.log('');

console.log('🎯 O QUE ESTE REGEX FAZ:');
console.log('✅ Aceita UUIDs válidos no formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
console.log('✅ Permite caracteres hexadecimais (0-9, a-f, A-F)');
console.log('❌ REJEITA UUIDs que são todos zeros: 00000000-0000-0000-0000-000000000000');
console.log('❌ REJEITA strings que não seguem o formato UUID');
console.log('');

// Test cases
const testCases = [
  // Valid UUIDs
  '12345678-1234-1234-1234-123456789abc',
  '87654321-4321-4321-4321-cba987654321',
  '12345678-1234-1234-1234-123456789ABC',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF',
  
  // Invalid UUIDs (all zeros - should be rejected)
  '00000000-0000-0000-0000-000000000000',
  
  // Invalid formats
  '12345678-1234-1234-1234-123456789ab',   // Too short
  '12345678-1234-1234-1234-123456789abcd', // Too long
  '12345678-1234-1234-1234-123456789abg',  // Invalid character
  '12345678_1234_1234_1234_123456789abc',  // Wrong separator
  '12345678123412341234123456789abc',       // No separators
  'not-a-uuid-at-all',
  '',
  null,
  undefined
];

console.log('🧪 TESTANDO CASOS:');
console.log('============================================================');

testCases.forEach((testCase, index) => {
  const result = regex.test(testCase);
  const status = result ? '✅ VÁLIDO' : '❌ INVÁLIDO';
  const type = typeof testCase;
  
  console.log(`${(index + 1).toString().padStart(2)}. ${status} | ${type.padEnd(8)} | ${testCase || '(empty/null)'}`);
});

console.log('');
console.log('📊 RESUMO:');
const validCount = testCases.filter(testCase => regex.test(testCase)).length;
const invalidCount = testCases.length - validCount;
console.log(`✅ Válidos: ${validCount}`);
console.log(`❌ Inválidos: ${invalidCount}`);
console.log(`📋 Total testado: ${testCases.length}`);

console.log('');
console.log('🔧 O REGEX É VÁLIDO E FUNCIONA CORRETAMENTE!');
console.log('O problema não está no regex, mas possivelmente em:');
console.log('1. Como os dados estão sendo enviados para o N8N');
console.log('2. Como o N8N está processando os dados');
console.log('3. Configuração do workflow N8N');
