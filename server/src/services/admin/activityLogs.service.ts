import ActivityLog from "../../models/admin/activityLogs.model";

class ActivityLogService {
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
    try {
      console.log("Creating activity log...");
      console.log(user);

      const log = await ActivityLog.create({
        user: user?._id,
        fullName: user?.fullName || "System",
        role: user?.role || "System",
        action,
        description,
        ipAddress,
      });

      console.log("Activity log saved:", log);

      return log;
    } catch (error) {
      console.error("Activity Log Error:", error);
      throw error;
    }
  }

  async getAll() {
    return await ActivityLog.find()
      .populate("user", "fullName email studentId role")
      .sort({ createdAt: -1 });
  }

  async getByUser(userId: string) {
    return await ActivityLog.find({ user: userId }).sort({
      createdAt: -1,
    });
  }
}

export default new ActivityLogService();