
var NamingUtils = require('../../commons/utils/NamingUtils').NamingUtils;
class Controller{
    constructor(path){
        this.path = path;
        this.actions = [];
    }
    addAction(action){
        action.path = this.path + action.path;
        this.actions.push(action);
    }
}
class Action{
    constructor(method, path, handler){
        this.method = method;
        this.path = path;
        this.handler = handler;
    }
    async handle(req, res){
        res.type("application/json");
        try{
            let result = await this.handler(req, res);
            result.body = NamingUtils.camelToSnake(result.body);
            res.status(result.status).send(result.body);
        }
        catch(error){
            res.status(error.status).send(error.body);
        }
        
    }
}

class ActionResult{
    constructor(body, status){
        this.body = body;
        this.status = status;
    }
    cal(){
        let statusText = this.status.toString();
        if(statusText.length == 3 && statusText.startsWith('2'))
            return new Promise((resolve, reject) => {
                resolve({body:this.body, status: this.status});
            })
        else
            return new Promise((resolve, reject) => {
                reject({body:this.body, status: this.status});
            })
    }
}
module.exports.ActionResult = ActionResult;
module.exports.Action = Action;
module.exports.Controller = Controller;