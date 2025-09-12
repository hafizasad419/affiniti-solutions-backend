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
   * Get GHL connection status
   * @returns {Promise<Object>} Connection health status
   */
  static async getConnectionStatus() {
    return await ghlManager.healthCheck();
  }
}
