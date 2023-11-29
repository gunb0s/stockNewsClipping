import { ShareTrendCollector } from "./collector/shareTrendCollector";
import { DataProcessor } from "./data_processor/dataProcessor";

export const handler = async () => {
  const dataProcessor = new DataProcessor();

  const shareTrendCollector = new ShareTrendCollector(dataProcessor);

  await shareTrendCollector.collect();

  await shareTrendCollector.notify();
};
