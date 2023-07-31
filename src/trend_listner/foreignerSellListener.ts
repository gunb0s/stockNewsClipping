import { ShareTrendListener } from "./shareTrendListener";
import { TelegramBot } from "../telegram/telegramBot";
import { Display } from "../display/display";
import { TrendEvent } from "../collector/shareTrendCollector";
import { NewsClipping } from "../news-clipping";
import { TREND_INDEX, TREND_URL } from "../collector/collector";

export class ForeignerSellListener implements ShareTrendListener, Display {
  private readonly name: TREND_INDEX;
  private readonly url: TREND_URL;
  private readonly telegramBot: TelegramBot;
  private readonly newsClipping: NewsClipping;

  constructor(name: TREND_INDEX, url: TREND_URL) {
    this.telegramBot = new TelegramBot();
    this.newsClipping = new NewsClipping();
    this.name = name;
    this.url = url;
  }

  async update(events: TrendEvent[]): Promise<void> {
    const message = await this.newsClipping.createHTMLMessage(
      this.name,
      this.url,
      events
    );
    await this.display(message);
  }

  async display(message: string): Promise<void> {
    await this.telegramBot.sendMessage(message);
  }
}
