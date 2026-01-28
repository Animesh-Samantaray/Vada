import express from "express";
import { createRide, getFareController, acceptRide, startRide, endRide, getCaptainRides, getRideById, getAllRides } from "../controllers/ride.controller.js";
const router = express.Router();
import {authUser} from '../middlewares/auth.middleware.js'
import { authCaptain } from '../middlewares/auth.middleware.js'
import  { body, query } from 'express-validator'


router.post('/create',
    authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn([ 'auto', 'car', 'moto' ]).withMessage('Invalid vehicle type'),
    createRide
)

router.get('/get-fare',
    authUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    query('vehicleType').isString().isIn([ 'auto', 'car', 'moto' ]).withMessage('Invalid vehicle type'),
    getFareController
)

router.get('/',
    authCaptain,
    getAllRides
)

router.post('/accept/:rideId',
    authCaptain,
    acceptRide
)

router.post('/start/:rideId',
    authCaptain,
    body('otp').isString().isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    startRide
)

router.post('/end/:rideId',
    authCaptain,
    endRide
)

router.get('/captain-rides',
    authCaptain,
    getCaptainRides
)

router.get('/:rideId',
    authUser,
    getRideById
)

export default router