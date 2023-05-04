const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bgvckelc_anaslouma', //bgvckelc_integration
  timezone: 'Africa/Tunis', // set the time zone here
})
connection.connect()

module.exports = connection