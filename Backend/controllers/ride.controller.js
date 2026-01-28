import { createRide1 } from "../services/ride.service.js"; 
import { validationResult } from "express-validator";


export const createRide=async(req,res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try {
        const { userId, pickup, destination, vehicleType } = req.body;
        const ride = await createRide1({ user: req.user._id, pickup, destination, vehicleType });
        res.status(201).json(ride);
    } catch (error) {
        return res.status(400).json({message:error.message});
    }
} 