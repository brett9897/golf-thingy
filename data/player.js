import _ from 'lodash';
import pg from 'pg';

export function getAll(callback) {
    var client = new pg.Client(process.env.DATABASE_URL);
    client.connect();
    client.query('Select * FROM Player;', function (err, result) {
        if (err) {
            console.log(err);
            callback(err);
        }
        else {
            console.log(result.rows);
            callback(err, result.rows);
        }
    });
}

export function get(id, callback) {
    var client = new pg.Client(process.env.DATABASE_URL);
    client.connect();
    client.query(`SELECT * FROM PLAYER WHERE PlayerId = ${id};`, function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        }
        else {
            console.log(result.rows);
            callback(err, result.rows);
        }
    });
}

export function update(id, data) {
    if(data.name) {
        const theOne = _.find(sampleData, {id: id});
        theOne.name = data.name;
    }
}

export function add(user, callback) {
    var client = new pg.Client(process.env.DATABASE_URL);
    client.connect();
    client.query(`INSERT INTO PLAYER (email, password, address) VALUES ('${user.email}', '${user.password}', '${user.address}') RETURNING * ;`, function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        }
        else {
            console.log(result.rows);
            callback(err, result.rows);
        }
    });
}

export function remove(id) {
    sampleData = _.filter(sampleData, {id: !id});
}

export function getFriends(id, callback){
    var client = new pg.Client(process.env.DATABASE_URL);
    console.log(id);
    client.connect();
    client.query(`SELECT playerid, email FROM Player where playerId in ( SELECT playertwoid from friends where playeroneid = ${id});`, function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        }
        else {
            console.log(result.rows);
            callback(err, result.rows);
        }
    });
}

export function findUser(email, callback){
    var client = new pg.Client(process.env.DATABASE_URL);
    client.connect();
    client.query(`SELECT playerid, email FROM Player where email like '%${email}%';`, function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        }
        else {
            console.log(result.rows);
            callback(err, result.rows);
        }
    });
}