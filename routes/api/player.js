import express from 'express';
import * as controller from '../../controllers/player'

export default sample;

function sample(app, options) {
    const router = express.Router();

    router
        .get('/', controller.getAll)
        .get('/:id', controller.get)
        .put('/:id', controller.update)
        .post('/', controller.add)
        .delete('/:id', controller.remove)
    ;

    app.use('/api/player', router);
}