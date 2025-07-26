import express from 'express';
import upload from '../middlewares/multer.js';
import {getAllAvailableDoctors} from '../controllers/doctorController.js';

const doctorRouter=express.Router();

doctorRouter.get('/get-all-available-doctors',getAllAvailableDoctors);

export default doctorRouter