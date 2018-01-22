var MongoStore = require('../../../base/dal/mongo/MongoStore');
var BaseDao = require('../../../base/dal/mongo/BaseDao');

class PlaceDao extends BaseDao{
    constructor(){
        super(new MongoStore({host:"mongodb://localhost:27017", dbName:"stadium-hub-main", collectionName: "places"}));
    }
    async getByUser(userId){
        try{
            let places = await this.query({userId:userId}, {});
            return Promise.resolve(places);
        }
        catch(exception){
            return Promise.reject(exception);
        }
            
    }
}

var placeDao = new PlaceDao();
exports.placeDao = placeDao;