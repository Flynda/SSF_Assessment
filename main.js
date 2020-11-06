const express = require('express')
const handlebars = require('express-handlebars')
const mysql = require('mysql2/promise')
const fetch = require('node-fetch')
const withQuery = require('with-query').default

// SQL statements


const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000

const app = express ()

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

app.get('/list', (req, resp) => {
    
    resp.status(200)
    resp.end()
})

// end of configuration

startApp(app, pool)