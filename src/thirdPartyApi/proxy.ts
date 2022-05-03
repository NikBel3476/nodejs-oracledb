import axios from "axios";
import HttpsProxyAgent from "https-proxy-agent";
import HttpProxyAgent from "http-proxy-agent";

export const setProxyAxios = (host: string, port: string) => {
  const httpsAgent = HttpsProxyAgent({
    host: host,
    port: port,
  });
  const httpAgent = HttpProxyAgent({
    host: host,
    port: port,
  });

  axios.defaults.httpsAgent = httpsAgent;
  axios.defaults.httpAgent = httpAgent;
  axios.defaults.proxy = false;
};
