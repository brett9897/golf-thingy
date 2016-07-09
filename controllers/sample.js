import * as sampleDao from '../data/sample';

export function getAll(req, res) {
    return res.status(200).json(sampleDao.getAll());
}

export function get(req, res) {
    console.log(req.params);
    return res.status(200).json(sampleDao.get(Number(req.params.id)));
}

export function update(req, res) {
    sampleDao.update(Number(req.params.id), req.body);
    return res.status(200).json({message: 'updated'});
}

export function add(req, res) {
    sampleDao.add(req.body);
    return res.status(200).json({message: 'added'});
}

export function remove(req, res) {
    sampleDao.remove(Number(req.params.id));
    return res.status(200).json({message: 'deleted'});
}