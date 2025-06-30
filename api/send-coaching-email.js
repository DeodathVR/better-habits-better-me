export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  if (!SENDGRID_API_KEY) {
    return res.status(500).json({ error: 'SendGrid API key not configured' });
  }

  try {
    const { userEmail, userName, inactiveDays, habits, longestStreak } = req.body;

    // Generate personalized message
    const getPersonalizedMessage = () => {
      const messages = [
        `Hi ${userName}, I noticed you haven't checked in for ${inactiveDays} days. Your journey matters!`,
        `Hey ${userName}, taking a break? That's okay! Your ${longestStreak}-day streak shows real dedication.`,
        `${userName}, your habits are waiting for you! Remember, consistency beats perfection.`,
        `Hi ${userName}, just a friendly nudge from your habit coach. You've got this! 💪`
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    };

    // Create beautiful HTML email
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Your Habit Coach Misses You!</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .habit-list { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .cta-button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            .streak { color: #e74c3c; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌟 Your Habit Coach</h1>
                <p>From My Awesome Life Habits</p>
            </div>
            <div class="content">
                <h2>Hey ${userName}! 👋</h2>
                
                <p>${getPersonalizedMessage()}</p>
                
                <div class="habit-list">
                    <h3>🎯 Your Active Habits:</h3>
                    ${habits.map(habit => `
                        <p><strong>${habit.name}</strong> - <span class="streak">${habit.streak} day streak</span></p>
                    `).join('')}
                </div>
                
                <p><strong>Remember:</strong> You don't rise to the level of your goals. You fall to the level of your systems. Your habits are your systems! 💪</p>
                
                <p>Every small step counts. Whether it's 5 minutes of meditation or a quick workout - progress is progress!</p>
                
                <div style="text-align: center;">
                    <a href="https://www.myawesomelifehabits.com" class="cta-button">
                        Continue Your Journey 🚀
                    </a>
                </div>
                
                <p><em>Your future self will thank you for not giving up today.</em></p>
                
                <p>Cheering you on,<br>
                <strong>Your AI Habit Coach</strong> 🤖❤️</p>
            </div>
            <div class="footer">
                <p>You're receiving this because you haven't logged habits in ${inactiveDays} days.</p>
                <p>© 2025 My Awesome Life Habits - Transform your daily habits, transform your life.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Send email using SendGrid Web API
    const emailData = {
      personalizations: [
        {
          to: [{ email: userEmail }],
          subject: `${userName}, your habits are waiting for you! 🌟`
        }
      ],
      from: {
        email: 'coach@myawesomelifehabits.com',
        name: 'Your Habit Coach'
      },
      content: [
        {
          type: 'text/html',
          value: htmlContent
        },
        {
          type: 'text/plain',
          value: `Hi ${userName}, I noticed you haven't checked in for ${inactiveDays} days. Your ${longestStreak}-day streak shows real dedication! Visit https://www.myawesomelifehabits.com to continue your journey.`
        }
      ]
    };

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (response.ok) {
      res.status(200).json({ 
        success: true, 
        message: `Coaching email sent to ${userEmail}` 
      });
    } else {
      const errorText = await response.text();
      throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
    }

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
}
