import express from "express";
const router = express.Router();

function home(app, options) {
    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Home' });
    });

    app.use('/', router);
}

export default home;