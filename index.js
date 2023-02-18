var mssql = require("mssql");
var exprss = require('express')
var app = exprss()
var cors = require('cors')

app.use(cors())
// mssql config

var dbConfig = {

    server: "DESKTOP-006M8ES\\SQLEXPRESS",

    database: "ONtime_Att",

    user: "krish", // Update it

    password: "0000000000", // Update it

    port: 1433,

    options: {
        trustServerCertificate: true,
    },


}

// Connection to DB for Mysql


app.get("/getpunch", async (req, res) => {
    const sleep = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time))
    }      
    
    var conn = new mssql.ConnectionPool(dbConfig);
    await conn.connect(async function (err) {
        if (err) {
            console.log(err);
        }
        var run = true
        while (run) {
            console.log("In loop");
            await conn.query("SELECT  TOP 1 [Punch_month],[Emp_id],[Card_Number],[Att_PunchDownDate],[Att_PunchRecDate],[sno_id],[remarks] FROM [ONtime_Att].[dbo].[Tran_DeviceAttRec] ORDER BY [sno_id] DESC ", async (err, record) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(record['rowsAffected'][0]);
                    if (record['rowsAffected'][0] != 0) {
                        console.log("In first If");
                        if (record['recordset'][0]['remarks'] != "true") {
                            console.log("In second If");
                            console.log(record['recordset'][0]['remarks']);
                            console.log("jvjhfju");
                            console.log(record['recordset'][0]['sno_id']);
                            let sno_id = record['recordset'][0]['sno_id']
                            let responce = record['recordset'][0]
                            await conn.query(`UPDATE [ONtime_Att].[dbo].[Tran_DeviceAttRec] set [remarks] = 'true' WHERE [sno_id] = ${sno_id}`, async (err, record) => {
                                console.log(record);
                                run = false
                                await conn.close()
                                return res.status(200).json(responce);
                            })
                        }
                    }
                }
            })
            await sleep(1000)
            console.log("closing");
        }
    });
})
app.get("/punchapi/health", async (req, res) => {
    res.status(200).send("Success")
})
app.listen(3000, () => {
    console.log("Server running on port 3000");
})