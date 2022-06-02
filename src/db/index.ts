import oracledb, {
	BindParameters,
	ExecuteManyOptions,
	ExecuteOptions,
} from "oracledb";
import { dbconfig } from "./dbconfig";
import { City, CityWeatherInfo } from "../@types/dbmodels";
import { WindRoseDirectionStats } from "../@types/WindRose";

class Database {
	async initialize() {
		try {
			await oracledb.createPool(dbconfig.pool);
		} catch (e) {
			console.error(e);
		}
	}

	async closePool() {
		try {
			await oracledb.getPool().close(5);
		} catch (e) {
			console.error(e);
		}
	}

	private async execute<T>(
		sql: string,
		bindParams: BindParameters,
		options: ExecuteOptions
	) {
		let connection;

		try {
			connection = await oracledb.getConnection();
			return await connection.execute<T>(sql, bindParams, options);
		} catch (e) {
			console.error(e);
		} finally {
			if (connection) {
				try {
					await connection.close();
				} catch (e) {
					console.error(e);
				}
			}
		}
	}

	private async executeMany<T>(
		sql: string,
		binds: BindParameters[],
		options: ExecuteManyOptions
	) {
		let connection;

		try {
			connection = await oracledb.getConnection();
			return await connection.executeMany<T[]>(sql, binds, options);
		} catch (e) {
			console.error(e);
		} finally {
			if (connection) {
				try {
					await connection.close();
				} catch (e) {
					console.error(e);
				}
			}
		}
	}

	async cityGetByName(cityName: string) {
		const data = await this.execute<City>(
			`select ID "id", NAME "name" from CITY where NAME = :cityName`,
			[cityName],
			{
				outFormat: oracledb.OUT_FORMAT_OBJECT,
				maxRows: 1,
			}
		);
		if (data?.rows) return data.rows[0];
		return null;
	}

	async cityGetAll() {
		const data = await this.execute<City>(
			`select ID "id", NAME "name" from CITY`,
			[],
			{
				outFormat: oracledb.OUT_FORMAT_OBJECT,
			}
		);
		return data?.rows || null;
	}

	async cityAddOne(name: string) {
		const data = await this.execute<City>(
			`
      insert into CITY
        (NAME)
      values (:cityName)
      returning
        ID, NAME into :id, :name
      `,
			{
				cityName: name,
				id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
				name: { type: oracledb.DB_TYPE_VARCHAR, dir: oracledb.BIND_OUT },
			},
			{
				autoCommit: true,
				outFormat: oracledb.OUT_FORMAT_OBJECT,
			}
		);
		if (data?.outBinds) {
			const city: City = {
				...data?.outBinds,
			};
			return city;
		}
		return null;
	}

	async cityUpdateOne(city: City) {
		const data = await this.execute(
			`
      update
        CITY
      set
        NAME = :name
      where
        ID = :id
      `,
			city,
			{
				outFormat: oracledb.OUT_FORMAT_OBJECT,
				autoCommit: true,
			}
		);

		return data?.rowsAffected || null;
	}

	async cityDeleteOne(id: number) {
		const data = await this.execute(
			`
      delete from
        CITY
      where
        ID = :id
      `,
			{
				id,
			},
			{
				outFormat: oracledb.OUT_FORMAT_OBJECT,
				autoCommit: true,
			}
		);

		return data?.rowsAffected || null;
	}

	async weatherGetWindRoseStats(
		cityId: number,
		startDatetime: string,
		endDatetime: string
	) {
		const weatherData = await this.execute<
			WindRoseDirectionStats & { count: number }
		>(
			`
      (select
          round(avg(WIND_SPEED), 3) "windSpeed",
          round(avg(WIND_GUST), 3) "windGust",
          count(*) / 24 "hoursAmount",
          'Север' "cardinalDirection",
          0 "count"
      from
          WEATHER
      where
          CITY_ID = :cityId and
          datetime between to_date(:startDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and to_date(:endDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and
          (WIND_DIRECTION >= 337.5 or
          WIND_DIRECTION < 22.5)
      union
      select
          round(avg(WIND_SPEED), 3) "windSpeed",
          round(avg(WIND_GUST), 3) "windGust",
          count(*) / 24 "hoursAmount",
          'Северо-Восток' "cardinalDirection",
          1 "count"
      from
          WEATHER
      where
          CITY_ID = :cityId and
          datetime between to_date(:startDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and to_date(:endDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and
          WIND_DIRECTION >= 22.5 and
          WIND_DIRECTION < 67.5
      union
      select
          round(avg(WIND_SPEED), 3) "windSpeed",
          round(avg(WIND_GUST), 3) "windGust",
          count(*) / 24 "hoursAmount",
          'Восток' "cardinalDirection",
          2 "count"
      from
          WEATHER
      where
          CITY_ID = :cityId and
          datetime between to_date(:startDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and to_date(:endDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and
          WIND_DIRECTION >= 67.5 and
          WIND_DIRECTION < 112.5
      union
      select
          round(avg(WIND_SPEED), 3) "windSpeed",
          round(avg(WIND_GUST), 3) "windGust",
          count(*) / 24 "hoursAmount",
          'Юго-Восток' "cardinalDirection",
          3 "count"
      from
          WEATHER
      where
          CITY_ID = :cityId and
          datetime between to_date(:startDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and to_date(:endDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and
          WIND_DIRECTION >= 112.5 and
          WIND_DIRECTION < 157.5
      union
      select
          round(avg(WIND_SPEED), 3) "windSpeed",
          round(avg(WIND_GUST), 3) "windGust",
          count(*) / 24 "hoursAmount",
          'Юг' "cardinalDirection",
          4 "count"
      from
          WEATHER
      where
          CITY_ID = :cityId and
          datetime between to_date(:startDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and to_date(:endDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and
          WIND_DIRECTION >= 157.5 and
          WIND_DIRECTION < 202.5
      union
      select
          round(avg(WIND_SPEED), 3) "windSpeed",
          round(avg(WIND_GUST), 3) "windGust",
          count(*) / 24 "hoursAmount",
          'Юго-Запад' "cardinalDirection",
          5 "count"
      from
          WEATHER
      where
          CITY_ID = :cityId and
          datetime between to_date(:startDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and to_date(:endDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and
          WIND_DIRECTION >= 202.5 and
          WIND_DIRECTION < 247.5
      union
      select
          round(avg(WIND_SPEED), 3) "windSpeed",
          round(avg(WIND_GUST), 3) "windGust",
          count(*) / 24 "hoursAmount",
          'Запад' "cardinalDirection",
          6 "count"
      from
          WEATHER
      where
          CITY_ID = :cityId and
          datetime between to_date(:startDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and to_date(:endDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and
          WIND_DIRECTION >= 247.5 and
          WIND_DIRECTION < 292.5
      union
      select
          round(avg(WIND_SPEED), 3) "windSpeed",
          round(avg(WIND_GUST), 3) "windGust",
          count(*) / 24 "hoursAmount",
          'Северо-Запад' "cardinalDirection",
          7 "count"
      from
          WEATHER
      where
          CITY_ID = :cityId and
          datetime between to_date(:startDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and to_date(:endDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and
          WIND_DIRECTION >= 292.5 and
          WIND_DIRECTION < 337.5)
      order by
        "count"
      `,
			{
				cityId,
				startDatetime,
				endDatetime,
			},
			{
				outFormat: oracledb.OUT_FORMAT_OBJECT,
			}
		);
		return weatherData?.rows || null;
	}

