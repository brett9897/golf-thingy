import sample from './sample';
import player from './player';

export default index;

function index(app, options) {
  sample(app, options);
  player(app, options);
};