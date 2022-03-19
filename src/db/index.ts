import oracledb, {
  BindParameters,
  ExecuteManyOptions,
  ExecuteOptions,
  Result,
} from "oracledb";
import { dbconfig } from "./dbconfig";
import { City, dayWeatherInfo } from "../@types/dbtypes";

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

  async weatherAddMany(weatherData: dayWeatherInfo[]) {
    console.log(weatherData);
    const data = await this.executeMany<dayWeatherInfo>(
      `
            insert into WEATHER (CITY_ID, CREATED_AT, WIND_SPEED, WIND_DIRECTION, WIND_GUST)
            values (:city_id, :created_at, :wind_speed, :wind_direction, :wind_gust)
            `,
      weatherData,
      {
        autoCommit: true,
        bindDefs: {
          city_id: { type: oracledb.NUMBER },
          created_at: { type: oracledb.DATE },
          wind_speed: { type: oracledb.NUMBER },
          wind_direction: { type: oracledb.NUMBER },
          wind_gust: { type: oracledb.NUMBER },
        },
      }
    );
    if (data?.outBinds) {
      console.log(data.outBinds);
    }
    return null;
  }
}

export const db = new Database();
