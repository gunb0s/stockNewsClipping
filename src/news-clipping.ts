import * as dotenv from "dotenv";
import axios from "axios";
import { TrendEvent } from "./collector/shareTrendCollector";
import { TREND_INDEX, TREND_URL } from "./collector/collector";

dotenv.config();

const TREND_TRANSLATOR = new Map<TREND_INDEX, string>([
  [TREND_INDEX.ForeignerSell, "외국인 매도"],
  [TREND_INDEX.ForeignerBuy, "외국인 매수"],
  [TREND_INDEX.InstitutionalSell, "기관 매도"],
  [TREND_INDEX.InstitutionalBuy, "기관 매수"],
]);

interface NewsResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: News[];
}

export interface News {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
}

function decodeHTMLEntities(text: string) {
  const entities = [
    ["amp", "&"],
    ["apos", "'"],
    ["#x27", "'"],
    ["#x2F", "/"],
    ["#39", "'"],
    ["#47", "/"],
    ["lt", "<"],
    ["gt", ">"],
    ["nbsp", " "],
    ["quot", '"'],
  ];

  for (let i = 0, max = entities.length; i < max; ++i)
    text = text.replace(
      new RegExp("&" + entities[i][0] + ";", "g"),
      entities[i][1]
    );

  return text;
}

export class NewsClipping {
  private readonly baseUrl = new URL(
    "https://openapi.naver.com/v1/search/news.json"
  );

  public async getNewsWithShares(
    shares: string[]
  ): Promise<Record<string, Pick<News, "title" | "link">[]>> {
    const result: Record<string, Pick<News, "title" | "link">[]> = {};
    for (const share of shares) {
      const items = (await this.getNews(share)) as News[];

      result[share] = [];
      for (const item of items) {
        result[share].push({
          title: decodeHTMLEntities(this.sanitizeHtmlText(item.title)),
          link: item.link,
        });
      }
    }

    return result;
  }

  async createHTMLMessage(
    trend: TREND_INDEX,
    trendUrl: TREND_URL,
    events: TrendEvent[]
  ): Promise<string> {
    const shares = events.map((event) => event.name);
    const shareToNews = await this.getNewsWithShares(shares);

    let message = `<a href="${trendUrl}"><u>${TREND_TRANSLATOR.get(
      trend
    )}</u></a>`;
    for (const share of Object.keys(shareToNews)) {
      const news = shareToNews[share];

      let newsClippingMsg = `<b>${share}</b>\n\n`;
      for (const item of news) {
        newsClippingMsg += `\n${item.title}\n${item.link}`;
      }

      message += "\n\n" + newsClippingMsg;
    }

    return message;
  }

  private sanitizeHtmlText(text: string) {
    return text.replace(/<[^>]+>/g, "");
  }

  private async getNews(title: string): Promise<News[] | undefined> {
    const newsURL = this.urlGenerator(title);

    try {
      const result = await axios.get<NewsResponse>(newsURL, {
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
          "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
        },
      });

      return result.data.items;
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  }

  private urlGenerator(title: string): string {
    const queryParams = new URLSearchParams({
      query: title,
      display: "3",
    });
    this.baseUrl.search = queryParams.toString();

    return this.baseUrl.href;
  }
}
