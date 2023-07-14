import { getInvestmentTrend } from "./crawler";
import { createHTMLMessage, extractSharesAndUrls } from "./parser";
import { News, NewsClipping } from "./news-clipping";
import { TelegramBot } from "./telegram";

const FOREIGN_NET_PURCHASE =
  "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=9000&type=buy";

const FOREIGN_NET_SALES =
  "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=9000&type=sell";

const INSTITUTIONAL_NET_PURCHASE =
  "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=1000&type=buy";

const INSTITUTIONAL_NET_SALES =
  "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=1000&type=sell";

export const TREND_INDEX = [
  "외국인 순 매도",
  "외국인 순 매수",
  "기관 순 매도",
  "기관 순 매수",
] as const;

export const URLS = [
  FOREIGN_NET_PURCHASE,
  FOREIGN_NET_SALES,
  INSTITUTIONAL_NET_PURCHASE,
  INSTITUTIONAL_NET_SALES,
] as const;

const URL_MAP = new Map<(typeof TREND_INDEX)[number], (typeof URLS)[number]>([
  ["외국인 순 매도", FOREIGN_NET_PURCHASE],
  ["외국인 순 매수", FOREIGN_NET_SALES],
  ["기관 순 매도", INSTITUTIONAL_NET_PURCHASE],
  ["기관 순 매수", INSTITUTIONAL_NET_SALES],
]);

async function main() {
  for (const [trend, trendUrl] of URL_MAP) {
    const html = await getInvestmentTrend(trendUrl); // 시장 동향 지표 문서(html) 가져오기

    const sharesAndUrls = extractSharesAndUrls(html);
    const shares = Array.from(sharesAndUrls.keys());

    const sharedToNews: Record<string, Pick<News, "title" | "link">[]> =
      await new NewsClipping().getNewsWithShares(shares);

    const message = createHTMLMessage(
      trend,
      trendUrl,
      sharedToNews,
      sharesAndUrls
    );

    const telegramBot = new TelegramBot();
    await telegramBot.sendMessage(message);

    break;
  }
}

main()
  .then()
  .catch(() => process.exit(1));
