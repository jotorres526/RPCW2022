/* Imports */
var http = require('http')
var url = require('url')
var axios = require('axios')
var port = 4000


async function genIndex() {
    let body = `<ul>
    <li><a href="http://localhost:4000/alunos">Lista de Alunos</a></li>
    <li><a href="http://localhost:4000/cursos">Lista de Cursos</a></li>
    <li><a href="http://localhost:4000/instrumentos">Lista de Instrumentos</a></li>
</ul>`
    return genHTML(body, "Index");
}

async function genCursos() {
    const req = await axios.get("http://localhost:3000/cursos");
    let body = `<table>
    <tr>
        <th>Id</th>
        <th>Designação</th>
        <th>Duração</th>
        <th>Id Instrumento</th>
        <th>Nome Instrumento</th>
    </tr>`;

    req.data.forEach(element => {
        body += `<tr>
    <th>${element['id']}</th>
    <th>${element['designacao']}</th>
    <th>${element['duracao']}</th>
    <th>${element['instrumento']['id']}</th>
    <th>${element['instrumento']["#text"]}</th>
</tr>`
    });

    body += '</table>';

    return genHTML(body, "Cursos");
}

async function genInstrumentos(params) {
    const req = await axios.get("http://localhost:3000/instrumentos")
    let body = `<table>
    <tr>
        <th>Id Instrumento</th>
        <th>Nome Instrumento</th>
    </tr>`;

    req.data.forEach(element => {
        body += `<tr>
    <th>${element['id']}</th>
    <th>${element["#text"]}</th>
</tr>`
    });

    body += '</table>';

    return genHTML(body, "Instrumentos");
}

async function genAlunos(params) {
    const req = await axios.get("http://localhost:3000/alunos")
    let body = `<table>
    <tr>
        <th>Id</th>
        <th>Nome</th>
        <th>Data Nascimento</th>
        <th>Curso</th>
        <th>Instrumento</th>
    </tr>`;

    req.data.forEach(element => {
        body += `<tr>
    <th>${element['id']}</th>
    <th>${element['nome']}</th>
    <th>${element['dataNasc']}</th>
    <th>${element['curso']}</th>
    <th>${element['instrumento']}</th>
</tr>`
    });

    body += '</table>';

    return genHTML(body, "Alunos");
}

function genHTML(body, title) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body>
    ${body}
</body>
</html>`
}


var server = http.createServer(async function (req, res) {
    let myUrl = url.parse(req.url, true).pathname
    let result = ''
    let code = 200
    let d = new Date().toISOString().substring(0, 16);
    console.log(req.method + " " + req.url + " " + d);

    if (myUrl == '/') {
        result = await genIndex();
    }
    else if (myUrl == '/cursos') {
        result = await genCursos();
    }
    else if (myUrl == '/instrumentos') {
        result = await genInstrumentos();
    }
    else if (myUrl == '/alunos') {
        result = await genAlunos();
    }
    else {
        let body = "<p>Rota " + myUrl + " não suportada </p>";
        code = 404
        res.write(genHTML(body, "Error"));
    }
    
    res.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8' })
    res.write(result)
});


server.listen(port);
console.log(`Server active on port: ${port}`);