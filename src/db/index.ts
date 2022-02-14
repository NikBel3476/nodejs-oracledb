import oracledb from 'oracledb';
import {dbconfig} from "./dbconfig";

export async function getDataFromDB() {
    const connection = await oracledb.getConnection(dbconfig);

    const data = await connection.execute('');
    return data;
}
