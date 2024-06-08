import mysql from 'mysql2'

const access: mysql.ConnectionOptions = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'world',
}

const conn = mysql.createPool(access)

export default conn
