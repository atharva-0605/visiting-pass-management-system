const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkLogModelSchema = new Schema({
    pass:{
        type: Schema.Types.ObjectId,
        ref: 'Pass',
        required: true
    },
    action:{
        type: String,
        enum: ['IN', 'OUT'],
        required: true
    },
    securityUser:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    gate:{
        type: String,
        trim: true,
    },
},
{ timestamps:true}
)

module.exports = mongoose.model('CheckLog', checkLogModelSchema)