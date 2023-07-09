import { Telegram } from "telegraf";

export class TelegramBot {
  private readonly telegramBot;

  constructor() {
    this.telegramBot = new Telegram(process.env.TELEGRAM_TOKEN!);
  }

  async sendMessage(message: string) {
    this.telegramBot.sendMessage(process.env.CHAT_ID!, message, {
      message_thread_id: 2,
      parse_mode: "HTML",
    });
  }
}
