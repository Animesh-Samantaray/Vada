import express from 'express';
import { getAddressCoordinate } from '../services/maps.service.js';
import {authUser} from '../middlewares/auth.middleware.js';
import {getCoordinates, getDistanceTime,getAutoCompleteSuggestions} from '../controllers/maps.controller.js';
import {query} from 'express-validator'
import { body } from 'express-validator';
const router = express.Router();

router.get(
  "/get-coordinates",
  query("address").isString().isLength({ min: 3 }),
  authUser,
  getCoordinates
);

router.get(
  "/get-distance-time",
  query("origin.lat").isFloat(),
  query("origin.lng").isFloat(),
  query("destination.lat").isFloat(),
  query("destination.lng").isFloat(),
  authUser,
  getDistanceTime
);

router.get('/get-suggestions',query('input').isString().isLength({min:3}),
authUser,getAutoCompleteSuggestions)


 export  default router