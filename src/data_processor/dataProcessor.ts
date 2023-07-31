import axios from "axios";
import iconv from "iconv-lite";
import * as cheerio from "cheerio";
import { TrendEvent } from "../collector/shareTrendCollector";

export class DataProcessor {
  async extractSharesAndUrls(url: string): Promise<TrendEvent[]> {
    const html = await this.getInvestmentTrend(url);

    const trendEvents = [];
    const $ = cheerio.load(html);

    // div.box_type_ms > table.type_1 > tbody > tr
    const box_type_ms = $(".box_type_ms")[1];

    const tr = $(box_type_ms).find("tr").slice(2);
    for (let i = 0; i < 5; i++) {
      const titleTag = $(tr[i]).find(".tltle");
      const trendEvent = this.getTitleAndUrl(titleTag);
      trendEvents.push(trendEvent);
    }

    return trendEvents;
  }

  private getTitleAndUrl(htmlTag: cheerio.Cheerio): TrendEvent {
    const title = htmlTag.text();
    const href = htmlTag.attr("href") as string;

    return {
      name: title,
      url: href,
    };
  }

  private getInvestmentTrend = async (url: string) => {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return iconv.decode(response.data, "EUC-KR").toString();
  };
}
