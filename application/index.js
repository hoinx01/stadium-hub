var express = require('express');

var bodyParser = require('body-parser');
var convertBody = require('./commons/middlewares/ConvertBody');
var authentication = require('./commons/middlewares/Authenticator');

var app = express();

app.use(bodyParser.json());
app.use(convertBody);
app.use(authentication);

var userController = require('./controller/UserController');
var placeController = require('./controller/PlaceController');
var controllers = [
    userController,
    placeController
]

controllers.forEach((controller) => {
    controller.actions.forEach((action) => {
        if(action.method == 'get'){
            
            app.get(action.path, async (req, res) => {
                await action.handle(req, res);
            })
        };
        if(action.method == 'put'){           
            app.put(action.path, async (req, res) => {
                action.handle(req, res);
            })
        };
        if(action.method == 'post'){           
            app.post(action.path, async (req, res) => {
                action.handle(req, res);
            })
        }
    })
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));