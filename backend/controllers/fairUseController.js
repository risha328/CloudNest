import User from "../models/User.js";
import File from "../models/File.js";

// Bandwidth limits (monthly) - adjusted for 256GB server capacity
const BANDWIDTH_LIMITS = {
  free: 5 * 1024 * 1024 * 1024, // 5GB (reduced from 10GB)
  pro: 50 * 1024 * 1024 * 1024  // 50GB (reduced from 100GB)
};

// Check if user has exceeded bandwidth limit
export const checkBandwidthLimit = async (userId, additionalBytes = 0) => {
  try {
    const user = await User.findById(userId);
    if (!user) return { allowed: false, reason: 'User not found' };

    // Reset bandwidth if it's a new month
    const now = new Date();
    const resetDate = new Date(user.bandwidthResetDate);
    if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
      user.bandwidthUsed = 0;
      user.bandwidthResetDate = now;
      await user.save();
    }

    const limit = BANDWIDTH_LIMITS[user.plan] || BANDWIDTH_LIMITS.free;
    const wouldExceed = user.bandwidthUsed + additionalBytes > limit;

    return {
      allowed: !wouldExceed,
      currentUsage: user.bandwidthUsed,
      limit: limit,
      remaining: Math.max(0, limit - user.bandwidthUsed),
      percentage: ((user.bandwidthUsed / limit) * 100).toFixed(2)
    };
  } catch (error) {
    console.error('Bandwidth check error:', error);
    return { allowed: true }; // Allow on error to avoid blocking legitimate users
  }
};

// Update user's bandwidth usage
export const updateBandwidthUsage = async (userId, bytesUsed) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Reset if new month
    const now = new Date();
    const resetDate = new Date(user.bandwidthResetDate);
    if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
      user.bandwidthUsed = bytesUsed;
      user.bandwidthResetDate = now;
    } else {
      user.bandwidthUsed += bytesUsed;
    }

    user.lastActivity = now;
    await user.save();

    // Check if warnings should be sent
    await checkAndSendWarnings(user);
  } catch (error) {
    console.error('Bandwidth update error:', error);
  }
};

// Check and send usage warnings
const checkAndSendWarnings = async (user) => {
  const limit = BANDWIDTH_LIMITS[user.plan] || BANDWIDTH_LIMITS.free;
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
      // In a real app, send email notification here
      console.log(`WARNING: User ${user.email} has used ${usagePercent.toFixed(2)}% of bandwidth limit`);

      user.warningsSent.push(new Date());
      await user.save();

      // TODO: Send email notification
      // await sendBandwidthWarningEmail(user, usagePercent, limit);
    }
  }
};

// Get bandwidth stats for user
export const getBandwidthStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const limit = BANDWIDTH_LIMITS[user.plan] || BANDWIDTH_LIMITS.free;

    res.json({
      used: user.bandwidthUsed,
      limit: limit,
      remaining: Math.max(0, limit - user.bandwidthUsed),
      percentage: ((user.bandwidthUsed / limit) * 100).toFixed(2),
      resetDate: user.bandwidthResetDate,
      lastActivity: user.lastActivity
    });
  } catch (error) {
    console.error('Bandwidth stats error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Reset bandwidth usage (admin function)
export const resetBandwidthUsage = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return false;

    user.bandwidthUsed = 0;
    user.bandwidthResetDate = new Date();
    await user.save();

    return true;
  } catch (error) {
    console.error('Bandwidth reset error:', error);
    return false;
  }
};

// Get fair use analytics for admin
export const getFairUseAnalytics = async () => {
  try {
    const users = await User.find({ role: 'user' }).select('plan bandwidthUsed bandwidthResetDate lastActivity');

    const analytics = {
      totalUsers: users.length,
      bandwidthUsage: {
        free: { total: 0, users: 0, average: 0 },
        pro: { total: 0, users: 0, average: 0 }
      },
      overLimitUsers: [],
      inactiveUsers: []
    };

    users.forEach(user => {
      const limit = BANDWIDTH_LIMITS[user.plan] || BANDWIDTH_LIMITS.free;
      analytics.bandwidthUsage[user.plan].total += user.bandwidthUsed;
      analytics.bandwidthUsage[user.plan].users += 1;

      if (user.bandwidthUsed > limit) {
        analytics.overLimitUsers.push({
          id: user._id,
          email: user.email,
          used: user.bandwidthUsed,
          limit: limit,
          overBy: user.bandwidthUsed - limit
        });
      }

      // Users inactive for 30+ days
      if (user.lastActivity && new Date(user.lastActivity).getTime() < Date.now() - 30 * 24 * 60 * 60 * 1000) {
        analytics.inactiveUsers.push(user._id);
      }
    });

    // Calculate averages
    if (analytics.bandwidthUsage.free.users > 0) {
      analytics.bandwidthUsage.free.average = analytics.bandwidthUsage.free.total / analytics.bandwidthUsage.free.users;
    }
    if (analytics.bandwidthUsage.pro.users > 0) {
      analytics.bandwidthUsage.pro.average = analytics.bandwidthUsage.pro.total / analytics.bandwidthUsage.pro.users;
    }

    return analytics;
  } catch (error) {
    console.error('Fair use analytics error:', error);
    return null;
  }
};
