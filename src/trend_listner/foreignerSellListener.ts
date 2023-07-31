import { ShareTrendListener } from "./shareTrendListener";
import { TelegramBot } from "../telegram/telegramBot";
import { Display } from "../display/display";
import { TrendEvent } from "../collector/shareTrendCollector";

export class ForeignerSellListener implements ShareTrendListener, Display {
  private readonly telegramBot: TelegramBot;

  constructor() {
    this.telegramBot = new TelegramBot();
  }

  async update(events: TrendEvent[]): Promise<void> {
    await this.display();
  }

  async display(): Promise<void> {}
}
