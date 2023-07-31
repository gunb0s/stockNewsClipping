import { ShareTrendListener } from "./shareTrendListener";
import { TelegramBot } from "../telegram/telegramBot";
import { Display } from "../display/display";

export class ForeignerSellListener implements ShareTrendListener, Display {
  private readonly telegramBot: TelegramBot;

  constructor() {
    this.telegramBot = new TelegramBot();
  }

  update() {
    this.display();
  }

  display() {}
}
