import * as cheerio from "cheerio";
import { News } from "./news-clipping";

export const extractSharesAndUrls = (html: string) => {
  const result = new Map<string, string>();
  const $ = cheerio.load(html);

  // div.box_type_ms > table.type_1 > tbody > tr
  const box_type_ms = $(".box_type_ms")[1];

  const tr = $(box_type_ms).find("tr").slice(2);
  for (let i = 0; i < 5; i++) {
    const titleTag = $(tr[i]).find(".tltle");
    const [title, url] = getTitleAndUrl(titleTag);
    result.set(title, url);
  }
  return result;
};

export const createHTMLMessage = (
  trend: string,
  trendUrl: string,
  shareToNews: Record<string, Pick<News, "title" | "link">[]>,
  sharesAndUrls: Map<string, string>
): string => {
  let message = `<a href="${trendUrl}"><u>${trend}</u></a>`;
  for (const share of Object.keys(shareToNews)) {
    const news = shareToNews[share];
    const shareUrl = sharesAndUrls.get(share);

    let newsClippingMsg = `<a href="https://finance.naver.com${shareUrl}">${share}</a>\n\n`;
    for (const item of news) {
      newsClippingMsg += `\n${item.title}\n${item.link}`;
    }

    message += "\n\n" + newsClippingMsg;
  }

  return message;
};

function getTitleAndUrl(htmlTag: cheerio.Cheerio): [string, string] {
  const title = htmlTag.text();
  const href = htmlTag.attr("href") as string;
  return [title, href];
}
