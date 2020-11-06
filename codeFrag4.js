const express = require('express')
const handlebars = require('express-handlebars')

const PORT = 3000

const app = express ()

app.engine('hbs', handlebars({defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs')

/*
const result = {
    status: 'OK',
    copyright: 'Copyright (c) 2020 The New York Times Company.  All Rights Reserved.',
    num_results: 1,
    results: [
      {
        url: 'https://www.nytimes.com/2018/06/05/books/review/president-is-missing-clinton-patterson.html',
        publication_dt: '2018-06-05',
        byline: 'NICOLLE WALLACE',
        book_title: 'The President Is Missing',
        book_author: 'Bill Clinton and James Patterson',
        summary: 'The former president and the best-selling novelist have packed “The President Is Missing” with inside-the-Beltway intrigue and secret White House details.',
        uuid: '00000000-0000-0000-0000-000000000000',
        uri: 'nyt://book/00000000-0000-0000-0000-000000000000',
        isbn13: [Array]
      }
    ]
}
*/

const result = {
    status: 'OK',
    copyright: 'Copyright (c) 2020 The New York Times Company.  All Rights Reserved.',
    num_results: 2,
    results: [
      {
        url: 'https://www.nytimes.com/2018/06/05/books/review/president-is-missing-clinton-patterson.html',
        publication_dt: '2018-06-05',
        byline: 'NICOLLE WALLACE',
        book_title: 'The President Is Missing',
        book_author: 'Bill Clinton and James Patterson',
        summary: 'The former president and the best-selling novelist have packed “The President Is Missing” with inside-the-Beltway intrigue and secret White House details.',
        uuid: '00000000-0000-0000-0000-000000000000',
        uri: 'nyt://book/00000000-0000-0000-0000-000000000000',
        isbn13: [Array]
      },
      {
        url: 'https://www.nytimes.com/2018/06/05/books/review/president-is-missing-clinton-patterson.html',
        publication_dt: '2018-06-05',
        byline: 'NICOLLE WALLACE',
        book_title: 'The President Is Missing',
        book_author: 'Bill Clinton and James Patterson',
        summary: 'The former president and the best-selling novelist have packed “The President Is Missing” with inside-the-Beltway intrigue and secret White House details.',
        uuid: '00000000-0000-0000-0000-000000000000',
        uri: 'nyt://book/00000000-0000-0000-0000-000000000000',
        isbn13: [Array]
      }
    ]
}

const reviews = result.results.map(
    d => {
        return {
            title: d.book_title,
            author: d.book_author,
            reviewer: d.byline,
            review_date: d.publication_dt,
            summary: d.summary,
            link: d.url
        }
    }
)

app.get('/review', (req, resp) => {
    resp.status(200)
    resp.type('text/html')
    resp.render('review', {
        hasReview: !!result.num_results,
        copyright:result.copyright,
        reviews: reviews
    })
})


app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`)
})