const Tag= require('../models/tags')
 
//create tag
exports.createTag= async(req, res)=>{
    try{
        //fetch data
        const {name, description}= req.body
        //validate
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }
        //create in db
        const tagDetails= await Tag.create({
            name: name,
            description: description
        })
        console.log(tagDetails)
        //return response
        return res.status(200).json({
            success: true,
            message:'Tag created Successfully'
        })

    }catch(e){
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

//getAllTags
exports.showAlltags= async(req, res)=>{
    try{
        const allTags= await Tag.find({}, {name:true, description: true});
        return res.status(200).json({
            success: true,
            message: 'All tags returned successfully',
            allTags,
        })
    }catch(e){
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}