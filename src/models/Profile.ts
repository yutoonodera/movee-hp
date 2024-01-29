type ProfileData = {
  // すべてのキーが string であり、値が { githubName: string } であることを指定
  [key: string]: {introduction: String; interest: String; githubName: string; technique: string; blog: string };
};

import profileData from "../assets/data/profile.json";
import axios from "axios";
import fs from "fs";
import path from "path";
const { GithubApi } = require("../models/GithubApi");

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
   * Github APIからデータを取得する
   * @returns
   */

  async getCheckedProfileData(): Promise<any[]> {
    const profileInfo = this.getInitProfileData();
    const cacheDuration = 24 * 60 * 60 * 1000; // キャッシュの有効期限 (24時間)

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
            console.log("cachedataを使用");
          } else {
            // GithubApi クラスのインスタンスを作成
            const githubApi = new GithubApi();

            // Githubデータを取得
            const githubData = await githubApi.getGithubData(githubName);

            let dataToCache = {
              githubdata: githubData,
              timestamp: Date.now(),
              key: key,
              introduction: profileInfo[key].introduction,
              interest: profileInfo[key].interest,
              technique: profileInfo[key].technique,
              blog: profileInfo[key].blog,
            };
            fs.writeFileSync(cacheFilePath, JSON.stringify(dataToCache));
            //githubDataArray.push(response.data);
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
