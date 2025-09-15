import { Injectable, Logger } from "@nestjs/common";
import { Response } from "express";

interface ChatSubscription {
  userId: string;
  chatId: string;
  response: Response;
  lastInteraction: Date;
  heartbeat: NodeJS.Timeout;
}

@Injectable()
export class SSEChatService {
  private readonly logger = new Logger(SSEChatService.name);
  private readonly subscriptions = new Map<string, ChatSubscription>();
  private readonly messageCache = new Map<string, any[]>();
  private readonly timeoutMinutes = parseInt(
    process.env.SSE_TIMEOUT_MINUTES || "5",
  );

  constructor() {
    // Start cleanup timer
    setInterval(() => {
      this.cleanupInactiveSubscriptions();
    }, 60000); // Check every minute
  }

  async subscribe(
    userId: string,
    chatId: string,
    response: Response,
  ): Promise<void> {
    this.logger.log(`User ${userId} subscribing to chat ${chatId}`);

    // Unsubscribe from any existing subscription
    this.unsubscribe(userId);

    // Create new subscription
    const subscription: ChatSubscription = {
      userId,
      chatId,
      response,
      lastInteraction: new Date(),
      heartbeat: setInterval(() => {
        this.updateLastInteraction(userId);
      }, 30000), // Update interaction every 30 seconds
    };

    this.subscriptions.set(userId, subscription);

    // Send any cached messages for this chat
    const cachedMessages = this.messageCache.get(chatId) || [];
    if (cachedMessages.length > 0) {
      for (const message of cachedMessages) {
        this.sendMessageToUser(userId, message);
      }
      // Clear cache after sending
      this.messageCache.delete(chatId);
    }
  }

  unsubscribe(userId: string): void {
    this.logger.log(`User ${userId} unsubscribing from chat`);

    const subscription = this.subscriptions.get(userId);
    if (subscription) {
      // Clear heartbeat
      if (subscription.heartbeat) {
        clearInterval(subscription.heartbeat);
      }

      // Close response if not already closed
      if (!subscription.response.destroyed) {
        subscription.response.end();
      }

      this.subscriptions.delete(userId);
    }
  }

  sendMessageToChat(chatId: string, message: any): void {
    this.logger.log(
      `Sending message to chat ${chatId}: ${JSON.stringify(message)}`,
    );

    const subscribers = Array.from(this.subscriptions.values()).filter(
      (sub) => sub.chatId === chatId,
    );

    if (subscribers.length === 0) {
      // Cache message if no subscribers
      const cachedMessages = this.messageCache.get(chatId) || [];
      cachedMessages.push(message);
      this.messageCache.set(chatId, cachedMessages);
      this.logger.log(`No subscribers for chat ${chatId}, message cached`);
      return;
    }

    // Send to all subscribers
    for (const subscriber of subscribers) {
      this.sendMessageToUser(subscriber.userId, message);
    }
  }

  private sendMessageToUser(userId: string, message: any): void {
    const subscription = this.subscriptions.get(userId);
    if (!subscription || subscription.response.destroyed) {
      this.logger.warn(
        `Cannot send message to user ${userId} - subscription not found or response destroyed`,
      );
      return;
    }

    try {
      subscription.response.write(`data: ${JSON.stringify(message)}\n\n`);
      this.updateLastInteraction(userId);
    } catch (error) {
      this.logger.error(
        `Error sending message to user ${userId}: ${error.message}`,
      );
      this.unsubscribe(userId);
    }
  }

  private updateLastInteraction(userId: string): void {
    const subscription = this.subscriptions.get(userId);
    if (subscription) {
      subscription.lastInteraction = new Date();
    }
  }

  private cleanupInactiveSubscriptions(): void {
    const now = new Date();
    const timeoutMs = this.timeoutMinutes * 60 * 1000;

    for (const [userId, subscription] of this.subscriptions.entries()) {
      const timeSinceLastInteraction =
        now.getTime() - subscription.lastInteraction.getTime();

      if (timeSinceLastInteraction > timeoutMs) {
        this.logger.log(
          `Cleaning up inactive subscription for user ${userId} (inactive for ${this.timeoutMinutes} minutes)`,
        );
        this.unsubscribe(userId);
      }
    }
  }

  getActiveSubscriptions(): number {
    return this.subscriptions.size;
  }

  getSubscribersForChat(chatId: string): string[] {
    return Array.from(this.subscriptions.values())
      .filter((sub) => sub.chatId === chatId)
      .map((sub) => sub.userId);
  }
}
