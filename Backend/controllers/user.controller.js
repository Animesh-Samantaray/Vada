import UserModel from "../models/user.model.js"; 
 import { validationResult } from "express-validator";
import { createUser } from "../services/user.service.js";
import blacklistTokenModel from "../models/blacklistToken.model.js";
export const registerUser=async(req , res)=>{
const errors=validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({
        errors:errors.array()
    })
}
console.log(req.body)
const {fullname,email,password}=req.body;
const hashedPassword=await UserModel.hashPassword(password)

const user = await createUser({
    firstname:fullname.firstname,
    lastname:fullname.lastname
    ,email,
    password:hashedPassword
})

const token=await  user.generateAuthToken();
const theUser = user.toObject();
delete theUser.password;
res.status(201).json({token,user:theUser})
}



export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select('+password');

    // ✅ MUST CHECK FIRST
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = await user.generateAuthToken();

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    const copyUser = user.toObject();
    delete copyUser.password;

    return res.status(200).json({ user: copyUser,token });

  } catch (error) {
    console.error('LOGIN ERROR 💥', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};






export const  getUserProfile = async (req, res) => {
    res.status(200).json(req.user);
}

export const logoutUser=async(req,res)=>{
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1] ; 
    await blacklistTokenModel.create({token})
    res.status(200).json({message:'Logged out'})
}