import { Request, Response } from "express";

export const handleSubPageGet = async (req: Request, res: Response) => {
  try {
    res.render("secondary-use-data", {
      title: "データの二次利用とは",
    });
  } catch (error) {
    // エラーハンドリング
    console.error("エラー:", error);
  }
};
