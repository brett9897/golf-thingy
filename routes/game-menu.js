import express from "express";
const router = express.Router();
var pg =require('pg');
/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('gamemenu', { title: 'Game Menu' });
});

router.get('/data', function(req, res, next){
    //check auth
    var client = new pg.Client(process.env.DATABASE_URL);
    client.connect();
    const userId = req.param.userId;

    /*not sure whats needed here yet
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
    */
});



router.post('/gameDetails', function (req, res, next) {
    var client = new pg.Client(process.env.DATABASE_URL);
    client.connect();
    
    const sql = `INSERT INTO game columns( groupId, gameTypeId, dateCreated)
     Values (${req.body.groupId}, ${gameTypeId}, currentDateTime()`;

     client.query(sql, function(err, result) {

     if (err) {
     console.error(err); result.send("Error " + err); }
     else{
     const userData = result.rows[0];

     res.send({
     //results: menuData
     } ); }
     });

});

export default router;