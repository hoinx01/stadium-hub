var mobileSessionMap = require('../tempdata/Authentication').mobileSessionMap;
var md5 = require('md5');

var apps = [
    {
        name:'minh-android'
    }
];

var secretKeyAppMap = {};
apps.forEach(function(app){
    let secretKey = md5(app.name);
    secretKeyAppMap[secretKey] = app;
})

console.log(secretKeyAppMap);

function authenticate(req, res, next){
    if(
        req.path == '/api/users/login' 
        || req.path == '/api/users/register'
        || req.path == '/api/users/getByUserName'
    )
    {
        let secretKey = req.get('X-StadiumHub-SecretKey');
        if(!secretKey)
            res.status(403).send({error: ['Cần truyền thêm header X-StadiumHub-SecretKey']});
        let app = secretKeyAppMap[secretKey];
        if(!app){
            res.status(403).send({error: ['SecretKey không hợp lệ']});
            return;
        }
            
        
        req.principal = {app:app};
    }       
    else{
        let sessionId = req.get("X-StadiumHub-SessionId");
        if(!sessionId){
            res.status(403).send({error: ['Cần truyền thêm header X-StadiumHub-SessionId']});
        }

        let principal = mobileSessionMap[sessionId];
        if(!principal)
            res.status(403).send({error:'an authentication require for this request'});
        
        req.principal = principal;
        
    }  
    next();
}
module.exports = authenticate;