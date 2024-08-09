require('dotenv').config()
const mongoose= require('mongoose')

exports.connect= ()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{console.log('DB connection successful')})
    .catch((e)=>{
        console.log('Error in DB connection')
        console.error(e)
        process.exit(1)     
    })

}

