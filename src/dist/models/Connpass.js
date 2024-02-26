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
    }
    /**
     * Connpass APIからデータを取得する
     * @returns response.data
     */
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheDuration = 1 * 60 * 60 * 1000; // キャッシュの有効期限 (1時間)
            const connpassDataArray = [];
            let dirPath = path_1.default.join(__dirname, "..", "assets", "data");
            let cacheFilePath = path_1.default.join(dirPath, `connpass_cache.json`);
            console.log('cacheFilePath' + cacheFilePath);
            try {
                let passedCachedData = null;
                if (fs_1.default.existsSync(cacheFilePath) && fs_1.default.readFileSync(cacheFilePath, "utf-8")) {
                    passedCachedData = JSON.parse(fs_1.default.readFileSync(cacheFilePath, "utf-8"));
                    console.log('ファイルは存在します。中身' + JSON.stringify(passedCachedData));
                    console.log('passedCachedData.timestamp' + passedCachedData.timestamp);
                }
                console.log('passedCachedDataの中' + passedCachedData);
                if (passedCachedData &&
                    passedCachedData.timestamp &&
                    Date.now() - passedCachedData.timestamp < cacheDuration) {
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
                    console.log('responseです' + response);
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
            console.log('connpassDataArray::backend' + JSON.stringify(connpassDataArray));
            return connpassDataArray;
        });
    }
}
exports.Connpass = Connpass;
