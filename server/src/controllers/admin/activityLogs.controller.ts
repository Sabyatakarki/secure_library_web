import { Request, Response } from "express";
import activityLogService from "../../services/admin/activityLogs.service";

class AdminActivityController {
  async getAllLogs(req: Request, res: Response) {
    try {
      const logs = await activityLogService.getAllLogs();

      return res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AdminActivityController();