import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import blacklistTokenModel from '../models/blacklistToken.model.js';

export const authUser = async(req , res , next)=>{
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1] ; 
        if(!token){
            return res.status(401).json({message:'Unauthorized'});
        }
        const isBlacklisted = await blacklistTokenModel.findOne({token:token});
        if(isBlacklisted){
            return res.status(401).json({
                message:'Unauthorized user'
            })
        }
        const isAuthed = await jwt.verify(token , process.env.JWT_SECRET);
    
        if(!isAuthed){
            return res.status(401).json({
                message:'Not authenticated'
            })
        }
        const user = await UserModel.findById(isAuthed._id);
        req.user=user;
        return next();
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}