const axios = require('axios');
const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  axios.get(
    'http://localhost:3000/musicas'
  ).then(resp => {
    let listaMusicas = resp.data
    let title = "Listagem de músicas"
    res.render('musicas', { title:title, header:title, musicas: listaMusicas})
  }).catch(err => {
    res.render('error', { error: err })
  })
});

router.get('/inserir', function (req, res, next) {
  res.render('form', { title: "Form" })
}) 

router.get('/prov/:idProv', function (req, res, next) {
  axios.get(
    'http://localhost:3000/musicas?prov=' + req.params.idProv
  ).then(resp => {
    let musicaProv = resp.data
    let header = "Listagem de músicas - " + req.params.idProv
    res.render('musicas', { title: req.params.idProv, header: header, musicas: musicaProv })
  }).catch(err => {
    res.render('error', { error: err })
  })
})

router.get('/:id', function (req, res, next) {
  axios.get(
    'http://localhost:3000/musicas?id=' + req.params.id
  ).then(resp => {
    let musica = resp.data[0]
    res.render('musica', { title:musica.tit, m: musica })
  }).catch(err => {
    res.render('error', { error: err })
  })
})


router.post('/', (req, res) => {
  axios.post(
    'http://localhost:3000/musicas', req.body
  ).then(resp => {
    res.redirect('/')
  }).catch(err => {
    res.render('error', { error: err })
  })
})

module.exports = router;
