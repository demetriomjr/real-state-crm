#!/bin/bash

# Script para chamar o Session Manager Hook via curl
# 
# Este script demonstra como chamar o webhook do Session Manager
# usando curl diretamente.

# Configuração
N8N_BASE_URL=${N8N_BASE_URL:-"http://localhost:5678"}
SESSION_MANAGER_ENDPOINT="${N8N_BASE_URL}/webhook/whatsapp/session"

# Gera IDs únicos
SESSION_ID=$(uuidgen)
TENANT_ID=$(uuidgen)

echo "============================================================"
echo "🎯 CHAMADA DO SESSION MANAGER HOOK VIA CURL"
echo "============================================================"
echo "📋 URL: $SESSION_MANAGER_ENDPOINT"
echo "🆔 Session ID: $SESSION_ID"
echo "🆔 Tenant ID: $TENANT_ID"
echo ""

# Payload JSON
PAYLOAD=$(cat <<EOF
{
  "session_id": "$SESSION_ID",
  "tenant_id": "$TENANT_ID"
}
EOF
)

echo "📤 Enviando payload:"
echo "$PAYLOAD" | jq .
echo ""

# Faz a chamada
echo "🚀 Executando curl..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  --connect-timeout 30 \
  --max-time 60 \
  -w "\n📊 Status Code: %{http_code}\n📊 Time Total: %{time_total}s\n" \
  "$SESSION_MANAGER_ENDPOINT"

echo ""
echo "============================================================"
echo "🎉 CHAMADA CONCLUÍDA!"
echo "============================================================"
