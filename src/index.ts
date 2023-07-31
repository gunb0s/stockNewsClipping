import { ShareTrendCollector } from "./collector/shareTrendCollector";

// export const handlerDeprecated = async () => {
//   for (const [trend, trendUrl] of URL_MAP) {
//     const html = await getInvestmentTrend(trendUrl); // 시장 동향 지표 문서(html) 가져오기
//
//     const sharesAndUrls = extractSharesAndUrls(html); // 문서에서 탑 5 주식, url 뽑아오기
//     const shares = Array.from(sharesAndUrls.keys());
//
//     const sharedToNews: Record<string, Pick<News, "title" | "link">[]> = // 주식들의 뉴스 가져오기
//       await new NewsClipping().getNewsWithShares(shares);
//
//     const message = createHTMLMessage(
//       // 동향 지표의 주식의 뉴스들로 메시지 구성하기
//       trend,
//       trendUrl,
//       sharedToNews,
//       sharesAndUrls
//     );
//
//     const telegramBot = new TelegramBotDeprecated();
//     await telegramBot.sendMessage(message); // 메시지 보내기
//   }
// };

export const handler = async () => {
  const shareTrendCollector = new ShareTrendCollector();

  await shareTrendCollector.collect();

  await shareTrendCollector.notify();
};

handler().then();
