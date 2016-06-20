import express from 'express';
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const outputString = 'some stuff';
  res.send(`respond with a resource and ${outputString}`);
});

export default router;
