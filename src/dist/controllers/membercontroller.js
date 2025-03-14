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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMemberGet = void 0;
const handleMemberGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const FUKUOKA = '福岡';
    const { Profile } = require("../models/Profile");
    const { Connpass } = require("../models/Connpass");
    try {
        // Profile クラスのインスタンスを作成
        const profile = new Profile();
        const profileData = yield profile.getCheckedProfileData();
        const connpass = new Connpass(FUKUOKA);
        const connpassData = yield connpass.get();
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
    }
    catch (error) {
        // エラーハンドリング
        console.error("エラー:", error);
    }
});
exports.handleMemberGet = handleMemberGet;
