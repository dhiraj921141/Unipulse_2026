# Unipulse AI Chatbot Setup Guide

## Overview
The Unipulse chatbot is powered by Google's Gemini AI API, providing intelligent responses about Maharashtra colleges, admissions, and academic guidance.

## Features
- **AI-Powered Responses**: Uses Google Gemini AI for intelligent, contextual responses
- **College-Specific Knowledge**: Trained on Maharashtra college data including cutoffs, fees, and placements
- **Conversation Memory**: Maintains context throughout the conversation
- **Rate Limiting**: Prevents API abuse with built-in request limiting
- **Fallback Responses**: Works even without API key using enhanced local responses
- **Enhanced UI**: Modern chat interface with typing indicators and timestamps

## Setup Instructions

### Step 1: Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Configure the Chatbot
1. Open `chatbot-config.js`
2. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:
   ```javascript
   API_KEY: 'your-actual-api-key-here',
   ```
3. Save the file

### Step 3: Test the Chatbot
1. Open `index.html` in a web browser
2. Click the chat button in the bottom-right corner
3. Try asking questions like:
   - "Tell me about COEP college"
   - "What are the cutoffs for computer science?"
   - "Which colleges are best for medical?"

## Configuration Options

### API Settings
```javascript
// In chatbot-config.js
API_KEY: 'your-api-key',           // Your Gemini API key
MAX_TOKENS: 1000,                  // Maximum response length
TEMPERATURE: 0.7,                  // Response creativity (0-1)
```

### Rate Limiting
```javascript
RATE_LIMIT: {
    MAX_REQUESTS_PER_MINUTE: 10,   // Maximum requests per minute
    COOLDOWN_PERIOD: 60000         // Cooldown period in milliseconds
}
```

## Usage Examples

### Basic Questions
- "What is the cutoff for COEP?"
- "Tell me about medical colleges in Mumbai"
- "What are the fees for engineering colleges?"

### Specific Queries
- "Compare VNIT and COEP for computer science"
- "Best pharmacy colleges in Maharashtra"
- "Admission process for medical colleges"

### Advanced Features
- "What are my chances with 95 percentile in JEE?"
- "Suggest colleges for mechanical engineering under 5 lakhs fees"
- "Latest placement statistics for IT colleges"

## Troubleshooting

### Chatbot Not Working
1. **Check API Key**: Ensure the API key is correctly set in `chatbot-config.js`
2. **Check Console**: Open browser developer tools and check for error messages
3. **Network Issues**: Verify internet connection for API calls

### API Errors
- **Invalid API Key**: Double-check your Gemini API key
- **Rate Limit Exceeded**: Wait for the cooldown period to reset
- **Network Error**: Check internet connection and try again

### Fallback Mode
If the API is unavailable, the chatbot automatically switches to enhanced local responses with comprehensive college information.

## Security Notes

### API Key Security
- **Never commit API keys to version control**
- **Use environment variables in production**
- **Rotate API keys regularly**
- **Monitor API usage in Google Cloud Console**

### Production Deployment
For production use, consider:
1. Server-side API calls to hide the API key
2. User authentication and session management
3. Enhanced rate limiting and abuse prevention
4. Logging and monitoring

## Customization

### Adding New Responses
Edit the `getFallbackResponse()` function in `chatbot.js` to add new local responses.

### Modifying System Context
Update the `SYSTEM_CONTEXT` in `chatbot-config.js` to change the AI's behavior and knowledge base.

### UI Customization
Modify the CSS styles in `index.html` to change the chatbot's appearance.

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify API key configuration
3. Test with simple questions first
4. Contact the development team at info@unipulse.com

## API Costs

Gemini API pricing (as of 2024):
- **Free Tier**: 15 requests per minute, 1500 requests per day
- **Paid Tier**: $0.00025 per 1K characters for input, $0.0005 per 1K characters for output

Monitor your usage in the Google Cloud Console to avoid unexpected charges.
