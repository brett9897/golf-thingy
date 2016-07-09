import _ from 'lodash';

let sampleData = [
    {id: 1, name: 'sample 1'},
    {id: 2, name: 'sample 2'},
    {id: 3, name: 'sample 3'}
];

export function getAll() {
    return sampleData;
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