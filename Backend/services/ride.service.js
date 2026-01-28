import rideModel from "../models/ride.model.js";
import {getDistanceTime1} from './maps.service.js';
import crypto from 'crypto'
import bcrypt from "bcryptjs";

export const getFare=async(pickup,destination)=>{
 if(!pickup || !destination){
    throw new Error('Pickup and destination are required');
 }

 try {
   const distanceTime = await getDistanceTime1(pickup,destination);
   
   const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };
        const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),

        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),

        moto: Math.round(baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto))
    };

    return fare;
 } catch(error){
   console.error('Fare calculation error:', error.message);
   // Return default fares if calculation fails
   return {
     auto: 50,
     car: 100,
     moto: 30
   };
 }
}
export const createRide1 = async({user, pickup, destination, vehicleType})=>{
    if(!user  || !pickup || !destination  || !vehicleType){
        throw new Error("All fields are required")
    }

    const fare = await getFare(pickup,destination);

    const ride = await rideModel.create({
        user , pickup , destination , fare:fare[vehicleType],otp:getOtp(6)
    })

    return ride;

}

function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}

