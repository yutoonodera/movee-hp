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
exports.GithubApi = void 0;
const axios_1 = __importDefault(require("axios"));
class GithubApi {
    /**
     * Github APIからデータを取得する
     * @returns response.data
     */
    getGithubData(githubName) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `https://api.github.com/users/${githubName}/repos?sort=pushed_at`;
            let response = yield axios_1.default.get(url);
            return response.data;
        });
    }
}
exports.GithubApi = GithubApi;
