// src/services/MessagingService.ts
import { StreamChat } from "stream-chat";

class MessagingService {
  private static instance: MessagingService;
  private client: StreamChat;
  private userId: string;
  private token: string;

  private constructor(apiKey: string, userId: string, token: string) {
    this.client = StreamChat.getInstance(apiKey);
    this.userId = userId;
    this.token = token;
  }

  static async init(apiKey: string, userId: string, token: string) {
    if (!MessagingService.instance) {
      MessagingService.instance = new MessagingService(apiKey, userId, token);
      await MessagingService.instance.connectUser();
    }
    return MessagingService.instance;
  }

  private async connectUser() {
    await this.client.connectUser(
      { id: this.userId, name: this.userId },
      this.token
    );
  }

  async getChannel(channelId: string) {
    return this.client.channel("messaging", channelId, {
      name: "Radiology Room",
    });
  }

  async sendMessage(channelId: string, text: string, file?: File) {
    const channel = await this.getChannel(channelId);
    await channel.watch();

    const message: any = { text };

    if (file) {
      message.attachments = [
        {
          type: "file",
          asset_url: URL.createObjectURL(file), // temporary preview
          title: file.name,
        },
      ];
    }

    const response = await channel.sendMessage(message);

    // 🔹 Send via Twilio mock (replace with backend later)
    await this.sendTwilioNotification(text);

    return response;
  }

  async sendTwilioNotification(text: string) {
    try {
      // This MUST be proxied via your backend later
      await fetch("https://localhost:4000/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "+234XXXXXXXXXX", // patient number
          body: text,
        }),
      });
    } catch (err) {
      console.warn("Twilio mock failed:", err);
    }
  }
}

export default MessagingService;
