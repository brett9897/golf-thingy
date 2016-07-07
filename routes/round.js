import express from "express";
const router = express.Router();
var pg =require('pg');
/* GET home page. */


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

router.put('/createRound', function (req, res, next) {
    var client = new pg.Client(process.env.DATABASE_URL);
    client.connect();
    const userId = req.param.userId;
    const sql = `INSERT INTO Round (RoundName, CourseId, GroupId, GameId, DateCreated) 
    Values (${req.body.roundName}, ${req.body.courseId}, ${req.body.groupId}, ${req.body.gameId}, currentLocalDateTime`


    client.query(sql, function(err, result) {

        if (err) {
            console.error(err); result.send("Error " + err); }
        else{
            
            req.body.userIds.forEach(id, function(id){
                clilent.query(`INSERT INTO UserRounds (UserId, RoundId, GroupId
                            VALUES (${id}, ${result.roundId}, ${reg.body.groupId})`)
            });
            
            res.send({
                results: result.roundId
            } ); }
    });
});

export default router;