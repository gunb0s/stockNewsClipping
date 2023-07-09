import { getInvestmentTrend } from "./crawler";
import { htmlParser } from "./parser";
import { NewsClipping } from "./news-clipping";

const naverFinance = "https://finance.naver.com";

const foreignerSell =
  "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=9000&type=sell";
async function main() {
  const html = await getInvestmentTrend(foreignerSell);

  const titleAndUrls = htmlParser(html);
  const titles = titleAndUrls.map((item) => item[0]);
  const news = await new NewsClipping().getNewsWithLink(titles);
  console.log(news);
}

main().then();
