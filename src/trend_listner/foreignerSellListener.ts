import { ShareTrendListener } from "./shareTrendListener";
import { TelegramBot } from "../telegram/telegramBot";
import { Display } from "../display/display";
import { Collector } from "../collector/Collector";

export class ForeignerSellListener implements ShareTrendListener, Display {
  private readonly telegramBot: TelegramBot;

  constructor(collector: Collector) {
    this.telegramBot = new TelegramBot();
  }

  update() {
    this.display();
  }

  display() {}
}
