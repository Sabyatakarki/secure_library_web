import ActivityLog from "../../models/admin/activityLogs.model";

class ActivityLogService {
  // Create Activity Log
  async create({
    user,
    action,
    description,
    ipAddress,
  }: {
    user?: any;
    action: string;
    description: string;
    ipAddress?: string;
  }) {
    return await ActivityLog.create({
      user: user?._id,
      fullName: user?.fullName || "System",
      role: user?.role || "System",
      action,
      description,
      ipAddress,
    });
  }

  // Get All Activity Logs
  async getAll() {
    return await ActivityLog.find()
      .populate("user", "fullName email studentId role")
      .sort({ createdAt: -1 });
  }

  // Get Activity Logs By User
  async getByUser(userId: string) {
    return await ActivityLog.find({
      user: userId,
    })
      .sort({ createdAt: -1 });
  }
}

export default new ActivityLogService();