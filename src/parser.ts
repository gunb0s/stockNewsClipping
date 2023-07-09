import * as cheerio from "cheerio";
import { News } from "./news-clipping";
import { escapers } from "@telegraf/entity";

export const htmlParser = (html: string) => {
  const result = [];
  const $ = cheerio.load(html);

  // div.box_type_ms > table.type_1 > tbody > tr
  const box_type_ms = $(".box_type_ms")[1];

  const tr = $(box_type_ms).find("tr").slice(2);
  for (let i = 0; i < 5; i++) {
    const titleTag = $(tr[i]).find(".tltle");
    const titleAndUrl = getTitleAndUrl(titleTag);
    result.push(titleAndUrl);
  }
  return result;
};

export const createMarkDown = (
  newsToKeyword: Record<string, Pick<News, "title" | "link">[]>
): string => {
  let message = "외국인 순매도";
  for (const keyword of Object.keys(newsToKeyword)) {
    let newsClippingMsg = `${keyword}\n\n`;
    const news = newsToKeyword[keyword];
    for (const item of news) {
      newsClippingMsg += `\n${item.title}\n${item.link}`;
    }

    message += "\n\n" + newsClippingMsg;
  }

  return escapers.HTML(message);
};

function getTitleAndUrl(
  htmlTag: cheerio.Cheerio
): [string, string | undefined] {
  const title = htmlTag.text();
  const href = htmlTag.attr("href");
  return [title, href];
}
