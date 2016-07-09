import _ from 'lodash';
var pg = require('pg');

export function getAll() {

    var client = new pg.Client(process.env.DATABASE_URL);

    client.connect();

    client.query('Select * FROM Player;', function (err, result) {

        if (err) {
            return err;
        }
        else {
            console.log(result.rows);
            return result.rows;
        }
    });
}

export function get(id) {
    return _.find(sampleData, {id: id});
}

export function update(id, data) {
    if(data.name) {
        const theOne = _.find(sampleData, {id: id});
        theOne.name = data.name;
    }
}

export function add(data) {
    sampleData.push(
        {
            id: _.last(sampleData).id + 1,
            name: data.name
        }
    );
}

export function remove(id) {
    sampleData = _.filter(sampleData, {id: !id});
}