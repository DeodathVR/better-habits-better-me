export default async function handler(req, res) {
  // Simple test endpoint
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Use GET method' });
  }

  try {
    // Test data (replace with your email!)
    const testData = {
      userEmail: 'sparksofmotivation1001@gmail.com', // 👈 PUT YOUR EMAIL HERE!
      userName: 'Deo',
      inactiveDays: 3,
      longestStreak: 21,
      habits: [
        { name: 'Morning Meditation', streak: 5 },
        { name: 'Yoga Practice', streak: 8 },
        { name: 'Reading', streak: 3 }
      ]
    };

    // Call your email function
    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/send-coaching-email`, {
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
        message: 'Test email sent! Check your inbox! 📧✨' 
      });
    } else {
      res.status(500).json({ error: 'Email failed', details: result });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
