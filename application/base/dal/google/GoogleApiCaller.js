let BaseApiCaller = require('../../api-caller/BaseApiCaller');

class GoogleApiCaller extends BaseApiCaller{
    constructor(baseUrl, token){
        super(baseUrl);
        this.token = token;
    }
    setHeader(headers){
        return headers;
    }
    setQuery(query){
        query.token = this.token;
        return query;
    }
    async get(path, pathVariables, query, headers){
        headers = this.setHeader(headers);
        query = this.setQuery(query);
        try{
            let data = await super.get(path, pathVariables, query, headers);
            return Promise.resolve(data);
        }
        catch(ex){
            return Promise.reject(ex);
        }
    }
}

module.exports = GoogleApiCaller;