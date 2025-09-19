import { z } from 'zod';

// Validation schema for creating a lead
export const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional().refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), {
    message: 'Invalid phone number format'
  }),
  company: z.string().max(100, 'Company name must be less than 100 characters').optional(),
  jobTitle: z.string().max(100, 'Job title must be less than 100 characters').optional(),
  companyWebsite: z.string().url('Invalid website URL').optional().or(z.literal(''))
});

// Validation schema for referral data
export const referralFriendSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Invalid email format')
});

export const createReferralSchema = z.object({
  friends: z.array(referralFriendSchema).min(3, 'At least 3 friends are required').max(5, 'Maximum 5 friends allowed'),
  referrerEmail: z.string().email('Invalid referrer email format').optional()
});

// Middleware to validate lead data
export const validateLeadData = (req, res, next) => {
  try {
    const validatedData = createLeadSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => err.message).join(', ');
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        error: errorMessage
      });
    }
    next(error);
  }
};

// Middleware to validate referral data
export const validateReferralData = (req, res, next) => {
  try {
    const validatedData = createReferralSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => err.message).join(', ');
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        error: errorMessage
      });
    }
    next(error);
  }
};
