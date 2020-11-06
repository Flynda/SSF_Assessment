const mysql = require('mysql2/promise')

// SQL statements
const SQL_GET_BOOK_DETAILS = 'select * from book2018 where book_id = ?'

const pool = mysql.createPool({
    host: process.env.DB_host || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'goodreads',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 4,
    timezone: '+08:00'
})

const mkQuery = (sqlStmt, pool) => {
    const f = async (params) => {
        // get a connection from the pool
        const conn = await pool.getConnection()

        try {
            const results = await pool.query(sqlStmt, params)
            return results[0]
        } catch(e) {
            return Promise.reject(e)
        } finally {
            conn.release()
        }
    }
    return f
}

// sql queries
const bookDetails = mkQuery(SQL_GET_BOOK_DETAILS, pool)

const asf = async () => {

    const book_id = 'c1706051'

    try {
        const result = await bookDetails([book_id])
        console.info(`result: `, result[0])

    } catch(e) {
        console.error(e)
    }
}

asf()