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
    try{
        //fetch data
    const {
        firstName, 
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    } = req.body
    //validate details
    if(!firstName || !lastName || !email|| !password || !confirmPassword || !otp){
        return res.status(403).json({
            success: false,
            message: "All fields are required"
        })
    }
    //match 2 passwords
    if(password!==confirmPassword){
       return res.statis(400).json({
        success: false,
        message: 'Passwords do not match'
       })
    }
    //check if existing users
    const existingUser= await User.findOne({email})
    if(existingUser){
        return res.status(400).json({
            success: false,
            message: 'User is already registered'
        })
    }
    //find most recent otp
    const recentOtp= await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp)
    //validate OTP
    if(recentOtp.length==0){
        return res.status(400).json({
            success: false,
            message: 'OTP not found',
        })
    }
    else if(otp!==recentOtp){
        return res.status(400).json({
            success: false,
            message: 'Invalid OTP'
        })
    }

    //hash password
    const hashedPassword= await bcrypt.hash(password, 10)

    //entry in DB
    const profileDetails= await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber: null,
    });
    const user= await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password: hashedPassword,
        accountType,
        additionalDetails: profileDetails._id,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    })
    //return res
     return res.status(200).json({
        success: true,
        message: 'User registered successfully',
        user
     })
    }catch(e){
       console.log(e)
       return res.status(500).json({
        success: false,
        message: 'User cannot be registered'
       })
    }
} 
