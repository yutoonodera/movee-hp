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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connpass = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Connpass {
    constructor(regionName) {
        this.regionName = regionName;
        this.cacheDuration = 1 * 60 * 60 * 1000;
    }
    /**
     * Connpass APIからデータを取得する
     * @returns response.data
     */
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            // const cacheDuration = 1 * 60 * 60 * 1000; // キャッシュの有効期限 (1時間)
            const connpassDataArray = [];
            const dirPath = path_1.default.join(__dirname, "..", "assets", "data");
            const cacheFilePath = path_1.default.join(dirPath, `connpass_cache.json`);
            try {
                let passedCachedData = null;
                if (fs_1.default.existsSync(cacheFilePath) && fs_1.default.readFileSync(cacheFilePath, "utf-8")) {
                    passedCachedData = JSON.parse(fs_1.default.readFileSync(cacheFilePath, "utf-8"));
                }
                if (passedCachedData &&
                    passedCachedData.timestamp &&
                    Date.now() - passedCachedData.timestamp < this.cacheDuration) {
                    console.log('キャッシュです');
                    connpassDataArray.push(passedCachedData);
                }
                else {
                    let url = `https://connpass.com/api/v1/event/?keyword=${this.regionName}&order=3`;
                    let response = yield axios_1.default.get(url);
                    let dataToCache = {
                        connpassApiData: response.data.events,
                        timestamp: Date.now(),
                    };
                    fs_1.default.writeFileSync(cacheFilePath, JSON.stringify(dataToCache));
                    connpassDataArray.push(dataToCache);
                    console.log('生成です');
                }
            }
            catch (error) {
                // エラーハンドリング
                console.error("Conpass APIエラー:", error);
                throw error;
            }
            return connpassDataArray;
        });
    }
}
exports.Connpass = Connpass;
