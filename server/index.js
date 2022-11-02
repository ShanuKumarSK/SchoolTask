const sql = require("mssql/msnodesqlv8");

async function checkConnection() {
    var config1 = {
        connectionString: "Driver=SQL Server;Server=APEX-66\\SQLEXPRESS;Database=SchoolTask;Trusted_Connection=true;"
    };
    try {
        let pool = await sql.connect(config1);
        console.log("connected!")

        let mytableData = await pool.request().query('select * from dbo.mytable')
        console.log(mytableData.recordsets)
    } catch (error) {
        console.log("Error in Connection: ", error);
    }
}
checkConnection()
