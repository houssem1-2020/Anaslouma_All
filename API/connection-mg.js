const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bgvckelc_magazin' //bgvckelc_integration
})
connection.connect()

module.exports = connection