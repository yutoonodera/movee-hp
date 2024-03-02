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
exports.Weather = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Weather {
    constructor(lat, lon) {
        this.lat = lat;
        this.lon = lon;
        this.cacheDuration = 10 * 60 * 1000; // キャッシュの有効期限 (10分)
    }
    /**
     * APIからデータを取得する
     * @returns response.data
     */
    getFiveDays() {
        return __awaiter(this, void 0, void 0, function* () {
            const weatherDataArray = [];
            const dirPath = path_1.default.join(__dirname, "..", "assets", "data");
            const cacheFilePath = path_1.default.join(dirPath, `weather_five_days_cache.json`);
            try {
                let passedCachedData = null;
                if (fs_1.default.existsSync(cacheFilePath) && fs_1.default.readFileSync(cacheFilePath, "utf-8")) {
                    passedCachedData = JSON.parse(fs_1.default.readFileSync(cacheFilePath, "utf-8"));
                }
                if (passedCachedData &&
                    passedCachedData.timestamp &&
                    Date.now() - passedCachedData.timestamp < this.cacheDuration) {
                    console.log('weatherキャッシュです');
                    weatherDataArray.push(passedCachedData);
                }
                else {
                    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=33.5902&lon=130.3976&lang=ja&appid=a3e771e9cfdc65f95dd062b1e86d1679`;
                    let response = yield axios_1.default.get(url);
                    console.log('response.data.list.main::' + JSON.stringify(response.data.list));
                    let dataToCache = {
                        weatherApiData: response.data.list,
                        timestamp: Date.now(),
                    };
                    fs_1.default.writeFileSync(cacheFilePath, JSON.stringify(dataToCache));
                    weatherDataArray.push(dataToCache);
                    console.log('生成です');
                }
            }
            catch (error) {
                // エラーハンドリング
                console.error("Conpass APIエラー:", error);
                throw error;
            }
            return weatherDataArray;
        });
    }
}
exports.Weather = Weather;
