import express from "express";
const router = express.Router();
var pg =require('pg');
/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('groupmenu', { title: 'Game Menu' });
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

router.put('/createGroup', function (req, res, next) {

    var client = new pg.Client(process.env.DATABASE_URL);
    client.connect();

    const userIds = req.body.userIds;

    //I this will become some kind of etl or aggregate ie. rounds played, top location,
     client.query(`INSERT INTO Group (createDate) VALUES (currentLocalDateTime)`, function(err, result) {

     if (err) {
        console.error(err); result.send("Error " + err); }
     else{
         userIds.forEach(id, function(id){
             client.query(`INSERT INTO UserGroup (UserId, GroupId) VALUES (${result.groupId}, ${id})`)
         });

        res.send({
            results: results.groupId
         });}
     });
});

export default router;