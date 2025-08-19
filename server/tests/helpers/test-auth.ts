import { testConfig } from '../../test.config';

export class TestAuthHelper {
  static getTestCredentials() {
    return {
      username: testConfig.env.TEST_USER,
      password: testConfig.env.TEST_PASSWORD,
      fullName: testConfig.auth.testUser.fullName,
      user_level: testConfig.auth.testUser.user_level,
      tenant_id: testConfig.auth.testUser.tenant_id
    };
  }

  static getTestUserData() {
    return testConfig.auth.testUser;
  }

  static getAuthHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  static getBasicAuthHeaders() {
    const credentials = this.getTestCredentials();
    const auth = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
    return {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    };
  }
}
