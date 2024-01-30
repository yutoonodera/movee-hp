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
exports.Profile = void 0;
const profile_json_1 = __importDefault(require("../assets/data/profile.json"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const { GithubApi } = require("../models/GithubApi");
const { QiitaApi } = require("../models/QiitaApi");
class Profile {
    // getGithubNameメソッドの型指定
    getInitProfileData() {
        if (typeof profile_json_1.default === "object" && profile_json_1.default !== null) {
            return profile_json_1.default;
        }
        else {
            return undefined;
        }
    }
    /**
     * 個人データを取得する
     * @returns personalDataArray
     */
    getCheckedProfileData() {
        return __awaiter(this, void 0, void 0, function* () {
            const profileInfo = this.getInitProfileData();
            const cacheDuration = 1 * 60 * 60 * 1000; // キャッシュの有効期限 (1時間)
            const personalDataArray = [];
            for (const key in profileInfo) {
                if (Object.prototype.hasOwnProperty.call(profileInfo, key)) {
                    let githubName = profileInfo[key].githubName;
                    let dirPath = path_1.default.join(__dirname, "..", "assets", "data");
                    let cacheFilePath = path_1.default.join(dirPath, `${githubName}_github_cache.json`);
                    try {
                        let cachedData = null;
                        if (fs_1.default.existsSync(cacheFilePath)) {
                            cachedData = JSON.parse(fs_1.default.readFileSync(cacheFilePath, "utf-8"));
                        }
                        if (cachedData &&
                            cachedData.timestamp &&
                            Date.now() - cachedData.timestamp < cacheDuration) {
                            personalDataArray.push(cachedData);
                        }
                        else {
                            // GithubApi クラスのインスタンスを作成
                            const githubApi = new GithubApi();
                            // Githubデータを取得
                            const githubData = yield githubApi.getGithubData(githubName);
                            let interests = profileInfo[key].interest;
                            const replacedInterests = interests.split(',').map((interestItem) => `title%3A'${interestItem}'`);
                            const convertedInterests = replacedInterests.join('+OR+');
                            const qiitaApi = new QiitaApi();
                            // Qiitaデータを取得
                            const qiitaData = yield qiitaApi.getInterestDataAboutTitle(convertedInterests);
                            let dataToCache = {
                                githubdata: githubData,
                                qiitadata: qiitaData,
                                timestamp: Date.now(),
                                key: key,
                                introduction: profileInfo[key].introduction,
                                interest: profileInfo[key].interest,
                                technique: profileInfo[key].technique,
                                blog: profileInfo[key].blog,
                            };
                            fs_1.default.writeFileSync(cacheFilePath, JSON.stringify(dataToCache));
                            personalDataArray.push(dataToCache);
                        }
                    }
                    catch (error) {
                        // エラーハンドリング
                        console.error("GitHub APIエラー:", error);
                        throw error;
                    }
                }
            }
            return personalDataArray;
        });
    }
}
exports.Profile = Profile;
