from cmath import acos
import json
import re
import os

os.makedirs('arquivos', exist_ok=True)
actorDict = {}

def getDocHeader(title):
    return f'''<!DOCTYPE html>
<html lang = "en">
<head>
    <meta charset = "UTF-8">
    <title>{title}</title>
    <meta name = "viewport" content = "width=device-width,initial-scale=1">
</head>
<body>
    '''


def genMoviePage(movie, counter):
    with open(f'arquivos/f{counter}.html', mode='w', encoding='utf-8') as file:
        file.write(getDocHeader(movie['title']) + '<h1>' + movie['title'] + '</h1>\r\n')
        file.write('\t<h2>Ano de estreia: ' + str(movie['year']) + '</h2>\r\n')
        file.write('\t<h2>Gênero cinematográfico</h2>\r\n\t<ul>\r\n')
        for genre in movie['genres']:
            file.write('\t\t<li>' + genre + '</li>\r\n')
        file.write('\t</ul>\r\n\t<h2>Elenco</h2>\r\n\t<ul>\r\n')
        for actor in movie['cast']:
            validActor = re.match(r'^[A-Z][a-z]+ [A-Z][a-z]+$', actor)
            if validActor:
                actorDict.setdefault(actor, []).append(movie['title']) 
                file.write('\t\t<li>' + actor + '</li>\r\n')
        file.write('\t</ul>\r\n</body>\r\n</html>')


def genActorPage(actor, counter):
    with open(f'arquivos/a{counter}.html', mode='w', encoding='utf-8') as file:
        file.write(getDocHeader(actor) +'<h1>' + actor + '</h1>\r\n')
        file.write('\t<h2>Filmes em que participa:</h2>\r\n\t<ul>\r\n')
        for movie in actorDict[actor]:
            file.write('\t\t<li>' + movie + '</li>\r\n')
        file.write('\t</ul>\r\n</body>\r\n</html>')


def genAtores():
    acc = 1
    with open(f'arquivos/atores.html', mode='w', encoding='utf-8') as file:
        file.write(getDocHeader('Atores') + '<h1>Lista de Atores</h1>\r\n\t<ul>\r\n')
        for i in actorDict:
            url = 'http://localhost:7777/atores/a' + str(acc)
            file.write(f'\t\t<li><a href=\'{url}\'>' + i + '</a></li>\n')
            genActorPage(i, acc)
            acc = acc + 1
        file.write('\t</ul>\r\n</body>\r\n</html>')


#maybe do it in a single loop idk
with open('cinemaATP.json', encoding='utf-8') as f:
    fileCounter = 1
    myJson = json.load(f)
    myJson.sort(key = lambda x : x['title'].lower())
    index = open('arquivos/index.html', mode='w', encoding='utf-8')
    index.write(getDocHeader('Index') + '<h1>Lista de Filmes</h1>\r\n\t<ul>\r\n')
    for movie in myJson:
        url = 'http://localhost:7777/filmes/f' + str(fileCounter)
        index.write(f'\t\t<li><a href=\'{url}\'>' + movie['title'] + '</a></li>\n')
        genMoviePage(movie, str(fileCounter))
        fileCounter = fileCounter + 1
    index.write('\t</ul>\r\n</body>\r\n</html>')
    index.close()
    actorDict = dict(sorted(actorDict.items()))
    genAtores()
