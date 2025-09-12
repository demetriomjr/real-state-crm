# Testes de Integração - N8N WhatsApp

Este diretório contém os testes de integração para a funcionalidade de WhatsApp via N8N, organizados em 4 testes separados que seguem o fluxo completo do N8N.

## Estrutura dos Testes

### 1. `session-manager.integration.spec.ts`
**Teste do SessionManager Hook** - Cria sessão completa:
- ✅ Deleta todas as sessões WAHA existentes via Axios direto
- ✅ Cria nova sessão via N8N SessionManager (com GUID gerado)
- ✅ Verifica se sessão foi criada no WAHA
- ✅ Verifica se sessão foi persistida no banco de dados
- ✅ Gera QR code via SessionAuth
- ✅ Para a sessão para próximo teste

### 2. `session-start.integration.spec.ts`
**Teste do SessionStart Hook** - Inicia sessão parada:
- ✅ Verifica se sessão existe e está parada
- ✅ Para sessão se estiver WORKING
- ✅ Inicia sessão via N8N SessionStart
- ✅ Verifica se sessão está WORKING

### 3. `session-auth.integration.spec.ts`
**Teste do SessionAuth Hook** - Gera QR code e autenticação:
- ✅ Garante que sessão está WORKING
- ✅ Inicia sessão se necessário (com loop de verificação)
- ✅ Gera QR code via SessionAuth
- ✅ Salva QR code como imagem e abre no Chrome
- ✅ Aguarda autenticação manual do usuário
- ✅ Verifica se sessão está autenticada

### 4. `send-message.integration.spec.ts`
**Teste do SendMessage Hook** - Envio e webhook:
- ✅ Verifica se sessão está WORKING
- ✅ Envia mensagem via N8N SendMessage
- ✅ Simula mensagem recebida (webhook injection)
- ✅ Testa processamento do webhook na aplicação
- ✅ Verifica se mensagem foi processada

### 5. `webhook.integration.spec.ts`
**Teste de Webhook** - Recebimento de mensagens:
- ✅ Recebimento de webhooks sem autenticação (Docker internal)
- ✅ Validação de webhook secret
- ✅ Filtragem de eventos não-mensagem
- ✅ Processamento de diferentes tipos de mensagem
- ✅ Segurança de IPs externos

### 6. `n8n-error-scenarios.integration.spec.ts`
**Teste de Cenários de Erro** - Edge cases e tratamento de erros:
- ✅ IDs de sessão inválidos
- ✅ IDs de tenant inválidos
- ✅ Números de telefone inválidos
- ✅ Mensagens vazias ou nulas
- ✅ Serviço N8N indisponível
- ✅ Sessões inexistentes
- ✅ Operações concorrentes
- ✅ Timeouts de rede

### 7. `n8n-performance.integration.spec.ts`
**Teste de Performance** - Medição de performance e carga:
- ✅ Tempo de resposta das operações
- ✅ Carga concorrente
- ✅ Uso de memória
- ✅ Resiliência de rede
- ✅ Retry com backoff exponencial

### 8. `test-utils.ts`
**Utilitários de Teste** - Funções auxiliares:
- ✅ Gerenciamento de status de sessão
- ✅ Limpeza de sessões
- ✅ Verificação de existência
- ✅ Retry com backoff
- ✅ Aguardar status específico

### 9. `test-config.ts`
Configuração centralizada para os testes:
- URLs dos serviços (WAHA, N8N)
- Timeouts e configurações
- IDs consistentes para todos os testes
- Funções utilitárias (salvar QR code, abrir Chrome, etc.)

### 10. `run-all-n8n-tests.ts`
Script para executar todos os testes N8N em sequência com pausas.

## Como Executar

### Pré-requisitos
1. **Docker Compose rodando** com todos os serviços:
   ```bash
   docker-compose up -d
   ```

2. **WAHA rodando na porta 3100**
3. **N8N rodando na porta 5678**
4. **Aplicação rodando na porta 3000**

### Executar Todos os Testes N8N em Sequência
```bash
# Via script dedicado (RECOMENDADO)
npx ts-node tests/integration/run-all-n8n-tests.ts
```

### Executar Testes Individuais
```bash
# 1. SessionManager (cria sessão, gera QR, para sessão)
npm test -- tests/integration/session-manager.integration.spec.ts

# 2. SessionStart (inicia sessão parada)
npm test -- tests/integration/session-start.integration.spec.ts

# 3. SessionAuth (gera QR code e aguarda autenticação manual)
npm test -- tests/integration/session-auth.integration.spec.ts

# 4. SendMessage (envio de mensagem + webhook injection)
npm test -- tests/integration/send-message.integration.spec.ts

# 5. Webhook (recebimento de mensagens)
npm test -- tests/integration/webhook.integration.spec.ts

# 6. Error Scenarios (cenários de erro)
npm test -- tests/integration/n8n-error-scenarios.integration.spec.ts

# 7. Performance (testes de performance)
npm test -- tests/integration/n8n-performance.integration.spec.ts
```

### Executar Todos os Testes de Integração
```bash
npm test -- tests/integration/
```

## Configuração

### Variáveis de Ambiente
```bash
N8N_BASE_URL=http://localhost:5678
WHATSAPP_WEBHOOK_SECRET=your-whatsapp-webhook-secret
```

### Configuração de Teste
Edite `test-config.ts` para ajustar:
- `TEST_PHONE`: Número de telefone para teste
- `SESSION_NAME`: Nome da sessão (deve ser "default")
- Timeouts e URLs

## Fluxo do Teste N8N

1. **🗑️ Limpeza**: Deleta sessão WAHA existente
2. **🚀 Criação**: Cria nova sessão via N8N
3. **🔍 Verificação**: Confirma que sessão existe no WAHA
4. **📱 QR Code**: Gera QR code e abre no Chrome
5. **⏳ Aguarda**: Espera autenticação manual do usuário
6. **📤 Teste**: Envia mensagem de teste
7. **🧹 Limpeza**: Remove sessão de teste

## Interação Manual

Durante o teste N8N, você precisará:
1. **Escanear o QR code** com seu WhatsApp
2. **Aguardar a autenticação** ser concluída
3. **Confirmar** digitando 'y' quando solicitado

## Troubleshooting

### Erro de Conexão WAHA
- Verifique se WAHA está rodando na porta 3100
- Confirme que o container está ativo: `docker ps`

### Erro de Conexão N8N
- Verifique se N8N está rodando na porta 5678
- Confirme que o workflow está ativo

### QR Code não abre
- Verifique se o Chrome está instalado
- Abra manualmente o arquivo `whatsapp-qr-code.png`

### Sessão não autentica
- Verifique se o WhatsApp está conectado à internet
- Tente gerar um novo QR code
- Confirme que a sessão "default" não está sendo usada em outro lugar

## Logs e Debug

Os testes geram logs detalhados com emojis para facilitar o acompanhamento:
- 🗑️ Deleção
- 🚀 Criação
- 🔍 Verificação
- 📱 QR Code
- ⏳ Aguardando
- 📤 Envio
- 🧹 Limpeza
- ✅ Sucesso
- ❌ Erro
- ⚠️ Aviso
- ℹ️ Informação
