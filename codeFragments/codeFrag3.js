const fetch = require('node-fetch')
const withQuery = require('with-query').default

const apikey = ''
const ENDPOINT = 'https://api.nytimes.com/svc/books/v3/reviews.json'
// const title = 'Becoming'
// const author = 'Michelle Obama'

// const title = 'The President is Missing'
// const author = 'Bill Clinton'
// const author = 'Bill Clinton and James Patterson'

const title = 'The Outsider'

const url = withQuery(
    ENDPOINT,
    {
        title: title,
    //    author: author,
        "api-key": apikey
    }
)

const asf = async () => {
    try {
        let result = await fetch(url)
        result = await result.json()

        console.info(result)

    } catch (e) {
        console.error(e);
    }
}
asf()