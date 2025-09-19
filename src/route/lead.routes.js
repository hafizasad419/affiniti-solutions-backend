import express from 'express';
import { createLeadInGoHighLevel, createReferralInGoHighLevel } from '../controller/lead.controller.js';
import { validateLeadData, validateReferralData } from '../validator/lead.validator.js';

const router = express.Router();

// Route to create a new lead in Go High Level
router.post('/create', validateLeadData, createLeadInGoHighLevel);

// Route to create referrals in Go High Level
router.post('/refer', validateReferralData, createReferralInGoHighLevel);

export default router;
