/* eslint-disable no-undef */
const errorHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        res.status(400)
        console.log(process.env.MODE)

        res.json({
            message: 'Something broke with the json parser!',
            stack: process.env.MODE === 'development' ? err.stack : {}
        })
    }

    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }

    // res.status(err.status || 500)
    // return res.json({
    //   message: 'Something broke!',
    //   stack: process.env.MODE === 'development' ? err.stack : {}
    // })

    next(err)

}

const notFoundHandler = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
    errorHandler,
    notFoundHandler

}
