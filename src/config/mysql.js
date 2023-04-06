
const env=require('../../env');
var mysql = require('mysql');


const con = mysql.createConnection({

    host:env.mysql.host,
    database:env.mysql.database,
    user:env.mysql.user,
    password:env.mysql.password,
    // post:3306,
});

return con;
// con.connect(function(err) {
//     if (err) {
//         console.log('err');
//     }
//     else{
//         console.log("Connected!");
//     }
//
// });

// const users=con.query('SELECT * FROM users', (err,rows) => {
//     if(err) throw err;
//
//
//    return rows;
//     // rows.forEach( (row) => {
//     //     console.log(`${row.name} lives in ${row.city}`);
//     // });
//
// });

// module.exports = mysql