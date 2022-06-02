import { NextFunction, Request, Response } from "express";
import moment from "moment";
import { ApiError } from "../ApiError/ApiError";
import { $weatherApi } from "../thirdPartyApi";
import { db } from "../db";
import { CityWeatherInfo } from "../@types/dbmodels";
import { CityWeatherAPI } from "../@types/weatherAPI";

class WeatherController {
	async getWindStats(req: Request, res: Response, next: NextFunction) {
		const { startDatetime, endDatetime } = req.params;
		const startDate = moment(startDatetime);
		const endDate = moment(endDatetime);

		if (startDate > endDate) {
			return next(ApiError.badRequest("Начальная дата больше конечной"));
		}

		const notExistingDatesRange = await db.getNotExistingDatesRange(
			req.city.id,
			startDate.format("YYYY-MM-DD"),
			endDate.hours(23).format("YYYY-MM-DD")
		);

		const errors: string[] = [];

		if (
			notExistingDatesRange?.minDatetime &&
			notExistingDatesRange.maxDatetime
		) {
			try {
				const apiRes = await $weatherApi.get<CityWeatherAPI>(
					`/timeline/${req.city.name}/${notExistingDatesRange.minDatetime}/${notExistingDatesRange.maxDatetime}`
				);
				if (apiRes.data) {
					const weatherInfo: CityWeatherInfo[] = [];
					apiRes.data.days.forEach((day) =>
						day.hours.forEach((hour) => {
							weatherInfo.push({
								cityId: req.city.id,
								datetime: moment(`${day.datetime} ${hour.datetime}`).toDate(),
								windSpeed: hour.windspeed,
								windDirection: hour.winddir,
								windGust: hour.windgust,
							});
						})
					);
					await db.weatherAddMany(weatherInfo);
				}
			} catch (e: any) {
				let apiErrorText = "Ошибка запроса данных из стороннего API";
				if (e.response.status === 429)
					apiErrorText += ": исчерпан лимит запросов";
				errors.push(apiErrorText, "Найдены не все данные");
			}
		}

		const windRoseStats = await db.weatherGetWindRoseStats(
			req.city.id,
			startDate.format("YYYY-MM-DDTHH:mm:ss"),
			endDate.hours(23).format("YYYY-MM-DDTHH:mm:ss")
		);

		const existingDates = await db.getExistingDates(
			req.city.id,
			startDate.format("YYYY-MM-DD"),
			endDate.hours(23).format("YYYY-MM-DD")
		);

		const response = {
			windRoseStats: windRoseStats || [],
			startDate: startDatetime,
			endDate: endDatetime,
			errors,
			existingDates,
		};
		return res.json(response);
	}
}

export default new WeatherController();
