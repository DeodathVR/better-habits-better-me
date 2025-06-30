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

    // Generate personalized coaching message
    const getCoachingMessage = () => {
      const messages = [
        `Ahoy ${userName}! 🎤 Your habit coach has an encouraging voice message for you. Your ${longestStreak}-day streak shows real dedication!`,
        `Hey ${userName}! 💪 Time to get back on track! Your habit coach left you a motivational voice message.`,
        `${userName}, your habits are calling! 🎯 Listen to your personal coaching message and reignite that spark!`,
        `Hi ${userName}! 🌟 Your habit coach believes in you. Check out this personalized voice message!`
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    };

    // Create voice message URL (we'll build this next!)
    const voiceMessageId = `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const voiceUrl = `https://www.myawesomelifehabits.com/voice/${voiceMessageId}`;

    // Create SMS content
    const smsBody = `${getCoachingMessage()}

🎤 Listen here: ${voiceUrl}

Your active habits:
${habits.map(habit => `• ${habit.name} (${habit.streak} day streak)`).join('\n')}

You've got this! 💪
- Your Habit Coach`;

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
        message: `Coaching SMS sent to ${userPhone}`,
        twilioSid: result.sid 
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
