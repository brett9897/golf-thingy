import home from './home';
import api from './api/index';

function index(app, options) {
    home(app, options);
    api(app, options);
}

export default index;