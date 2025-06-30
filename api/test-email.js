export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Use GET method' });
  }

  try {
    // Import and call the email function directly
    const sendEmail = require('./send-coaching-email').default;
    
    const testData = {
      userEmail: 'sparksofmotivation1001@gmail.com',
      userName: 'Alex',
      inactiveDays: 3,
      longestStreak: 21,
      habits: [
        { name: 'Morning Meditation', streak: 5 },
        { name: 'Yoga Practice', streak: 8 },
        { name: 'Reading', streak: 3 }
      ]
    };

    // Create mock request object
    const mockReq = {
      method: 'POST',
      body: testData
    };

    const mockRes = {
      status: (code) => ({
        json: (data) => {
          if (code === 200) {
            res.status(200).json({ success: true, message: 'Test email sent! Check sparksofmotivation1001@gmail.com! 📧✨' });
          } else {
            res.status(500).json({ error: 'Email failed', details: data });
          }
        }
      })
    };

    await sendEmail(mockReq, mockRes);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
