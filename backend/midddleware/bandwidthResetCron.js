import cron from 'node-cron';
import User from '../models/User.js';

// Run every day at midnight to reset bandwidth for users whose reset date has passed
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    const usersToReset = await User.find({
      bandwidthResetDate: { $lt: now }
    });

    for (const user of usersToReset) {
      // Calculate next reset date (1st of next month)
      const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      user.bandwidthUsed = 0;
      user.bandwidthResetDate = nextReset;
      user.warningsSent = []; // Reset warnings for new month
      await user.save();

      console.log(`Reset bandwidth for user ${user.email}`);
    }

    console.log(`Bandwidth reset completed for ${usersToReset.length} users`);
  } catch (error) {
    console.error('Bandwidth reset cron error:', error);
  }
});

// Run every hour to check for users exceeding limits and send warnings
cron.schedule('0 * * * *', async () => {
  try {
    const users = await User.find({ role: 'user' });

    for (const user of users) {
      const limit = user.plan === 'pro' ? 50 * 1024 * 1024 * 1024 : 5 * 1024 * 1024 * 1024; // 50GB pro, 5GB free (adjusted for 256GB server)
      const usagePercent = (user.bandwidthUsed / limit) * 100;

      // Send warnings at 80% and 95%
      const warningThresholds = [80, 95];
      const recentWarnings = user.warningsSent.filter(date =>
        new Date(date).getTime() > Date.now() - 24 * 60 * 60 * 1000 // Last 24 hours
      );

      for (const threshold of warningThresholds) {
        if (usagePercent >= threshold && !recentWarnings.some(date =>
          new Date(date).getTime() > Date.now() - 24 * 60 * 60 * 1000
        )) {
          console.log(`WARNING: User ${user.email} has used ${usagePercent.toFixed(2)}% of bandwidth limit`);

          user.warningsSent.push(new Date());
          await user.save();

          // TODO: Send email notification
          // await sendBandwidthWarningEmail(user, usagePercent, limit);
        }
      }
    }
  } catch (error) {
    console.error('Bandwidth warning cron error:', error);
  }
});

console.log('Bandwidth reset and warning cron jobs scheduled');
