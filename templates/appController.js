var mongoose = require('mongoose')
  , async = require('async')
  , ${model.camelname} = mongoose.model('${model.camelname}')
  , _ = require('underscore')
  		${--repeat4:model:model[@name="user"]:
	  		${--repeat3:model:model[@represents-user="true"]:
	          	, ${model.camelname} = mongoose.model('${model.camelname}')
	        --3}
        --4}
 
exports.create = function (req, res) {
  var ${model.name} = new ${model.camelname}(req.body)

  ${model.name}.createdby = req.user
  ${model.name}.created = new Date()

  ${model.name}.save()
  res.jsonp(${model.name})
}
 
exports.show = function(req, res){
  res.jsonp(req.${model.name});
}
 
exports.${model.name} = function(req, res, next, id){
  var ${model.camelname} = mongoose.model('${model.camelname}')
  ${model.camelname}.load(id, function (err, ${model.name}) {
    if (err) return next(err)
    if (!${model.name}) return next(new Error('Failed to load ${model.name} ' + id))
    req.${model.name} = ${model.name}
    next()
  })
}
 
exports.all = function(req, res){
 ${model.camelname}.find().populate('${populate-list}').exec(function(err, ${model.name}s) {
   if (err) {
   		console.log(err);
      res.render('error', {status: 500});
   } else {      
      res.jsonp(${model.name}s);
   }
 });
}
 
exports.queryCount = function(req, res){
 ${model.camelname}.find(req.query.q).count().exec(function(err, count) {
   if (err) {
   		console.log(err);
      res.render('error', {status: 500});
   } else {    
      res.jsonp(count);
   }
 });
}
 
exports.query = function(req, res){

 var responseObj = {};

  if ( req.query.q2 ) {
    req.query.q2 = eval('('+req.query.q2+')');
    req.query.q = {};

    for ( f in req.query.q2 ) {
      if ( req.query.q2[f].regex ) {
        if ( !req.query.q[f] ) {
          req.query.q[f] = {};
        }
        req.query.q[f].$regex = req.query.q2[f].regex;
      }
      if ( req.query.q2[f].options ) {
        if ( !req.query.q[f] ) {
          req.query.q[f] = {};
        }
        req.query.q[f].$options = req.query.q2[f].options;
      }
    }
  ${--repeat1:field:field[@type='ref']:
    if ( req.query.q2.${field.name} ) {
      req.query.q.${field.name} = req.query.q2.${field.name};
    }--1}
  }

  var sort_field = req.query.sort_field;
  var sort_order = req.query.sort_order;

  var sort_params = {};
  if ( sort_field ) {
  	sort_params[sort_field] = sort_order;
  } else {
  	sort_params = { $natural: -1 };
  }

 var runMainQuery = function() {
 
   if ( !req.query.q ) {
     req.query.q = {};
   }
   if ( !req.query.page ) {
     req.query.page = 1;
   }
   if ( !req.query.page_limit ) {
     req.query.page_limit = 100;
   }

   ${model.camelname}.find(req.query.q)
        .skip((req.query.page-1)*req.query.page_limit)
        .limit(req.query.page_limit)
        .sort(sort_params)
        .populate('${populate-list}')
        .exec(function(err, ${model.name}s) {
     if (err) {
		console.log(err);
        res.render('error', {status: 500});
     } else {      
          responseObj.data = ${model.name}s;
          res.jsonp(responseObj);
     }
   });
 }
 
 console.log("================== req.query ====================");
 console.log(req.query);
 console.log("================== req.query ====================");

 if ( req.query.page == 1 ) {
   ${model.camelname}.find(req.query.q).count().exec(function(err, count) {
     if (err) {
   		console.log(err);
        res.render('error', {status: 500});
     } else {
        responseObj.count = count;
        runMainQuery();
     }
   });
 } else {
    runMainQuery();
 }  
}

exports.update = function(req, res){
  var ${model.name} = req.${model.name}
  

  ${--repeat2:field:field[@type="ref"]:
	  if ( req.body.${field.name} ) {
	    req.body.${field.name} = req.body.${field.name}._id ? req.body.${field.name}._id : req.body.${field.name};
	  }--2}
          
  ${model.name} = _.extend(${model.name}, req.body)

  ${model.name}.modifiedby = req.user
  ${model.name}.modified = new Date()
  
  ${model.name}.save(function(err) {
    res.jsonp(${model.name})
  })
}
 
exports.destroy = function(req, res){
  var ${model.name} = req.${model.name}
  ${model.name}.remove(function(err){
    if (err) {
   		console.log(err);
      res.render('error', {status: 500});
    }  else {
      res.jsonp(1);
    }
  })
}