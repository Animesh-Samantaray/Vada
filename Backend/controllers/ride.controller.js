import { createRide1, getFare } from "../services/ride.service.js"; 
import { validationResult } from "express-validator";
import rideModel from "../models/ride.model.js";


export const createRide=async(req,res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try {
        const { pickup, destination, vehicleType } = req.body;
        const ride = await createRide1({ user: req.user._id, pickup, destination, vehicleType });
        res.status(201).json(ride);
    } catch (error) {
        return res.status(400).json({message:error.message});
    }
}

export const getFareController = async(req,res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try {
        const { pickup, destination, vehicleType } = req.query;
        const fare = await getFare(pickup, destination);
        
        res.status(200).json({
            fare: fare[vehicleType],
            all_fares: fare
        });
    } catch (error) {
        return res.status(400).json({message:error.message});
    }
}

export const acceptRide = async(req, res) => {
    try {
        const { rideId } = req.params;

        const ride = await rideModel.findByIdAndUpdate(
            rideId,
            {
                captain: req.captain._id,
                status: 'accepted'
            },
            { new: true }
        ).populate('user').populate('captain');

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        res.status(200).json(ride);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const startRide = async(req, res) => {
    try {
        const { rideId } = req.params;
        const { otp } = req.body;

        const ride = await rideModel.findById(rideId);

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        const updatedRide = await rideModel.findByIdAndUpdate(
            rideId,
            { status: 'ongoing' },
            { new: true }
        ).populate('user').populate('captain');

        res.status(200).json(updatedRide);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const endRide = async(req, res) => {
    try {
        const { rideId } = req.params;

        const ride = await rideModel.findByIdAndUpdate(
            rideId,
            { status: 'completed' },
            { new: true }
        ).populate('user').populate('captain');

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        res.status(200).json(ride);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const getCaptainRides = async(req, res) => {
    try {
        const rides = await rideModel.find({
            captain: req.captain._id,
            status: { $in: ['pending', 'accepted'] }
        }).populate('user');

        res.status(200).json(rides);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const getAllRides = async(req, res) => {
    try {
        const rides = await rideModel.find({ status: 'pending' }).populate('user');
        res.status(200).json(rides);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const getRideById = async(req, res) => {
    try {
        const { rideId } = req.params;
        const ride = await rideModel.findById(rideId).populate('user').populate('captain');

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        res.status(200).json(ride);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}