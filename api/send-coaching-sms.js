export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, matey!' });
  }

  // Get Twilio credentials from the treasure chest
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

  if (!accountSid || !authToken || !messagingServiceSid) {
    return res.status(500).json({ error: 'Twilio credentials not configured, Captain!' });
  }

  try {
    const { userPhone, userName, inactiveDays, habits, longestStreak } = req.body;

    // Create voice message URL (we'll build this next!)
    const voiceMessageId = `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const voiceUrl = `https://www.myawesomelifehabits.com/voice/${voiceMessageId}`;

    // Create SHORT SMS content for international delivery
    const smsBody = `Hi ${userName}! Your habit coach has a voice message for you 🎤

Listen: ${voiceUrl}

Keep building those habits! 💪
- Your Coach`;

    // Send SMS using Twilio
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        To: userPhone,
        MessagingServiceSid: messagingServiceSid,
        Body: smsBody
      })
    });

    if (response.ok) {
      const result = await response.json();
      res.status(200).json({ 
        success: true, 
        message: `Short coaching SMS sent to ${userPhone}`,
        twilioSid: result.sid,
        messageLength: smsBody.length
      });
    } else {
      const errorText = await response.text();
      throw new Error(`Twilio API error: ${response.status} - ${errorText}`);
    }

  } catch (error) {
    console.error('SMS sending error:', error);
    res.status(500).json({ 
      error: 'Failed to send coaching SMS',
      details: error.message 
    });
  }
}
