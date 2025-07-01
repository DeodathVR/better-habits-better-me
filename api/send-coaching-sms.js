export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get Twilio credentials
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    return res.status(500).json({ error: 'Twilio credentials not configured' });
  }

  try {
    const { userPhone, userName } = req.body;

    // Ultra basic message - no emojis, no special chars
    const smsBody = `Hi ${userName}! Message from your habit coach.`;

    // Send SMS using direct phone number
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        To: userPhone,
        From: '+13254405735',
        Body: smsBody
      })
    });

    if (response.ok) {
      const result = await response.json();
      res.status(200).json({ 
        success: true, 
        message: `Ultra basic SMS sent to ${userPhone}`,
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
      error: 'Failed to send SMS',
      details: error.message 
    });
  }
}
