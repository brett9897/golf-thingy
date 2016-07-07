import express from 'express';
const router = express.Router();
var pg = require('pg');
/* GET users listing. */
router.get('/', function(req, res, next) {
  const outputString = 'some stuff';
  res.send(`respond with a resource and ${outputString}`);
});

router.get('/getAllUsers', function(req, res, next){

    var client = new pg.Client(process.env.DATABASE_URL);
    client.connect();


      client.query('SELECT * FROM users', function(err, result) {

        if (err)
        { console.error(err); result.send("Error " + err); }
        else
        { res.send({results: result.rows} ); }
      });
    });

export default router;
