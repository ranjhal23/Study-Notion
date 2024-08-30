const Course= require('../models/Course')
const Tag= require('../models/tags')
const User= require('../models/User')
const {uploadImageToCloudinary}= require('../utils/imageUploader')

//createCourse handler function
exports.createCourse= async(req, res)=>{
    try{
        //fetch user data
        const {courseName, courseDescription, whaYouWillLearn, price, tag}= req.body
        //get thumbnail
        const thumbnail= req.files.thumbnailImage;
        //validation
        if(!courseName || !courseDescription || !whaYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success: false,
                message: 'Fill all the details'
            })
        } 
        //check for instructor
        const userId= req.user.id;
        const instructorDetails= await User.findById(userId)
        console.log(instructorDetails)

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: 'Instructor Details not found'
            })
        }
        
        //check if tag is valid or not
        const tagDetails= await Tag.findById(tag);
        if(!tagDetails){
            return res.status(404).json({
                success: false,
                message: 'Tag details not found'
            })
        }
        //update details to cloudinary
        const thumbnailImage= await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
         //create an entry for new course
         const newCourse= await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatWillYouLearn : whaYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
         })
         //update user
         await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push:{
                    couses: newCourse._id,   
                }
            },
            {new: true},
        )
        //update tag schema
        const tagDetails2= await User.findByIdAndUpdate(
            {_id: tag},
            {
                $push:{
                    couses: newCourse._id,   
                }
            },
            {new: true},
        )
        //return response
        return res.status(200).json({
            success: true,
            message: 'course created successfully',
            data: newCourse
        })
    }catch(e){
        console.log(e)
        return res.status(500).json({
            success: false,
            messade: 'Failed to create course'
        })

    }

}