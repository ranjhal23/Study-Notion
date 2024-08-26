const User= require('../models/User')
const mailSender= require('../utils/mailSender')
const bcrypt= require('bcrypt')
//resetPasswordToken
exports.resetPasswordToken= async (req, res)=>{
   try{
      //get email
      const email= req.body.email
      //check user validity
      const user= await User.findOne({email: email})
      if(!user){
          return res.json({
              success: false,
              message: 'Your email is not registered'
          })
      }
      //generate token
      const token= crypto.randomUUID()
      //update user by adding token and expiration time
       const updatedDetails= await User.findOneAndUpdate(
            {email:email},
            {
              token:token,
              resetPasswordExpires: Date.now() + 5*60*1000,
            },
            {new: true}
       )
      //create url
       const url= `http://localhost:3000/update-password/${token}`
      //send mail containing url
      await mailSender(
           email, 
          'Password Reset Link',
          `Password Reset Link: ${url}`)
      //return response
      return res.json({
          success: true,
          message: 'Email sent successfully, check email and change password'
      })
   }catch(e){
       console.log(e)
       return res.status(500).json({
        success: false,
        message: 'SOmething went wrong while sending password reset mail'
       })
   }
}

//resetPassword
exports.resetPassword=async(req, res)=>{
    try{
    //data fetch
    const{password, confirmPassword, token}= req.body
    //validate
    if(password!=confirmPassword){
        return res.json({
            success: false,
            message: 'Passwords are not matching each other'
        })
    }
    //get userdetails using token
    const userDetails = await User.findOne({token: token})
    //if no token- invalid
    if(!userDetails){
        return res.json({
            success: false,
            message: 'token invalid'
        })
    }
    //token expiry
    if(userDetails.resetPasswordExpires < Date.now()){
         return res.json({
            success: false,
            message: 'Token has expired, regenerate again'
         })
    }
    //hash password
     const hashedPassword= await bcrypt.hash(password, 10);
    //update password
     await User.findOneAndUpdate(
        {token:token},
        {password: hashedPassword},
        {new: true}
     )
    //return res
    return res.status(200).json({
        success: true,
        message: 'Password reset successfully'
    })

    }catch(e){
        console.log(e)
        return res.status(500).json({
            success: false,
            message: ' something went wrong while reseting the password'
        })

    }
    
}