export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Use GET method, matey!' });
  }

  try {
    // Test data for Captain's phone!
    const testData = {
      userPhone: '+18684605675', // 👈 YER PHONE NUMBER!
      userName: 'Captain Alex',
      inactiveDays: 4,
      longestStreak: 21,
      habits: [
        { name: 'Morning Meditation', streak: 5 },
        { name: 'Yoga Practice', streak: 8 },
        { name: 'Reading', streak: 3 }
      ]
    };

    // Fire the SMS cannon!
    const baseUrl = `https://${req.headers.host}`;
    const response = await fetch(`${baseUrl}/api/send-coaching-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (response.ok) {
      res.status(200).json({ 
        success: true, 
        message: 'Coaching SMS fired at Captain\'s phone! 🎤📱⚓',
        details: result
      });
    } else {
      res.status(500).json({ error: 'SMS cannon misfired!', details: result });
    }

  } catch (error) {
    res.status(500).json({ error: `Cannon malfunction: ${error.message}` });
  }
}
