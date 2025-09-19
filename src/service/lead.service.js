import ghlManager from '../lib/GHL.js';
import { GHL_LOCATION_ID } from '../config/index.js';

export class LeadService {
  /**
   * Create a new lead in Go High Level
   * @param {Object} leadData - Lead information
   * @param {string} leadData.name - Full name of the lead
   * @param {string} leadData.email - Email address
   * @param {string} [leadData.phone] - Phone number
   * @param {string} [leadData.company] - Company name
   * @param {string} [leadData.jobTitle] - Job title
   * @param {string} [leadData.companyWebsite] - Company website
   * @returns {Promise<Object>} Created lead information
   */
  static async createLead(leadData) {
    try {
      // Get GHL client from connection manager
      let ghl = ghlManager.getClient();

      if (!ghl) {
        // Try to reconnect if not connected
        const reconnected = await ghlManager.reconnect();
        if (!reconnected) {
          throw new Error('Unable to establish GHL connection');
        }
        // Get client again after reconnection
        const reconnectedClient = ghlManager.getClient();
        if (!reconnectedClient) {
          throw new Error('Failed to get GHL client after reconnection');
        }
        ghl = reconnectedClient;
      }

      // Validate required environment variables
      if (!GHL_LOCATION_ID) {
        throw new Error('Go High Level location ID not configured');
      }

      // Prepare contact data for Go High Level
      const contactData = {
        locationId: GHL_LOCATION_ID,
        firstName: leadData.name.split(' ')[0] || leadData.name,
        lastName: leadData.name.split(' ').slice(1).join(' ') || '',
        email: leadData.email,
        phone: leadData.phone || '',
        companyName: leadData.company || '',
        tags: ["DeepTrust AI Early Access"],
        customFields: [
          {
            key: "job_title",
            value: leadData.jobTitle || ''
          },
          {
            key: "company_url", 
            value: leadData.companyWebsite || ''
          }
        ]
      };
      // Create contact in Go High Level
      const response = await ghl.contacts.createContact(contactData);

      console.log("New Lead Created, GHL Response:", response);

      if (!response || !response.contact || !response.contact.id) {
        throw new Error('Failed to create lead in Go High Level - unexpected response format');
      }

      return {
        leadId: response.contact.id,
        message: 'Lead has been created and added to Go High Level contacts'
      };

    } catch (error) {
      // Log error for debugging
      console.error('LeadService.createLead error:', error);

      // Re-throw error for controller to handle
      throw error;
    }
  }

  /**
   * Create referrals in Go High Level
   * @param {Object} referralData - Referral information
   * @param {Array} referralData.friends - Array of friend information
   * @param {string} [referralData.referrerEmail] - Email of the person who referred
   * @returns {Promise<Object>} Created referrals information
   */
  static async createReferrals(referralData) {
    try {
      // Get GHL client from connection manager
      let ghl = ghlManager.getClient();

      if (!ghl) {
        // Try to reconnect if not connected
        const reconnected = await ghlManager.reconnect();
        if (!reconnected) {
          throw new Error('Unable to establish GHL connection');
        }
        // Get client again after reconnection
        const reconnectedClient = ghlManager.getClient();
        if (!reconnectedClient) {
          throw new Error('Failed to get GHL client after reconnection');
        }
        ghl = reconnectedClient;
      }

      // Validate required environment variables
      if (!GHL_LOCATION_ID) {
        throw new Error('Go High Level location ID not configured');
      }

      const results = [];
      const { friends, referrerEmail } = referralData;

      // Process each friend referral
      for (const friend of friends) {
        try {
          // Prepare contact data for Go High Level
          const contactData = {
            locationId: GHL_LOCATION_ID,
            firstName: friend.firstName,
            lastName: friend.lastName,
            email: friend.email,
            tags: ["DeepTrust AI Referral"],
            customFields: []
          };

          // Add referrer information if available
          if (referrerEmail) {
            contactData.customFields.push({
              key: "referred_by",
              value: referrerEmail
            });
          }

          // Create contact in Go High Level
          const response = await ghl.contacts.createContact(contactData);

          if (response && response.contact && response.contact.id) {
            results.push({
              friendId: response.contact.id,
              friendName: `${friend.firstName} ${friend.lastName}`,
              friendEmail: friend.email,
              status: 'success'
            });
          } else {
            results.push({
              friendName: `${friend.firstName} ${friend.lastName}`,
              friendEmail: friend.email,
              status: 'failed',
              error: 'Failed to create contact in Go High Level'
            });
          }
        } catch (friendError) {
          console.error(`Error creating referral for ${friend.firstName} ${friend.lastName}:`, friendError);
          results.push({
            friendName: `${friend.firstName} ${friend.lastName}`,
            friendEmail: friend.email,
            status: 'failed',
            error: friendError.message
          });
        }
      }

      // Check if referrer should get VIP status (3+ successful referrals)
      const successfulReferrals = results.filter(r => r.status === 'success').length;
      
      if (successfulReferrals >= 3 && referrerEmail) {
        try {
          // Find the referrer's contact using getContacts (deprecated but functional)
          const searchResult = await ghl.contacts.getContacts({
            locationId: GHL_LOCATION_ID,
            query: referrerEmail
          });

          if (searchResult && searchResult.contacts && searchResult.contacts.length > 0) {
            const referrerContact = searchResult.contacts.find(contact => 
              contact.email === referrerEmail
            );

            if (referrerContact) {
              // Get current tags and add VIP tag if not already present
              const currentTags = referrerContact.tags || [];
              const vipTag = "deeptrust ai vip";
              
              // Only add VIP tag if it doesn't already exist
              if (!currentTags.includes(vipTag)) {
                const updatedTags = [...currentTags, vipTag];
                
                // Update contact with VIP tag using correct API signature
                await ghl.contacts.updateContact(
                  { contactId: referrerContact.id },
                  { tags: updatedTags }
                );

                console.log(`VIP status granted to referrer: ${referrerEmail}`);
              } else {
                console.log(`Referrer ${referrerEmail} already has VIP status`);
              }
            }
          }
        } catch (vipError) {
          console.error('Error updating referrer VIP status:', vipError);
          // Don't fail the entire operation for VIP status update
        }
      }

      return {
        referrals: results,
        totalReferrals: friends.length,
        successfulReferrals,
        vipStatusGranted: successfulReferrals >= 3,
        message: `Successfully processed ${successfulReferrals} out of ${friends.length} referrals`
      };

    } catch (error) {
      // Log error for debugging
      console.error('LeadService.createReferrals error:', error);

      // Re-throw error for controller to handle
      throw error;
    }
  }

  /**
   * Get GHL connection status
   * @returns {Promise<Object>} Connection health status
   */
  static async getConnectionStatus() {
    return await ghlManager.healthCheck();
  }
}
