import axios from "axios";

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
