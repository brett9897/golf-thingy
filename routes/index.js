/**
 * Created by Brett on 6/14/2016.
 */
import express from "express";
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home' });
});

export default router;