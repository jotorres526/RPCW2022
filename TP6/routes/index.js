const { default: axios } = require('axios');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  axios.get('http://localhost:3000/files')
    .then(resp => {
      res.render('index', { title: 'Main', list: resp.data });
    })
    .catch(err => {
      res.render('error', { error: err })
    })
});

module.exports = router;
