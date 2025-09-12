import axios from "axios";
import { TEST_CONFIG } from "./test-config";

/**
 * Utility functions for N8N integration tests
 */
export class N8NTestUtils {
  private static readonly { WAHA_BASE_URL, SESSION_NAME } = TEST_CONFIG;

  /**
   * Wait for a session to reach a specific status
   */
  static async waitForSessionStatus(
    expectedStatus: string,
    timeoutMs: number = 30000,
    checkIntervalMs: number = 1000
  ): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      try {
        const response = await axios.get(`${this.WAHA_BASE_URL}/api/sessions/${this.SESSION_NAME}`);
        const session = response.data;
        
        if (session.status === expectedStatus) {
          return true;
        }
        
        await new Promise(resolve => setTimeout(resolve, checkIntervalMs));
      } catch (error) {
        // Continue trying
        await new Promise(resolve => setTimeout(resolve, checkIntervalMs));
      }
    }
    
    return false;
  }

  /**
   * Ensure session is in a specific status, starting it if necessary
   */
  static async ensureSessionStatus(expectedStatus: string): Promise<void> {
    try {
      const response = await axios.get(`${this.WAHA_BASE_URL}/api/sessions/${this.SESSION_NAME}`);
      const session = response.data;
      
      if (session.status === expectedStatus) {
        console.log(`✅ Sessão já está ${expectedStatus}`);
        return;
      }
      
      if (expectedStatus === "WORKING" && session.status === "STOPPED") {
        console.log("🚀 Iniciando sessão parada...");
        await axios.post(`${this.WAHA_BASE_URL}/api/sessions/${this.SESSION_NAME}/start`);
        
        const success = await this.waitForSessionStatus("WORKING");
        if (!success) {
          throw new Error("Timeout: Sessão não iniciou");
        }
        console.log("✅ Sessão iniciada com sucesso");
      } else if (expectedStatus === "STOPPED" && session.status === "WORKING") {
        console.log("🛑 Parando sessão...");
        await axios.post(`${this.WAHA_BASE_URL}/api/sessions/${this.SESSION_NAME}/stop`);
        
        const success = await this.waitForSessionStatus("STOPPED");
        if (!success) {
          throw new Error("Timeout: Sessão não parou");
        }
        console.log("✅ Sessão parada com sucesso");
      }
    } catch (error: any) {
      throw new Error(`Erro ao garantir status da sessão: ${error.message}`);
    }
  }

  /**
   * Clean up all WAHA sessions
   */
  static async cleanupAllSessions(): Promise<void> {
    try {
      const response = await axios.get(`${this.WAHA_BASE_URL}/api/sessions`);
      const sessions = response.data;
      
      console.log(`🗑️  Encontradas ${sessions.length} sessões para limpeza`);
      
      for (const session of sessions) {
        try {
          await axios.delete(`${this.WAHA_BASE_URL}/api/sessions/${session.name}`);
          console.log(`✅ Sessão "${session.name}" deletada`);
        } catch (error: any) {
          if (error.response?.status === 404) {
            console.log(`ℹ️  Sessão "${session.name}" já não existia`);
          } else {
            console.error(`❌ Erro ao deletar sessão "${session.name}":`, error.message);
          }
        }
      }
      
      // Verify cleanup
      const verifyResponse = await axios.get(`${this.WAHA_BASE_URL}/api/sessions`);
      if (verifyResponse.data.length === 0) {
        console.log("✅ Todas as sessões foram limpas com sucesso");
      } else {
        console.warn(`⚠️  Ainda existem ${verifyResponse.data.length} sessões`);
      }
    } catch (error: any) {
      throw new Error(`Erro na limpeza de sessões: ${error.message}`);
    }
  }

  /**
   * Verify session exists in WAHA
   */
  static async verifySessionExists(): Promise<any> {
    try {
      const response = await axios.get(`${this.WAHA_BASE_URL}/api/sessions`);
      const sessions = response.data;
      const session = sessions.find((s: any) => s.name === this.SESSION_NAME);
      
      if (!session) {
        throw new Error(`Sessão "${this.SESSION_NAME}" não encontrada no WAHA`);
      }
      
      return session;
    } catch (error: any) {
      throw new Error(`Erro ao verificar sessão no WAHA: ${error.message}`);
    }
  }

  /**
   * Get session status
   */
  static async getSessionStatus(): Promise<string> {
    try {
      const response = await axios.get(`${this.WAHA_BASE_URL}/api/sessions/${this.SESSION_NAME}`);
      return response.data.status;
    } catch (error: any) {
      throw new Error(`Erro ao obter status da sessão: ${error.message}`);
    }
  }

  /**
   * Retry a function with exponential backoff
   */
  static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelayMs: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        
        if (attempt === maxRetries) {
          break;
        }
        
        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        console.log(`⏳ Tentativa ${attempt} falhou, aguardando ${delay}ms antes da próxima...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }
}
