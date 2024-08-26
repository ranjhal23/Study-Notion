const mongoose= require('mongoose')
const Profile= require('./Profile')
const CouseProgress= require('./CourseProgress')

const userSchema= new mongoose.Schema(({
    firstName:{
        type: String,
        required:true,
        trim:true
    },
    lastName:{
        type: String,
        required:true,
        trim:true
    },
    email:{
        type: String,
        required:true,
        trim:true
    },
    password:{
        type: String,
        required:true
    },
    accountType:{
        type: String,
        enum:["Student", "Admin", "Instructor"],
        required:true,
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Profile"
    },
    courses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course"
        }
    ],
    image:{
        type: String,
        required: true
    },
    token:{
        type: String,   
    },
    resetPasswordExpires:{
      type: Date
    },
    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CouseProgress"
        }
    ]
}))
module.exports= mongoose.model('User', userSchema)