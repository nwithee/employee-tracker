const mysql = require ('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'mysqlpassword',
    database: 'employee_tracker'
});

module.exports = connection;