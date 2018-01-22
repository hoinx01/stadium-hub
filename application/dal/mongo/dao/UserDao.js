var MongoStore = require('../../../base/dal/mongo/MongoStore');
var BaseDao = require('../../../base/dal/mongo/BaseDao');

class UserDao extends BaseDao{
    constructor(){
        super(new MongoStore({host:"mongodb://localhost:27017", dbName:"stadium-hub-main", collectionName: "users"}));
    }
    async getByUserName(userName){
        try{
            let query = 
            {
                'auths':{
                    '$elemMatch':{
                        'mode':'basic',
                        'infor.userName':userName
                    }
                }
            };
            console.log(query);
            let users = await this.query(query);
            return Promise.resolve(users);
        }
        catch(exception){
            return Promise.reject(exception);
        }
            
    }
}

var userDao = new UserDao();
exports.userDao = userDao;
