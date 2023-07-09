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

export class NewsClipping {
  private readonly url = new URL("https://openapi.naver.com/v1/search/news.json");

  public async getNewsWithLink(keywords: string[]) {
    const result: Record<string, Pick<News, "title" | "link">[]> = {};
    for (const keyword of keywords) {
      const items = (await this.getNews(keyword)) as News[];

      result[keyword] = [];
      for (const item of items) {
        result[keyword].push({
          title: item.title,
          link: item.link,
        });
      }
    }

    return result;
  }

  private async getNews(keyword: string): Promise<News[] | undefined> {
    const newsURL = this.urlGenerator(keyword);

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

  private urlGenerator(keyword: string): string {
    const queryParams = new URLSearchParams({
      query: keyword,
      display: "3",
    });
    this.url.search = queryParams.toString();

    return this.url.href;
  }
}
