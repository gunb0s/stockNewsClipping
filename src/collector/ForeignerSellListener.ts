import { ShareTrendListener } from "../trend_listner/ShareTrendListener";
import { TelegramBot } from "../telegram/telegramBot";

export class ForeignerSellListener implements ShareTrendListener {
  private readonly telegramBot: TelegramBot;

  constructor() {
    this.telegramBot = new TelegramBot();
  }
}
