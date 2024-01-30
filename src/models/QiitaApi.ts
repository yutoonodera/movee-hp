import axios from "axios";

export class QiitaApi {
  /**
   * Qiita APIからデータを取得する
   * @returns response.data
   */
  async getInterestDataAboutTitle(convertedInterests:string): Promise<any[]> {
    //let url = `https://api.github.com/users/${interests}/repos?sort=pushed_at`;
    let url = `https://qiita.com/api/v2/items?&query=${convertedInterests}&per_page=10&sort=created`
    let response = await axios.get(url);
    return response.data;
  }
}
