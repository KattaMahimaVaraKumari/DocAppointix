import mongoose, { mongo } from "mongoose"

const appointmentSchema = new mongoose.Schema({
    userId : {type:String, required:true},
    docId: {type:String, required:true},
    slotDate : {type:String, required:true},
    slotTime : {type:String, required: true},
    userData : {type:Object, required:true},
    docData : {type:Object, required : true},
    amount: {type:Number, required: true},
    date: {type:Number, required:true},
    cancelled : {type:Boolean, default:false},
    payment:{type:Boolean, default:false},
    status: { type: String, default: "Pending" },
    isCompleted: { type: Boolean, default: false },
    isRated: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    review: { type: String, default: "" },
    notes: { type: String, default: "" },
    triageData: { type: Object, default: {} },
    recoveryLogs: [{
        date: { type: Date, default: Date.now },
        healthScore: { type: Number, min: 1, max: 10 },
        feedback: { type: String, default: "" }
    }]
})

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment',appointmentSchema)
export default appointmentModel