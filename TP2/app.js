var http = require('http') 
var fs = require('fs')

// Note to self: substring doesn't include the last index
const myserver = http.createServer(function (req, res) {
    let page = ''
    let isRoute = true 
    let d = new Date().toISOString().substring(0, 16);
    if (req.url == "/" || req.url == '/filmes')
        page = './arquivos/index.html'
    else if (req.url.substring(0, 9) == '/filmes/f') 
        page = './arquivos/f' + req.url.substring(9) + '.html'
    else if (req.url == '/atores')
        page = './arquivos/atores.html'
    else if (req.url.substring(0, 9) == '/atores/a')
        page = './arquivos/a' + req.url.substring(9) + '.html'
    else
        isRoute = false
    
    console.log(req.method + " " + req.url + " " + d);
    
    fs.readFile(page, function (err, data) { 
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
            if (isRoute)
                res.write('<h1>Erro</h1><p>Ficheiro não existente</p>')
            else
                res.write('<h1>Erro</h1><p>Rota não suportada</p>')
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
            res.write(data)
        }
        res.end()
    })
});


myserver.listen(7777);
console.log('Server connected to port 7777')