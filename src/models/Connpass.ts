    import axios from "axios";
    import { Api } from "../interface/Api";
    import connpassData from "../assets/data/connpass_cache.json";
    import fs from "fs";
    import path from "path";

    export class Connpass implements Api {

      private regionName: string;
      constructor(regionName: string) {
        this.regionName = regionName;
      }

      /**
       * Connpass APIからデータを取得する
       * @returns response.data
       */
      async get(): Promise<any[]> {
        const cacheDuration = 1 * 60 * 60 * 1000; // キャッシュの有効期限 (1時間)
        const connpassDataArray = [];
        let dirPath = path.join(__dirname, "..", "assets", "data");
        let cacheFilePath = path.join(
          dirPath,
          `connpass_cache.json`
        );
        try {
          let passedCachedData = null;
          if (fs.existsSync(cacheFilePath) && fs.readFileSync(cacheFilePath, "utf-8")) {
            passedCachedData = JSON.parse(fs.readFileSync(cacheFilePath, "utf-8"));
          }

          if (
            passedCachedData &&
            passedCachedData.timestamp &&
            Date.now() - passedCachedData.timestamp < cacheDuration
          ){
            console.log('キャッシュです');
            connpassDataArray.push(passedCachedData);
          }else{
            let url = `https://connpass.com/api/v1/event/?keyword=${this.regionName}&order=3`;
            let response = await axios.get(url);
            let dataToCache = {
              connpassApiData: response.data.events,
              timestamp: Date.now(),
            };
            fs.writeFileSync(cacheFilePath, JSON.stringify(dataToCache));
            connpassDataArray.push(dataToCache);
            console.log('生成です');
          }
        } catch (error) {
          // エラーハンドリング
          console.error("Conpass APIエラー:", error);
          throw error;
        }
        return connpassDataArray;
      }
    }
