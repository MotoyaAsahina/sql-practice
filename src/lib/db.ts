import mysql from 'mysql2'

const access: mysql.ConnectionOptions = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DATABASE || 'world',
}

const conn = mysql.createPool(access)

export default conn
