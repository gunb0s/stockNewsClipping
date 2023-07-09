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
const crawler_1 = require("./crawler");
const parser_1 = require("./parser");
const news_clipping_1 = require("./news-clipping");
const telegram_1 = require("./telegram");
const naverFinance = "https://finance.naver.com";
const foreignerSell = "https://finance.naver.com/sise/sise_deal_rank_iframe.naver?sosok=01&investor_gubun=9000&type=sell";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const html = yield (0, crawler_1.getInvestmentTrend)(foreignerSell);
        const titleAndUrls = (0, parser_1.htmlParser)(html);
        const titles = titleAndUrls.map((item) => item[0]);
        const news = yield new news_clipping_1.NewsClipping().getNewsWithLink(titles);
        const message = (0, parser_1.createMarkDown)(news);
        const telegramBot = new telegram_1.TelegramBot();
        yield telegramBot.sendMessage(message);
    });
}
main().then();
