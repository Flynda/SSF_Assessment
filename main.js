const express = require('express')
const handlebars = require('express-handlebars')
const mysql = require('mysql2/promise')
const fetch = require('node-fetch')
const withQuery = require('with-query').default

// SQL statements
const SQL_GET_TITLE_LIST = 'select book_id, title from book2018 where title like ? order by title asc limit ? offset ?'
const SQL_TOTAL_LIST = 'select count(*) as listCount from book2018 where title like ?'

const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000

const pool = mysql.createPool({
    host: process.env.DB_host || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'goodreads',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 4,
    timezone: '+08:00'
})

const startApp = async (app, pool) => {
    try {
        const conn = await pool.getConnection();

        console.info('Pinging database')
        await conn.ping()

        conn.release()

        app.listen(PORT, () => {
            console.info(`Application started on port ${PORT} at ${new Date()}`)
        })

    } catch(e) {
        console.error('Cannot ping database:', e)
    }
}

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

const app = express ()

app.engine('hbs', handlebars({defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs')



// application configuration
app.get('/', (req, resp) => {
    const aToZ = [
        'A', 'B', 'C', 'D', 'E',
        'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O',
        'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'E', 'X', 'Y', 'Z'
    ]
    const numArray = [
        '0', '1', '2', '3', '4',
        '5', '6', '7', '8', '9'
    ]
    resp.status(200)
    resp.type('text/html')
    resp.render('index', {
        alphabet: aToZ,
        numbers: numArray
    }
    )
})

app.get('/list', async (req, resp) => {
    const setLimit = 10
    const q = req.query['q']
    const qualifier = req.query['qualifier']

    const page = parseInt(req.query['page']) || 1
    console.info('Page is: ', page)
    const offsetBy= (page - 1) * setLimit

    try {
        const booklist = await getBookList([`${q}%`, setLimit, offsetBy])
        const totalList = await listCount([`${q}%`])
        
        console.info('Book List: ', booklist)
        console.info('Count: ', totalList[0].listCount)

        const totalPages = Math.ceil(totalList[0].listCount / setLimit)
        console.info('number of pages: ', totalPages)
        console.info(`current page: `, page)
        const hasPrevPage = (page > 1) ? 'Previous' : ''
        const hasNextPage = (page < totalPages) ? 'Next' : ''
        
        console.info('p:', hasPrevPage)
        console.info('n:', hasNextPage)
        console.info('type: ', qualifier)
        resp.status(200)
        resp.type('text/html')
        resp.render('list', {
            booklist: booklist,
            hasContent: !!booklist.length,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            q: q,
            qualifier: qualifier,
            prevPage: page - 1,
            nextPage: page + 1
        })

    } catch(e) {
        resp.status(500)
        resp.type('text/html')
        resp.send(JSON.stringify(e))
    }
})



// end of configuration

startApp(app, pool)