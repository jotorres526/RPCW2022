const http = require('http')
const static = require('./static')
const axios = require('axios')
const { parse } = require('querystring')

function parseReqBody(req, callback) {
    if (req.headers['content-type'] == 'application/x-www-form-urlencoded') {
        let body = 'dateCreated=' + new Date().toISOString().substring(0,10) + '&estado=ativa&'
        req.on('data', block => {
            body += block.toString()
        })
        req.on('end', () => {
            console.log(body)
            callback(parse(body))
        })
    }
}

function genPage(activeData) {
    activeStr = ''
    inactiveStr = ''
    activeData.forEach(task => {
        if(task.estado == 'ativa') {
            activeStr += `
                <tr>
                    <td class='w3-center'>${task.what}</td>
                    <td class='w3-center'>${task.dateDue}</td>
                    <td class='w3-center'>${task.who}</td>
                    <td class='w3-center'>${task.dateCreated}</td>
                    <td class='w3-center'>${task.type}</td>
                    <td class='w3-center'><a href='/tarefas/${task.id}/realizada'>✅</a></td>
                <tr>
            `
        } else if (task.estado == 'inativa') {
            inactiveStr += `
                <tr>
                    <td class='w3-center'>${task.what}</td>
                    <td class='w3-center'>${task.dateDue}</td>
                    <td class='w3-center'>${task.who}</td>
                    <td class='w3-center'>${task.dateCreated}</td>
                    <td class='w3-center'>${task.type}</td>
                    <td class='w3-center'><a href='/tarefas/${task.id}/apagar'>❌</a></td>
                <tr>
            `
        }
    })

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Tarefas</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="stylesheet" href="w3.css"/>
    <link rel="icon" href="favicon.png">
</head>
<body>
    <div class="w3-container">
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Nova tarefa</h1>
                <form class="w3-container" action="/tarefas" method="POST">
                    <label class="w3-text-light-grey"><b>Tarefa</b></label>
                    <input class="w3-input w3-border w3-light-grey" type="text" name="what">
          
                    <label class="w3-text-light-grey"><b>Responsável</b></label>
                    <input class="w3-input w3-border w3-light-grey" type="text" name="who">

                    <label class="w3-text-light-grey"><b>Tipo de Tarefa</b></label>
                    <input class="w3-input w3-border w3-light-grey" type="text" name="type">

                    <label class="w3-text-light-grey"><b>Prazo</b></label>
                    <input class="w3-input w3-border w3-light-grey" type="date" name="dateDue">

                    <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
                    <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 

                </form>
            </header>
            <div class="w3-row">
            </div>
            <div class="w3-row w3-teal">
                <div class="w3-half w3-container w3-center">
                    <h1>Tarefas ativas</h1>
                    <table class="w3-table w3-bordered">
                        <tr>
                            <th class='w3-center'>Tarefa</th>
                            <th class='w3-center'>Prazo</th>
                            <th class='w3-center'>Responsável</th>
                            <th class='w3-center'>Data de criação</th>
                            <th class='w3-center'>Tipo</th>  
                            <th class='w3-center'>Marcar Realizada</th>
                        </tr>
                        ${activeStr}
                    </table>
                </div>
                <div class="w3-half w3-container w3-center">
                    <h1>Tarefas inativas</h1>
                    <table class="w3-table w3-bordered">
                        <tr>
                            <th class='w3-center'>Tarefa</th>
                            <th class='w3-center'>Prazo</th>
                            <th class='w3-center'>Responsável</th>
                            <th class='w3-center'>Data de criação</th>
                            <th class='w3-center'>Tipo</th>
                            <th class='w3-center'>Eliminar</th>
                        </tr>
                        ${inactiveStr}
                    </table>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`
}

function genPostConfirm() {
    return `<html>
<head>
    <title>Confirmação</title>
    <meta charset="utf-8"/>
    <link rel="stylesheet" href="w3.css"/>
    <link rel="icon" href="favicon.png">
</head>
<body>
    <div class="w3-card-4 w3-teal">
        <header class="w3-container w3-teal">
            <h1>Tarefa criada</h1>
        </header>

        <div class="w3-container">
            <p><a href="/">Voltar ao menu principal</a></p>
        </div>
    </div>
</body>
</html>`

}


const server = http.createServer((req, res) => {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    if (static.hasStaticResource(req)) {
        static.serveStaticResource(req, res)
    } else {
        switch (req.method) {
            case "GET":
                if (req.url == '/') {
                    axios.get(
                        'http://localhost:3000/tasks'
                    ).then(response => {
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                        res.write(genPage(response.data))
                        res.end()
                    }).catch(err => {
                        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
                        res.write('<p>Erro ao obter lista de tarefas: ' + err + '</p>')
                        res.end()
                    })
                } else if (/\/tarefas\/[0-9]+\/apagar$/.test(req.url)) {
                    let taskID = req.url.split("/")[2]
                    axios.delete(
                        'http://localhost:3000/tasks/' + taskID
                    ).then(response => {
                        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                        res.write("<p>Apagado com sucesso</p>")
                        res.write('<p><a href="/">Voltar</a></p>')
                        res.end()
                    }).catch(err => {
                        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                        res.write("<p>Erro a apagar</p>")
                        res.write('<p><a href="/">Voltar</a></p>')
                        res.end()
                    })
                } else if (/\/tarefas\/[0-9]+\/realizada$/.test(req.url)) {
                    let taskID = req.url.split("/")[2]
                    axios.get(
                        'http://localhost:3000/tasks/' + taskID
                    ).then(response => {
                        let reqBody = response.data
                        reqBody.estado = 'inativa'
                        axios.put(
                            'http://localhost:3000/tasks/' + reqBody.id, reqBody
                        ).then(response => {
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                            res.write("<p>Atualizado com sucesso</p>")
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        }).catch(err => {
                            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                            res.write("<p>Erro a atualizar: " + err + " </p>")
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        })
                        
                    }).catch(err => {
                        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                        res.write("<p>Erro a atualizar: " + err + " </p>")
                        res.write('<p><a href="/">Voltar</a></p>')
                        res.end()
                    })
                }
                break;
            case "POST":
                if (req.url == '/tarefas') {
                    parseReqBody(req, body => {
                        axios.post(
                            'http://localhost:3000/tasks', body
                        ).then(response => {
                            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                            res.write(genPostConfirm())
                            res.end()
                        }).catch(err => {
                            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
                            res.write('<p>Erro no POST: ' + err + '</p>')
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        })
                    })
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
                    res.write('<p>Post não suportado</p>')
                    res.write('<p><a href="/">Voltar</a></p>')
                    res.end()
                }
                break;
            default:
                res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' })
                res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                res.end()
        }
    }
});

server.listen(7777)
console.log('Servidor a ouvir na porta 7777')
