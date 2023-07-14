"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLS = exports.TREND_INDEX = void 0;
const crawler_1 = require("./crawler");
const parser_1 = require("./parser");
const news_clipping_1 = require("./news-clipping");
const telegram_1 = require("./telegram");
const FOREIGN_NET_PURCHASE = "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=9000&type=buy";
const FOREIGN_NET_SALES = "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=9000&type=sell";
const INSTITUTIONAL_NET_PURCHASE = "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=1000&type=buy";
const INSTITUTIONAL_NET_SALES = "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=1000&type=sell";
exports.TREND_INDEX = [
    "외국인 순 매도",
    "외국인 순 매수",
    "기관 순 매도",
    "기관 순 매수",
];
exports.URLS = [
    FOREIGN_NET_PURCHASE,
    FOREIGN_NET_SALES,
    INSTITUTIONAL_NET_PURCHASE,
    INSTITUTIONAL_NET_SALES,
];
const URL_MAP = new Map([
    ["외국인 순 매도", FOREIGN_NET_PURCHASE],
    ["외국인 순 매수", FOREIGN_NET_SALES],
    ["기관 순 매도", INSTITUTIONAL_NET_PURCHASE],
    ["기관 순 매수", INSTITUTIONAL_NET_SALES],
]);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const [trend, trendUrl] of URL_MAP) {
            const html = yield (0, crawler_1.getInvestmentTrend)(trendUrl); // 시장 동향 지표 문서(html) 가져오기
            const sharesAndUrls = (0, parser_1.extractSharesAndUrls)(html);
            const shares = Array.from(sharesAndUrls.keys());
            const sharedToNews = yield new news_clipping_1.NewsClipping().getNewsWithShares(shares);
            const message = (0, parser_1.createHTMLMessage)(trend, trendUrl, sharedToNews, sharesAndUrls);
            const telegramBot = new telegram_1.TelegramBot();
            yield telegramBot.sendMessage(message);
            break;
        }
    });
}
main()
    .then()
    .catch(() => process.exit(1));
