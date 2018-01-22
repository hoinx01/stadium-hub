class BaseDao{
    constructor(mongoStore){
        this.store = mongoStore;            
    };

    async insertOne(entity){
        try{
            let insertResult = await this.store.getCollection().insertOne(entity);
            return Promise.resolve(insertResult.ops[0]); 
        }
        catch(exception){
            return Promise.reject(exception);
        }            
    }

    async getById(_id){        
        try{
            let findResult = await this.store.getCollection().findOne({"_id": _id});
            return Promise.resolve(findResult);
            
        }
        catch(ex){
            return Promise.reject(ex);
        }
        
    }

    async update(entity){
        try{
            let updateResult = await this.store.getCollection().update({"_id": entity._id}, entity);
            return Promise.resolve(updateResult);
        }
        catch(exception){
            return Promise.reject(exception);
        }      
    }

    async query(criteria, options){
        try{
            let findResult = await this.store.getCollection().find(criteria, options);
            let result = await findResult.toArray();                            
            return Promise.resolve(result);           
        }
        catch(exception){
            return Promise.reject(exception);
        }
    }

    async findOne(criteria, options){
        try{
            let findResult = await this.store.getCollection().find(criteria, {limit: 1});
            let result = await findResult.toArray();   
            if(result.length == 0)                         
                return Promise.resolve(null);         
            return result[0];  
        }
        catch(exception){
            return Promise.reject(exception);
        }
    }
}

module.exports = BaseDao;