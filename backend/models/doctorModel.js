import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    image:{type:String,required:true},
    speciality:{type:String,required:true},
    degree:{type:String,required:true},
    experience:{type:String,required:true},
    yearsOfExperience:{type:Number,default:1},
    about:{type:String,required:true},
    available:{type:Boolean,default:true},
    fees:{type:Number,required:true},
    address:{
        line1:{type:String,default:''},
        line2:{type:String,default:''},
        city:{type:String,required:true},
        state:{type:String,required:true},
        country:{type:String,required:true},
        pincode:{type:String,required:true,default:'000000'},
    },
    date:{type:Number,required:true},
    slots_booked:{type:Object,default:{}},
    ratingAverage:{type:Number,default:0},
    ratingTotalScore:{type:Number,default:0},
    ratingCount:{type:Number,default:0}
},{minimize:false})

const doctorModel = mongoose.models.doctor || mongoose.model('doctor',doctorSchema)

export default doctorModel