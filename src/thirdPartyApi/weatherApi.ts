import { $weatherApi } from "./index";

export const getData = async (city: string, start: Date, end: Date) => {
  const startISO = start.toISOString().split("T")[0];
  const endISO = end.toISOString().split("T")[0];

  const { data } = await $weatherApi.get(
    `timeline/Izhevsk/${startISO}/${endISO}/`
  );

  console.log(data);
};
