const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passSchema = new Schema({
    visitor:{
        type: Schema.Types.ObjectId,
        ref: 'Visitor',
        required: true
    },
    host:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    appointment:{
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
    },
    passNumber:{
        type: String,
        required: true,
        unique: true
    },
    qrData:{
        type: String,
        required: true
    },
    qrImage: {
      type: String, 
    },
    validFrom:{
        type: Date,
        required: true
    },
    validTo:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        enum: ['active', 'expired', 'checkedOut', 'cancelled'],
        default: 'active',
        required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
},
{ timestamps: true}
)

module.exports = mongoose.model('Pass', passSchema);