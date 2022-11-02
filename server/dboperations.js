var config = require('./dbconfig');
const sql = require("mssql/msnodesqlv8");

async function getTables() {
    try {
        let pool = await sql.connect(config);
        let details = await pool.request().query("SELECT * from dbo.mytable");
        return details.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function getTable(detailId) {
    try {
        let pool = await sql.connect(config);
        let detail = await pool.request()
            .input('input_parameter', sql.Int, detailId)
            .query("SELECT * from dbo.mytable where Id = @input_parameter");
        return detail.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function addTable(table) {
    var Name = table.Name;
    var Email = table.Email;
    var Password = table.Password;
    var FirstName = table.FirstName;
    var LastName = table.LastName;
    var Role = table.Role;
    try {
        console.log(config, 'config1')
        let pool = await sql.connect(config);
        console.log('connected!')
        let insertDetail = await pool.request()
            .query`INSERT INTO dbo.mytable (Name,Email,Password,FirstName,LastName,Roles) 
        OUTPUT Inserted.* 
        VALUES (${Name},${Email},${Password},${FirstName},${LastName},${Role})`;
        return insertDetail.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function login(res, credentials) {
    var Email = credentials.Email;
    var Password = credentials.Password;

    if(Email && Password) {
        let pool = await sql.connect(config);
        console.log(Email, 'connected!')
        let loginDetail = await pool.request()
            .query`SELECT * from dbo.mytable where Email = ${Email} and Password = ${Password}`;
        console.log(loginDetail.recordset, "Login");

        if (loginDetail.recordset.length > 0) {
            return loginDetail
        } else {
            res.send('Username and/or Password not found');
        }
        // (function () {
        //     var req = request;
        //     var resp = response;
        //     var conn = thisConn;

        //     return function (error, results, fields) {
        //         if (results.length > 0) {
        //             req.session.loggedin = true;
        //             req.session.Email = Email;
        //             resp.redirect('/AfterLogin');
        //         } else {
        //             response.send('Username and/or Password not found');
        //         }
        //         conn.close();
        //         resp.end();
        //     };
        // })();
        // return 
    } else {
        res.send('Please enter Username and Password');
    }
}

module.exports = {
    getTables: getTables,
    getTable: getTable,
    addTable: addTable,
    login: login
}