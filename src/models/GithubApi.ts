import axios from "axios";

export class GithubApi {
  /**
   * Github APIからデータを取得する
   * @returns response.data
   */
  async getGithubData(githubName:string): Promise<any[]> {
    let url = `https://api.github.com/users/${githubName}/repos?sort=pushed_at`;
    let response = await axios.get(url);
    return response.data;
  }
}
