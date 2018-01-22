var Controller = require('../base/controller/BaseController').Controller;
var Action = require('../base/controller/BaseController').Action;
var ActionResult = require('../base/controller/BaseController').ActionResult;
var md5 = require('md5');
var ObjectID = require('mongodb').ObjectID

var mobileSessionMap = require('../commons/tempdata/Authentication').mobileSessionMap;
var userSessionMap = require('../commons/tempdata/Authentication').userSessionMap;

var userController = new Controller("/api/users");

var userDao = require('../dal/mongo/dao/UserDao').userDao;

userController.addAction(new Action(
    'post',
    '/register',
    async function(req, res){
        let model = req.body;

        let user = {};
        user._id = new ObjectID();
        user.firstName = model.firstName;
        user.lastName = model.lastName;
        user.phoneNumber = model.phoneNumber;
        user.createdAt = new Date();
        user.modifiedAt = new Date();
        user.auths = [];

        let basicAuth = {};
        basicAuth.mode = 'basic';
        basicAuth.infor = {userName:model.auth.infor.user_name, password: md5(model.auth.infor.password)};
        user.auths.push(basicAuth);

        try{
            let result = await userDao.insertOne(user);
            return new ActionResult(result, 200).cal();
        }
        catch(exception){
            return new ActionResult(exception, 500).cal();
        }
    }
));

userController.addAction(new Action(
    "get",
    "/", 
    async function(req, res){
        console.log(req.principal);
        let userId = req.principal.user._id;
        let user = await userDao.getById(new ObjectID(userId));
        if(user)
            return new ActionResult(user, 200).cal();    
        return new ActionResult({message:'Không tìm thấy đối tượng'}, 404).cal();    
    }
));

userController.addAction(new Action(
    'get',
    "/getByUserName",
    async function(req, res){
        let userName = req.query.user_name;
        let users = await userDao.query({userName:userName}, {limit:1});
        if(users.length == 0)
            return new ActionResult({message:'Không tìm thấy đối tượng'}, 404).cal();  
        return new ActionResult(users[0], 200).cal();  
    }
));

userController.addAction(new Action(
    'post',
    '/login',
    async function(req, res){
        let model = req.body;

        let loginMode = model.mode;
        if(loginMode == 'basic')
        
        try{
            console.log(model);
            let userName = model.infor.userName;
            let password = model.infor.password;
            let users = await userDao.getByUserName(userName);
            if(!users || users.length == 0)
                return new ActionResult({error:['Thông tin đăng nhập không chính xác']}, 403).cal();
            
            let user = users[0];
            // if(user.password != password)
            //     return new ActionResult({error:['Thông tin đăng nhập không chính xác']}, 403).cal();
            
            let sessionId = userSessionMap[userName];
            if(!sessionId){
                sessionId = md5(userName + user.password + new Date().toISOString());
                mobileSessionMap[sessionId] = {app:req.principal.app, user:user};
                userSessionMap[userName] = sessionId;
            }           
            
            let result = Object.assign(user);
            delete result.password;
            result.session_id = sessionId;
            return new ActionResult(result, 200).cal();
        }
        catch(exception){
            console.log(exception);
            return new ActionResult(exception, 500).cal();
        }
        
    }
));

userController.addAction(new Action(
    "put",
    "/:id",
    async function(req, res){        
        let model = req.body;
        let id = req.params.id;
        let user = await userDao.getById(id);
        user.modifiedAt = new Date();
        try{
            let updateResult = await userDao.update(user);
            return new ActionResult(user, 200).cal();
        }
        catch(exception){
            return new ActionResult(user, 500).cal();
        }       
    }
));

module.exports = userController;