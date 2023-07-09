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
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlParser = void 0;
const cheerio = __importStar(require("cheerio"));
const htmlParser = (html) => {
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
exports.htmlParser = htmlParser;
function getTitleAndUrl(htmlTag) {
    const title = htmlTag.text();
    const href = htmlTag.attr("href");
    return [title, href];
}
