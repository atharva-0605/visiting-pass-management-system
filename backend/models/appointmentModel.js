const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    visitor:{
        type: Schema.Types.ObjectId,
        ref: 'Visitor',
        required: true
    },
    host:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    purpose:{
        type: String,
        required: true
    },
    dateTime:{
        type: Date,
        required: true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notes:{ 
        type: String, 
        trim: true 
    },
    status:{
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled'],
        default: 'pending',
        required: true
    },
},
{timestamps: true}
)

module.exports = mongoose.model('Appointment', appointmentSchema)