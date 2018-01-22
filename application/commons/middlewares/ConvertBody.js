var namingUtils = require('../utils/NamingUtils').NamingUtils;
function convertBody(req, res, next){
    req.body = namingUtils.snakeToCamel(req.body);
    next(); 
}

module.exports = convertBody;