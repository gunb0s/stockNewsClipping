import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

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
