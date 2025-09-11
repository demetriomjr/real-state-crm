import { Injectable, Logger } from "@nestjs/common";
import { randomBytes } from "crypto";

export interface UserSecretCacheEntry {
  userSecret: string;
  user_id: string;
  tenant_id: string;
  user_level: number;
  createdAt: Date;
  expiresAt: Date;
}

@Injectable()
export class UserSecretCacheService {
  private readonly logger = new Logger(UserSecretCacheService.name);
  private readonly cache: Map<string, UserSecretCacheEntry> = new Map();
  private readonly maxCacheSize = 1000;
  private readonly defaultExpirationMinutes = 30;

  /**
   * Generate a new userSecret for a user
   */
  generateUserSecret(): string {
    return randomBytes(32).toString("hex");
  }

  /**
   * Store userSecret with user data in cache
   */
  storeUserSecret(
    userSecret: string,
    user_id: string,
    tenant_id: string,
    user_level: number,
    expirationMinutes?: number,
  ): void {
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() +
        (expirationMinutes || this.defaultExpirationMinutes) * 60 * 1000,
    );

    const entry: UserSecretCacheEntry = {
      userSecret,
      user_id,
      tenant_id,
      user_level,
      createdAt: now,
      expiresAt,
    };

    this.cache.set(userSecret, entry);
    this.logger.log(
      `Stored userSecret for user: ${user_id} (tenant: ${tenant_id})`,
    );

    // Clean up expired entries if cache is getting large
    if (this.cache.size > this.maxCacheSize) {
      this.cleanupExpiredEntries();
    }
  }

  /**
   * Retrieve user data by userSecret
   */
  getUserBySecret(userSecret: string): UserSecretCacheEntry | null {
    const entry = this.cache.get(userSecret);

    if (!entry) {
      this.logger.warn(`UserSecret not found in cache: ${userSecret}`);
      return null;
    }

    // Check if entry has expired
    if (new Date() > entry.expiresAt) {
      this.logger.warn(`UserSecret expired for user: ${entry.user_id}`);
      this.cache.delete(userSecret);
      return null;
    }

    this.logger.log(
      `Retrieved user data for userSecret: ${userSecret} (user: ${entry.user_id})`,
    );
    return entry;
  }

  /**
   * Remove userSecret from cache (for logout)
   */
  removeUserSecret(userSecret: string): boolean {
    const entry = this.cache.get(userSecret);
    if (entry) {
      this.cache.delete(userSecret);
      this.logger.log(`Removed userSecret for user: ${entry.user_id}`);
      return true;
    }
    return false;
  }

  /**
   * Clean up expired entries
   */
  private cleanupExpiredEntries(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [userSecret, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(userSecret);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.log(`Cleaned up ${cleanedCount} expired userSecret entries`);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
    };
  }

  /**
   * Clear all cache entries (for testing)
   */
  clearCache(): void {
    this.cache.clear();
    this.logger.log("Cleared all userSecret cache entries");
  }
}
