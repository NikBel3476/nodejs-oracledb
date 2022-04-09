import oracledb, {
  BindParameters,
  ExecuteManyOptions,
  ExecuteOptions,
} from "oracledb";
import { dbconfig } from "./dbconfig";
import { City, CityWeatherInfo } from "../@types/dbmodels";

class Database {
  async initialize() {
    await oracledb.createPool(dbconfig.pool);
  }

  private async execute<T>(
    sql: string,
    bindParams: BindParameters,
    options: ExecuteOptions
  ) {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig.connection);
      return await connection.execute<T>(sql, bindParams, options);
    } catch (e) {
      console.error(e);
    } finally {
      if (connection) {
        try {
          connection.close();
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
      connection = await oracledb.getConnection(dbconfig.connection);
      return await connection.executeMany<T[]>(sql, binds, options);
    } catch (e) {
      console.error(e);
    } finally {
      if (connection) {
        try {
          connection.close();
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  async cityGetByName(cityName: string) {
    const data = await this.execute<City>(
      `select ID "id", NAME "name", TZ_OFFSET "tzOffset" from CITY where NAME = :cityName`,
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
        rid: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
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

  async weatherAddMany(weatherData: CityWeatherInfo[]) {
    const data = await this.executeMany(
      `
      insert
      when not exists (select 1 from WEATHER where CITY_ID = :cityId AND DATETIME = :datetime)
      then
      into WEATHER (CITY_ID, DATETIME, WIND_SPEED, WIND_DIRECTION, WIND_GUST)
      select :cityId, :datetime, :windSpeed, :windDirection, :windGust from DUAL
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
    console.log(data);
    return null;
  }

  async getNotExistingDates(
    cityId: number,
    startDateISO: string,
    endDateISO: string
  ) {
    const data = await this.execute<{ MAX_DATETIME: Date; MIN_DATETIME: Date }>(
      `
      with
        city_tz_offset as (select tz_offset from city where id = :cityId)
      select
        max(datetime) max_datetime,
        min(datetime) min_datetime
      from
        city_tz_offset,
        (select
          to_date(:startDatetime, 'yyyy-mm-dd"T"HH24:MI:SS') + (ROWNUM - 1) / 24 datetime
        from
          city,
          city_tz_offset
        CONNECT BY
          (to_date(:endDatetime, 'yyyy-mm-dd"T"HH24:MI:SS') - to_date(:startDatetime, 'yyyy-mm-dd"T"HH24:MI:SS')) * 24 - 1 > ROWNUM
        minus
        select
          datetime + tz_offset / 24
        from
          weather,
          city_tz_offset
        where
          city_id = :cityId and
          datetime between to_date(:startDatetime, 'yyyy-mm-dd"T"HH24:MI:SS') - tz_offset / 24 and
          to_date(:endDatetime, 'yyyy-mm-dd"T"HH24:MI:SS') - tz_offset / 24)
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
