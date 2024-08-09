const mongoose= require('mongoose')
const User= require('./User')
const Section= require('./Section')
const courseSchema= new mongoose.Schema({
    courseName:{
        type:String
    },
    courseDescription:{
        type:String
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    whatWillYouLearn:{
        type:String
    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Section'
        }
    ],
    ratingAndReview:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'RatingAndReview'
        }
    ],
    price:{
        type:Number
    },
    thumbnail:{
        type:String
    },
    tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tag'
    },
    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    ]  
})

module.exports= mongoose.model('Course', courseSchema)