# Affiniti Solutions Server

## Go High Level Integration

This server integrates with Go High Level V2 API to create leads in contacts using the private integration token method.

### Environment Variables Required

Add the following environment variables to your `.env` file:

```bash
# Go High Level Configuration
GHL_PRIVATE_INTEGRATION_TOKEN=your_ghl_private_integration_token
GHL_LOCATION_ID=your_ghl_location_id
```

### How to Get Go High Level Credentials

1. **Private Integration Token (PIT)**:
   - Log into your Go High Level account
   - Go to Settings > Integrations > API Keys
   - Generate a new Private Integration Token

2. **Location ID**:
   - In your Go High Level dashboard, the location ID is visible in the URL
   - Format: `https://app.gohighlevel.com/location/{LOCATION_ID}/...`

### API Endpoints

#### Create Lead
**Route**: `POST /lead/create`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Example Corp",
  "jobTitle": "Manager",
  "companyWebsite": "https://example.com"
}
```

**Required Fields**: `name`, `email`

**Response**:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Lead created successfully in Go High Level",
  "data": {
    "leadId": "ghl_contact_id",
    "message": "Lead has been created and added to Go High Level contacts"
  }
}
```

#### Health Checks

**Server Health**: `GET /health`  
**GHL Connection Health**: `GET /ghl/health`  
**Lead Service Health**: `GET /lead/health`

### Architecture Features

✅ **Centralized Connection Management** - Single GHL connection instance  
✅ **Automatic Reconnection** - Retry mechanism with exponential backoff  
✅ **Graceful Error Handling** - App won't crash on GHL connection issues  
✅ **Health Monitoring** - Real-time connection status monitoring  
✅ **Connection Pooling** - Avoids multiple connections to GHL  
✅ **Graceful Shutdown** - Proper cleanup on app termination  

### Installation

```bash
npm install
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

### Dependencies

- `@gohighlevel/api-client` - Official Go High Level SDK
- Express.js - Web framework
- Other standard Node.js packages
