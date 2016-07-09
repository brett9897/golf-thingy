import * as playerDao from '../data/player';

export function getAll(req, res) {
    
    return res.status(200).json(playerDao.getAll());
}

export function get(req, res) {
    console.log(req.params);
    return res.status(200).json(playerDao.get(Number(req.params.id)));
}

export function update(req, res) {
    playerDao.update(Number(req.params.id), req.body);
    return res.status(200).json({message: 'updated'});
}

export function add(req, res) {
    playerDao.add(req.body);
    return res.status(200).json({message: 'added'});
}

export function remove(req, res) {
    playerDao.remove(Number(req.params.id));
    return res.status(200).json({message: 'deleted'});
}