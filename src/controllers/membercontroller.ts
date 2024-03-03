import { Request, Response } from "express";

export const handleMemberGet = async (req: Request, res: Response) => {
  const FUKUOKA = '福岡';
  const { Profile } = require("../models/Profile");
  const { Connpass } = require("../models/Connpass");


  try {
    // Profile クラスのインスタンスを作成
    const profile = new Profile();
    const profileData = await profile.getCheckedProfileData();
    const connpass = new Connpass(FUKUOKA);
    const connpassData = await connpass.get();
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1); // 1ヶ月前の日付を取得
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const formattedLastMonth = year + "-" + month;
    // デバッグ情報をコンソールに出力
    // レンダリング時に Github データをテンプレートに渡す
    res.render("member", {
      title: "株式会社movee/メンバー",
      profileData,
      connpassData,
      formattedLastMonth,
    });
  } catch (error) {
    // エラーハンドリング
    console.error("エラー:", error);
  }
};
