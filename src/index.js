const http = require('http')
const { bodyParser } = require('./lib/body-parser')

let db = []

function getTaskHandler(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.write(JSON.stringify(db))
    res.end()
}

async function createTaskHandler(req, res) {
    try {
        await bodyParser(req)
        db.push(req.body)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.write(JSON.stringify(db))
        res.end()
    } catch (error) {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.write('Invalid data', error)
        res.end()
    }
}

async function updateTaskHandle(req, res) {
    try {
        let { url } = req

        let idQuery = url.split("?")[1]
        let idKey = idQuery.split("=")[0]
        let idValue = idQuery.split("=")[1]

        if (idKey === 'id') {
            await bodyParser(req)

            db[idValue - 1] = req.body
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.write('Invalid request query!')
            res.end()
        }

    } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.write('Invalid body data was provided', error.message)
        res.end()
    }

}

async function deleteTaskHandle (req, res) {
    const { url } = req

    let idQuery = url.split("?")[1]
    let idKey = idQuery.split("=")[0]
    let idValue = idQuery.split("=")[1]

    if (idKey === 'id') {
        db.splice(idValue - 1, 1)
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.write('delete successfully')
        res.end()
    } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.write('invalid query!')
        res.end()
    }
}

const server = http.createServer((req, res) => {

    const { url, method } = req

    console.log(`URL: ${url} - Method: ${method}`);

    switch (method) {
        case "GET":
            if (url === '/') {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.write(JSON.stringify({
                    msg: 'OK!'
                }))
                res.end()
            }
            if (url === '/tasks') {
                getTaskHandler(req, res)
            }
            break
        case "POST":
            if (url === '/task') {
                createTaskHandler(req, res)
            }
            break
        case "PUT":
            updateTaskHandle(req, res)
            break
        case "DELETE":
            deleteTaskHandle(req, res)
            break
        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' })
            res.write('404 not found')
            res.end()
    }
})

server.listen(4040, () => {
    console.log('server listen')
})