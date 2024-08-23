const User= require('../models/User')
const OTP= require('../models/OTP')
const otpGenerator= require('otp-generator')
//send OTP
exports.sendOTP= async(req, res)=>{
    //fetch email from req body
    try{
        const {email}= req.body
        //check if user already exists
        const checkUserPresent= await User.findOne({email});
        //if yes, return resp
        if(checkUserPresent){
            return res.statu(401).json({
                success: false,
                message: 'User already registered'
            })
        }
        //generate otp
        var otp= otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })
        console.log('OTP generated:', otp)
        //check uniqueness
        const result= await OTP.findOne({otp:otp})
        while(result){
            otp= otpGenerator(6,{
                upperCaseAlphabets:false,
               lowerCaseAlphabets:false,
              specialChars:false
            })
            result= await OTP.findOne({otp:otp})
        }
        //store in db
        const otpPayload={email, otp} 
        const otpBody= await OTP.create(otpPayload)
        console.log(otpBody)
        //return response successful
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp
        })
    }
    catch(e){
        console.log(e)
        return res.status(500).json({
            success: false,
            message: e.message,
        })
    }
}

//signUp
exports.signUp= async(req, res)=>{
    //fetch data
    
} 
