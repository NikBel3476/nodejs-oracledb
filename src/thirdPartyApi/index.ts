import axios from "axios";

export const $weatherApi = axios.create({
  baseURL:
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/",
  params: {
    contentType: "json",
  },
});
