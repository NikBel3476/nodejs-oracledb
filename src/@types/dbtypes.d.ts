export type City = {
  id: number;
  name: string;
};

export type dayWeatherInfo = {
  city_id: number;
  created_at: Date;
  wind_speed: number;
  wind_direction: number;
  wind_gust: number;
};
