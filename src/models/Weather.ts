    import axios from "axios";
    import fs from "fs";
    import path from "path";

    export class Weather {
      cacheDuration: number;
      private lat: string;
      private lon: string;
      constructor(lat: string,lon: string) {
        this.lat = lat;
        this.lon = lon;
        this.cacheDuration = 10 * 60 * 1000;// キャッシュの有効期限 (10分)
      }

      /**
       * APIからデータを取得する
       * @returns response.data
       */
      async getFiveDays(): Promise<any[]> {
        const weatherDataArray = [];
        const dirPath = path.join(__dirname, "..", "assets", "data");
        const cacheFilePath = path.join(
          dirPath,
          `weather_five_days_cache.json`
        );
        try {
          let passedCachedData = null;
          if (fs.existsSync(cacheFilePath) && fs.readFileSync(cacheFilePath, "utf-8")) {
            passedCachedData = JSON.parse(fs.readFileSync(cacheFilePath, "utf-8"));
          }

          if (
            passedCachedData &&
            passedCachedData.timestamp &&
            Date.now() - passedCachedData.timestamp < this.cacheDuration
          ){
            console.log('weatherキャッシュです');
            weatherDataArray.push(passedCachedData);
          }else{
            let url = `https://api.openweathermap.org/data/2.5/forecast?lat=33.5902&lon=130.3976&lang=ja&appid=a3e771e9cfdc65f95dd062b1e86d1679`;
            let response = await axios.get(url);
            console.log('response.data.list.main::'+JSON.stringify(response.data.list));
            let dataToCache = {
              weatherApiData: response.data.list,
              timestamp: Date.now(),
            };
            fs.writeFileSync(cacheFilePath, JSON.stringify(dataToCache));
            weatherDataArray.push(dataToCache);
            console.log('生成です');

          }
        } catch (error) {
          // エラーハンドリング
          console.error("Conpass APIエラー:", error);
          throw error;
        }
        return weatherDataArray;
      }
    }
