import oracledb, { BindParameters, ExecuteOptions, Result } from "oracledb";
import dbconfig from "./dbconfig";
import { City } from "../types/dbtypes";

class Database {
  private async execute<T>(
    sql: string,
    bindParams: BindParameters,
    options: ExecuteOptions
  ) {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig);
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

  async getCityByName(cityName: string) {
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

  async getAllCities() {
    const data = await this.execute<City>(
      `select ID "id", NAME "name" from CITY`,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );
    return data?.rows || null;
  }

  async addCity(name: string) {
    const data = await this.execute<City>(
      `insert into CITY (NAME) values (:cityName) returning ID, NAME into :id, :name`,
      {
        cityName: name,
        rid: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        name: { type: oracledb.DB_TYPE_VARCHAR, dir: oracledb.BIND_OUT },
      },
      {
        autoCommit: true,
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
}

export const db = new Database();
