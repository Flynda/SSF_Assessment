const mysql = require('mysql2/promise')

// SQL statements
const SQL_GET_TITLE_LIST = 'select book_id, title from book2018 where title like ? order by title asc limit ? offset ?'
const SQL_TOTAL_LIST = 'select count(*) as listCount from book2018 where title like ?'

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
const getBookList = mkQuery(SQL_GET_TITLE_LIST, pool)
const listCount = mkQuery(SQL_TOTAL_LIST, pool)

const asf = async () => {

    const setLimit = 10
    const q = 't'
    const page =  1
    const offsetBy= (page - 1) * setLimit

    try {
        const booklist = await getBookList([`${q}%`, setLimit, offsetBy])
        const totalList = await listCount([`${q}%`])
        console.info('Book List: ', booklist)
        console.info('Count: ', totalList)

    } catch(e) {
        console.error(e)
    }
}

asf()