// Test UUID regex validation
const regex = /^(?!0{8}-0{4}-0{4}-0{4}-0{12})[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const testUUIDs = [
  '12345678-1234-1234-1234-123456789abc',  // Our test UUID
  '87654321-4321-4321-4321-cba987654321',  // Our test UUID
  '00000000-0000-0000-0000-000000000000',  // All zeros (should fail)
  '12345678-1234-1234-1234-123456789ABC',  // Uppercase (should pass)
  '12345678-1234-1234-1234-123456789ab',   // Too short (should fail)
  '12345678-1234-1234-1234-123456789abcd', // Too long (should fail)
  '12345678-1234-1234-1234-123456789abg',  // Invalid character (should fail)
];

console.log('🧪 Testando regex de validação de UUID:');
console.log('Regex:', regex);
console.log('');

testUUIDs.forEach(uuid => {
  const isValid = regex.test(uuid);
  console.log(`${isValid ? '✅' : '❌'} ${uuid} - ${isValid ? 'VÁLIDO' : 'INVÁLIDO'}`);
});

console.log('');
console.log('📋 UUIDs que estamos usando:');
console.log('Session ID: 12345678-1234-1234-1234-123456789abc');
console.log('Tenant ID:  87654321-4321-4321-4321-cba987654321');
console.log('');

const sessionIdValid = regex.test('12345678-1234-1234-1234-123456789abc');
const tenantIdValid = regex.test('87654321-4321-4321-4321-cba987654321');

console.log(`Session ID válido: ${sessionIdValid ? '✅ SIM' : '❌ NÃO'}`);
console.log(`Tenant ID válido:  ${tenantIdValid ? '✅ SIM' : '❌ NÃO'}`);
