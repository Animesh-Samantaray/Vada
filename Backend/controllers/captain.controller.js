import { validationResult } from "express-validator";
import captainModel from "../models/captain.model.js";
import { createCaptain } from "../services/captain.service.js";
import blacklistTokenModel from "../models/blacklistToken.model.js";
export const  registerCaptain=async(req,res)=>{
const errors=validationResult(req);

if(!errors.isEmpty()){
    return res.status(400).json({
        errors:errors.array()
    });
}

const {fullname , email , password , vehicle}=req.body;

const captainExists  = await captainModel.findOne({email});
if(captainExists){
    return res.status(400).json({message:'Captain already exists'});
}

const hashedPassword = await captainModel.hashPassword(password);

const captain = await createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    const token =await captain.generateAuthToken();
const demoCaptain = captain.toObject();
delete demoCaptain.password;
    res.status(201).json({ token, captain:demoCaptain });
}


export const loginCaptain = async(req,res)=>{
    const errors = validationResult(req);

     if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');


    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

     const token =await  captain.generateAuthToken();

res.cookie('token', token, {
  httpOnly: true,
  sameSite: 'lax',        // 👈 REQUIRED for localhost
  secure: false,          // 👈 true only in HTTPS (prod)
  maxAge: 24 * 60 * 60 * 1000
});
const demoCaptain = captain.toObject();
delete demoCaptain.password;
    res.status(200).json({ token, captain:demoCaptain });
}


export const getCaptainProfile=async(req,res)=>{
    const captain = req.captain;
    const captainDemo = captain.toObject();
    delete captainDemo.password;
    return res.status(200).json({captain:captainDemo})
}


export const logoutCaptain = async(req , res )=>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[0];
    await blacklistTokenModel.create({token});
    res.clearCookie('token');

    return res.status(200).json({message:'Captin Logged Out'})

}