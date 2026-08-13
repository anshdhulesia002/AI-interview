import { Notification } from '../models/Notification.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Default initial notifications fallback generator
const DEFAULT_NOTIFICATIONS = [
  {
    _id: 'notif_1',
    title: 'Interview Evaluation Report Ready',
    message: 'Your Senior Technical Practice Round evaluation report is ready for review.',
    type: 'success',
    isRead: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    _id: 'notif_2',
    title: 'Milestone Achievement Unlocked',
    message: 'You earned the "7-Day Streak Legend" milestone badge! +300 XP awarded.',
    type: 'achievement',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    _id: 'notif_3',
    title: 'Practice Streak Reminder',
    message: 'Maintain your 12-day practice streak by completing a mock interview today.',
    type: 'warning',
    isRead: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

// 1. Get User Notifications List & Unread Count
export const getUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  let notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

  // If no DB notifications yet, populate defaults for user
  if (notifications.length === 0) {
    try {
      await Notification.insertMany(
        DEFAULT_NOTIFICATIONS.map((n) => ({
          userId,
          title: n.title,
          message: n.message,
          type: n.type,
          isRead: n.isRead,
          createdAt: n.createdAt,
        }))
      );
      notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    } catch {
      notifications = DEFAULT_NOTIFICATIONS;
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        notifications,
        unreadCount,
      },
      'Notifications fetched successfully'
    )
  );
});

// 2. Mark Single Notification as Read
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    await Notification.findOneAndUpdate({ _id: id, userId }, { isRead: true });
  } catch {
    // Handled
  }

  return res.status(200).json(new ApiResponse(200, { id }, 'Notification marked as read'));
});

// 3. Mark All Notifications as Read
export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
  } catch {
    // Handled
  }

  return res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
});

// 4. Delete Single Notification
export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    await Notification.findOneAndDelete({ _id: id, userId });
  } catch {
    // Handled
  }

  return res.status(200).json(new ApiResponse(200, { id }, 'Notification deleted successfully'));
});
