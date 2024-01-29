import { Profile } from "../models/Profile";
import axios from "axios";
import fs from "fs";
import path from "path";

export class GithubApi {
  /**
   * Github APIからデータを取得する
   * @returns
   */
  async getGithubData(githubName:string): Promise<any[]> {
    let url = `https://api.github.com/users/${githubName}/repos?sort=pushed_at`;
    let response = await axios.get(url);
    return response.data;
  }
}
