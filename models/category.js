var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customerSchema = new Schema({
    id: { type: Number, default: "", required:false},
    name: { type: String, default: "", required:true},
    image: { type: String, default: "", required:false}, 
    image_name: { type: String, default: "", required:false}, 
    status :{type :Number,default: 0, required:false},
    createdAt: { type: Date, default: "", required:false},
    updatedAt: { type: Date, default: new Date(), required:false},
    lastModifiedAt: { type: Date, default: new Date(), required:false},
    LastModifiedBy: { type: String, default: "", required:false},
}, 
{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
}
)

module.exports = mongoose.model('Category', customerSchema);