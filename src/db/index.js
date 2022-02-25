const oracledb = require('oracledb');
const dbconfig = require('./dbconfig');

async function getDataFromDB() {
    let connection;

    try {
        connection = await oracledb.getConnection(dbconfig);
        const data = await connection.execute(
            'select id, name from test',
            [],
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        );
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

module.exports = getDataFromDB;
