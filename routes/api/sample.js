import express from 'express';
import * as controller from '../../controllers/sample'

export default sample;

function sample(app, options) {
    const router = express.Router();

    router
        .get('/', controller.get);

    app.use('/sample', router);
}