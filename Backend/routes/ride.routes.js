import express from "express";
import { createRide } from "../controllers/ride.controller.js";
const router = express.Router();
import {authUser} from '../middlewares/auth.middleware.js'
import  { body, query } from 'express-validator'


router.post('/create',
    authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn([ 'auto', 'car', 'moto' ]).withMessage('Invalid vehicle type'),
    createRide
)

export default router