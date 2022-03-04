import oracledb from "oracledb";
import dbconfig from "./dbconfig";
import { City } from "./dbtypes";

class Database {
  getDataFromDB = async () => {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig);
      const data = await connection.execute("select id, name from test", [], {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });
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
  };

  getCity = async (cityName: string): Promise<City[] | undefined> => {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig);
      const data = await connection.execute<City>(
        "select ID, NAME from CITY where NAME = :cityName",
        [cityName],
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
          maxRows: 1,
        }
      );
      return data.rows;
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
  };
}

export const db = new Database();
