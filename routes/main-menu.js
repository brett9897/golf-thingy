import express from "express";
const router = express.Router();
var pg =require('pg');
/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('mainmenu', { title: 'Main Menu' });
});

router.get('/data', function(req, res, next){
    //check auth
    var client = new pg.Client(process.env.DATABASE_URL);
    client.connect();
    const userId = req.param.userId;


    client.query(`SELECT * FROM users where id = ${userId}`, function(err, result) {

        if (err) {
            console.error(err); result.send("Error " + err); }
        else{
            const userData = result.rows[0];
            //const recentRounds = getRecentRounds(userId);
            //const weather = getWeather(userData.location)
            //const menuData = { recentRounds : recentRounds, weather : weather };
            res.send({
                //results: menuData
            } ); }
    });
});

export default router;