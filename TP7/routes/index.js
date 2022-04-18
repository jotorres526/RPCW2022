var express = require('express');
var axios = require('axios')
var router = express.Router();

const apikey = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNGNiYTg0OWJhYmI2NjdjYmZkYzE2ZSIsImlhdCI6MTY0OTE5NTY1MiwiZXhwIjoxNjUxNzg3NjUyfQ.EuvH713Qr6IZ073-5FMF6j5p_3tb6Trv0TOOF5ZHWOPUlCBqKU1H9DTo_ueoCyWhPbEd6F8xzNvn-UkG3J8Ppq65xF8uukoElnSIsi3kldXI2E_EHMv5ETIq-2SGpiBmLyv1zu2broi-nXw18XwKM-WWpoumw5mZacg1qyj4kokGm--WzPIDD15Uibu2ObsDfeHpbDt81Npq-WgEVe56F5w0TdAvY_b-Xvm77hXI4MuaatL9bsOtYEyiepLuBelDyVWjAIoon3-7tB1lwrPnC0OJ_cxKUyCdqx8sZPkmciyTmBsV8fDTyvTP1ibiryAQsDRK5TrG83CcWmStZyDnoQ'

/* GET home page. */
router.get('/', (req, res) => {
  axios.get('http://clav-api.di.uminho.pt/v2/classes?nivel=1&apikey=' + apikey)
    .then(resp => {
      res.render('index', { classes: resp.data })
    })
    .catch(err => {
      res.render('error', { error: err })
    })
});

router.get('/:id', (req, res) => {
  axios.get('http://clav-api.di.uminho.pt/v2/classes/c' + req.params.id + '?apikey=' + apikey)
    .then(resp => {
      // se nivel = 3, filter processosRelacionados
      if (resp.data.nivel == 3) {
        let filterRel = resp.data.processosRelacionados
          .filter(x => x.idRel == 'eCruzadoCom' || x.idRel == 'eComplementarDe' || x.idRel == 'eSuplementoDe' || x.idRel == 'eSuplementoPara')
        resp.data.processosRelacionados = filterRel
      }
      res.render('classe', { classe: resp.data })
    })
    .catch(err => {
      res.render('error', { error:err })
    })
});

module.exports = router;
