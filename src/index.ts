import { getInvestmentTrend } from "./crawler";
import { createHTMLMessage, extractSharesAndUrls } from "./parser";
import { News, NewsClipping } from "./news-clipping";
import { TelegramBotDeprecated } from "./telegram";

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

export const handler = async () => {
  for (const [trend, trendUrl] of URL_MAP) {
    const html = await getInvestmentTrend(trendUrl); // 시장 동향 지표 문서(html) 가져오기

    const sharesAndUrls = extractSharesAndUrls(html); // 문서에서 탑 5 주식, url 뽑아오기
    const shares = Array.from(sharesAndUrls.keys());

    const sharedToNews: Record<string, Pick<News, "title" | "link">[]> = // 주식들의 뉴스 가져오기
      await new NewsClipping().getNewsWithShares(shares);

    const message = createHTMLMessage(
      // 동향 지표의 주식의 뉴스들로 메시지 구성하기
      trend,
      trendUrl,
      sharedToNews,
      sharesAndUrls
    );

    const telegramBot = new TelegramBotDeprecated();
    await telegramBot.sendMessage(message); // 메시지 보내기
  }
};
