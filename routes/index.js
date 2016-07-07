/**
 * Created by Brett on 6/14/2016.
 */
import express from "express";
const router = express.Router();
var pg =require('pg');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home' });
});

router.post('/login', function(req, res, next){
    console.log(process.env.DATABASE_URL);
    var client = new pg.Client(process.env.DATABASE_URL);
    client.connect();
    const user = req.body.userName;
    //need encrypt
    const pw = req.body.pw;

    client.query(`SELECT * FROM users where username = ${user} and password = ${pw}`, function(err, result) {
        
        if (err) {
            console.error(err); result.send("Error " + err); }
        else{
            //set cookie
            res.send({results: result.rows} ); }
    });
});

export default router;