var GoogleApiCaller = require('../../base/dal/google/GoogleApiCaller');

class MapApiCaller extends GoogleApiCaller{
    constructor(){
        super("https://maps.googleapis.com", "AIzaSyCiBvteKvIlhiwUEdzQaHCHYHkJqh--Y2g");
    }
    async getDistances(sourceCoordinate, destinations){
        let joinedDestination = destinations.join('|');
        let query = {origins:sourceCoordinate, destinations: joinedDestination, mode:'driving'};
        try{
            let data = await super.get("/maps/api/distancematrix/json",{}, query, {});
            return Promise.resolve(data);
        }
        catch(ex){
            return Promise.reject(ex);
        }
    }
}

var mapApiCaller = new MapApiCaller();

exports.mapApiCaller = mapApiCaller;