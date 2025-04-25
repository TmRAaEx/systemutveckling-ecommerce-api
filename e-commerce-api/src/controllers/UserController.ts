import User from "@models/User";
import BaseController from "./BaseController";

/**
 * UserController handles all operations related to users,
 * including fetching, creating, updating, and deleting users.
 * It extends the BaseController to provide error handling for asynchronous operations.
 */
export default class UserController extends BaseController {
  constructor() {
    super();
  }

  /**
   * Handles GET requests to fetch all users.
   * Strips sensitive fields like `admin` and `passwordHash` before sending the response.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response containing an array of sanitized user objects.
   */
  public getAll = this.handle(async (req, res) => {
    const users = await User.getAll();
    const sanitizedUsers = this.sanitizeUsers(users);
    res.status(200).json(sanitizedUsers);
  });

  /**
   * Handles GET requests to fetch a single user by their ID.
   * Strips sensitive fields before sending the response.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response containing the sanitized user object.
   */
  public getById = this.handle(async (req, res) => {
    const { id } = req.params;
    const user = await this.createInstance(id, User);
    const sanitizedUser = this.sanitizeUsers([user]);
    res.status(200).json(sanitizedUser[0]);
  });

  /**
   * Handles POST requests to create a new user.
   * Hashes the user's password, saves the user to the database, and returns the created user.
   *
   * @param req - The Express request object containing `username`, `email`, and `password` in the body.
   * @param res - The Express response object.
   * @returns A JSON response containing the sanitized created user object.
   */
  public create = this.handle(async (req, res) => {
    const { username, email, password } = req.body;

    //extra security so invalid users dont get created
    if (!username) {
      res
        .status(400)
        .json({ error: "Username is required to create an account" });
      return;
    }
    if (!email) {
      res.status(400).json({ error: "Email is required to create an account" });
      return;
    }
    if (!password) {
      res
        .status(400)
        .json({ error: "Password is required to create an account" });
      return;
    }

    const user = new User();
    await user.hashPassword(password);
    user.username = username;
    user.email = email;
    await user.save();

    const sanitizedUser = this.sanitizeUsers([user]);

    res.status(201).json(sanitizedUser[0]);
  });

  /**
   * Handles PUT or PATCH requests to update an existing user.
   * Updates the user's details and password, saves the changes to the database, and returns the updated user.
   *
   * @param req - The Express request object containing `id` in the params and `newName`, `newPass`, and `newEmail` in the body.
   * @param res - The Express response object.
   * @returns A JSON response containing the sanitized updated user object.
   */
  public update = this.handle(async (req, res) => {
    const { id } = req.params;
    const { newName, newPass, newEmail } = req.body;

    const user = await this.createInstance(id, User);
    if (newPass) await user.hashPassword(newPass);
    if (newName) user.username = newName;
    if (newEmail) user.email = newEmail;
    await user.save();

    const sanitizedUser = this.sanitizeUsers([user]);
    res.status(200).json(sanitizedUser[0]);
  });

  /**
   * Handles DELETE requests to delete a user by their ID.
   * Deletes the user from the database.
   *
   * @param req - The Express request object containing `id` in the params.
   * @param res - The Express response object.
   * @returns A 204 No Content response if the deletion is successful.
   */
  public delete = this.handle(async (req, res) => {
    const { id } = req.params;
    const user = await this.createInstance(id, User);

    await user.delete();
    res.status(204).send();
  });

  /**
   * Helper function to sanitize user data by removing sensitive fields.
   *
   * @param users - An array of User instances.
   * @returns An array of sanitized user objects without sensitive fields like `admin` and `passwordHash`.
   */
  private sanitizeUsers(users: User[]): Record<string, any>[] {
    return users.map((user) => {
      const { admin, passwordHash, ...sanitizedUser } = user.toJSON();
      return sanitizedUser;
    });
  }
}
