import { Request, Response } from "express";

export const handleIndexGet = async (req: Request, res: Response) => {
  const { Profile } = require("../models/Profile");
  const { Connpass } = require("../models/Connpass");
  try {
    // Profile クラスのインスタンスを作成
    const profile = new Profile();
    const profileData = await profile.getCheckedProfileData();
    const connpass = new Connpass('福岡');
    const connpassData = await connpass.get();
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1); // 1ヶ月前の日付を取得
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const formattedLastMonth = year + "-" + month;
    // デバッグ情報をコンソールに出力
    // レンダリング時に Github データをテンプレートに渡す
    res.render("index", {
      title: "株式会社movee/データ活用で未来を豊かにする",
      profileData,
      connpassData,
      formattedLastMonth,
    });
  } catch (error) {
    // エラーハンドリング
    console.error("エラー:", error);
  }
};
