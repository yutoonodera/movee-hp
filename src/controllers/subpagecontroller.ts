import { Request, Response } from "express";

export const handleSubPageGet = async (req: Request, res: Response) => {
  const { Profile } = require("../models/Profile");
  try {
    // // Profile クラスのインスタンスを作成
    // const profile = new Profile();
    // const profileData = await profile.getCheckedProfileData();
    // const currentDate = new Date();
    // currentDate.setMonth(currentDate.getMonth() - 1); // 1ヶ月前の日付を取得
    // const year = currentDate.getFullYear();
    // const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    // const formattedLastMonth = year + "-" + month;
    // // デバッグ情報をコンソールに出力
    // レンダリング時に Github データをテンプレートに渡す
    res.render("secondary-use-data", {
      title: "データの二次利用とは",
    });
  } catch (error) {
    // エラーハンドリング
    console.error("エラー:", error);
  }
};
