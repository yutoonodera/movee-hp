import { Request, Response } from "express";

export const handleIndexGet = async (req: Request, res: Response) => {
  // GitHubApi クラスをインポート
  const { GithubApi } = require("../models/GithubApi");
  const { Profile } = require("../models/Profile");
  console.log("indexページですよ");
  try {
    // Profile クラスのインスタンスを作成
    const profile =
      new Profile(/* ここにプロファイルデータを初期化するコードを追加 */);

    // GithubApi クラスのインスタンスを作成
    const githubApi = new GithubApi(profile);

    // Githubデータを取得
    const githubData = await githubApi.getGithubData();
    console.log("githubDataですう::" + JSON.stringify(githubData));
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1); // 1ヶ月前の日付を取得
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const formattedLastMonth = year + "-" + month;
    // デバッグ情報をコンソールに出力
    // レンダリング時に Github データをテンプレートに渡す
    res.render("index", { title: "movee", githubData, formattedLastMonth });
  } catch (error) {
    // エラーハンドリング
    console.error("エラー:", error);
  }
};
