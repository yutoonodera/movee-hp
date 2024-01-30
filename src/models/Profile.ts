type ProfileData = {
  // すべてのキーが string であり、値が { githubName: string } であることを指定
  [key: string]: {introduction: String; interest: String; githubName: string; technique: string; blog: string };
};

import profileData from "../assets/data/profile.json";
import fs from "fs";
import path from "path";
const { GithubApi } = require("../models/GithubApi");
const { QiitaApi } = require("../models/QiitaApi");

export class Profile {
  // getGithubNameメソッドの型指定
  public getInitProfileData(): ProfileData | undefined {
    if (typeof profileData === "object" && profileData !== null) {
      return profileData as ProfileData;
    } else {
      return undefined;
    }
  }

  /**
   * 個人データを取得する
   * @returns personalDataArray
   */
  async getCheckedProfileData(): Promise<any[]> {
    const profileInfo = this.getInitProfileData();
    const cacheDuration = 1 * 60 * 60 * 1000; // キャッシュの有効期限 (1時間)
    const personalDataArray = [];
    for (const key in profileInfo) {
      if (Object.prototype.hasOwnProperty.call(profileInfo, key)) {
        let githubName = profileInfo[key].githubName;
        let dirPath = path.join(__dirname, "..", "assets", "data");
        let cacheFilePath = path.join(
          dirPath,
          `${githubName}_github_cache.json`
        );
        try {
          let cachedData = null;
          if (fs.existsSync(cacheFilePath)) {
            cachedData = JSON.parse(fs.readFileSync(cacheFilePath, "utf-8"));
          }
          if (
            cachedData &&
            cachedData.timestamp &&
            Date.now() - cachedData.timestamp < cacheDuration
          ) {
            personalDataArray.push(cachedData);
          } else {
            // GithubApi クラスのインスタンスを作成
            const githubApi = new GithubApi();
            // Githubデータを取得
            const githubData = await githubApi.getGithubData(githubName);

            let interests = profileInfo[key].interest;
            const replacedInterests = interests.split(',').map((interestItem) => `title%3A'${interestItem}'`);
            const convertedInterests = replacedInterests.join('+OR+');
            const qiitaApi = new QiitaApi();
            // Qiitaデータを取得
            const qiitaData = await qiitaApi.getInterestDataAboutTitle(convertedInterests);
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
            fs.writeFileSync(cacheFilePath, JSON.stringify(dataToCache));
            personalDataArray.push(dataToCache);
          }
        } catch (error) {
          // エラーハンドリング
          console.error("GitHub APIエラー:", error);
          throw error;
        }
      }
    }
    return personalDataArray;
  }
}
