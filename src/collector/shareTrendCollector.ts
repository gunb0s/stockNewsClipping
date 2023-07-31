import { ShareTrendListener } from "../trend_listner/shareTrendListener";
import { Collector, TREND_INDEX, TREND_URL } from "./Collector";
import { DataProcessor } from "../data_processor/dataProcessor";

export class ShareTrendCollector implements Collector {
  trendToListeners = new Map<TREND_INDEX, ShareTrendListener>();
  trendToEvents = new Map<TREND_INDEX, string[]>();
  URL_MAP = new Map<TREND_INDEX, TREND_URL>([
    [TREND_INDEX.ForeignerSell, TREND_URL.ForeignerSell],
    [TREND_INDEX.ForeignerBuy, TREND_URL.ForeignerBuy],
    [TREND_INDEX.InstitutionalSell, TREND_URL.InstitutionalSell],
    [TREND_INDEX.InstitutionalBuy, TREND_URL.InstitutionalBuy],
  ]);
  private readonly dataProcessor: DataProcessor;

  constructor() {
    this.dataProcessor = new DataProcessor();
  }

  registerListener(trend: TREND_INDEX, listener: ShareTrendListener) {
    this.trendToListeners.set(trend, listener);
  }

  removeListener(trend: TREND_INDEX) {
    this.trendToListeners.delete(trend);
  }
  notify() {}
}
