"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsClipping = void 0;
const dotenv = __importStar(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv.config();
function decodeHTMLEntities(text) {
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
        text = text.replace(new RegExp("&" + entities[i][0] + ";", "g"), entities[i][1]);
    return text;
}
class NewsClipping {
    constructor() {
        this.url = new URL("https://openapi.naver.com/v1/search/news.json");
    }
    getNewsWithLink(keywords) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = {};
            for (const keyword of keywords) {
                const items = (yield this.getNews(keyword));
                result[keyword] = [];
                for (const item of items) {
                    result[keyword].push({
                        title: decodeHTMLEntities(item.title.replace(/<[^>]+>/g, "")),
                        link: item.link,
                    });
                }
            }
            return result;
        });
    }
    getNews(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            const newsURL = this.urlGenerator(keyword);
            try {
                const result = yield axios_1.default.get(newsURL, {
                    headers: {
                        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
                        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
                    },
                });
                return result.data.items;
            }
            catch (error) {
                console.error(JSON.stringify(error));
            }
        });
    }
    urlGenerator(keyword) {
        const queryParams = new URLSearchParams({
            query: keyword,
            display: "3",
        });
        this.url.search = queryParams.toString();
        return this.url.href;
    }
}
exports.NewsClipping = NewsClipping;
