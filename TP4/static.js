var fs = require('fs')

function hasStaticResource(request) {
    return /\/w3.css$/.test(request.url) ||
        /\/favicon.png$/.test(request.url)
}

function serveStaticResource(req, res) {
    var split = req.url.split('/')
    var file = split[split.length - 1]
    fs.readFile('public/' + file, (err, data) => {
        if (err) {
            console.log('Erro: ficheiro não encontrado ' + err)
            res.statusCode = 404
            res.end()
        }
        else {
            if (file == '/favicon.ico')
                res.setHeader('Content-Type', 'image/x-icon')
            res.end(data)
        }
    })
}

exports.hasStaticResource = hasStaticResource
exports.serveStaticResource = serveStaticResource