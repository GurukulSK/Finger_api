var mssql = require("mssql");
var exprss = require('express')
var app = exprss()
var cors = require('cors')
require('dotenv').config()
var TelegramBot = require("node-telegram-bot-api")
var fs = require('fs')
app.use(cors())
app.use(exprss.json());
app.use(exprss.urlencoded({extended :true}))
// mssql config

var dbConfig = {

    server: "DESKTOP-PMQC8H3\\SQLEXPRESS",

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
        await conn.query(`UPDATE [ONtime_Att].[dbo].[Tran_DeviceAttRec] set [remarks] = 'true'`, async (err, record) => {
            console.log(record);
        })
        let count = 0;
        var run = true
        while (run) {
            count += 1
            if(count == 10){
                return res.status(200).json("This is Very bold")
            }
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
                                return res.status(200).json(responce);
                            })
                        }
                    }
                }
            })
            await sleep(1000)
        }
    });
})
app.get("/punchapi/health", async (req, res) => {
    res.status(200).send("Success")
})
app.post("/sendTelegram",(req,res)=>{
    let gid = req.body['gid'];
    let mes = req.body['mes'];
    console.log(req.body);
    // const token = process.env.BOT_TOKEN;
    const token = "5851040555:AAFWjOGSBUgUyxuqZHqahNi6oBvueEo988o";
    const bot = new TelegramBot(token);
    // try {
      bot.sendPhoto(-1001873566418,fs.readFileSync("C:\\xampp\\htdocs\\Students\\"+gid+".jpg"), { caption: mes });
    // } catch {
    //   bot.sendMessage(-1001873566418, mes);
    // }
    return res.status(200).send("url");
})
app.listen(3000, () => {
    console.log("Server running on port 3000");
})