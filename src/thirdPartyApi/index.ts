// import HttpsProxyAgent from "https-proxy-agent";
// import HttpProxyAgent from "http-proxy-agent";
import axios from "axios";

/*const httpsAgent = HttpsProxyAgent({host: "cproxy.udsu.ru", port: "8080"});
const httpAgent = HttpProxyAgent({host: "cproxy.udsu.ru", port: "8080"});

axios.defaults.httpsAgent = httpsAgent;
axios.defaults.httpAgent = httpAgent;
axios.defaults.proxy = false;*/

axios.defaults.params = {
  key: process.env.API_KEY,
};

export const $weatherApi = axios.create({
  baseURL:
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/",
  params: {
    contentType: "json",
  },
});
