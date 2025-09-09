import express from 'express';
import { createLeadInGoHighLevel } from '../controller/lead.controller.js';
import { validateLeadData } from '../validator/lead.validator.js';

const router = express.Router();

// Route to create a new lead in Go High Level
router.post('/create', validateLeadData, createLeadInGoHighLevel);

export default router;
