import User from "@models/User";
import BaseController from "./BaseController";

export default class UserController extends BaseController {
  constructor() {
    super();
  }

  /**
   * Handles GET requests to fetch all users.
   * Strips sensitive fields like `admin` and `passwordHash` before sending the response.
   */
  public getAll = this.handle(async (req, res) => {
    const users = await User.getAll();
    const sanitizedUsers = this.sanitizeUsers(users);
    res.status(200).json(sanitizedUsers);
  });

  /**
   * Helper function to sanitize user data by removing sensitive fields.
   * @param users - An array of User instances.
   * @returns An array of sanitized user objects.
   */
  private sanitizeUsers(users: User[]): Record<string, any>[] {
    return users.map((user) => {
      const { admin, passwordHash, ...sanitizedUser } = user.toJSON();
      return sanitizedUser;
    });
  }
}
