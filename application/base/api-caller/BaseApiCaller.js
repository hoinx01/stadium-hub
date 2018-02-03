var Client = require('node-rest-client').Client;
var util = require('util');

class BaseApiCaller{
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }
    async get(path, pathVariables, query, headers){
        let client = new Client();
        let url = this.baseUrl + path;
        if(util.isArray(pathVariables) && pathVariables.length > 0)
            url = util.format(url, pathVariables);

        var args = {
            path: pathVariables,
            headers: headers,
            parameters: query
        };

        let emitter = {};

        return new Promise((resolve, reject)=> {
            client.get(url, args, function(data, response){
                if(response.statusCode >=200 && response.statusCode < 300)
                    resolve(data);
                else
                    reject(data);
            })
        })

    }
}

module.exports = BaseApiCaller;