	async weatherGetMany(cityId: number, startDatetime: Date, endDatetime: Date) {
		const weatherData = await this.execute<CityWeatherInfo>(
			`
      select
        CITY_ID "cityId",
        DATETIME "datetime",
        WIND_SPEED "windSpeed",
        WIND_DIRECTION "windDirection",
        WIND_GUST "windGust"
      from
        WEATHER
      join
        CITY on WEATHER.CITY_ID = CITY.ID
      where
        CITY_ID = :cityId and DATETIME between :startDatetime and :endDatetime
      `,
			{
				cityId,
				startDatetime,
				endDatetime,
			},
			{
				outFormat: oracledb.OUT_FORMAT_OBJECT,
			}
		);

		return weatherData?.rows || null;
	}

	async weatherAddMany(weatherData: CityWeatherInfo[]) {
		return await this.executeMany(
			`
      merge into
        WEATHER
      using DUAL
        on (DATETIME = :datetime)
        when not matched then
          insert (DATETIME, WIND_SPEED, WIND_DIRECTION, WIND_GUST, CITY_ID)
          values (:datetime, :windSpeed, :windDirection, :windGust, :cityId)
      `,
			weatherData,
			{
				autoCommit: true,
				bindDefs: {
					cityId: { type: oracledb.NUMBER },
					datetime: { type: oracledb.DATE },
					windSpeed: { type: oracledb.NUMBER },
					windDirection: { type: oracledb.NUMBER },
					windGust: { type: oracledb.NUMBER },
				},
			}
		);
	}

	async getNotExistingDatesRange(
		cityId: number,
		startDate: string,
		endDate: string
	) {
		const data = await this.execute<{
			minDatetime: string;
			maxDatetime: string;
		}>(
			`
      select
				to_char(min(datetime), 'YYYY-MM-DD') "minDatetime",
        to_char(max(datetime), 'YYYY-MM-DD') "maxDatetime"
      from
        (select
          to_date(:startDate, 'YYYY-MM-DD') + (ROWNUM - 1) / 24 datetime
        from
          city
        connect by
          (to_date(:endDate, 'YYYY-MM-DD') - to_date(:startDate, 'YYYY-MM-DD')) * 24 - 1 > ROWNUM
        minus
        select
          datetime
        from
          weather
        where
          city_id = :cityId and
          datetime between to_date(:startDate, 'YYYY-MM-DD') and
													 to_date(:endDate, 'YYYY-MM-DD'))
      `,
			{
				cityId,
				startDate,
				endDate,
			},
			{
				outFormat: oracledb.OUT_FORMAT_OBJECT,
			}
		);
		return data?.rows?.[0] || null;
	}

	async getExistingDates(cityId: number, startDate: string, endDate: string) {
		const data = await this.execute<{ date: string }[]>(
			`
				select
					to_char(datetime, 'YYYY-MM-DD') "date"
				from
					weather
				where
					city_id = :cityId and
					datetime between to_date(:startDate, 'YYYY-MM-DD') and
													 to_date(:endDate, 'YYYY-MM-DD')
				group by
					to_char(datetime, 'YYYY-MM-DD')
				order by
					"date"
			`,
			{
				cityId,
				startDate,
				endDate,
			},
			{
				outFormat: oracledb.OUT_FORMAT_OBJECT,
			}
		);
		return data?.rows || null;
	}
}

export const db = new Database();
