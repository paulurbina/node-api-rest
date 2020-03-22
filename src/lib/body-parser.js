function bodyParser(req) {
   return new Promise((resolve, reject) => {
        let total = ''
        req
            .on('data', chunk => {
                total += chunk
            })
            .on('end', () => {
                req.body = JSON.parse(total)
                resolve()
            })
            .on('error', err => {
                console.log(err);
                reject()
            })
   })
}

module.exports = {bodyParser}