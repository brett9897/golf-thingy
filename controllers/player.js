import * as playerDao from '../data/player';

export function getAll(req, res) {
    playerDao.getAll(function(err, data) {
        return res.status(200).json(data);
    });
}

export function get(req, res) {
    playerDao.get(req.params.id, function (err, data) {
    return res.status(200).json(data);

    });
}

export function update(req, res) {
    playerDao.update(Number(req.params.id), req.body);
    return res.status(200).json({message: 'updated'});
}

export function add(req, res) {
    const newUser = req.body.data;
    playerDao.add(newUser, function (err, data) {
        const success = data;
        return res.status(200).json({response: success});
    });
}

export function remove(req, res) {
    playerDao.remove(Number(req.params.id));
    return res.status(200).json({message: 'deleted'});
}

export function getFriends(req, res){
    playerDao.getFriends(req.params.id, function (err, data) {
        return res.status(200).json(data);
    });
}

export function findUser(req, res){
    playerDao.findUser(req.params.email, function (err, data) {
        return res.status(200).json(data);
    })
}