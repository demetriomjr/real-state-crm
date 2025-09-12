# Script PowerShell para chamar o Session Manager Hook
# 
# Este script demonstra como chamar o webhook do Session Manager
# usando PowerShell/Invoke-RestMethod.

# Configuração
$N8N_BASE_URL = if ($env:N8N_BASE_URL) { $env:N8N_BASE_URL } else { "http://localhost:5678" }
$SESSION_MANAGER_ENDPOINT = "$N8N_BASE_URL/webhook/whatsapp/session"

# Gera IDs únicos
$SESSION_ID = [System.Guid]::NewGuid().ToString()
$TENANT_ID = [System.Guid]::NewGuid().ToString()

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🎯 CHAMADA DO SESSION MANAGER HOOK VIA POWERSHELL" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "📋 URL: $SESSION_MANAGER_ENDPOINT" -ForegroundColor Green
Write-Host "🆔 Session ID: $SESSION_ID" -ForegroundColor Green
Write-Host "🆔 Tenant ID: $TENANT_ID" -ForegroundColor Green
Write-Host ""

# Payload JSON
$payload = @{
    session_id = $SESSION_ID
    tenant_id = $TENANT_ID
} | ConvertTo-Json

Write-Host "📤 Enviando payload:" -ForegroundColor Yellow
Write-Host $payload -ForegroundColor White
Write-Host ""

try {
    Write-Host "🚀 Executando chamada..." -ForegroundColor Yellow
    
    # Faz a chamada
    $response = Invoke-RestMethod -Uri $SESSION_MANAGER_ENDPOINT -Method POST -Body $payload -ContentType "application/json" -TimeoutSec 60
    
    Write-Host "✅ Resposta recebida:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor White
    
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "🎉 CHAMADA CONCLUÍDA COM SUCESSO!" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Erro ao chamar Session Manager Hook:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "📊 Status Code: $statusCode" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "💥 CHAMADA FALHOU!" -ForegroundColor Red
    Write-Host "============================================================" -ForegroundColor Cyan
}
