var Controller = require('../base/controller/BaseController').Controller;
var Action = require('../base/controller/BaseController').Action;
var ActionResult = require('../base/controller/BaseController').ActionResult;
var ObjectID = require('mongodb').ObjectID;

var placeDao = require('../dal/mongo/dao/PlaceDao').placeDao;

var placeController = new Controller("/api/places");

placeController.addAction(new Action(
    'post',
    '/',
    async function(req, res){
        let user = req.principal.user;
        let model = req.body;

        let place = Object.assign({}, model);
        place._id = new ObjectID();
        place.userId = user._id;
        place.status = 'active';
        place.createdAt = new Date();
        place.modifiedAt = new Date();
        try{
            let result = await placeDao.insertOne(place);
            return new ActionResult(result, 200).cal();
        }
        catch(exception){
            console.log(exception)
            return new ActionResult(exception, 500).cal();
        }
    }
));

placeController.addAction(new Action(
    'get',
    '/:id',
    async function(req, res){
        let user = req.principal.user;
        let id = req.params.id;

        try{
            let place = await placeDao.findOne({userId:user._id, _id:new ObjectID(id)});
            if(!place)
                return new ActionResult({error:["Không tìm thấy địa điểm thỏa mãn"]}, 404).cal();

            return new ActionResult(place, 200).cal();
        }
        catch(exception){
            console.log(exception)
            return new ActionResult(exception, 500).cal();
        }
    }
));

placeController.addAction(new Action(
    'put',
    '/:id',
    async function(req, res){
        let user = req.principal.user;
        let id = req.params.id;

        let body = req.body;

        let model = Object.assign(body);

        try{
            let place = await placeDao.findOne({userId:user._id, _id:new ObjectID(id)});
            if(!place)
                return new ActionResult({error:["Không tìm thấy địa điểm thỏa mãn"]}, 404).cal();

            place.name = model.name;
            place.modifiedAt = new Date();
            let updateResult = await placeDao.update(place);    
            return new ActionResult(place, 200).cal();
        }
        catch(exception){
            return new ActionResult({error: ["Có lỗi xảy ra"]}, 500).cal();
        }
    }
));

placeController.addAction(new Action(
    'delete',
    '/:id',
    async function(req, res){
        let user = req.principal.user;
        let id = req.params.id;

        let body = req.body;

        let model = Object.assign(body);

        try{
            let place = await placeDao.findOne({userId:user._id, _id:new ObjectID(id)});
            if(!place)
                return new ActionResult({error:["Không tìm thấy địa điểm thỏa mãn"]}, 404).cal();

            place.status = 'deleted';
            place.modifiedAt = new Date();
            let updateResult = await placeDao.update(place);    
            return new ActionResult(place, 200).cal();
        }
        catch(exception){
            return new ActionResult({error: ["Có lỗi xảy ra"]}, 500).cal();
        }
    }
));

placeController.addAction(new Action(
    'get',
    '/',
    async function(req, res){
        let user = req.principal.user;

        try{
            let places = await placeDao.query({userId:user._id, status: 'active'}); 
            return new ActionResult({places:places}, 200).cal();
        }
        catch(exception){
            return new ActionResult({error: ["Có lỗi xảy ra"]}, 500).cal();
        }
    }
));

module.exports = placeController;