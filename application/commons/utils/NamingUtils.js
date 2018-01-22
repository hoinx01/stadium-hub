const namingConverter = require('object-case-converter');
const ObjectId = require('mongodb').ObjectID;

var NamingUtils = {
    snakeToCamel : function(obj){
        return namingConverter.camelCase(obj)
    },
    camelToSnake : function(obj){
        return namingConverter.snakeCase(obj);;
    },
    standadizeForMongoStore : function(entity){
        let e = camelToSnake(entity);
        e._id = new ObjectId(e.id);
        if(e.id) delete e.id;
        return e;
    },
    standadizeForMongoOutput : function(entity){
        let output = snakeToCamel(entity);
        if(output._id){
            output.id = output._id.str;
            delete output._id;
        }
        return output;
    }
}

module.exports.NamingUtils = NamingUtils;