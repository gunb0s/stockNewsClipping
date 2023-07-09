import * as cheerio from "cheerio";

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

function getTitleAndUrl(htmlTag: cheerio.Cheerio): [string, string | undefined] {
  const title = htmlTag.text();
  const href = htmlTag.attr("href");
  return [title, href];
}
