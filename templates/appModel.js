var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema;
 
var ${model.camelname}Schema = new Schema({
${--repeat1:field:field:
  ${field.name}: {type : ${field.type}},--1}
  customer: {type: Schema.ObjectId, ref: 'Customer'},
  created: {type : Date},
  createdby: {type: Schema.ObjectId, ref: 'User'},
  modified: {type : Date},
  modifiedby: {type: Schema.ObjectId, ref: 'User'}
});
 
 ${model.camelname}Schema.statics = {
   load: function (id, cb) {
     this.findOne({ _id : id }).populate('${populate-list}').exec(cb);
   }
 };
 
mongoose.model('${model.camelname}', ${model.camelname}Schema);