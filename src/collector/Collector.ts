import { ShareTrendListener } from "../trend_listner/shareTrendListener";

export enum TREND_INDEX {
  "ForeignerSell" = "ForeignerSell",
  "ForeignerBuy" = "ForeignerBuy",
  "InstitutionalSell" = "InstitutionalSell",
  "InstitutionalBuy" = "InstitutionalBuy",
}

export enum TREND_URL {
  "ForeignerSell" = "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=9000&type=sell",
  "ForeignerBuy" = "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=9000&type=sell",
  "InstitutionalSell" = "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=1000&type=sell",
  "InstitutionalBuy" = "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=1000&type=buy",
}

export interface Collector {
  registerListener(trend: TREND_INDEX, listener: ShareTrendListener): void;
  removeListener(trend: TREND_INDEX): void;
  notify(): void;
}
