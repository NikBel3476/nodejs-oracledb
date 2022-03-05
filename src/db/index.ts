import oracledb, { BindParameters, ExecuteOptions, Result } from "oracledb";
import dbconfig from "./dbconfig";
import { City } from "./dbtypes";

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

  async getCityByName(cityName: string): Promise<City | undefined> {
    const data = await this.execute<City>(
      "select ID, NAME from CITY where NAME = :cityName",
      [cityName],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        maxRows: 1,
      }
    );
    if (data?.rows) return data.rows[0];
  }
}

export const db = new Database();
