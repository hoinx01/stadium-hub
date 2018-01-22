const MongoClient = require('mongodb').MongoClient;

var clients = [];

class MongoStore{
    constructor(storeConfig){
        this.host = storeConfig.host;
        this.dbName = storeConfig.dbName;
        this.collectionName = storeConfig.collectionName;
        try{
            this.validate();
        }
        catch(exception){
            console.log("error on validate storeConfig");
            console.log(storeConfig);
            throw exception;
        }
    }
    async validate(){
        let client;
        if(!clients.map(m => {
            return m.host;
        }).includes(this.host)){
            client = await MongoClient.connect(this.host);  
            clients.push({host:this.host, instance:client});
        }
        else{
            clients.forEach( f => {
                if(f.host === this.host)
                    client = f;
            })
        }
               
        let db = client.db(this.dbName);   
        let collection = db.collection(this.collectionName);
        if(!collection)
            db.createCollection(this.collectionName); 
        this.client = client;
        
    }
    getCollection(){
        let db = this.client.db(this.dbName);   
        let collection = db.collection(this.collectionName);
        return collection;
    }
}

module.exports = MongoStore;




