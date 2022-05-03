import axios from "axios";
import { setProxyAxios } from "./proxy";

if (process.env.PROXY_ENABLE === "ENABLE") {
  const proxyHost = process.env.PROXY_HOST;
  const proxyPort = process.env.PROXY_PORT;
  if (!proxyHost) {
    throw new Error("Ошибка установки прокси: не указан адрес прокси");
  }
  if (!proxyPort) {
    throw new Error("Ошибка установки прокси: не указан порт прокси");
  }
  setProxyAxios(proxyHost, proxyPort);
}

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
