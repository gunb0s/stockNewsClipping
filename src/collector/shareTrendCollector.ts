import { Listener } from "../trend_listner/listener";
import { Collector, TREND_INDEX, TREND_URL } from "./collector";
import { DataProcessor } from "../data_processor/dataProcessor";
import { TrendListener } from "../trend_listner/trendListener";

export interface TrendEvent {
  name: string;
  url: string;
}

export class ShareTrendCollector implements Collector {
  trendToListeners = new Map<TREND_INDEX, Listener>();
  trendToEvents = new Map<TREND_INDEX, TrendEvent[]>();
  URL_MAP = new Map<TREND_INDEX, TREND_URL>([
    [TREND_INDEX.ForeignerSell, TREND_URL.ForeignerSell],
    [TREND_INDEX.ForeignerBuy, TREND_URL.ForeignerBuy],
    [TREND_INDEX.InstitutionalSell, TREND_URL.InstitutionalSell],
    [TREND_INDEX.InstitutionalBuy, TREND_URL.InstitutionalBuy],
  ]);

  constructor(private readonly dataProcessor: DataProcessor) {
    this.registerListener(
      TREND_INDEX.ForeignerSell,
      new TrendListener(
        TREND_INDEX.ForeignerSell,
        this.URL_MAP.get(TREND_INDEX.ForeignerSell)!
      )
    );
    this.registerListener(
      TREND_INDEX.ForeignerBuy,
      new TrendListener(
        TREND_INDEX.ForeignerBuy,
        this.URL_MAP.get(TREND_INDEX.ForeignerBuy)!
      )
    );
    this.registerListener(
      TREND_INDEX.InstitutionalSell,
      new TrendListener(
        TREND_INDEX.InstitutionalSell,
        this.URL_MAP.get(TREND_INDEX.InstitutionalSell)!
      )
    );
    this.registerListener(
      TREND_INDEX.InstitutionalBuy,
      new TrendListener(
        TREND_INDEX.InstitutionalBuy,
        this.URL_MAP.get(TREND_INDEX.InstitutionalBuy)!
      )
    );
  }

  registerListener(trend: TREND_INDEX, listener: Listener) {
    this.trendToListeners.set(trend, listener);
  }

  removeListener(trend: TREND_INDEX) {
    this.trendToListeners.delete(trend);
  }
  async notify() {
    for (const [trend, listener] of this.trendToListeners) {
      await listener.update(this.trendToEvents.get(trend)!);
    }
  }

  async collect() {
    for (const [trend, trendUrl] of this.URL_MAP) {
      const trendEvents = await this.dataProcessor.extractSharesAndUrls(
        trendUrl
      ); // 문서에서 탑 3 주식, url 뽑아오기

      this.trendToEvents.set(trend, trendEvents);
    }
  }
}
