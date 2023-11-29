import { ShareTrendCollector } from "./collector/shareTrendCollector";
import { DataProcessor } from "./data_processor/dataProcessor";
import { TelegramBot } from "./telegram/telegramBot";
import { NewsClipping } from "./news-clipping";

export const handler = async () => {
  const dataProcessor = new DataProcessor();
  const telegramBot = new TelegramBot();
  const newsClipping = new NewsClipping();

  const shareTrendCollector = new ShareTrendCollector(
    dataProcessor,
    telegramBot,
    newsClipping
  );

  await shareTrendCollector.collect();

  await shareTrendCollector.notify();
};
