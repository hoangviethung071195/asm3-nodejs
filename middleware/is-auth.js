const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};

module.exports.isEmployee = (req, res, next) => {
  const authHeader = req.get('Authorization');
  const token = authHeader.split(' ')[1];
  const decodedToken = jwt.verify(token, 'somesupersecretsecret');
  if (+decodedToken.role > 2) {
    const error = new Error('Forbidden.');
    error.statusCode = 403;
    throw error;
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  const authHeader = req.get('Authorization');
  const token = authHeader.split(' ')[1];
  const decodedToken = jwt.verify(token, 'somesupersecretsecret');
  console.log('+decodedToken.role ', +decodedToken.role);
  console.log('decodedToken.role ', decodedToken.role);
  if (+decodedToken.role > 1) {
    const error = new Error('Forbidden.');
    error.statusCode = 403;
    throw error;
  }
  next();
};
