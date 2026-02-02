const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const visitorSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: String,
        required: true
    },
    company:{
        type: String,
        required: true
    },
    idType:{
        type: String,
        required: true
    },
    idNumber:{
        type: String,
        required: true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    photoUrl:{ 
        type: String, 
        trim: true 
    },

},
{
    timestamps: true
})

module.exports = mongoose.model('Visitor', visitorSchema);