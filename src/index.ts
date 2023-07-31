import { ShareTrendCollector } from "./collector/shareTrendCollector";

export const handler = async () => {
  const shareTrendCollector = new ShareTrendCollector();

  await shareTrendCollector.collect();

  await shareTrendCollector.notify();
};
