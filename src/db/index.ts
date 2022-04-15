import oracledb, {
  BindParameters,
  ExecuteManyOptions,
  ExecuteOptions,
} from "oracledb";
import { dbconfig } from "./dbconfig";
import { City, CityWeatherInfo } from "../@types/dbmodels";
import { WindRoseDirectionStat } from "../@types/WindRose";

class Database {
  async initialize() {
    await oracledb.createPool(dbconfig.pool);
  }

  async closePool() {
    await oracledb.getPool().close(5);
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
      `insert into CITY (NAME) values (:cityName) returning ID, NAME into :id, :name`,
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

  async weatherGetWindRoseStats(
    cityId: number,
    startDatetime: string,
    endDatetime: string
  ) {
    const weatherData = await this.execute<WindRoseDirectionStat>(
      `
      select
        round(avg(WIND_SPEED), 3) "windSpeed",
        round(avg(WIND_GUST), 3) "windGust",
        count(*) "hours",
        'E' "cardinalDirection"
      from
        WEATHER
      where
        CITY_ID = :cityId and
        datetime between to_date(:startDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and to_date(:endDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and
        WIND_DIRECTION >= 337.5 and
        WIND_DIRECTION < 22.5
      group by
        CITY_ID
      union
      select
        round(avg(WIND_SPEED), 3) "windSpeed",
        round(avg(WIND_GUST), 3) "windGust",
        count(*) "hours",
        'NE' "cardinalDirection"
      from
        WEATHER
      where
        CITY_ID = :cityId and
        datetime between to_date(:startDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and to_date(:endDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and
        WIND_DIRECTION >= 22.5 and
        WIND_DIRECTION < 67.5
      group by
        CITY_ID
      union
      select
        round(avg(WIND_SPEED), 3) "windSpeed",
        round(avg(WIND_GUST), 3) "windGust",
        count(*) "hours",
        'N' "cardinalDirection"
      from
        WEATHER
      where
        CITY_ID = :cityId and
        datetime between to_date(:startDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and to_date(:endDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and
        WIND_DIRECTION >= 67.5 and
        WIND_DIRECTION < 112.5
      group by
        CITY_ID
      union
      select
        round(avg(WIND_SPEED), 3) "windSpeed",
        round(avg(WIND_GUST), 3) "windGust",
        count(*) "hours",
        'NW' "cardinalDirection"
      from
        WEATHER
      where
        CITY_ID = :cityId and
        datetime between to_date(:startDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and to_date(:endDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and
        WIND_DIRECTION >= 112.5 and
        WIND_DIRECTION < 157.5
      group by
        CITY_ID
      union
      select
        round(avg(WIND_SPEED), 3) "windSpeed",
        round(avg(WIND_GUST), 3) "windGust",
        count(*) "hours",
        'W' "cardinalDirection"
      from
        WEATHER
      where
        CITY_ID = :cityId and
        datetime between to_date(:startDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and to_date(:endDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and
        WIND_DIRECTION >= 157.5 and
        WIND_DIRECTION < 202.5
      group by
        CITY_ID
      union
      select
        round(avg(WIND_SPEED), 3) "windSpeed",
        round(avg(WIND_GUST), 3) "windGust",
        count(*) "hours",
        'SW' "cardinalDirection"
      from
        WEATHER
      where
        CITY_ID = :cityId and
        datetime between to_date(:startDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and to_date(:endDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and
        WIND_DIRECTION >= 202.5 and
        WIND_DIRECTION < 247.5
      group by
        CITY_ID
      union
      select
        round(avg(WIND_SPEED), 3) "windSpeed",
        round(avg(WIND_GUST), 3) "windGust",
        count(*) "hours",
        'S' "cardinalDirection"
      from
        WEATHER
      where
        CITY_ID = :cityId and
        datetime between to_date(:startDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and to_date(:endDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and
        WIND_DIRECTION >= 247.5 and
        WIND_DIRECTION < 292.5
      group by
        CITY_ID
      union
      select
        round(avg(WIND_SPEED), 3) "windSpeed",
        round(avg(WIND_GUST), 3) "windGust",
        count(*) "hours",
        'SE' "cardinalDirection"
      from
        WEATHER
      where
        CITY_ID = :cityId and
        datetime between to_date(:startDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and to_date(:endDatetime, 'YYYY-MM-DD"T"HH24:MI:SS') and
        WIND_DIRECTION >= 292.5 and
        WIND_DIRECTION < 337.5
      group by
        CITY_ID
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

  async getNotExistingDates(
    cityId: number,
    startDateISO: string,
    endDateISO: string
  ) {
    const data = await this.execute<{ MAX_DATETIME: Date; MIN_DATETIME: Date }>(
      `
      select
        max(datetime) max_datetime,
        min(datetime) min_datetime
      from
        (select
          to_date(:startDatetime, 'yyyy-mm-dd"T"HH24:MI:SS') + (ROWNUM - 1) / 24 datetime
        from
          city
        connect by
          (to_date(:endDatetime, 'yyyy-mm-dd"T"HH24:MI:SS') - to_date(:startDatetime, 'yyyy-mm-dd"T"HH24:MI:SS')) * 24 - 1 > ROWNUM
        minus
        select
          datetime
        from
          weather
        where
          city_id = :cityId and
          datetime between to_date(:startDatetime, 'yyyy-mm-dd"T"HH24:MI:SS') and
          to_date(:endDatetime, 'yyyy-mm-dd"T"HH24:MI:SS'))
      `,
      {
        cityId,
        startDatetime: startDateISO,
        endDatetime: endDateISO,
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );
    return data?.rows || null;
  }
}

export const db = new Database();
