export class ShareTrendCollector {
  private readonly FOREIGN_NET_PURCHASE =
    "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=9000&type=buy";
  private readonly FOREIGN_NET_SALES =
    "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=9000&type=sell";
  private readonly INSTITUTIONAL_NET_PURCHASE =
    "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=1000&type=buy";
  private readonly INSTITUTIONAL_NET_SALES =
    "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=1000&type=sell";

  private readonly TREND_INDEX = [
    "외국인 순 매도",
    "외국인 순 매수",
    "기관 순 매도",
    "기관 순 매수",
  ] as const;
  private readonly URLS = [
    this.FOREIGN_NET_PURCHASE,
    this.FOREIGN_NET_SALES,
    this.INSTITUTIONAL_NET_PURCHASE,
    this.INSTITUTIONAL_NET_SALES,
  ] as const;

  URL_MAP = new Map<
    (typeof this.TREND_INDEX)[number],
    (typeof this.URLS)[number]
  >([
    ["외국인 순 매도", this.FOREIGN_NET_PURCHASE],
    ["외국인 순 매수", this.FOREIGN_NET_SALES],
    ["기관 순 매도", this.INSTITUTIONAL_NET_PURCHASE],
    ["기관 순 매수", this.INSTITUTIONAL_NET_SALES],
  ]);

  registerListener() {}
  notify() {}
}
