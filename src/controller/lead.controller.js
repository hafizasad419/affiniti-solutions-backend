import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { LeadService } from "../service/lead.service.js";

export const createLeadInGoHighLevel = async (req, res) => {
  try {
    // Extract lead data from request body
    const { name, email, phone, company, jobTitle, companyWebsite } = req.body;

    // Create lead using the service layer
    const result = await LeadService.createLead({
      name,
      email,
      phone,
      company,
      jobTitle,
      companyWebsite
    });

    return apiResponse(res, 201, "You're officially on the Early Access list! Thanks for joining DeepTrust AI - we'll keep you posted as we roll out new features.", result, true);

  } catch (error) {
    console.error('Error creating lead in Go High Level:', error);
    
    // Handle specific Go High Level API errors
    if (error.response) {
      const { status, data } = error.response;
      return apiError(res, status || 500, 'Go High Level API error', data?.message || error.message, false);
    }
    
    // Handle service layer errors
    if (error.message.includes('not configured')) {
      return apiError(res, 500, error.message, null, false);
    }
    
    return apiError(res, 500, 'Failed to create lead', error.message, false);
  }
};

export const createReferralInGoHighLevel = async (req, res) => {
  try {
    // Extract referral data from request body
    const { friends, referrerEmail } = req.body;

    // Create referrals using the service layer
    const result = await LeadService.createReferrals({
      friends,
      referrerEmail
    });

    // Determine success message based on results
    let message = `Successfully referred ${result.successfulReferrals} friend${result.successfulReferrals !== 1 ? 's' : ''}!`;
    
    if (result.vipStatusGranted) {
      message += " 🎉 You've unlocked VIP status with exclusive access to DeepTrust AI!";
    } else if (result.successfulReferrals >= 1) {
      const remaining = 3 - result.successfulReferrals;
      message += ` Refer ${remaining} more friend${remaining !== 1 ? 's' : ''} to unlock VIP status!`;
    }

    return apiResponse(res, 201, message, result, true);

  } catch (error) {
    console.error('Error creating referrals in Go High Level:', error);
    
    // Handle specific Go High Level API errors
    if (error.response) {
      const { status, data } = error.response;
      return apiError(res, status || 500, 'Go High Level API error', data?.message || error.message, false);
    }
    
    // Handle service layer errors
    if (error.message.includes('not configured')) {
      return apiError(res, 500, error.message, null, false);
    }
    
    return apiError(res, 500, 'Failed to create referrals', error.message, false);
  }
};