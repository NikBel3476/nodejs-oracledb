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
      const data = await connection.execute<T>(sql, bindParams, options);
      return data;
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
      const data = await connection.executeMany<T[]>(sql, binds, options);
      return data;
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
        id: data?.outBinds.id,
        name: data?.outBinds.name,
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
    const data = await this.execute<Date[]>(
      ` 
      select to_date(:start_date, 'yyyy-mm-dd') + (ROWNUM - 1 - :tz_offset) / 24 datetime
      from
        DUAL,
        CITY
      CONNECT BY (to_date(:end_date, 'yyyy-mm-dd') - to_date(:start_date, 'yyyy-mm-dd')) * 24 > ROWNUM - 1
      /* minus
      select DATETIME
      from WEATHER
      where CITY_ID = :city_id */
      `,
      {
        start_date: startDateISO,
        end_date: endDateISO,
        // city_id: cityId,
        tz_offset: 4,
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );
    return data?.rows || null;
  }
}

export const db = new Database();
