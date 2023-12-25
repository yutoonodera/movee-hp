"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAnalyticsPost = void 0;
const DisplayRequestData_1 = require("../models/DisplayRequestData");
const handleAnalyticsPost = (req, res) => {
    try {
        // リクエストデータを受け取る
        const requestBody = req.body;
        const displayRequest = new DisplayRequestData_1.DisplayRequestData();
        const hashedIp = displayRequest.hashIpAddress(req.ip);
        const dateData = displayRequest.getTimestamp();
        console.log(`アクション: ${requestBody.action},text: ${requestBody.text},buttonText: ${requestBody.buttonText},linkText: ${requestBody.linkText}, linkUrl: ${requestBody.linkUrl},モデル化したHashed IP: ${hashedIp}, パス: ${requestBody.path}, ymdDate: ${dateData.ymdDate}, ymdhmsmDate: ${dateData.ymdhmsmDate}`);
        // レスポンスを返す
        res.status(200).json({ message: 'POSTリクエストを受け取りました' });
    }
    catch (error) {
        console.error('エラー:', error);
        res.status(500).json({ error: 'エラーが発生しました' });
    }
};
exports.handleAnalyticsPost = handleAnalyticsPost;
