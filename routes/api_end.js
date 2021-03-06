var express = require('express');
var router = express.Router();
const {login,register,reset,forgot,login_check} = require('../controllers/api')

//login route : check if the user has authorized token, otherwise redirect to login url
router.post('/login',login_check,login);
router.post('/register', register);
router.post('/reset', reset);
router.all('/forgot', forgot);
module.exports = router;