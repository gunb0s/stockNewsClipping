import { TrendEvent } from "../collector/shareTrendCollector";

export interface ShareTrendListener {
  update(events: TrendEvent[]): void;
}
