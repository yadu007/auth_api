
var config = require('../config/globals');
var bcrypt = require('bcrypt')
var db = config.mysql.getClient();
var redis = config.redis;
var users = db.import('../models/users');
var jwt = require('jsonwebtoken');

//login function : check if user exists
async function login({
  email,
  password
}) {
  let user = await users.findOne({
    where: {
      email: email
    }
  });

  if (bcrypt.compareSync(password, user.password)) {

    let tok = await get_token_for_auth(email)
    return {
      found: true,
      id: tok
    };
  }
  return {
    found: false
  };
}

//register new user
async function register(body) {
  var hash = bcrypt.hashSync(body.password, 10);
  let user = {
    email: body.email,
    password: hash,
    name: body.name,
    createdAt: new Date()
  };
  return users.create(user);


}
//check if user already signedin using redis
async function login_check(email, token, handler) {
  redis.get(email, (err, reply) => {

    if (reply == token) {

      return handler(true)
    } else {
      return handler(false)
    }
  });
}

//get access token for logged in users.
async function get_token_for_auth(email, new_pass) {
  var token = jwt.sign({
    email: email,
    pass: new_pass
  }, 'password-test');
  redis.set(email, token)
  return token
}

//reset password and delete user access token
function reset(email, password, handler) {
  redis.del(email)
  users.update({
    password: bcrypt.hashSync(password, 10)
  }, {
    where: {
      email: email
    }
  }).then(function () {
    handler()
  })
}

function logout(email) {
  try {
    redis.del(email)
    return true
  } catch (e) {
    return false
  }


}
// create link to reset password, the link can be sent to email for secure authentication.
function create_token_forgot(email, new_pass, handler) {
  jwt.sign({
    email: email,
    new_pass: new_pass
  }, 'password-test', (err, token) => {
    if (err) handler(false)
    else {
      return handler("http:/link-to-reset/?token=" + token)
    }
  });
}

//verifying the jwt token to reset user password
function verify_forgot(token, handler) {
  jwt.verify(token, 'password-test', (err, val) => {
    if (err) handler(false)
    else {
      users.update({
        password: bcrypt.hashSync(val.new_pass, 10)
      }, {
        where: {
          email: val.email
        }
      }).then(function () {
        handler(true)
      })
    }

  })

}

module.exports = {
  login,
  register,
  reset,
  login_check,
  create_token_forgot,
  verify_forgot
}