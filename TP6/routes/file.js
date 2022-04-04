var express = require('express');
var fs = require('fs')
var axios = require('axios')

var router = express.Router();

var multer = require('multer')
var upload = multer({ dest: 'uploads' })


router.get('/delete/:id', (req, res, next) => {
  axios.delete('http://localhost:3000/files/' + req.params.id)
    .then(resp => {
      res.redirect('/')
    })
    .catch(err => {
      res.render('error', { error: err })
    })
})

router.post('/', upload.single('myFile'), (req, res, next) => {
  let oldPath = __dirname + '/../' + req.file.path
  let newPath = __dirname + '/../filestore/' + req.file.originalname
  fs.rename(oldPath, newPath, erro => {
    if (erro) throw erro
  })
  var d = new Date().toISOString().substring(0, 16)
  axios.post("http://localhost:3000/files", {
    "date": d,
    "name": req.file.originalname,
    "mimetype": req.file.mimetype,
    "size": req.file.size,
    "description": req.body.description
  }).then(_ => {
    res.redirect('/')
  }).catch(err => {
    res.render('error', { error: err })
  })
})


module.exports = router;
