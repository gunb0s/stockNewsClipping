import { TrendEvent } from "../collector/shareTrendCollector";

export interface Listener {
  update(events: TrendEvent[]): void;
}
